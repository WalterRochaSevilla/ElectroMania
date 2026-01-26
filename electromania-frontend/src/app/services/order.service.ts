import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order, UpdateOrderStatusRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);

  /**
   * Get all orders for the logged-in user
   * Backend: GET /order
   */
  async getMyOrders(): Promise<Order[]> {
    return firstValueFrom(this.http.get<Order[]>(`${environment.API_DOMAIN}/order`));
  }

  /**
   * Get a specific order by ID
   * Backend: GET /order/:id
   */
  async getOrderById(id: number): Promise<Order> {
    return firstValueFrom(this.http.get<Order>(`${environment.API_DOMAIN}/order/${id}`));
  }

  /**
   * Create an order from the user's current cart
   * Backend: POST /order/register (uses cart, no body needed)
   */
  async createOrderFromCart(): Promise<Order> {
    return firstValueFrom(this.http.post<Order>(`${environment.API_DOMAIN}/order/register`, {}));
  }

  /**
   * Update an order
   * Backend: PATCH /order/:id
   */
  async updateOrder(id: number, data: UpdateOrderStatusRequest): Promise<Order> {
    return firstValueFrom(this.http.patch<Order>(`${environment.API_DOMAIN}/order/${id}`, data));
  }

  /**
   * Delete an order  
   * Backend: DELETE /order/:id
   */
  async deleteOrder(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${environment.API_DOMAIN}/order/${id}`));
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

