import { Component, inject, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

const WHATSAPP_NUMBER = '59177418158';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductosComponent implements OnInit {
  private router = inject(Router);
  private toast = inject(ToastService);
  private authService = inject(AuthService);
  protected cartService = inject(CartService);

  readonly isAuthenticated = this.authService.isAuthenticated$;
  readonly currentUser = this.authService.currentUser;

  readonly carrito = this.cartService.items;
  readonly totals = this.cartService.totals;
  readonly isEmpty = this.cartService.isEmpty;

  nombreFactura = signal('');
  nitFactura = signal('');
  emailFactura = signal('');
  procesando = signal(false);
  mostrarModalExito = signal(false);
  numeroFactura = signal('');

  ngOnInit() {
    this.autoFillUserData();
  }

  private autoFillUserData() {
    const user = this.currentUser();
    if (user) {
      if (user.email) {
        this.emailFactura.set(user.email);
      }
      if (user.nombre) {
        this.nombreFactura.set(user.nombre);
      }
    }
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
    this.mostrarModalExito.set(false);
    this.cartService.clear();
    this.router.navigate(['/home']);
  }

  async aumentarCantidad(index: number) {
    const item = this.carrito().find(i => i.id === index);
    if (item) {
      await this.cartService.increaseQuantity(item.id);
    }
  }

  async disminuirCantidad(index: number) {
    const item = this.carrito().find(i => i.id === index);
    if (item) {
      await this.cartService.decreaseQuantity(item.id);
    }
  }

  eliminarProducto(product_id: number) {
    const item = this.carrito().find(i => i.id === product_id);
    if (item) {
      this.cartService.removeItem(item.id);
    }
  }

  async procesarPago() {
    if (this.procesando()) return;

    if (this.isEmpty()) {
      this.toast.error('Tu carrito esta vacio');
      return;
    }

    if (!this.nombreFactura() || !this.nitFactura()) {
      this.toast.warning('Por favor completa los datos de facturación (Nombre y NIT/CI son obligatorios)');
      return;
    }

    this.procesando.set(true);

    const whatsappMessage = this.generateWhatsAppMessage();
    const whatsappUrl = this.generateWhatsAppUrl(whatsappMessage);

    window.open(whatsappUrl, '_blank');

    this.numeroFactura.set(`PED-${Math.floor(10000 + Math.random() * 90000)}`);
    this.mostrarModalExito.set(true);
    this.procesando.set(false);
  }

  private generateWhatsAppMessage(): string {
    const items = this.carrito();
    const totales = this.totals();

    const productList = items.map(item => 
      `• ${item.nombre} x${item.cantidad} = Bs. ${(item.precio * item.cantidad).toFixed(2)}`
    ).join('\n');

    const message = `¡Hola Electromania! 👋

Quiero realizar el siguiente pedido:

${productList}

───────────────
*Subtotal:* Bs. ${totales.subtotal.toFixed(2)}
*Impuestos (13%):* Bs. ${totales.impuestos.toFixed(2)}
*TOTAL A PAGAR:* Bs. ${totales.total.toFixed(2)}
───────────────

*Datos de Facturación:*
📝 Nombre: ${this.nombreFactura()}
🆔 NIT/CI: ${this.nitFactura()}
${this.emailFactura() ? `📧 Email: ${this.emailFactura()}` : ''}

¡Gracias!`;

    return message;
  }

  private generateWhatsAppUrl(message: string): string {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  }
}
