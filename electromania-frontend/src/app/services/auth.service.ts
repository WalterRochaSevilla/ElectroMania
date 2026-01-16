import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import environment from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  async registerUser(data: unknown) {
    console.log(data);
    console.log(`${environment.API_DOMAIN}/auth/register`);
    return this.http.post(`${environment.API_DOMAIN}/auth/register`, data).forEach((res: unknown) => {
      console.log(res);
    });
  }
  async login(data: unknown) {
    console.log(data);
    console.log(`${environment.API_DOMAIN}/auth/login`);
    return this.http.post<{ access_token: string, role?: string }>(`${environment.API_DOMAIN}/auth/login`, data).pipe().forEach((res) => {
      console.log(res);
      localStorage.setItem('token', res.access_token);
      // Mocking role for now if not present, default to admin for dev
      const role = res.role || 'admin';
      localStorage.setItem('user_role', role);
    });
  }

  getRole(): string {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('user_role') || 'guest';
    }
    return 'guest';
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user_role');
    }
  }
}
