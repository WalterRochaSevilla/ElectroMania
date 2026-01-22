export interface Category {
  id: number;
  name: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface RegisterProductCategoryRequest {
  productId: number;
  categoryId: number;
}
