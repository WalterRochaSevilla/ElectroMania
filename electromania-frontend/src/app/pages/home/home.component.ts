/*import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../services/productos.service';
import { Router, RouterLink } from '@angular/router';
import environment from '../../../environments/environment';

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
/*  modoOscuro: boolean = true;

  busqueda: string = '';
  orden: string = 'relevancia';

    /* =========================
     INYECCIÓN DE DEPENDENCIAS
  ========================= */
/*constructor(private router: Router) {}

/* =========================
   CATEGORÍAS
========================= */
/* categorias: string[] = [
   'Arduino & Microcontroladores',
   'Sensores',
   'Componentes Pasivos'
 ];

 categoriasSeleccionadas: Set<string> = new Set();

 /* =========================
    PRODUCTOS (SIMULADOS)
    Luego vienen del backend
 ========================= */
/*productos = [
{
  nombre: 'ESP32 WiFi + Bluetooth',
  descripcion: 'Microcontrolador potente para IoT',
  precio: 55,
  categoria: 'Arduino & Microcontroladores'
},
{
  nombre: 'Módulo Bluetooth HC-05',
  descripcion: 'Conectividad inalámbrica simple',
  precio: 45,
  categoria: 'Arduino & Microcontroladores'
},
{
  nombre: 'Sensor Ultrasonido HC-SR04',
  descripcion: 'Mide distancia por ultrasonido',
  precio: 15,
  categoria: 'Sensores'
},
{
  nombre: 'Kit de Resistencias (100u)',
  descripcion: 'Valores variados para prototipado',
  precio: 20,
  categoria: 'Componentes Pasivos'
},
{
  nombre: 'Pantalla OLED 0.96"',
  descripcion: 'Display monocromo I2C',
  precio: 35,
  categoria: 'Arduino & Microcontroladores'
},
{
  nombre: 'Sensor de Humedad DHT11',
  descripcion: 'Mide temperatura y humedad',
  precio: 12,
  categoria: 'Sensores'
}
];

productosFiltrados = [...this.productos];

/* =========================
   HEADER
========================= */
/*cambiarModo() {
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
/*filtrarCategoria(categoria: string) {
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
/*if (this.busqueda.trim() !== '') {
  resultado = resultado.filter(p =>
    p.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
  );
}

/* Filtro por categoría */
/*if (this.categoriasSeleccionadas.size > 0) {
  resultado = resultado.filter(p =>
    this.categoriasSeleccionadas.has(p.categoria)
  );
}

/* Ordenamiento *//*
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
========================= *//*
agregarAlCarrito(producto: any) {
  console.log('Producto agregado al carrito:', producto);
}
}*/
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  filtrosAvanzadosAbierto = false;

  toggleFiltrosAvanzados() {
    this.filtrosAvanzadosAbierto = !this.filtrosAvanzadosAbierto;
  }

  /* =========================
      ESTADOS GENERALES
  ========================= */
  modoOscuro = true;
  busqueda = '';
  orden = 'relevancia';

  /* =========================
      INYECCIÓN DE DEPENDENCIAS
  ========================= */
  constructor(
    public router: Router,
    private productosService: ProductosService
  ) { }

  ngOnInit() {
    this.cargarCategorias();
    this.cargarFiltrosGuardados();
  }

  /* =========================
      PERSISTENCIA Y CATEGORÍAS
  ========================= */
  categorias: string[] = [];

  cargarFiltrosGuardados() {
    const filtros = localStorage.getItem('electromania_filtros');
    if (filtros) {
      const data = JSON.parse(filtros);
      this.busqueda = data.busqueda || '';
      this.orden = data.orden || 'relevancia';
      if (data.categorias) {
        this.categoriasSeleccionadas = new Set(data.categorias);
      }
    }
  }

  guardarFiltros() {
    const data = {
      busqueda: this.busqueda,
      orden: this.orden,
      categorias: Array.from(this.categoriasSeleccionadas)
    };
    localStorage.setItem('electromania_filtros', JSON.stringify(data));
  }

  cargarCategorias() {
    this.productosService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        // Re-aplicar filtros una vez cargadas las categorías
        this.aplicarFiltros();
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
        // Fallback or empty
      }
    });
  }

  categoriasSeleccionadas = new Set<string>();

  /* =========================
      PRODUCTOS (SIMULADOS)
      Agregamos 'id' para que el RouterLink funcione
  ========================= */
  productos = [
    {
      id: 1,
      nombre: 'ESP32 WiFi + Bluetooth',
      descripcion: 'Microcontrolador potente para IoT',
      precio: 55,
      categoria: 'Arduino & Microcontroladores'
    },
    {
      id: 2,
      nombre: 'Módulo Bluetooth HC-05',
      descripcion: 'Conectividad inalámbrica simple',
      precio: 45,
      categoria: 'Arduino & Microcontroladores'
    },
    {
      id: 3,
      nombre: 'Sensor Ultrasonido HC-SR04',
      descripcion: 'Mide distancia por ultrasonido',
      precio: 15,
      categoria: 'Sensores'
    },
    {
      id: 4,
      nombre: 'Kit de Resistencias (100u)',
      descripcion: 'Valores variados para prototipado',
      precio: 20,
      categoria: 'Componentes Pasivos'
    },
    {
      id: 5,
      nombre: 'Pantalla OLED 0.96"',
      descripcion: 'Display monocromo I2C',
      precio: 35,
      categoria: 'Arduino & Microcontroladores'
    },
    {
      id: 6,
      nombre: 'Sensor de Humedad DHT11',
      descripcion: 'Mide temperatura y humedad',
      precio: 12,
      categoria: 'Sensores'
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
    this.guardarFiltros();
    this.aplicarFiltros();
  }

  buscarComponentes() {
    this.guardarFiltros();
    this.aplicarFiltros();
  }

  ordenarComponentes() {
    this.guardarFiltros();
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
    } else if (this.orden === 'precioDesc') {
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