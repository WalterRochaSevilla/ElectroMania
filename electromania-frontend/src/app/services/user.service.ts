import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, RegisterUserRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  async getAllUsers(): Promise<User[]> {
    return firstValueFrom(this.http.get<User[]>(`${environment.API_DOMAIN}/users/all`));
  }

  async createUser(data: RegisterUserRequest): Promise<User> {
    return firstValueFrom(this.http.post<User>(`${environment.API_DOMAIN}/auth/register`, data));
  }
}
