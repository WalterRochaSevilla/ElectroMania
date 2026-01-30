import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Product, ProductCard, CreateProductRequest, UpdateProductRequest, PageProductResponse, Category, RegisterProductImageRequest } from '../models';
import { API, INVENTORY } from '../constants';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private readonly http = inject(HttpClient);
  private readonly categoryService = inject(CategoryService);

  async getAllProducts(): Promise<Product[]> {
    return firstValueFrom(this.http.get<Product[]>(API.PRODUCTS.ALL));
  }

  async getProductsPage(page: number): Promise<PageProductResponse> {
    return firstValueFrom(this.http.get<PageProductResponse>(API.PRODUCTS.PAGE(page)));
  }

  async getProductById(id: number): Promise<Product | null> {
    const products = await this.getAllProducts();
    return products.find(p => p.product_id === id) ?? null;
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
    return firstValueFrom(this.http.post<Product>(API.PRODUCTS.REGISTER, formData));
  }

  async updateProduct(id: number | string, product: UpdateProductRequest): Promise<Product> {
    if (product.image) {
      const formData = new FormData();
      if (product.product_name) formData.append('product_name', product.product_name);
      if (product.description) formData.append('description', product.description);
      if (product.price !== undefined) formData.append('price', product.price.toString());
      if (product.stock !== undefined) formData.append('stock', product.stock.toString());
      if (product.state) formData.append('state', product.state);
      formData.append('image', product.image);

      return firstValueFrom(this.http.put<Product>(API.PRODUCTS.UPDATE(id), formData));
    }

    const { image: _image, ...jsonData } = product;
    return firstValueFrom(this.http.put<Product>(API.PRODUCTS.UPDATE(id), jsonData));
  }

  async deleteProduct(id: number | string): Promise<void> {
    await firstValueFrom(this.http.delete(API.PRODUCTS.DELETE(id)));
  }

  async addProductImage(data: RegisterProductImageRequest): Promise<Product> {
    return firstValueFrom(this.http.post<Product>(API.PRODUCTS.ADD_IMAGE, data));
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

  private getStockStatus(stock: number): 'Agotado' | 'Crítico' | 'Bajo' {
    if (stock === INVENTORY.OUT_OF_STOCK_THRESHOLD) return 'Agotado';
    if (stock <= INVENTORY.CRITICAL_STOCK_THRESHOLD) return 'Crítico';
    return 'Bajo';
  }
}
