import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, ProductCard, CreateProductRequest, UpdateProductRequest, PageProductResponse, Category, RegisterProductImageRequest } from '../models';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private httpClient = inject(HttpClient);
  private categoryService = inject(CategoryService);

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
    const formData = new FormData();
    formData.append('product_name', product.product_name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('stock', product.stock.toString());

    if (product.image) {
      formData.append('image', product.image);
    }
    return firstValueFrom(this.httpClient.post<Product>(`${environment.API_DOMAIN}/products/register`, formData));
  }

  async updateProduct(id: number | string, product: UpdateProductRequest): Promise<Product> {
    return firstValueFrom(this.httpClient.put<Product>(`${environment.API_DOMAIN}/products/update/?id=${id}`, product));
  }

  async deleteProduct(id: number | string): Promise<void> {
    await firstValueFrom(this.httpClient.delete(`${environment.API_DOMAIN}/products/delete/${id}`));
  }

  async addProductImage(data: RegisterProductImageRequest): Promise<Product> {
    return firstValueFrom(this.httpClient.post<Product>(`${environment.API_DOMAIN}/products/addImage`, data));
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

  async getCategorias(): Promise<Category[]> {
    return this.categoryService.getAll();
  }

  async getCategoriasAsStrings(): Promise<string[]> {
    const categories = await this.categoryService.getAll();
    return categories.map(c => c.name);
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
    const products = await this.getAllProducts();
    const lowStockThreshold = 10;
    
    return products
      .filter(p => p.stock <= lowStockThreshold)
      .map(p => ({
        id: p.product_id ?? 0,
        name: p.product_name,
        stock: p.stock,
        status: p.stock === 0 ? 'Agotado' : p.stock <= 3 ? 'Crítico' : 'Bajo'
      }))
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 10);
  }
}
