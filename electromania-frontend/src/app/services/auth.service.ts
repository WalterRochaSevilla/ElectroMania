import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.template';
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest, LoginResponse, DecodedToken, RegisterUserRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  async registerUser(data: RegisterUserRequest): Promise<void> {
    await firstValueFrom(this.http.post(`${environment.API_DOMAIN}/auth/register`, data));
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await firstValueFrom(
      this.http.post<LoginResponse>(`${environment.API_DOMAIN}/auth/login`, data)
    );

    if (response?.access_token) {
      localStorage.setItem('token', response.access_token);
    }
    return response;
  }

  getRole(): string {
    const token = this.getToken();
    if (!token) return 'guest';

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.role || (decoded.roles && decoded.roles[0]) || 'cliente';
    } catch {
      return 'guest';
    }
  }

  isAdmin(): boolean {
    const role = this.getRole().toLowerCase();
    return role === 'admin' || role === 'administrador';
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
