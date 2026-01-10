import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConectionService {

  private api = 'http://localhost:3000/product/Conection';

  constructor(private http: HttpClient) {}

  check() {
    return this.http.get(this.api);
  }
}
