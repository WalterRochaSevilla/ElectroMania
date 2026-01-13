import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import environment from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(
    private router: Router,
    private httpClient : HttpClient
  ) { }

  getProductos(){
    return this.httpClient.get(`${environment.API_DOMAIN}/product/all`)
  }

}
