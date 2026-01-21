import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category, CreateCategoryRequest, RegisterProductCategoryRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);

  async getAll(): Promise<Category[]> {
    return firstValueFrom(this.http.get<Category[]>(`${environment.API_DOMAIN}/category`));
  }

  async getById(id: number): Promise<Category> {
    return firstValueFrom(this.http.get<Category>(`${environment.API_DOMAIN}/category/${id}`));
  }

  async create(data: CreateCategoryRequest): Promise<Category> {
    return firstValueFrom(this.http.post<Category>(`${environment.API_DOMAIN}/category/register`, data));
  }

  async addProductToCategory(data: RegisterProductCategoryRequest): Promise<void> {
    await firstValueFrom(this.http.post(`${environment.API_DOMAIN}/category/addProduct`, data));
  }

  async update(id: number, data: Partial<CreateCategoryRequest>): Promise<Category> {
    return firstValueFrom(this.http.patch<Category>(`${environment.API_DOMAIN}/category/${id}`, data));
  }

  async delete(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${environment.API_DOMAIN}/category/${id}`));
  }
}
