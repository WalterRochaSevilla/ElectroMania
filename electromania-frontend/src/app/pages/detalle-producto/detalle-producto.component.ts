import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../services/toast.service';
import { ProductosService } from '../../services/productos.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models';

interface ProductDetail {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcionCorta: string;
  imagen: string;
  oferta?: boolean;
  descuento?: number;
  datasheet?: string;
  libreria?: string;
  especificaciones?: { label: string; valor: string }[];
}

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './detalle-producto.component.html',
  styleUrl: './detalle-producto.component.css'
})
export class DetalleProductoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  private productosService = inject(ProductosService);
  private cartService = inject(CartService);
  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  totalItems = 0;
  cantidadSeleccionada = 1;
  mensajeStock = '';
  idRecibido: string | null = null;
  loading = false;

  producto: ProductDetail | null = null;

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.idRecibido = idParam;
      await this.cargarDatosDelProducto(parseInt(idParam));
    }
  }

  async cargarDatosDelProducto(id: number) {
    this.loading = true;
    this.cdr.markForCheck();
    try {
      const apiProduct = await this.productosService.getProductById(id);
      if (!apiProduct) {
        this.toast.error(this.translate.instant('PRODUCTS.NOT_FOUND'));
        this.router.navigate(['/home']);
        return;
      }
      this.producto = this.mapToProductDetail(apiProduct);
      this.actualizarMensajeStock();
    } catch (error) {
      console.error('Error loading product:', error);
      this.toast.error(this.translate.instant('PRODUCTS.NOT_FOUND'));
      this.router.navigate(['/home']);
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  private mapToProductDetail(p: Product): ProductDetail {
    return {
      id: p.product_id ?? 0,
      nombre: p.product_name,
      categoria: 'General',
      precio: p.price,
      stock: p.stock,
      descripcionCorta: p.description,
      imagen: p.images?.length ? p.images[p.images.length - 1] : '/placeholder.png',
      datasheet: 'https://pdf-datasheet.com',
      libreria: 'https://github.com',
      especificaciones: [
        { label: 'Voltaje', valor: '3.3V - 5V' },
        { label: 'Uso', valor: 'Prototipado rápido' }
      ]
    };
  }

  actualizarMensajeStock() {
    if (!this.producto) return;
    if (this.producto.stock === 0) {
      this.mensajeStock = this.translate.instant('PRODUCT_DETAIL.STOCK_OUT');
    } else if (this.producto.stock < 10) {
      this.mensajeStock = this.translate.instant('PRODUCT_DETAIL.STOCK_LOW', { count: this.producto.stock });
    } else {
      this.mensajeStock = this.translate.instant('PRODUCT_DETAIL.STOCK_AVAILABLE');
    }
  }

  obtenerClaseStock() {
    if (!this.producto || this.producto.stock === 0) return 'stock-agotado';
    if (this.producto.stock < 10) return 'stock-bajo';
    return 'stock-disponible';
  }

  modificarCantidad(valor: number) {
    const nuevaCant = this.cantidadSeleccionada + valor;
    if (nuevaCant >= 1 && nuevaCant <= (this.producto?.stock || 1)) {
      this.cantidadSeleccionada = nuevaCant;
    }
  }

  async agregarAlCarrito() {
    if (!this.producto) return;

    await this.cartService.addItem({
      id: this.producto.id,
      nombre: this.producto.nombre,
      descripcion: this.producto.descripcionCorta,
      precio: this.producto.precio
    }, this.cantidadSeleccionada);

    this.toast.success(`${this.producto.nombre} agregado al carrito`);
  }
}
