import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

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
    this.cdr.markForCheck();
    try {
      this.orders = await this.orderService.getMyOrders();
      this.backendReady = true;
      this.applyFilters();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'status' in error && (error as { status: number }).status === 404) {
        this.backendReady = false;
      } else {
        this.toast.error(this.languageService.instant('ADMIN.ERROR_LOAD_ORDERS'));
      }
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
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
        o.id.toString().includes(term) ||
        o.user?.name?.toLowerCase().includes(term) ||
        o.user?.email?.toLowerCase().includes(term)
      );
    }

    this.filteredOrders = result;
  }

  async updateStatus(order: Order, newStatus: OrderStatus) {
    try {
      await this.orderService.updateOrder(order.id, { status: newStatus });
      order.status = newStatus;
      this.toast.success(this.languageService.instant('ADMIN.ORDER_UPDATED', { id: order.id, status: this.orderService.getStatusLabel(newStatus) }));
    } catch {
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
      this.cdr.markForCheck();
      this.toast.success(this.languageService.instant('ADMIN.ORDER_CANCELED', { id: order.id }));
    } catch {
      this.toast.error(this.languageService.instant('ADMIN.ERROR_CANCEL_ORDER'));
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
