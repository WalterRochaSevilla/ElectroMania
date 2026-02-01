import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Category, CreateCategoryRequest, RegisterProductCategoryRequest } from '../models';
import { API } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly http = inject(HttpClient);

  async getAll(): Promise<Category[]> {
    return firstValueFrom(this.http.get<Category[]>(API.CATEGORY.BASE));
  }

  async getById(id: number): Promise<Category> {
    return firstValueFrom(this.http.get<Category>(API.CATEGORY.BY_ID(id)));
  }

  async create(data: CreateCategoryRequest): Promise<Category> {
    return firstValueFrom(this.http.post<Category>(API.CATEGORY.REGISTER, data));
  }

  async addProductToCategory(data: RegisterProductCategoryRequest): Promise<void> {
    await firstValueFrom(this.http.post(API.CATEGORY.ADD_PRODUCT, data));
  }

  async update(id: number, data: Partial<CreateCategoryRequest>): Promise<Category> {
    return firstValueFrom(this.http.patch<Category>(API.CATEGORY.BY_ID(id), data));
  }

  async delete(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(API.CATEGORY.BY_ID(id)));
  }
}
