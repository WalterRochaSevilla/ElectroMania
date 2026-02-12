import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Order, UpdateOrderStatusRequest } from '../models';
import { API } from '../constants';
import { LanguageService } from './language.service';
import { SKIP_GLOBAL_ERROR_TOAST } from '../interceptors/error.interceptor';
@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private readonly http = inject(HttpClient);
    private readonly languageService = inject(LanguageService);
    private ordersCache: Order[] | null = null;
    private ordersCacheAt = 0;
    private ordersInFlight: Promise<Order[]> | null = null;
    private readonly ordersTtlMs = 30_000;
    async getMyOrders(): Promise<Order[]> {
        return firstValueFrom(this.http.get<Order[]>(API.ORDER.BASE));
    }
    async getAllOrders(options?: { suppressErrorToast?: boolean; forceRefresh?: boolean; }): Promise<Order[]> {
        const forceRefresh = options?.forceRefresh ?? false;
        const now = Date.now();
        if (!forceRefresh && this.ordersCache && now - this.ordersCacheAt < this.ordersTtlMs) {
            return [...this.ordersCache];
        }
        if (!forceRefresh && this.ordersInFlight) {
            return this.ordersInFlight;
        }
        const context = options?.suppressErrorToast
            ? new HttpContext().set(SKIP_GLOBAL_ERROR_TOAST, true)
            : undefined;
        const request = firstValueFrom(this.http.get<Order[]>(API.ORDER.ALL, { context }))
            .then(orders => {
            this.ordersCache = orders;
            this.ordersCacheAt = Date.now();
            return [...orders];
        })
            .finally(() => {
            this.ordersInFlight = null;
        });
        this.ordersInFlight = request;
        return request;
    }
    async getOrderById(id: number): Promise<Blob> {
        return firstValueFrom(this.http.get(API.ORDER.BY_ID(id), { responseType: 'blob' }));
    }
    async createOrderFromCart(): Promise<Order> {
        const created = await firstValueFrom(this.http.post<Order>(API.ORDER.REGISTER, {}));
        this.invalidateOrdersCache();
        return created;
    }
    async updateOrder(id: number, data: UpdateOrderStatusRequest): Promise<Order> {
        const updated = await firstValueFrom(this.http.patch<Order>(API.ORDER.BY_ID(id), data));
        this.invalidateOrdersCache();
        return updated;
    }
    async deleteOrder(id: number): Promise<void> {
        await firstValueFrom(this.http.delete(API.ORDER.BY_ID(id)));
        this.invalidateOrdersCache();
    }
    async cancelOrder(id: number): Promise<Order> {
        return this.updateOrder(id, { status: 'CANCELED' });
    }
    async getReceipt(orderId: number): Promise<Blob> {
        return firstValueFrom(this.http.get(`${API.ORDER.RECEIPT}?id=${orderId}`, { responseType: 'blob' }));
    }
    async sendReceipt(orderId: number): Promise<void> {
        await firstValueFrom(this.http.post(`${API.ORDER.RECEIPT_SEND}?id=${orderId}`, {}));
    }
    invalidateOrdersCache(): void {
        this.ordersCache = null;
        this.ordersCacheAt = 0;
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