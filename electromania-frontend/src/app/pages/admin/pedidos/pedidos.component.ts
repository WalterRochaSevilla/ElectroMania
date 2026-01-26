import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { ToastService } from '../../../services/toast.service';
import { AdminSidebarComponent } from '../../../components/admin-sidebar/admin-sidebar.component';
import { Order, OrderStatus } from '../../../models';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit {
  private orderService = inject(OrderService);
  private toast = inject(ToastService);

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = true;
  backendReady = false;

  statusFilter = '';
  searchTerm = '';

  statusOptions: { value: OrderStatus | '', label: string }[] = [
    { value: '', label: 'Todos los estados' },
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'PAID', label: 'Pagado' },
    { value: 'SHIPPED', label: 'Enviado' },
    { value: 'DELIVERED', label: 'Entregado' },
    { value: 'CANCELED', label: 'Cancelado' }
  ];

  async ngOnInit() {
    await this.loadOrders();
  }

  async loadOrders() {
    this.loading = true;
    try {
      this.orders = await this.orderService.getMyOrders();
      this.backendReady = true;
      this.applyFilters();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'status' in error && (error as { status: number }).status === 404) {
        this.backendReady = false;
      } else {
        this.toast.error('Error al cargar los pedidos');
      }
    } finally {
      this.loading = false;
    }
  }

  applyFilters() {
    let result = [...this.orders];

    if (this.statusFilter) {
      result = result.filter(o => o.status === this.statusFilter);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(o =>
        o.order_id.toString().includes(term) ||
        o.user?.name?.toLowerCase().includes(term) ||
        o.user?.email?.toLowerCase().includes(term)
      );
    }

    this.filteredOrders = result;
  }

  async updateStatus(order: Order, newStatus: OrderStatus) {
    try {
      await this.orderService.updateOrder(order.order_id, { status: newStatus });
      order.status = newStatus;
      this.toast.success(`Pedido #${order.order_id} actualizado a ${this.orderService.getStatusLabel(newStatus)}`);
    } catch {
      this.toast.error('Error al actualizar el estado');
    }
  }

  async cancelOrder(order: Order) {
    if (!confirm(`¿Está seguro de cancelar el pedido #${order.order_id}? El stock será restaurado.`)) {
      return;
    }

    try {
      await this.orderService.cancelOrder(order.order_id);
      order.status = 'CANCELED';
      this.toast.success(`Pedido #${order.order_id} cancelado. Stock restaurado.`);
    } catch {
      this.toast.error('Error al cancelar el pedido');
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return `Bs. ${amount.toFixed(2)}`;
  }
}
