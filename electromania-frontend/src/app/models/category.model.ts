export interface Category {
  id: number;
  name: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface RegisterProductCategoryRequest {
  productId: number;
  categoryId: number;
}
