import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-producto.component.html',
  styleUrl: './detalle-producto.component.css'
})
export class DetalleProductoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  modoOscuro = true;
  totalItems = 0;
  cantidadSeleccionada = 1;
  mensajeStock = '';
  idRecibido: string | null = null;

  // Objeto inicializado para evitar errores de "undefined" en el HTML
  producto: ProductDetail | null = null;

  // Lista local para simular la base de datos (Debe coincidir con la del Home)
  private listaProductos: ProductDetail[] = [
    { id: 1, nombre: 'Arduino UNO R4 WiFi', categoria: 'Microcontroladores', precio: 210, stock: 25, descripcionCorta: 'Microcontrolador con WiFi integrado.', imagen: '/arduino-uno.png' },
    { id: 2, nombre: 'Servomotor MG996R', categoria: 'Motores', precio: 45, stock: 50, descripcionCorta: 'Servomotor de alta torque.', imagen: '/servomotor.png' },
    { id: 3, nombre: 'Sensor LiDAR TF-Luna', categoria: 'Sensores', precio: 320, stock: 15, descripcionCorta: 'Sensor de distancia láser.', imagen: '/lidar-sensor.png' },
    { id: 4, nombre: 'Raspberry Pi 5 8GB', categoria: 'SBC', precio: 850, stock: 10, descripcionCorta: 'Potente ordenador de placa única.', imagen: '/raspberry-pi.png' },
    { id: 5, nombre: 'ESP32 Development Board', categoria: 'IoT', precio: 120, stock: 40, descripcionCorta: 'Ideal para proyectos IoT.', imagen: '/esp32.png' },
    { id: 6, nombre: 'STM32 Blue Pill', categoria: 'Microcontroladores', precio: 75, stock: 35, descripcionCorta: 'ARM Cortex-M3 a bajo costo.', imagen: '/stm32.png' },

    // Ofertas (IDs 7-12)
    { id: 7, nombre: 'Driver Stepper TB6600', categoria: 'Drivers', precio: 55, stock: 30, descripcionCorta: 'Controlador de motor paso a paso.', imagen: '/stepper-driver.png', oferta: true, descuento: 15 },
    { id: 8, nombre: 'Motor Nema 23', categoria: 'Motores', precio: 145, stock: 20, descripcionCorta: 'Motor paso a paso Nema 23.', imagen: '/nema-motor.png', oferta: true, descuento: 20 },
    { id: 9, nombre: 'Módulo Relé 4 Canales', categoria: 'Módulos', precio: 25, stock: 60, descripcionCorta: 'Control de cargas AC/DC.', imagen: '/rele-module.png', oferta: true, descuento: 10 },
    { id: 10, nombre: 'Kit de Cables Dupont', categoria: 'Accesorios', precio: 15, stock: 100, descripcionCorta: 'Cables para prototipado.', imagen: '/dupont-cables.png', oferta: true, descuento: 25 },
    { id: 11, nombre: 'Fuente 12V 10A', categoria: 'Fuentes', precio: 65, stock: 25, descripcionCorta: 'Fuente conmutada 12V.', imagen: '/power-supply.png', oferta: true, descuento: 18 },
    { id: 12, nombre: 'Display OLED 0.96"', categoria: 'Displays', precio: 35, stock: 45, descripcionCorta: 'Pantalla I2C SSD1306.', imagen: '/oled-display.png', oferta: true, descuento: 12 }
  ];

  ngOnInit() {
    // Obtenemos el ID de la URL y lo convertimos a número
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.idRecibido = idParam;
      this.cargarDatosDelProducto(parseInt(idParam));
    }
  }

  cargarDatosDelProducto(id: number) {
    // Buscamos el producto real en nuestra lista
    const productoEncontrado = this.listaProductos.find(p => p.id === id);

    if (productoEncontrado) {
      this.producto = {
        ...productoEncontrado,
        datasheet: 'https://pdf-datasheet.com',
        libreria: 'https://github.com',
        especificaciones: [
          { label: 'Voltaje', valor: '3.3V - 5V' },
          { label: 'Uso', valor: 'Prototipado rápido' }
        ]
      };
      this.actualizarMensajeStock();
    } else {
      // Si no existe, volvemos al home para evitar pantalla vacía
      this.router.navigate(['/home']);
    }
  }

  actualizarMensajeStock() {
    if (!this.producto) return;
    if (this.producto.stock === 0) {
      this.mensajeStock = 'Agotado temporalmente';
    } else if (this.producto.stock < 10) {
      this.mensajeStock = `¡Solo quedan ${this.producto.stock} unidades!`;
    } else {
      this.mensajeStock = 'Disponible para envío inmediato';
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

  cambiarModo() { this.modoOscuro = !this.modoOscuro; }
  irAHome() { this.router.navigate(['/home']); }
  irACarrito() { this.router.navigate(['/producto']); }
  irALogin() { this.router.navigate(['/login']); }
  agregarAlCarrito() {
    this.toast.success('Agregado al carrito');
  }
}