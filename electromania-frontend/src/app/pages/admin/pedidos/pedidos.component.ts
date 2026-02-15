import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { OrderService } from '../../../services/order.service';
import { OrderWebsocketService } from '../../../services/order-websocket.service';
import { ToastService } from '../../../services/toast.service';
import { LanguageService } from '../../../services/language.service';
import { ModalService } from '../../../services/modal.service';
import { AdminSidebarComponent } from '../../../components/admin-sidebar/admin-sidebar.component';
import { ConfirmationModalComponent } from '../../../components/confirmation-modal/confirmation-modal.component';
import { Order, OrderStatus } from '../../../models';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-pedidos',
    standalone: true,
    imports: [CommonModule, FormsModule, AdminSidebarComponent, TranslateModule, ConfirmationModalComponent],
    templateUrl: './pedidos.component.html',
    styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit, OnDestroy {
    private orderService = inject(OrderService);
    private orderWebsocketService = inject(OrderWebsocketService);
    private toast = inject(ToastService);
    private languageService = inject(LanguageService);
    private modalService = inject(ModalService);
    private subscriptions: Subscription[] = [];
    orders = signal<Order[]>([]);
    filteredOrders = signal<Order[]>([]);
    loading = signal(true);
    backendReady = signal(false);
    statusFilter = '';
    searchTerm = '';
    get statusOptions(): {
        value: OrderStatus | '';
        label: string;
    }[] {
        return [
            { value: '', label: this.languageService.instant('ADMIN.ALL_STATUSES') },
            { value: 'PENDING', label: this.languageService.instant('ORDERS.STATUS_PENDING') },
            { value: 'PAID', label: this.languageService.instant('ORDERS.STATUS_PAID') },
            { value: 'SHIPPED', label: this.languageService.instant('ORDERS.STATUS_SHIPPED') },
            { value: 'DELIVERED', label: this.languageService.instant('ORDERS.STATUS_DELIVERED') },
            { value: 'CANCELED', label: this.languageService.instant('ORDERS.STATUS_CANCELED') }
        ];
    }
    async ngOnInit() {
        await this.loadOrders();
        this.setupWebSocket();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.orderWebsocketService.disconnect();
    }

    private setupWebSocket() {
        this.orderWebsocketService.connect();
        const newOrderSub = this.orderWebsocketService.onNewOrder().subscribe(
            (newOrder: Order) => {
                console.log('Nueva orden recibida:', newOrder);
                const currentOrders = this.orders();
                newOrder.id = newOrder.order_id ?? newOrder.id;
                this.orders.set(this.sortOrdersById([...currentOrders, newOrder]));
                console.log('Órdenes actualizadas:', this.orders());
                this.applyFilters();
                this.toast.success(
                    this.languageService.instant('ADMIN.NEW_ORDER_RECEIVED', { id: newOrder.order_id })
                );
            }
        );
        const updatedOrderSub = this.orderWebsocketService.onOrderUpdated().subscribe(
            (updatedOrder: Order) => {
                const currentOrders = this.orders();
                const index = currentOrders.findIndex(o => o.order_id === updatedOrder.order_id);

                if (index !== -1) {
                    const updatedOrders = [...currentOrders];
                    updatedOrders[index] = updatedOrder;
                    this.orders.set(this.sortOrdersById(updatedOrders));
                    this.applyFilters();
                }
            }
        );
        const cancelledOrderSub = this.orderWebsocketService.onOrderCancelled().subscribe(
            (cancelledOrder: Order) => {
                const currentOrders = this.orders();
                const index = currentOrders.findIndex(o => o.order_id === cancelledOrder.order_id);
                if (index !== -1) {
                    const updatedOrders = [...currentOrders];
                    updatedOrders[index] = { ...updatedOrders[index], status: 'CANCELED' };
                    this.orders.set(this.sortOrdersById(updatedOrders));
                    this.applyFilters();
                    this.toast.success(
                        this.languageService.instant('ADMIN.ORDER_CANCELED', {
                            id: cancelledOrder.order_id,
                        }),
                    );
                }
            }
        );
        this.subscriptions.push(newOrderSub, updatedOrderSub, cancelledOrderSub);
    }
    private sortOrdersById(orders: Order[]): Order[] {
        return orders.sort((a, b) => b.id - a.id);
    }
    async loadOrders() {
        this.loading.set(true);
        try {
            const orders = await this.orderService.getAllOrders();
            this.orders.set(this.sortOrdersById(orders));
            this.backendReady.set(true);
            this.applyFilters();
        }
        catch (error: unknown) {
            if (error && typeof error === 'object' && 'status' in error && (error as {
                status: number;
            }).status === 404) {
                this.backendReady.set(false);
            }
            else {
                this.toast.error(this.languageService.instant('ADMIN.ERROR_LOAD_ORDERS'));
            }
        }
        finally {
            this.loading.set(false);
        }
    }
    applyFilters() {
        let result = [...this.orders()];
        if (this.statusFilter) {
            result = result.filter(o => o.status === this.statusFilter);
        }
        if (this.searchTerm.trim()) {
            const term = this.searchTerm.toLowerCase();
            result = result.filter(o => o.id.toString().includes(term) ||
                o.user?.name?.toLowerCase().includes(term) ||
                o.user?.email?.toLowerCase().includes(term));
        }
        this.filteredOrders.set(this.sortOrdersById(result));
    }
    async updateStatus(order: Order, newStatus: OrderStatus) {
        try {
            await this.orderService.updateOrder(order.id, { status: newStatus });
            console.log(newStatus);
            console.log(order);

            const currentOrders = this.orders();
            const index = currentOrders.findIndex(o => o.id === order.id);
            if (index !== -1) {
                const updatedOrders = [...currentOrders];
                updatedOrders[index] = { ...updatedOrders[index], status: newStatus };
                this.orders.set(this.sortOrdersById(updatedOrders));
                this.applyFilters();
            }

            this.toast.success(this.languageService.instant('ADMIN.ORDER_UPDATED', { id: order.id, status: this.orderService.getStatusLabel(newStatus) }));
        }
        catch {
            this.toast.error(this.languageService.instant('ADMIN.ERROR_UPDATE_STATUS'));
        }
    }
    async cancelOrder(order: Order) {
        const confirmed = await this.modalService.confirm({
            title: this.languageService.instant('ADMIN.CANCEL_ORDER_TITLE'),
            message: this.languageService.instant('ADMIN.CANCEL_ORDER_CONFIRM', { id: order.id }),
            confirmText: this.languageService.instant('ADMIN.CANCEL'),
            cancelText: this.languageService.instant('COMMON.CANCEL'),
            type: 'danger'
        });
        if (!confirmed) {
            return;
        }
        try {
            await this.orderService.cancelOrder(order.id);

            const currentOrders = this.orders();
            const index = currentOrders.findIndex(o => o.id === order.id);
            if (index !== -1) {
                const updatedOrders = [...currentOrders];
                updatedOrders[index] = { ...updatedOrders[index], status: 'CANCELED' };
                this.orders.set(this.sortOrdersById(updatedOrders));
                this.applyFilters();
            }

            this.toast.success(this.languageService.instant('ADMIN.ORDER_CANCELED', { id: order.id }));
        }
        catch {
            this.toast.error(this.languageService.instant('ADMIN.ERROR_CANCEL_ORDER'));
        }
    }
    getStatusLabel(status: string): string {
        return this.orderService.getStatusLabel(status);
    }
    getStatusClass(status: string): string {
        return this.orderService.getStatusClass(status);
    }
    formatDate(dateString?: string): string {
        if (!dateString) {
            return this.languageService.instant('COMMON.NOT_AVAILABLE');
        }
        const parsedDate = new Date(dateString);
        if (Number.isNaN(parsedDate.getTime())) {
            return this.languageService.instant('COMMON.NOT_AVAILABLE');
        }
        return parsedDate.toLocaleString('es-BO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    formatCurrency(amount: number): string {
        return `${this.languageService.instant('CART.BS')} ${amount.toFixed(2)}`;
    }
}
