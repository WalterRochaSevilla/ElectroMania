import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  private router = inject(Router);
  private toast = inject(ToastService);
  private cartService = inject(CartService);

  carrito: CartItem[] = [];
  totalItems = 0;
  subtotal = 0;
  impuestos = 0;
  total = 0;

  generarFactura = true;
  nombreFactura = '';
  nitFactura = '';
  emailFactura = '';

  procesando = false;
  mostrarModalExito = false;
  numeroFactura = '';

  constructor() {
    effect(() => {
      this.carrito = this.cartService.getItems();
      const totals = this.cartService.getTotals();
      this.totalItems = totals.totalItems;
      this.subtotal = totals.subtotal;
      this.impuestos = totals.impuestos;
      this.total = totals.total;
    });
  }

  ngOnInit() {
    this.cargarCarritoInicial();
  }

  cargarCarritoInicial() {
    // Mock data removed. CartService loads from Backend or LocalStorage.
  }

  irACatalogo() {
    this.router.navigate(['/home']);
  }

  irACarrito() {
    this.router.navigate(['/producto']);
  }

  irALogin() {
    this.router.navigate(['/login']);
  }

  volverATienda() {
    this.mostrarModalExito = false;
    this.cartService.clear();
    this.router.navigate(['/home']);
  }

  aumentarCantidad(index: number) {
    const item = this.carrito[index];
    if (item) {
      this.cartService.increaseQuantity(item.id);
    }
  }

  disminuirCantidad(index: number) {
    const item = this.carrito[index];
    if (item) {
      this.cartService.decreaseQuantity(item.id);
    }
  }

  eliminarProducto(index: number) {
    const item = this.carrito[index];
    if (item) {
      this.cartService.removeItem(item.id);
    }
  }

  async procesarPago() {
    if (this.procesando) return;

    if (this.cartService.isEmpty()) {
      this.toast.error('Tu carrito está vacío');
      return;
    }

    if (this.generarFactura && (!this.nombreFactura || !this.nitFactura || !this.emailFactura)) {
      this.toast.warning('Por favor completa los datos de facturación');
      return;
    }

    this.procesando = true;

    await this.simularProcesamiento();

    this.numeroFactura = `FAC-${Math.floor(10000 + Math.random() * 90000)}`;

    this.mostrarModalExito = true;
    this.procesando = false;
  }

  simularProcesamiento(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }
}
