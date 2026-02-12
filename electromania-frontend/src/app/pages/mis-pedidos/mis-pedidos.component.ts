import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OrderService } from '../../services/order.service';
import { ModalService } from '../../services/modal.service';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { Order } from '../../models';
import { ToastService } from '../../services/toast.service';
@Component({
    selector: 'app-mis-pedidos',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule, ConfirmationModalComponent],
    templateUrl: './mis-pedidos.component.html',
    styleUrl: './mis-pedidos.component.css'
})
export class MisPedidosComponent implements OnInit {
    private orderService = inject(OrderService);
    private translate = inject(TranslateService);
    private modalService = inject(ModalService);
    private toast = inject(ToastService);
    orders = signal<Order[]>([]);
    loading = signal(true);
    async ngOnInit() {
        await this.loadOrders();
    }
    async loadOrders() {
        this.loading.set(true);
        try {
            this.orders.set(await this.orderService.getMyOrders());
        }
        catch {
            console.error('Error loading orders');
        }
        finally {
            this.loading.set(false);
        }
    }
    getStatusLabel(status: string): string {
        return this.orderService.getStatusLabel(status);
    }
    getStatusClass(status: string): string {
        return this.orderService.getStatusClass(status);
    }
    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('es-BO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    formatCurrency(amount: number): string {
        return `${this.translate.instant('CART.BS')} ${amount.toFixed(2)}`;
    }
    async viewReceipt(orderId: number): Promise<void> {
        try {
            const blob = await this.orderService.getReceipt(orderId);
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        }
        catch {
            this.toast.error(this.translate.instant('MY_ORDERS.RECEIPT_ERROR'));
        }
    }
    canViewReceipt(status: string): boolean {
        return status === 'PAID' || status === 'SHIPPED' || status === 'DELIVERED';
    }
    async cancelOrder(orderId: number): Promise<void> {
        const confirmed = await this.modalService.confirm({
            title: this.translate.instant('MY_ORDERS.CANCEL_TITLE'),
            message: this.translate.instant('MY_ORDERS.CONFIRM_CANCEL'),
            confirmText: this.translate.instant('MY_ORDERS.CANCEL'),
            cancelText: this.translate.instant('COMMON.CANCEL'),
            type: 'danger'
        });
        if (!confirmed) {
            return;
        }
        try {
            await this.orderService.cancelOrder(orderId);
            await this.loadOrders();
        }
        catch {
            console.error('Error canceling order');
        }
    }
}