import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Product, ProductCard, CreateProductRequest, UpdateProductRequest, PageProductResponse, Category, RegisterProductImageRequest, Order } from '../models';
import { API, INVENTORY } from '../constants';
import { CategoryService } from './category.service';
import { LanguageService } from './language.service';
import { OrderService } from './order.service';
import { UserService } from './user.service';
import { SKIP_GLOBAL_ERROR_TOAST } from '../interceptors/error.interceptor';
@Injectable({
    providedIn: 'root'
})
export class ProductosService {
    private readonly http = inject(HttpClient);
    private readonly categoryService = inject(CategoryService);
    private readonly languageService = inject(LanguageService);
    private readonly orderService = inject(OrderService);
    private readonly userService = inject(UserService);
    private productsCache: Product[] | null = null;
    private productsCacheAt = 0;
    private productsInFlight: Promise<Product[]> | null = null;
    private readonly productsTtlMs = 60_000;
    async getAllProducts(options?: { suppressErrorToast?: boolean; forceRefresh?: boolean; }): Promise<Product[]> {
        const forceRefresh = options?.forceRefresh ?? false;
        const now = Date.now();
        if (!forceRefresh && this.productsCache && now - this.productsCacheAt < this.productsTtlMs) {
            return [...this.productsCache];
        }
        if (!forceRefresh && this.productsInFlight) {
            return this.productsInFlight;
        }
        const context = options?.suppressErrorToast
            ? new HttpContext().set(SKIP_GLOBAL_ERROR_TOAST, true)
            : undefined;
        const request = firstValueFrom(this.http.get<Product[]>(API.PRODUCTS.ALL, { context }))
            .then(products => {
            this.productsCache = products;
            this.productsCacheAt = Date.now();
            return [...products];
        })
            .finally(() => {
            this.productsInFlight = null;
        });
        this.productsInFlight = request;
        return request;
    }
    async getProductsPage(page: number): Promise<PageProductResponse> {
        return firstValueFrom(this.http.get<PageProductResponse>(API.PRODUCTS.PAGE(page)));
    }
    async getProductById(id: number): Promise<Product | null> {
        try {
            return await firstValueFrom(this.http.get<Product>(API.PRODUCTS.BY(id)));
        }
        catch {
            const products = await this.getAllProducts();
            return products.find(p => p.product_id === id) ?? null;
        }
    }
    async createProduct(product: CreateProductRequest): Promise<Product> {
        const formData = new FormData();
        formData.append('product_name', product.product_name);
        formData.append('description', product.description);
        formData.append('price', product.price.toString());
        formData.append('stock', product.stock.toString());
        if (product.image) {
            formData.append('image', product.image);
        }
        const created = await firstValueFrom(this.http.post<Product>(API.PRODUCTS.REGISTER, formData));
        this.invalidateProductsCache();
        return created;
    }
    async updateProduct(id: number | string, product: UpdateProductRequest): Promise<Product> {
        if (product.image) {
            const formData = new FormData();
            if (product.product_name)
                formData.append('product_name', product.product_name);
            if (product.description)
                formData.append('description', product.description);
            if (product.price !== undefined)
                formData.append('price', product.price.toString());
            if (product.stock !== undefined)
                formData.append('stock', product.stock.toString());
            if (product.state)
                formData.append('state', product.state);
            formData.append('image', product.image);
            const updated = await firstValueFrom(this.http.put<Product>(API.PRODUCTS.UPDATE(id), formData));
            this.invalidateProductsCache();
            return updated;
        }
        const jsonData: UpdateProductRequest = { ...product };
        delete jsonData.image;
        const updated = await firstValueFrom(this.http.put<Product>(API.PRODUCTS.UPDATE(id), jsonData));
        this.invalidateProductsCache();
        return updated;
    }
    async deleteProduct(id: number | string): Promise<void> {
        await firstValueFrom(this.http.delete(API.PRODUCTS.DELETE(id)));
        this.invalidateProductsCache();
    }
    async addProductImage(data: RegisterProductImageRequest): Promise<Product> {
        const product = await firstValueFrom(this.http.post<Product>(API.PRODUCTS.ADD_IMAGE, data));
        this.invalidateProductsCache();
        return product;
    }
    toProductCard(product: Product): ProductCard {
        return {
            product_id: product.product_id,
            product_name: product.product_name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            images: product.images || [],
            categories: product.categories || [],
        };
    }
    toProductCards(products: Product[]): ProductCard[] {
        return products.map(p => this.toProductCard(p));
    }
    async getCategorias(): Promise<Category[]> {
        return this.categoryService.getAll();
    }
    async getCategoriasAsStrings(): Promise<string[]> {
        const categories = await this.categoryService.getAll();
        return categories.map(c => c.name);
    }
    async getDashboardStats(): Promise<{
        total_revenue: number;
        revenue_change: number;
        low_stock_count: number;
        system_status: 'online' | 'offline' | 'maintenance';
    }> {
        const [productsResult, ordersResult, usersResult] = await Promise.allSettled([
            this.getAllProducts({ suppressErrorToast: true }),
            this.orderService.getAllOrders({ suppressErrorToast: true }),
            this.userService.getAllUsers({ suppressErrorToast: true })
        ]);
        const products = productsResult.status === 'fulfilled' ? productsResult.value : [];
        const orders = ordersResult.status === 'fulfilled' ? ordersResult.value : [];
        const users = usersResult.status === 'fulfilled' ? usersResult.value : [];
        const hasFailures = [productsResult, ordersResult, usersResult].some(result => result.status === 'rejected');
        const hasData = products.length > 0 || orders.length > 0 || users.length > 0;
        const totalRevenue = orders
            .filter(order => this.isRevenueOrder(order))
            .reduce((sum, order) => sum + order.total, 0);
        const revenueChange = this.calculateRevenueChange(orders);
        const lowStockCount = products.filter(p => p.stock <= INVENTORY.LOW_STOCK_THRESHOLD).length;
        const systemStatus: 'online' | 'offline' | 'maintenance' = hasFailures
            ? (hasData ? 'maintenance' : 'offline')
            : 'online';
        return {
            total_revenue: Number(totalRevenue.toFixed(2)),
            revenue_change: revenueChange,
            low_stock_count: lowStockCount,
            system_status: systemStatus
        };
    }
    async getRevenueStats(period: '7d' | '30d' | '90d') {
        const orders = await this.getSafeOrders();
        if (period === '7d') {
            const labels: string[] = [];
            const data: number[] = [];
            for (let offset = 6; offset >= 0; offset--) {
                const day = new Date();
                day.setHours(0, 0, 0, 0);
                day.setDate(day.getDate() - offset);
                labels.push(this.toWeekdayKey(day));
                const dayTotal = orders
                    .filter(order => this.isRevenueOrder(order) && this.isSameDay(this.getOrderDate(order), day))
                    .reduce((sum, order) => sum + order.total, 0);
                data.push(Number(dayTotal.toFixed(2)));
            }
            return { labels, data };
        }
        const totalDays = period === '30d' ? 30 : 90;
        const bucketCount = 4;
        const bucketSize = Math.ceil(totalDays / bucketCount);
        const data = Array.from({ length: bucketCount }, () => 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (const order of orders) {
            if (!this.isRevenueOrder(order)) {
                continue;
            }
            const orderDate = this.getOrderDate(order);
            const diffInMs = today.getTime() - orderDate.getTime();
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
            if (diffInDays < 0 || diffInDays >= totalDays) {
                continue;
            }
            const normalizedDay = totalDays - 1 - diffInDays;
            const bucket = Math.min(bucketCount - 1, Math.floor(normalizedDay / bucketSize));
            data[bucket] += order.total;
        }
        return {
            labels: ['WEEK_1', 'WEEK_2', 'WEEK_3', 'WEEK_4'],
            data: data.map(value => Number(value.toFixed(2)))
        };
    }
    async getTopSellingProducts() {
        const orders = await this.getSafeOrders();
        const soldByProduct = new Map<string, number>();
        for (const order of orders) {
            const items = order.items ?? order.cart?.details?.map(detail => ({
                product_name: detail.product.product_name,
                quantity: detail.quantity
            }));
            if (!items?.length) {
                continue;
            }
            for (const item of items) {
                const current = soldByProduct.get(item.product_name) ?? 0;
                soldByProduct.set(item.product_name, current + item.quantity);
            }
        }
        return Array.from(soldByProduct.entries())
            .map(([name, sold]) => ({ name, sold }))
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 4);
    }
    async getLowStockProducts() {
        const products = await this.getAllProducts({ suppressErrorToast: true });
        return products
            .filter(p => p.stock <= INVENTORY.LOW_STOCK_THRESHOLD)
            .map(p => ({
            id: p.product_id ?? 0,
            name: p.product_name,
            stock: p.stock,
            status: this.getStockStatus(p.stock)
        }))
            .sort((a, b) => a.stock - b.stock)
            .slice(0, INVENTORY.MAX_LOW_STOCK_ITEMS);
    }
    private getStockStatus(stock: number): string {
        if (stock === INVENTORY.OUT_OF_STOCK_THRESHOLD) {
            return this.languageService.instant('ADMIN.LOW_STOCK_OUT');
        }
        if (stock <= INVENTORY.CRITICAL_STOCK_THRESHOLD) {
            return this.languageService.instant('ADMIN.LOW_STOCK_CRITICAL');
        }
        return this.languageService.instant('ADMIN.LOW_STOCK_LOW');
    }
    private async getSafeOrders(): Promise<Order[]> {
        try {
            return await this.orderService.getAllOrders({ suppressErrorToast: true });
        }
        catch {
            return [];
        }
    }
    private isRevenueOrder(order: Order): boolean {
        return order.status !== 'CANCELED';
    }
    private getOrderDate(order: Order): Date {
        const rawDate = order.created_at || order.createdAt;
        const date = rawDate ? new Date(rawDate) : new Date();
        date.setHours(0, 0, 0, 0);
        return date;
    }
    private isSameDay(a: Date, b: Date): boolean {
        return a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate();
    }
    private toWeekdayKey(date: Date): string {
        const weekday = date.getDay();
        const keys = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        return keys[weekday] ?? 'MON';
    }
    private calculateRevenueChange(orders: Order[]): number {
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        const currentRevenue = orders
            .filter(order => this.isRevenueOrder(order) && this.getOrderDate(order) >= currentMonthStart)
            .reduce((sum, order) => sum + order.total, 0);
        const previousRevenue = orders
            .filter(order => this.isRevenueOrder(order))
            .filter(order => {
            const orderDate = this.getOrderDate(order);
            return orderDate >= previousMonthStart && orderDate <= previousMonthEnd;
        })
            .reduce((sum, order) => sum + order.total, 0);
        if (previousRevenue === 0) {
            return currentRevenue > 0 ? 100 : 0;
        }
        return Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100);
    }
    invalidateProductsCache(): void {
        this.productsCache = null;
        this.productsCacheAt = 0;
    }
}
