import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  productos: Producto[] = [
    { id: 1, nombre: 'Laptop Pro 15"', precio: 7200, imagen: 'https://via.placeholder.com/300x200' },
    { id: 2, nombre: 'Smartphone X', precio: 3500, imagen: 'https://via.placeholder.com/300x200' },
    { id: 3, nombre: 'Auriculares Wireless', precio: 450, imagen: 'https://via.placeholder.com/300x200' }
  ];

  agregarAlCarrito(producto: Producto) {
    console.log(`Producto agregado: ${producto.nombre}`);
    // Aquí luego conectamos con carrito.service
  }
}
