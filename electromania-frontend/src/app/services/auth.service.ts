import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import environment from '../../environments/environment';
import { access } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  async registerUser(data: any) {
    console.log(data);
    console.log(`${environment.API_DOMAIN}/auth/register`);
    return this.http.post(`${environment.API_DOMAIN}/auth/register`, data).forEach((res: any) => {
      console.log(res);
    });
  }
  async login(data: any) {
    console.log(data);
    console.log(`${environment.API_DOMAIN}/auth/login`);
    return this.http.post(`${environment.API_DOMAIN}/auth/login`, data).pipe().forEach((res: any) => {
      console.log(res);
      localStorage.setItem('token', res.access_token);
    });
  }
}
