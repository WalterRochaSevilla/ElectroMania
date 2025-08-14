// src/app/pages/productos/productos.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule],
  templateUrl: './productos.component.html'
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];

  constructor(private productosService: ProductosService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productosService.getAllProductos().subscribe({
      next: (data) => this.productos = data || [],
      error: (err) => console.error('Error al cargar productos', err)
    });
  }
}
