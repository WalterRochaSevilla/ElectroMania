import { Component, OnInit, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  router = inject(Router);
  private productosService = inject(ProductosService);


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
      product_name: 'ESP32 WiFi + Bluetooth',
      description: 'Microcontrolador potente para IoT',
      price: 55,
      categoria: 'Arduino & Microcontroladores',
      images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1A2B3C4D5E6F7G8H9I0J1K2M3N4O5P6Q7R8&s'],
      stock: 10,
      state: true
    },
    {
      id: 2,
      product_name: 'Módulo Bluetooth HC-05',
      description: 'Conectividad inalámbrica simple',
      price: 45,
      categoria: 'Arduino & Microcontroladores',
      images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqL5yqL3tS_cDyD4D9gA4lZ8H6wF7pE0Q5wA&s'], // Placeholder reuse, best effort for mock
      stock: 10,
      state: true
    },
    {
      id: 3,
      product_name: 'Sensor Ultrasonido HC-SR04',
      description: 'Mide distancia por ultrasonido',
      price: 15,
      categoria: 'Sensores',
      images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0NnC8_t6zX9gB3e5f2a1d4c7b8e9f0g1h2i3j&s'],
      stock: 10,
      state: true
    },
    {
      id: 4,
      product_name: 'Kit de Resistencias (100u)',
      description: 'Valores variados para prototipado',
      price: 20,
      categoria: 'Componentes Pasivos',
      images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6j7k8l&s'],
      stock: 10,
      state: true
    },
    {
      id: 5,
      product_name: 'Pantalla OLED 0.96"',
      description: 'Display monocromo I2C',
      price: 35,
      categoria: 'Arduino & Microcontroladores',
      images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1U2V3W4X5Y6Z7a8b9c0d1e2f3g4h5i6j7k8&s'],
      stock: 10,
      state: true
    },
    {
      id: 6,
      product_name: 'Sensor de Humedad DHT11',
      description: 'Mide temperatura y humedad',
      price: 12,
      categoria: 'Sensores',
      images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0NnC8_t6zX9gB3e5f2a1d4c7b8e9f0g1h2i3j&s'], // Reuse sensor image
      stock: 10,
      state: true
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
        p.product_name.toLowerCase().includes(this.busqueda.toLowerCase())
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
      resultado.sort((a, b) => a.price - b.price);
    } else if (this.orden === 'precioDesc') {
      resultado.sort((a, b) => b.price - a.price);
    }

    this.productosFiltrados = resultado;
  }

  /* =========================
      CARRITO
  ========================= */
  agregarAlCarrito(producto: unknown) {
    console.log('Producto agregado al carrito:', producto);
  }
}