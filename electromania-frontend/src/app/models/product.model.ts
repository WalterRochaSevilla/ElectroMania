export type ProductState = 'AVAILABLE' | 'UNAVAILABLE' | 'OUT_OF_STOCK';

export interface Product {
  product_id?: number;
  product_name: string;
  description: string;
  price: number;
  stock: number;
  state: ProductState;
  images: string[];
}

export interface CreateProductRequest {
  product_name: string;
  description: string;
  price: number;
  stock: number;
  image?: File;
}

export interface UpdateProductRequest {
  product_name?: string;
  description?: string;
  price?: number;
  stock?: number;
  state?: ProductState;
  image?: File;
}

export interface ProductDisplay {
  id: number | undefined;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  activo: boolean;
  description?: string;
  images?: string[];
}

export interface ProductCard {
  product_id?: number;
  product_name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  isOffer?: boolean;
}

export interface PageProductResponse {
  page: number;
  max_size_per_page: number;
  content: Product[];
  totalElements: number;
}

export interface RegisterProductImageRequest {
  name: string;
  image_url: string;
}
