import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, ProductCard, CreateProductRequest, UpdateProductRequest, PageProductResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private httpClient = inject(HttpClient);

  async getAllProducts(): Promise<Product[]> {
    return firstValueFrom(this.httpClient.get<Product[]>(`${environment.API_DOMAIN}/products/all`));
  }

  async getProductsPage(page: number): Promise<PageProductResponse> {
    return firstValueFrom(this.httpClient.get<PageProductResponse>(`${environment.API_DOMAIN}/products?page=${page}`));
  }

  async getProductById(id: number): Promise<Product> {
    const products = await this.getAllProducts();
    const product = products.find(p => p.product_id === id);
    if (!product) throw new Error('Product not found');
    return product;
  }

  async createProduct(product: CreateProductRequest): Promise<Product> {
    return firstValueFrom(this.httpClient.post<Product>(`${environment.API_DOMAIN}/products/register`, product));
  }

  async updateProduct(id: number | string, product: UpdateProductRequest): Promise<Product> {
    return firstValueFrom(this.httpClient.put<Product>(`${environment.API_DOMAIN}/products/update/?id=${id}`, product));
  }

  async deleteProduct(id: number | string): Promise<void> {
    await firstValueFrom(this.httpClient.delete(`${environment.API_DOMAIN}/products/delete/${id}`));
  }

  toProductCard(product: Product): ProductCard {
    return {
      product_id: product.product_id,
      product_name: product.product_name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      images: product.images || [],
    };
  }

  toProductCards(products: Product[]): ProductCard[] {
    return products.map(p => this.toProductCard(p));
  }

  async getCategorias(): Promise<string[]> {
    return [
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
  }

  async getDashboardStats() {
    return {
      totalRevenue: 12450.00,
      revenueChange: 12,
      lowStockCount: 5,
      systemStatus: 'Online'
    };
  }

  async getRevenueStats(period: '7d' | '30d' | '90d') {
    const labels = period === '7d'
      ? ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
      : ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];

    const data = period === '7d'
      ? [7000, 8500, 6000, 9000, 7500, 9500, 8000]
      : [32000, 28000, 35000, 42000];

    return { labels, data };
  }

  async getTopSellingProducts() {
    return [
      { name: 'Arduino UNO R3', sold: 120 },
      { name: 'ESP32 DevKit', sold: 95 },
      { name: 'Sensor HC-SR04', sold: 80 },
      { name: 'Servo SG90', sold: 65 }
    ];
  }

  async getLowStockProducts() {
    return [
      { id: '#089', name: 'Sensor Humedad DHT11', stock: 2, status: 'Crítico' },
      { id: '#102', name: 'Cable Jumper M-M', stock: 5, status: 'Bajo' },
      { id: '#205', name: 'Resistencia 220Ω', stock: 8, status: 'Bajo' },
      { id: '#012', name: 'Display LCD 16x2', stock: 0, status: 'Agotado' }
    ];
  }
}
