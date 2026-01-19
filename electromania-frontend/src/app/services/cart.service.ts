import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { CartItem, CartTotals } from '../models';

interface BackendCartDetails {
  product: {
    product_id: number;
    product_name: string;
    description: string;
    images?: { image: string }[];
  };
  quantity: number;
  unit_price: string;
}

interface BackendCartResponse {
  cartDetails?: BackendCartDetails[];
}

const STORAGE_KEY = 'carrito_electromania';
const TAX_RATE = 0.13;

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
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

  constructor() {
    // If user logs in/out, we might want to reload. For now, load on init.
    // In a real app, we'd subscribe to auth state changes.
    this.refreshCart();
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
      // 1. Try to get existing cart
      const cart = await firstValueFrom(this.http.get<BackendCartResponse>(`${environment.API_DOMAIN}/cart`));

      // Map backend response to CartItem[] structure
      // Note: Adjust mapping based on actual backend response structure
      if (cart && cart.cartDetails) {
        const mappedItems: CartItem[] = cart.cartDetails!.map((d: BackendCartDetails) => ({
          id: d.product.product_id,
          nombre: d.product.product_name,
          precio: parseFloat(d.unit_price),
          descripcion: d.product.description,
          categoria: 'General', // Backend might not send this yet
          cantidad: d.quantity,
          imagen: d.product.images?.[0]?.image || 'assets/placeholder.jpg' // Handle images
        }));
        this.itemsSignal.set(mappedItems);
      }
    } catch (error) {
      console.error('Error loading cart from backend', error);
      // Fallback: If 404, maybe create cart? 
      // The backend 'create' endpoint seems to create a NEW cart.
      // We might need to call this if GET fails.
      try {
        await firstValueFrom(this.http.post(`${environment.API_DOMAIN}/cart/create`, {}));
        // Retry load?
      } catch (e) {
        console.error('Error creating cart', e);
      }
    }
  }

  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') return;

    const stored = localStorage.getItem(STORAGE_KEY);
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
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.itemsSignal()));
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

  removeItem(id: number): void {
    this.itemsSignal.update(items => items.filter(item => item.id !== id));
    this.saveToStorage();
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
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  getItems(): CartItem[] {
    return this.itemsSignal();
  }

  getTotals(): CartTotals {
    return this.totals();
  }
}
