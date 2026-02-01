import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Order, UpdateOrderStatusRequest } from '../models';
import { API } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);

  async getMyOrders(): Promise<Order[]> {
    return firstValueFrom(this.http.get<Order[]>(API.ORDER.BASE));
  }

  async getOrderById(id: number): Promise<Order> {
    return firstValueFrom(this.http.get<Order>(API.ORDER.BY_ID(id)));
  }

  async createOrderFromCart(): Promise<Order> {
    return firstValueFrom(this.http.post<Order>(API.ORDER.REGISTER, {}));
  }

  async updateOrder(id: number, data: UpdateOrderStatusRequest): Promise<Order> {
    return firstValueFrom(this.http.patch<Order>(API.ORDER.BY_ID(id), data));
  }

  async deleteOrder(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(API.ORDER.BY_ID(id)));
  }

  /**
   * Cancel an order (convenience method)
   */
  async cancelOrder(id: number): Promise<Order> {
    return this.updateOrder(id, { status: 'CANCELED' });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'PENDING': 'Pendiente',
      'PAID': 'Pagado',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregado',
      'CANCELED': 'Cancelado'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'PENDING': 'status-pending',
      'PAID': 'status-paid',
      'SHIPPED': 'status-shipped',
      'DELIVERED': 'status-delivered',
      'CANCELED': 'status-canceled'
    };
    return classes[status] || '';
  }
}

