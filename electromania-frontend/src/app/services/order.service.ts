import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order, CreateOrderRequest, UpdateOrderStatusRequest, OrderSummary } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);

  async getAllOrders(): Promise<Order[]> {
    return firstValueFrom(this.http.get<Order[]>(`${environment.API_DOMAIN}/orders`));
  }

  async getOrderById(id: number): Promise<Order> {
    return firstValueFrom(this.http.get<Order>(`${environment.API_DOMAIN}/orders/${id}`));
  }

  async getMyOrders(): Promise<Order[]> {
    return firstValueFrom(this.http.get<Order[]>(`${environment.API_DOMAIN}/orders/my-orders`));
  }

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    return firstValueFrom(this.http.post<Order>(`${environment.API_DOMAIN}/orders`, data));
  }

  async updateOrderStatus(id: number, data: UpdateOrderStatusRequest): Promise<Order> {
    return firstValueFrom(this.http.patch<Order>(`${environment.API_DOMAIN}/orders/${id}/status`, data));
  }

  async cancelOrder(id: number): Promise<Order> {
    return this.updateOrderStatus(id, { status: 'CANCELED' });
  }

  async getOrderSummary(): Promise<OrderSummary> {
    return firstValueFrom(this.http.get<OrderSummary>(`${environment.API_DOMAIN}/orders/summary`));
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
