import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import environment from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
  access_token: string;
}

interface DecodedToken {
  role?: string;
  roles?: string[];
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);


  async registerUser(data: unknown) {
    return firstValueFrom(this.http.post(`${environment.API_DOMAIN}/auth/register`, data));
  }

  async login(data: unknown) {
    const response = await firstValueFrom(this.http.post<LoginResponse>(`${environment.API_DOMAIN}/auth/login`, data));

    if (response && response.access_token) {
      localStorage.setItem('token', response.access_token);
      // We no longer store 'user_role' in localStorage to avoid security risks
    }
    return response;
  }

  getRole(): string {
    const token = this.getToken();
    if (!token) return 'guest';

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      // Check for 'role' or 'roles' claim
      return decoded.role || (decoded.roles && decoded.roles[0]) || 'cliente';
    } catch (error) {
      console.error('Error decoding token:', error);
      return 'guest';
    }
  }

  isAdmin(): boolean {
    const role = this.getRole().toLowerCase();
    return role === 'admin' || role === 'administrador';
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      // No need to remove user_role anymore
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
