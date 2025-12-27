import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Interfaz para los items del carrito
interface CarritoItem {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  categoria?: string;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  /* =========================
     ESTADOS GENERALES
  ========================= */
  modoOscuro: boolean = true;
  
  /* =========================
     CARRITO DE COMPRAS
  ========================= */
  carrito: CarritoItem[] = [];
  totalItems: number = 0;
  subtotal: number = 0;
  impuestos: number = 0;
  total: number = 0;
  
  /* =========================
     FACTURACIÓN
  ========================= */
  generarFactura: boolean = true;
  nombreFactura: string = 'Juan Pérez';
  nitFactura: string = '123-662';
  emailFactura: string = 'juan@gmail.com';
  
  /* =========================
     PROCESAMIENTO
  ========================= */
  procesando: boolean = false;
  mostrarModalExito: boolean = false;
  numeroFactura: string = 'FAC-00123';
  
  /* =========================
     INYECCIÓN DE DEPENDENCIAS
  ========================= */
  constructor(private router: Router) {}
  
  /* =========================
     CICLO DE VIDA
  ========================= */
  ngOnInit() {
    this.cargarCarrito();
    this.calcularTotales();
  }
  
  /* =========================
     NAVEGACIÓN
  ========================= */
  cambiarModo() {
    this.modoOscuro = !this.modoOscuro;
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
    this.limpiarCarrito();
    this.router.navigate(['/home']);
  }
  
  /* =========================
     MANEJO DEL CARRITO
  ========================= */
  cargarCarrito() {
    // En producción, esto vendría de un servicio o localStorage
    // Por ahora, datos de ejemplo
    this.carrito = [
      {
        id: 1,
        nombre: 'ESP32 WiFi + Bluetooth',
        descripcion: 'Microcontrolador ideal para proyectos IoT',
        precio: 55.00,
        cantidad: 2,
        categoria: 'Arduino & Microcontroladores'
      }
      // Agrega más productos según lo que agreguen desde el home
    ];
    
    this.actualizarTotalItems();
  }
  
  actualizarTotalItems() {
    this.totalItems = this.carrito.reduce((total, item) => total + item.cantidad, 0);
  }
  
  calcularTotales() {
    this.subtotal = this.carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    this.impuestos = this.subtotal * 0.13; // 13% de impuestos
    this.total = this.subtotal + this.impuestos;
  }
  
  /* =========================
     MANIPULACIÓN DE CANTIDADES
  ========================= */
  aumentarCantidad(index: number) {
    this.carrito[index].cantidad++;
    this.actualizarTotalItems();
    this.calcularTotales();
    this.guardarCarrito();
  }
  
  disminuirCantidad(index: number) {
    if (this.carrito[index].cantidad > 1) {
      this.carrito[index].cantidad--;
      this.actualizarTotalItems();
      this.calcularTotales();
      this.guardarCarrito();
    } else {
      this.eliminarProducto(index);
    }
  }
  
  eliminarProducto(index: number) {
    this.carrito.splice(index, 1);
    this.actualizarTotalItems();
    this.calcularTotales();
    this.guardarCarrito();
  }
  
  /* =========================
     PERSISTENCIA
  ========================= */
  guardarCarrito() {
    // En producción, guardarías en localStorage o backend
    localStorage.setItem('carrito_electromania', JSON.stringify(this.carrito));
  }
  
  limpiarCarrito() {
    this.carrito = [];
    this.totalItems = 0;
    localStorage.removeItem('carrito_electromania');
    this.calcularTotales();
  }
  
  /* =========================
     PROCESAMIENTO DE PAGO
  ========================= */
  async procesarPago() {
    if (this.procesando) return;
    
    // Validaciones
    if (this.carrito.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    
    if (this.generarFactura && (!this.nombreFactura || !this.nitFactura || !this.emailFactura)) {
      alert('Por favor completa los datos de facturación');
      return;
    }
    
    this.procesando = true;
    
    // Simulación de procesamiento
    await this.simularProcesamiento();
    
    // Generar número de factura aleatorio
    this.numeroFactura = `FAC-${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Mostrar modal de éxito
    this.mostrarModalExito = true;
    this.procesando = false;
    
    // En producción, aquí enviarías los datos al backend
    console.log('Datos de compra enviados:', {
      carrito: this.carrito,
      total: this.total,
      facturacion: {
        generarFactura: this.generarFactura,
        nombre: this.nombreFactura,
        nit: this.nitFactura,
        email: this.emailFactura
      }
    });
  }
  
  simularProcesamiento(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000); // 2 segundos de simulación
    });
  }
  
  /* =========================
     MÉTODOS AUXILIARES
  ========================= */
  // Para conectar con el HomeComponent
  // Necesitarías un servicio compartido o input/output
}