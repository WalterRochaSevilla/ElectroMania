import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { of, firstValueFrom } from 'rxjs';
import environment from '../../environments/environment';

export interface Product {
  product_id?: number;
  product_name: string;
  description: string;
  price: number;
  stock: number;
  state: boolean;
  images: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private router = inject(Router);
  private httpClient = inject(HttpClient);


  // Headers handled by AuthInterceptor

  // === REAL API METHODS ===

  async getAllProducts(): Promise<Product[]> {
    return firstValueFrom(this.httpClient.get<Product[]>(`${environment.API_DOMAIN}/products/all`));
  }

  async createProduct(product: Partial<Product>): Promise<Product> {
    return firstValueFrom(this.httpClient.post<Product>(`${environment.API_DOMAIN}/products/register`, product));
  }

  async updateProduct(id: number | string, product: Partial<Product>): Promise<Product> {
    // Note: Backend uses query param ?id=ID for update
    return firstValueFrom(this.httpClient.put<Product>(`${environment.API_DOMAIN}/products/update/?id=${id}`, product));
  }

  async deleteProduct(id: number | string): Promise<unknown> {
    return firstValueFrom(this.httpClient.delete(`${environment.API_DOMAIN}/products/delete/${id}`));
  }

  // === MOCK / HELPER METHODS ===

  // Simulating API call for categories (frontend categories)
  getCategorias() {
    const categories = [
      'Arduino & Microcontroladores',
      'Sensores',
      'Componentes Pasivos',
      'Motores & Drivers',
      'Pantallas & Displays',
      'Fuentes de Energía',
      'Herramientas',
      'Impresión 3D',
      'Conectividad & Cables',
      'Kits Educativos'
    ];
    return of(categories);
  }

  /* =========================
     MOCK DASHBOARD DATA
  ========================= */
  getDashboardStats() {
    return of({
      totalRevenue: 12450.00,
      revenueChange: 12, // +12%
      lowStockCount: 5,
      systemStatus: 'Online'
    });
  }

  getRevenueStats(period: '7d' | '30d' | '90d') {
    // Mock data based on period
    const labels = period === '7d'
      ? ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
      : ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4']; // Simplificado

    const data = period === '7d'
      ? [7000, 8500, 6000, 9000, 7500, 9500, 8000]
      : [32000, 28000, 35000, 42000];

    return of({ labels, data });
  }

  getTopSellingProducts() {
    return of([
      { name: 'Arduino UNO R3', sold: 120 },
      { name: 'ESP32 DevKit', sold: 95 },
      { name: 'Sensor HC-SR04', sold: 80 },
      { name: 'Servo SG90', sold: 65 }
    ]);
  }

  getLowStockProducts() {
    return of([
      { id: '#089', name: 'Sensor Humedad DHT11', stock: 2, status: 'Crítico' },
      { id: '#102', name: 'Cable Jumper M-M', stock: 5, status: 'Bajo' },
      { id: '#205', name: 'Resistencia 220Ω', stock: 8, status: 'Bajo' },
      { id: '#012', name: 'Display LCD 16x2', stock: 0, status: 'Agotado' }
    ]);
  }
}
