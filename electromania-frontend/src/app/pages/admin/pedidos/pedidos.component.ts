import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { OrderService } from '../../../services/order.service';
import { ToastService } from '../../../services/toast.service';
import { LanguageService } from '../../../services/language.service';
import { ModalService } from '../../../services/modal.service';
import { AdminSidebarComponent } from '../../../components/admin-sidebar/admin-sidebar.component';
import { ConfirmationModalComponent } from '../../../components/confirmation-modal/confirmation-modal.component';
import { Order, OrderStatus } from '../../../models';
@Component({
    selector: 'app-pedidos',
    standalone: true,
    imports: [CommonModule, FormsModule, AdminSidebarComponent, TranslateModule, ConfirmationModalComponent],
    templateUrl: './pedidos.component.html',
    styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit {
    private orderService = inject(OrderService);
    private toast = inject(ToastService);
    private languageService = inject(LanguageService);
    private modalService = inject(ModalService);
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
    }
    async loadOrders() {
        this.loading.set(true);
        try {
            this.orders.set(await this.orderService.getAllOrders());
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
            this.filteredOrders.set(result);
    }
    async updateStatus(order: Order, newStatus: OrderStatus) {
        try {
            await this.orderService.updateOrder(order.id, { status: newStatus });
            console.log(newStatus);
            console.log(order);
            order.status = newStatus;
            this.applyFilters();
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
            order.status = 'CANCELED';
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