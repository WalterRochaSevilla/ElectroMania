import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  /* =========================
     ESTADOS GENERALES
  ========================= */
  modoOscuro: boolean = true;

  busqueda: string = '';
  orden: string = 'relevancia';

    /* =========================
     INYECCIÓN DE DEPENDENCIAS
  ========================= */
  constructor(private router: Router) {}

  /* =========================
     CATEGORÍAS
  ========================= */
  categorias: string[] = [
    'Arduino & Microcontroladores',
    'Sensores',
    'Componentes Pasivos'
  ];

  categoriasSeleccionadas: Set<string> = new Set();

  /* =========================
     PRODUCTOS (SIMULADOS)
     Luego vienen del backend
  ========================= */
  productos = [
    {
      nombre: 'ESP32 WiFi + Bluetooth',
      descripcion: 'Microcontrolador ideal para proyectos IoT',
      precio: 55,
      categoria: 'Arduino & Microcontroladores'
    },
    {
      nombre: 'Módulo HC-05',
      descripcion: 'Bluetooth Maestro/Esclavo',
      precio: 45,
      categoria: 'Arduino & Microcontroladores'
    }
  ];

  productosFiltrados = [...this.productos];

  /* =========================
     HEADER
  ========================= */
  cambiarModo() {
    this.modoOscuro = !this.modoOscuro;
  }

  ingresar() {
    this.router.navigate(['/login']);
  }
  Catalogo() {
    this.router.navigate(['/home']);
  }
  Carrito() {
    this.router.navigate(['/producto']);
  }

  /* =========================
     FILTROS
  ========================= */
  filtrarCategoria(categoria: string) {
    if (this.categoriasSeleccionadas.has(categoria)) {
      this.categoriasSeleccionadas.delete(categoria);
    } else {
      this.categoriasSeleccionadas.add(categoria);
    }
    this.aplicarFiltros();
  }

  buscarComponentes() {
    this.aplicarFiltros();
  }

  ordenarComponentes() {
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let resultado = [...this.productos];

    /* Filtro por búsqueda */
    if (this.busqueda.trim() !== '') {
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    }

    /* Filtro por categoría */
    if (this.categoriasSeleccionadas.size > 0) {
      resultado = resultado.filter(p =>
        this.categoriasSeleccionadas.has(p.categoria)
      );
    }

    /* Ordenamiento */
    if (this.orden === 'precioAsc') {
      resultado.sort((a, b) => a.precio - b.precio);
    }

    if (this.orden === 'precioDesc') {
      resultado.sort((a, b) => b.precio - a.precio);
    }

    this.productosFiltrados = resultado;
  }

  /* =========================
     CARRITO
  ========================= */
  agregarAlCarrito(producto: any) {
    console.log('Producto agregado al carrito:', producto);
  }
}
