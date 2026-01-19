import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductCard } from '../../models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  router = inject(Router);
  private productosService = inject(ProductosService);
  private cartService = inject(CartService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  filtrosAvanzadosAbierto = false;
  busqueda = '';
  orden = 'relevancia';
  categoriaSeleccionada = '';
  precioSeleccionado = '';
  disponibilidadSeleccionada = '';
  loading = false;

  categorias: string[] = [];

  productos: ProductCard[] = [];
  productosFiltrados: ProductCard[] = [];

  get tieneFilrosActivos(): boolean {
    return this.busqueda.trim() !== '' ||
           this.orden !== 'relevancia' ||
           this.categoriaSeleccionada !== '' ||
           this.precioSeleccionado !== '' ||
           this.disponibilidadSeleccionada !== '';
  }

  async ngOnInit() {
    this.cargarFiltrosGuardados();
    await this.cargarProductos();
    this.cargarCategorias();
  }

  async cargarProductos() {
    this.loading = true;
    try {
      const data = await this.productosService.getAllProducts();
      this.productos = this.productosService.toProductCards(data);
      this.aplicarFiltros();
    } catch {
      this.toast.error('Error al cargar productos');
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  toggleFiltrosAvanzados() {
    this.filtrosAvanzadosAbierto = !this.filtrosAvanzadosAbierto;
  }

  cargarFiltrosGuardados() {
    const filtros = localStorage.getItem('electromania_filtros');
    if (filtros) {
      const data = JSON.parse(filtros);
      this.busqueda = data.busqueda || '';
      this.orden = data.orden || 'relevancia';
      this.categoriaSeleccionada = data.categoria || '';
      this.precioSeleccionado = data.precio || '';
      this.disponibilidadSeleccionada = data.disponibilidad || '';
    }
  }

  guardarFiltros() {
    const data = {
      busqueda: this.busqueda,
      orden: this.orden,
      categoria: this.categoriaSeleccionada,
      precio: this.precioSeleccionado,
      disponibilidad: this.disponibilidadSeleccionada
    };
    localStorage.setItem('electromania_filtros', JSON.stringify(data));
  }

  async cargarCategorias() {
    try {
      this.categorias = await this.productosService.getCategorias();
    } catch {
      this.categorias = [];
    }
  }

  buscarComponentes() {
    this.guardarFiltros();
    this.aplicarFiltros();
    this.cdr.markForCheck();
  }

  ordenarComponentes() {
    this.guardarFiltros();
    this.aplicarFiltros();
    this.cdr.markForCheck();
  }

  aplicarFiltrosAvanzados() {
    this.guardarFiltros();
    this.aplicarFiltros();
    this.filtrosAvanzadosAbierto = false;
    this.cdr.markForCheck();
  }

  restablecerFiltros() {
    this.categoriaSeleccionada = '';
    this.precioSeleccionado = '';
    this.disponibilidadSeleccionada = '';
    this.orden = 'relevancia';
    this.guardarFiltros();
    this.aplicarFiltros();
    this.cdr.markForCheck();
  }

  aplicarFiltros() {
    let resultado = [...this.productos];

    // Search filter
    if (this.busqueda.trim() !== '') {
      resultado = resultado.filter(p =>
        p.product_name.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        p.description.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    }

    // Category filter
    if (this.categoriaSeleccionada) {
      resultado = resultado.filter(p =>
        p.product_name.toLowerCase().includes(this.categoriaSeleccionada.toLowerCase()) ||
        p.description.toLowerCase().includes(this.categoriaSeleccionada.toLowerCase())
      );
    }

    // Price filter
    if (this.precioSeleccionado) {
      if (this.precioSeleccionado === '0-50') {
        resultado = resultado.filter(p => p.price < 50);
      } else if (this.precioSeleccionado === '50-100') {
        resultado = resultado.filter(p => p.price >= 50 && p.price <= 100);
      } else if (this.precioSeleccionado === '100+') {
        resultado = resultado.filter(p => p.price > 100);
      }
    }

    // Availability filter
    if (this.disponibilidadSeleccionada === 'in-stock') {
      resultado = resultado.filter(p => p.stock > 0);
    }

    // Sorting
    if (this.orden === 'precioAsc') {
      resultado.sort((a, b) => a.price - b.price);
    } else if (this.orden === 'precioDesc') {
      resultado.sort((a, b) => b.price - a.price);
    }

    this.productosFiltrados = resultado;
  }

  agregarAlCarrito(producto: ProductCard) {
    this.cartService.addItem({
      id: producto.product_id ?? 0,
      nombre: producto.product_name,
      descripcion: producto.description,
      precio: producto.price
    });
    this.toast.success(`${producto.product_name} agregado al carrito`);
  }
}
