import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Order, UpdateOrderStatusRequest } from '../models';
import { API } from '../constants';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly languageService = inject(LanguageService);

  async getMyOrders(): Promise<Order[]> {
    return firstValueFrom(this.http.get<Order[]>(API.ORDER.BASE));
  }

  async getAllOrders(): Promise<Order[]> {
    return firstValueFrom(this.http.get<Order[]>(API.ORDER.ALL));
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

  /**
   * Get receipt HTML for an order
   */
  async getReceipt(orderId: number): Promise<Blob> {
    return firstValueFrom(this.http.get(`${API.ORDER.RECEIPT}?id=${orderId}`, { responseType: 'blob' }));
  }

  /**
   * Send receipt via email
   */
  async sendReceipt(orderId: number): Promise<void> {
    await firstValueFrom(this.http.post(`${API.ORDER.RECEIPT_SEND}?id=${orderId}`, {}));
  }

  getStatusLabel(status: string): string {
    const keys: Record<string, string> = {
      'PENDING': 'ORDERS.STATUS_PENDING',
      'PAID': 'ORDERS.STATUS_PAID',
      'SHIPPED': 'ORDERS.STATUS_SHIPPED',
      'DELIVERED': 'ORDERS.STATUS_DELIVERED',
      'CANCELED': 'ORDERS.STATUS_CANCELED'
    };
    const key = keys[status];
    return key ? this.languageService.instant(key) : status;
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

