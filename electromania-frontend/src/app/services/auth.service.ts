import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

interface TokenPayload {
  sub?: string;
  exp?: number;
  roles?: string[];    // posible forma
  role?: string;       // posible forma simple
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any | null>;
  public currentUser: Observable<any | null>;
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        const decoded = jwtDecode<TokenPayload>(response.token);
        const user = { ...decoded, token: response.token };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  // Registro directo al backend
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get currentUserValue(): any | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const user = this.currentUserValue;
    if (!user?.token) return false;

    try {
      const decoded = jwtDecode<TokenPayload>(user.token);
      if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
        // token expirado: limpiar
        this.logout();
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    if (!user) return false;

    // diferentes backends usan distintas formas: adaptamos
    const roles = user.roles || user.authorities || user.role || user.rol;
    if (!roles) return false;

    if (Array.isArray(roles)) {
      return roles.includes('ADMIN') || roles.includes('ROLE_ADMIN');
    }
    if (typeof roles === 'string') {
      return roles === 'ADMIN' || roles === 'ROLE_ADMIN';
    }
    return false;
  }
}
