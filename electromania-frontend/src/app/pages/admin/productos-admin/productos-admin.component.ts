import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminSidebarComponent } from '../../../components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-productos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminSidebarComponent],
  templateUrl: './productos-admin.component.html',
  styleUrl: './productos-admin.component.css'
})
export class ProductosAdminComponent {
  /* =========================
     ESTADOS GENERALES
  ========================= */
  modoOscuro = true;
  paginaActual = 1;
  productosPorPagina = 10;

  /* =========================
     PRODUCTOS DE EJEMPLO
  ========================= */
  productos = [
    {
      id: '#001',
      nombre: 'Arduino Uno R3',
      categoria: 'Microcontroladores',
      precio: 65.00,
      stock: 42,
      activo: true
    },
    {
      id: '#005',
      nombre: 'Sensor Ultrasónico HC-SR04',
      categoria: 'Sensores',
      precio: 12.00,
      stock: 2,
      activo: true
    }
  ];

  /* =========================
     INYECCIÓN DE DEPENDENCIAS
  ========================= */
  constructor(private router: Router) { }

  /* =========================
     CALCULADOS
  ========================= */
  get totalPaginas(): number {
    return Math.ceil(this.productos.length / this.productosPorPagina);
  }

  get stockBajoCount(): number {
    return this.productos.filter(p => p.stock <= 5).length;
  }

  /* =========================
     HEADER
  ========================= */
  ingresar() {
    this.router.navigate(['/login']);
  }
  Dashboard() {
    this.router.navigate(['/admin/dashboard']);
  }
  Usuarios() {
    this.router.navigate(['/admin/usuarios']);
  }

  cambiarModo() {
    this.modoOscuro = !this.modoOscuro;
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }

  /* =========================
     ACCIONES DE PRODUCTOS
  ========================= */
  agregarProducto() {
    console.log('Agregar nuevo producto');
    // Aquí iría la lógica para abrir modal/formulario
  }

  editarProducto(producto: any) {
    console.log('Editar producto:', producto);
    // Aquí iría la lógica para editar
  }

  eliminarProducto(id: string) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productos = this.productos.filter(p => p.id !== id);
      console.log('Producto eliminado:', id);
    }
  }

  toggleActivo(producto: any) {
    producto.activo = !producto.activo;
    console.log(`Producto ${producto.id} ${producto.activo ? 'activado' : 'desactivado'}`);
  }

  /* =========================
     FUNCIONES DE NEGOCIO
  ========================= */
  calcularValorTotal(): string {
    const total = this.productos.reduce((sum, producto) => {
      return sum + (producto.precio * producto.stock);
    }, 0);
    return total.toFixed(2);
  }

  exportarInventario() {
    console.log('Exportando inventario...');
    // Aquí iría la lógica para exportar a CSV/Excel
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }
}