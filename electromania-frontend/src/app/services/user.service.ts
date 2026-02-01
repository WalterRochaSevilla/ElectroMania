import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { User, RegisterUserRequest } from '../models';
import { API } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);

  async getAllUsers(): Promise<User[]> {
    return firstValueFrom(this.http.get<User[]>(API.USERS.ALL));
  }

  async getCurrentUser(): Promise<User> {
    return firstValueFrom(this.http.get<User>(API.USERS.GET));
  }

  async createUser(data: RegisterUserRequest): Promise<User> {
    return firstValueFrom(this.http.post<User>(API.AUTH.REGISTER, data));
  }
}
