import { ProductModel } from "./Product.model";

export class PageProductResponseModel {
    page: number;
    max_size_per_page: number;
    content: ProductModel[];
    totalElements: number;
}