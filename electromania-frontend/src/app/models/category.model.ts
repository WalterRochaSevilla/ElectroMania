export interface Category {
    id: number;
    name: string;
}
export interface CreateCategoryRequest {
    name: string;
    description: string;
}
export interface RegisterProductCategoryRequest {
    product_id: number;
    category_id: number;
}