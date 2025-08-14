// src/app/services/carrito.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private itemsCarrito: any[] = [];
  private carrito = new BehaviorSubject<any[]>([]);

  carrito$ = this.carrito.asObservable();

  constructor() {
    const saved = JSON.parse(localStorage.getItem('carrito') || '[]');
    this.itemsCarrito = saved;
    this.carrito.next([...this.itemsCarrito]);
  }

  private persist() {
    localStorage.setItem('carrito', JSON.stringify(this.itemsCarrito));
    this.carrito.next([...this.itemsCarrito]);
  }

  agregarProducto(producto: any): void {
    const existente = this.itemsCarrito.find(item => item.id === producto.id);
    if (existente) {
      existente.cantidad += 1;
    } else {
      this.itemsCarrito.push({ ...producto, cantidad: 1 });
    }
    this.persist();
  }

  eliminarProducto(id: number): void {
    this.itemsCarrito = this.itemsCarrito.filter(item => item.id !== id);
    this.persist();
  }

  vaciarCarrito(): void {
    this.itemsCarrito = [];
    this.persist();
  }

  getTotal(): number {
    return this.itemsCarrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }
}
