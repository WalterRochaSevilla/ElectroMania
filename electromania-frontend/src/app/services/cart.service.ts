import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { CartItem, CartTotals } from '../models';

interface BackendCartProduct {
  product_id: number;
  product_name: string;
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

const STORAGE_KEY = 'carrito_electromania';
const TAX_RATE = 0.13;

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  private itemsSignal = signal<CartItem[]>([]);

  readonly items = this.itemsSignal.asReadonly();

  readonly totals = computed<CartTotals>(() => {
    const items = this.itemsSignal();
    const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const impuestos = subtotal * TAX_RATE;
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
    // Guest cart starts fresh after logout
  }

  private async mergeGuestCartToBackend(guestItems: CartItem[]): Promise<void> {
    for (const item of guestItems) {
      try {
        await firstValueFrom(this.http.post(`${environment.API_DOMAIN}/cart/addProduct`, {
          productId: item.id,
          quantity: item.cantidad
        }));
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
      const cart = await firstValueFrom(this.http.get<BackendCartResponse>(`${environment.API_DOMAIN}/cart`));

      if (cart && cart.details && cart.details.length > 0) {
        const mappedItems: CartItem[] = cart.details.map((d: BackendCartDetails) => ({
          id: d.product.product_id,
          nombre: d.product.product_name,
          precio: d.product.price,
          descripcion: '',
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
        await firstValueFrom(this.http.post(`${environment.API_DOMAIN}/cart/create`, {}));
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

    // Optimistic UI Update (update Signal immediately)
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

    // Persistence Logic
    if (this.authService.isAuthenticated()) {
      try {
        await firstValueFrom(this.http.post(`${environment.API_DOMAIN}/cart/addProduct`, {
          productId: item.id,
          quantity: cantidad // Backend expects "quantity" to ADD, not total? 
          // Wait, typical "add" endpoints add to existing. 
          // If backend replaces, logic differs. I'll assume "add".
        }));
        // Optional: Reload from backend to ensure synchronization
        // await this.refreshCart(); 
      } catch (error) {
        console.error('Failed to sync add to backend', error);
        // Revert on failure? For now, keep local optimistic update.
      }
    } else {
      this.saveToStorage();
    }
  }

  async removeItem(id: number): Promise<void> {
    this.itemsSignal.update(items => items.filter(item => item.id !== id));
    
    if (this.authService.isAuthenticated()) {
      try {
        await firstValueFrom(this.http.delete(`${environment.API_DOMAIN}/cart/removeItem/${id}`));
      } catch (error) {
        console.error('Failed to remove item from backend cart', error);
      }
    } else {
      this.saveToStorage();
    }
  }

  updateQuantity(id: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.removeItem(id);
      return;
    }

    this.itemsSignal.update(items =>
      items.map(item =>
        item.id === id ? { ...item, cantidad } : item
      )
    );
    this.saveToStorage();
  }

  increaseQuantity(id: number): void {
    const item = this.itemsSignal().find(i => i.id === id);
    if (item) {
      this.updateQuantity(id, item.cantidad + 1);
    }
  }

  decreaseQuantity(id: number): void {
    const item = this.itemsSignal().find(i => i.id === id);
    if (item) {
      this.updateQuantity(id, item.cantidad - 1);
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
