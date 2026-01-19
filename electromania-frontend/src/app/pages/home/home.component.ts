import { Component, OnInit, inject } from '@angular/core';
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
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  router = inject(Router);
  private productosService = inject(ProductosService);
  private cartService = inject(CartService);
  private toast = inject(ToastService);

  filtrosAvanzadosAbierto = false;
  busqueda = '';
  orden = 'relevancia';
  loading = false;

  categorias: string[] = [];
  categoriasSeleccionadas = new Set<string>();

  productos: ProductCard[] = [];
  productosFiltrados: ProductCard[] = [];

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

  async cargarCategorias() {
    try {
      this.categorias = await this.productosService.getCategorias();
    } catch {
      this.categorias = [];
    }
  }

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

    if (this.busqueda.trim() !== '') {
      resultado = resultado.filter(p =>
        p.product_name.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    }

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
