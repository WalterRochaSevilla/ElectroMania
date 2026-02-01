import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { CartItem, CartTotals } from '../models';
import { API, INVENTORY, STORAGE_KEYS } from '../constants';

interface BackendCartProduct {
  product_id: number;
  product_name: string;
  description: string;
  price: number;
  images: string[];
}

interface BackendCartDetails {
  product: BackendCartProduct;
  quantity: number;
  total: number;
}

interface BackendCartResponse {
  id: number;
  userUUID: string;
  details: BackendCartDetails[];
  total: number;
}

const STORAGE_KEY = STORAGE_KEYS.CART;

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly storageService = inject(StorageService);
  private readonly itemsSignal = signal<CartItem[]>([]);

  readonly items = this.itemsSignal.asReadonly();

  readonly totals = computed<CartTotals>(() => {
    const items = this.itemsSignal();
    const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const impuestos = subtotal * INVENTORY.TAX_RATE;
    const total = subtotal + impuestos;

    return { totalItems, subtotal, impuestos, total };
  });

  readonly isEmpty = computed(() => this.itemsSignal().length === 0);

  readonly itemCount = computed(() => this.totals().totalItems);

  private previousAuthState: boolean | null = null;

  constructor() {
    // React to auth state changes - sync cart when user logs in/out
    effect(() => {
      const isAuth = this.authService.isAuthenticated$();

      // Skip initial run and only react to actual changes
      if (this.previousAuthState !== null && this.previousAuthState !== isAuth) {
        if (isAuth) {
          // User just logged in - sync guest cart to backend or load from backend
          this.handleLogin();
        } else {
          // User just logged out - clear cart and load from localStorage
          this.handleLogout();
        }
      }
      this.previousAuthState = isAuth;
    });

    this.refreshCart();
  }

  private async handleLogin(): Promise<void> {
    const guestItems = this.itemsSignal();

    if (guestItems.length > 0) {
      // Merge guest cart with backend cart
      await this.mergeGuestCartToBackend(guestItems);
    }

    await this.loadFromBackend();
    this.clearLocalStorage();
  }

  private handleLogout(): void {
    this.itemsSignal.set([]);
  }

  private async postAddProduct(productId: number, quantity: number): Promise<void> {
    await firstValueFrom(this.http.post(API.CART.ADD_PRODUCT, { productId, quantity }));
  }

  /**
   * Update quantity in backend - quantity is a DELTA (positive to add, negative to remove)
   */
  private async postUpdateQuantity(productId: number, delta: number): Promise<void> {
    await firstValueFrom(this.http.post(API.CART.UPDATE, { productId, quantity: delta }));
  }

  private async postDeleteProduct(productId: number): Promise<void> {
    await firstValueFrom(this.http.post(API.CART.DELETE_PRODUCT, { productId }));
  }

  private async mergeGuestCartToBackend(guestItems: CartItem[]): Promise<void> {
    for (const item of guestItems) {
      try {
        await this.postAddProduct(item.id, item.cantidad);
      } catch (error) {
        console.error('Failed to merge guest item to backend', error);
      }
    }
  }

  private clearLocalStorage(): void {
    this.storageService.removeItem(STORAGE_KEY);
  }

  /**
   * Loads cart from Backend (if auth) or LocalStorage (if guest)
   */
  async refreshCart(): Promise<void> {
    if (this.authService.isAuthenticated()) {
      await this.loadFromBackend();
    } else {
      this.loadFromStorage();
    }
  }

  private async loadFromBackend(): Promise<void> {
    try {
      const cart = await firstValueFrom(this.http.get<BackendCartResponse>(API.CART.BASE));

      if (cart?.details?.length > 0) {
        const mappedItems: CartItem[] = cart.details.map((d: BackendCartDetails) => ({
          id: d.product.product_id,
          nombre: d.product.product_name,
          precio: d.product.price,
          descripcion: d.product.description || '',
          categoria: 'General',
          cantidad: d.quantity,
          imagen: d.product.images?.[0] || ''
        }));
        this.itemsSignal.set(mappedItems);
      } else {
        this.itemsSignal.set([]);
      }
    } catch (error) {
      console.error('Error loading cart from backend', error);
      try {
        await firstValueFrom(this.http.post(API.CART.CREATE, {}));
        this.itemsSignal.set([]);
      } catch (e) {
        console.error('Error creating cart', e);
      }
    }
  }

  private loadFromStorage(): void {
    const stored = this.storageService.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const items = JSON.parse(stored) as CartItem[];
        this.itemsSignal.set(items);
      } catch {
        this.itemsSignal.set([]);
      }
    }
  }

  private saveToStorage(): void {
    this.storageService.setItem(STORAGE_KEY, JSON.stringify(this.itemsSignal()));
  }

  async addItem(item: Omit<CartItem, 'cantidad'>, cantidad = 1): Promise<void> {
    const currentItems = this.itemsSignal();
    const existingIndex = currentItems.findIndex(i => i.id === item.id);

    let updatedItems = [...currentItems];
    if (existingIndex >= 0) {
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        cantidad: updatedItems[existingIndex].cantidad + cantidad
      };
    } else {
      updatedItems = [...currentItems, { ...item, cantidad }];
    }
    this.itemsSignal.set(updatedItems);

    if (this.authService.isAuthenticated()) {
      try {
        await this.postAddProduct(item.id, cantidad);
      } catch (error) {
        console.error('Failed to sync add to backend', error);
      }
    } else {
      this.saveToStorage();
    }
  }

  async removeItem(id: number): Promise<void> {
    if (this.authService.isAuthenticated()) {
      await this.postDeleteProduct(id);
    }
    await this.refreshCart();
  }

  async updateQuantity(id: number, cantidad: number): Promise<void> {
    if (cantidad <= 0) {
      await this.removeItem(id);
      return;
    }

    this.itemsSignal.update(items =>
      items.map(item =>
        item.id === id ? { ...item, cantidad } : item
      )
    );

    if (!this.authService.isAuthenticated()) {
      this.saveToStorage();
    }
  }

  async increaseQuantity(id: number, maxStock?: number): Promise<void> {
    const item = this.itemsSignal().find(i => i.id === id);
    if (!item) return;

    // Check stock limit
    if (maxStock !== undefined && item.cantidad >= maxStock) {
      return;
    }

    const newQuantity = item.cantidad + 1;

    // Update local state first
    this.itemsSignal.update(items =>
      items.map(i => i.id === id ? { ...i, cantidad: newQuantity } : i)
    );

    if (this.authService.isAuthenticated()) {
      try {
        await this.postUpdateQuantity(id, 1); // Delta of +1
      } catch (error) {
        console.error('Failed to increase quantity', error);
        // Revert on error
        this.itemsSignal.update(items =>
          items.map(i => i.id === id ? { ...i, cantidad: item.cantidad } : i)
        );
      }
    } else {
      this.saveToStorage();
    }
  }

  async decreaseQuantity(id: number): Promise<void> {
    const item = this.itemsSignal().find(i => i.id === id);
    if (!item) return;

    if (item.cantidad <= 1) {
      await this.removeItem(id);
      return;
    }

    const newQuantity = item.cantidad - 1;

    // Update local state first
    this.itemsSignal.update(items =>
      items.map(i => i.id === id ? { ...i, cantidad: newQuantity } : i)
    );

    if (this.authService.isAuthenticated()) {
      try {
        await this.postUpdateQuantity(id, -1); // Delta of -1
      } catch (error) {
        console.error('Failed to decrease quantity', error);
        // Revert on error
        this.itemsSignal.update(items =>
          items.map(i => i.id === id ? { ...i, cantidad: item.cantidad } : i)
        );
      }
    } else {
      this.saveToStorage();
    }
  }

  clear(): void {
    this.itemsSignal.set([]);
    this.clearLocalStorage();
  }

  getItems(): CartItem[] {
    return this.itemsSignal();
  }

  getTotals(): CartTotals {
    return this.totals();
  }
}
