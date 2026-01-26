import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models';

@Component({
    selector: 'app-mis-pedidos',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './mis-pedidos.component.html',
    styleUrl: './mis-pedidos.component.css'
})
export class MisPedidosComponent implements OnInit {
    private orderService = inject(OrderService);

    orders: Order[] = [];
    loading = true;

    async ngOnInit() {
        await this.loadOrders();
    }

    async loadOrders() {
        this.loading = true;
        try {
            this.orders = await this.orderService.getMyOrders();
        } catch {
            console.error('Error loading orders');
        } finally {
            this.loading = false;
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
        return `Bs. ${amount.toFixed(2)}`;
    }

    async cancelOrder(orderId: number): Promise<void> {
        if (!confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
            return;
        }

        try {
            await this.orderService.cancelOrder(orderId);
            await this.loadOrders();
        } catch {
            console.error('Error canceling order');
        }
    }
}
