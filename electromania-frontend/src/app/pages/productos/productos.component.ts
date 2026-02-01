import { Component, inject, ChangeDetectionStrategy, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastService } from '../../services/toast.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { LanguageService } from '../../services/language.service';
import { ProductosService } from '../../services/productos.service';
import { CONTACT, ROUTES } from '../../constants';
import { Product } from '../../models';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductosComponent implements OnInit {
  private router = inject(Router);
  private toast = inject(ToastService);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private languageService = inject(LanguageService);
  private productosService = inject(ProductosService);
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
  
  // Store product stock info
  private productStocks = signal<Map<number, number>>(new Map());

  async ngOnInit() {
    this.autoFillUserData();
    await this.loadProductStocks();
  }
  
  private async loadProductStocks() {
    try {
      const products = await this.productosService.getAllProducts();
      const stockMap = new Map<number, number>();
      products.forEach(p => {
        if (p.product_id !== undefined) {
          stockMap.set(p.product_id, p.stock);
        }
      });
      this.productStocks.set(stockMap);
    } catch {
      console.error('Failed to load product stocks');
    }
  }
  
  getMaxStock(productId: number): number {
    return this.productStocks().get(productId) ?? 999;
  }
  
  isAtMaxStock(productId: number, currentQuantity: number): boolean {
    const maxStock = this.getMaxStock(productId);
    return currentQuantity >= maxStock;
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
    this.router.navigate(['/', ROUTES.HOME]);
  }

  irACarrito() {
    this.router.navigate(['/', ROUTES.PRODUCTO]);
  }

  irALogin() {
    this.router.navigate(['/', ROUTES.LOGIN]);
  }

  volverATienda() {
    this.mostrarModalExito.set(false);
    this.cartService.clear();
    this.router.navigate(['/', ROUTES.HOME]);
  }

  async aumentarCantidad(productId: number) {
    const item = this.carrito().find(i => i.id === productId);
    if (item) {
      const maxStock = this.getMaxStock(productId);
      if (item.cantidad >= maxStock) {
        return; // Already at max
      }
      await this.cartService.increaseQuantity(item.id, maxStock);
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
      this.toast.error(this.languageService.instant('CHECKOUT.EMPTY_CART'));
      return;
    }

    if (!this.nombreFactura() || !this.nitFactura()) {
      this.toast.warning(this.languageService.instant('CHECKOUT.REQUIRED_FIELDS'));
      return;
    }

    this.procesando.set(true);

    try {
      // Create order in backend if authenticated
      if (this.isAuthenticated()) {
        const order = await this.orderService.createOrderFromCart();
        this.numeroFactura.set(`PED-${order.order_id}`);
      } else {
        // For guests, generate a random reference number
        this.numeroFactura.set(`PED-${Math.floor(10000 + Math.random() * 90000)}`);
      }

      const whatsappMessage = this.generateWhatsAppMessage();
      const whatsappUrl = this.generateWhatsAppUrl(whatsappMessage);

      window.open(whatsappUrl, '_blank');

      this.mostrarModalExito.set(true);
    } catch (error) {
      console.error('Error creating order:', error);
      this.toast.error(this.languageService.instant('CHECKOUT.ORDER_ERROR'));
    } finally {
      this.procesando.set(false);
    }
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
    return `https://wa.me/${CONTACT.WHATSAPP_NUMBER}?text=${encodedMessage}`;
  }
}
