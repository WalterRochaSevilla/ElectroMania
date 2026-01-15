import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-producto.component.html',
  styleUrl: './detalle-producto.component.css'
})
export class DetalleProductoComponent implements OnInit {
  modoOscuro: boolean = true;
  totalItems: number = 0;
  cantidadSeleccionada: number = 1;
  mensajeStock: string = '';
  idRecibido: string | null = null;

  // Objeto inicializado para evitar errores de "undefined" en el HTML
  producto: any = null;

  // Lista local para simular la base de datos (Debe coincidir con la del Home)
  private listaProductos = [
    { id: 1, nombre: 'ESP32 WiFi + Bluetooth', categoria: 'Arduino & Microcontroladores', precio: 55, stock: 15, descripcionCorta: 'Microcontrolador potente para IoT.', imagen: 'https://picsum.photos/seed/ESP32/400/400' },
    { id: 2, nombre: 'Módulo Bluetooth HC-05', categoria: 'Arduino & Microcontroladores', precio: 45, stock: 8, descripcionCorta: 'Conectividad inalámbrica simple.', imagen: 'https://picsum.photos/seed/HC05/400/400' },
    { id: 3, nombre: 'Sensor Ultrasonido HC-SR04', categoria: 'Sensores', precio: 15, stock: 20, descripcionCorta: 'Mide distancia por ultrasonido.', imagen: 'https://picsum.photos/seed/SR04/400/400' },
    { id: 4, nombre: 'Kit de Resistencias (100u)', categoria: 'Componentes Pasivos', precio: 20, stock: 50, descripcionCorta: 'Valores variados para prototipado.', imagen: 'https://picsum.photos/seed/Resistencias/400/400' },
    { id: 5, nombre: 'Pantalla OLED 0.96"', categoria: 'Arduino & Microcontroladores', precio: 35, stock: 0, descripcionCorta: 'Display monocromo I2C.', imagen: 'https://picsum.photos/seed/OLED/400/400' },
    { id: 6, nombre: 'Sensor de Humedad DHT11', categoria: 'Sensores', precio: 12, stock: 12, descripcionCorta: 'Mide temperatura y humedad.', imagen: 'https://picsum.photos/seed/DHT11/400/400' }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

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
  agregarAlCarrito() { alert('Agregado al carrito'); }
}