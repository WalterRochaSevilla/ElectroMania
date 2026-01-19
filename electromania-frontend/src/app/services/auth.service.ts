import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';  // 
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  // metodo registro esto me devuelve "obeservable"
  registerUser(data: any): Observable<any> {
    console.log('Datos de registro:', data);
    console.log('URL:', `${environment.API_DOMAIN}/auth/register`);
    return this.http.post(`${environment.API_DOMAIN}/auth/register`, data);
  }

  // metodo login esto me devuelve "obeservable"
  login(data: any): Observable<{ access_token: string }> {
    console.log('Datos de login:', data);
    console.log('URL:', `${environment.API_DOMAIN}/auth/login`);
    
    return this.http.post<{ access_token: string }>(
      `${environment.API_DOMAIN}/auth/login`, 
      data
    ).pipe(
      tap((res) => {
        console.log('Respuesta del login:', res);
        //solo guarde el token,no el rol
        localStorage.setItem('token', res.access_token);
        
        // limpio el rol antiguo si existe
        localStorage.removeItem('user_role');
        localStorage.removeItem('role');
      })
    );
  }

  // obtenemos el token
  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // decodificar el token
  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      return jwtDecode(token);  // funcion importada
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  // obtener rol desde token
  getRole(): string {
    const decoded = this.decodeToken();
    
    if (!decoded) {
      return 'guest';
    }
    
    // verificamos la expiracion
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      this.logout();
      return 'guest';
    }
    
    return decoded.role || 'guest';
  }

  // verificamos la autentificacion
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    const decoded = this.decodeToken();
    if (!decoded) return false;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return !decoded.exp || decoded.exp > currentTime;
  }

  // logoutt 
  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('role');
    }
  }
}