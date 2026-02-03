import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductosService } from '../../services/productos.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { StorageService } from '../../services/storage.service';
import { LanguageService } from '../../services/language.service';
import { STORAGE_KEYS } from '../../constants';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductCard } from '../../models';

type SortOrder = 'relevancia' | 'precioAsc' | 'precioDesc' | 'nombre';

interface SavedFilters {
  busqueda?: string;
  orden?: SortOrder;
  categoria?: string;
  precio?: string;
  disponibilidad?: string;
}

const PRICE_FILTERS = {
  LOW_MAX: 50,
  MID_MAX: 100,
} as const;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, ProductCardComponent, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  readonly router = inject(Router);
  private productosService = inject(ProductosService);
  private cartService = inject(CartService);
  private toast = inject(ToastService);
  private storageService = inject(StorageService);
  private languageService = inject(LanguageService);
  private cdr = inject(ChangeDetectorRef);

  filtrosAvanzadosAbierto = false;
  busqueda = '';
  orden: SortOrder = 'relevancia';
  categoriaSeleccionada = '';
  precioSeleccionado = '';
  disponibilidadSeleccionada = '';
  loading = false;

  categorias: string[] = [];

  productos: ProductCard[] = [];
  productosFiltrados: ProductCard[] = [];

  get tieneFiltrosActivos(): boolean {
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
      this.toast.error(this.languageService.instant('ERRORS.LOAD_PRODUCTS'));
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  toggleFiltrosAvanzados() {
    this.filtrosAvanzadosAbierto = !this.filtrosAvanzadosAbierto;
  }

  cargarFiltrosGuardados() {
    const filtros = this.storageService.getItem(STORAGE_KEYS.FILTERS);
    if (filtros) {
      const data: SavedFilters = JSON.parse(filtros);
      this.busqueda = data.busqueda ?? '';
      this.orden = data.orden ?? 'relevancia';
      this.categoriaSeleccionada = data.categoria ?? '';
      this.precioSeleccionado = data.precio ?? '';
      this.disponibilidadSeleccionada = data.disponibilidad ?? '';
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
    this.storageService.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(data));
  }

  async cargarCategorias() {
    try {
      this.categorias = await this.productosService.getCategoriasAsStrings();
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

    // Price filter (using < for upper bounds to avoid boundary overlap)
    if (this.precioSeleccionado) {
      if (this.precioSeleccionado === '0-50') {
        resultado = resultado.filter(p => p.price < PRICE_FILTERS.LOW_MAX);
      } else if (this.precioSeleccionado === '50-100') {
        resultado = resultado.filter(p => p.price >= PRICE_FILTERS.LOW_MAX && p.price < PRICE_FILTERS.MID_MAX);
      } else if (this.precioSeleccionado === '100+') {
        resultado = resultado.filter(p => p.price >= PRICE_FILTERS.MID_MAX);
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

  async agregarAlCarrito(producto: ProductCard) {
    await this.cartService.addItem({
      id: producto.product_id ?? 0,
      nombre: producto.product_name,
      descripcion: producto.description,
      precio: producto.price
    });
    this.toast.success(`${producto.product_name} agregado al carrito`);
    this.cdr.markForCheck();
  }
}
