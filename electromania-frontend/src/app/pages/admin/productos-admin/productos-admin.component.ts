import { Component, OnInit, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSidebarComponent } from '../../../components/admin-sidebar/admin-sidebar.component';
import { ProductosService } from '../../../services/productos.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { ModalService } from '../../../services/modal.service';
import { ProductFormModalComponent, ProductFormData } from '../../../components/product-form-modal/product-form-modal.component';

interface ProductDisplay {
  id: number | undefined;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  activo: boolean;
  description?: string;
}

@Component({
  selector: 'app-productos-admin',
  standalone: true,
  imports: [FormsModule, AdminSidebarComponent, ProductFormModalComponent],
  templateUrl: './productos-admin.component.html',
  styleUrl: './productos-admin.component.css'
})
export class ProductosAdminComponent implements OnInit {
  private router = inject(Router);
  private productosService = inject(ProductosService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private modalService = inject(ModalService);

  /* =========================
     ESTADOS GENERALES
  ========================= */
  modoOscuro = true;
  paginaActual = 1;
  productosPorPagina = 10;

  // Estado del Modal
  isModalOpen = false;
  selectedProduct: ProductFormData | null = null;
  isEditing = false; // To track if we are creating or editing

  /* =========================
     PRODUCTOS
  ========================= */
  productos: ProductDisplay[] = [];

  async ngOnInit() {
    await this.cargarProductos();
  }

  async cargarProductos() {
    try {
      const data = await this.productosService.getAllProducts();
      // Map backend fields to frontend display fields if necessary
      this.productos = data.map(p => ({
        id: p.product_id,
        nombre: p.product_name,
        categoria: 'General',
        precio: p.price,
        stock: p.stock,
        activo: p.state
      }));
    } catch (error) {
      console.error('Error cargando productos:', error);
      this.toast.error('Error al cargar productos');
    }
  }

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
    this.router.navigate(['/dashboard']);
  }
  Usuarios() {
    this.router.navigate(['/usuarios-admin']);
  }

  cambiarModo() {
    this.modoOscuro = !this.modoOscuro;
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /* =========================
     ACCIONES DE PRODUCTOS
  ========================= */
  openCreateModal() {
    this.selectedProduct = null;
    this.isEditing = false;
    this.isModalOpen = true;
  }

  openEditModal(producto: ProductDisplay) {
    this.selectedProduct = {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.description || '',
      price: producto.precio,
      stock: producto.stock,
      categoria: producto.categoria
    };
    this.isEditing = true;
    this.isModalOpen = true;
  }

  handleModalCancel() {
    this.isModalOpen = false;
    this.selectedProduct = null;
  }

  async handleModalSave(data: ProductFormData) {
    this.isModalOpen = false;

    if (this.isEditing && data.id) {
      // Update
      const updateData = {
        product_name: data.nombre,
        description: data.descripcion,
        price: data.price,
        stock: data.stock
        // category: data.categoria // If backend supports it
      };

      try {
        await this.productosService.updateProduct(data.id, updateData);
        this.toast.success('Producto actualizado exitosamente');
        this.cargarProductos();
      } catch (error) {
        console.error(error);
        this.toast.error('Error al actualizar el producto');
      }

    } else {
      // Create
      const nuevoProducto = {
        product_name: data.nombre,
        description: data.descripcion,
        price: data.price,
        stock: data.stock
      };

      try {
        await this.productosService.createProduct(nuevoProducto);
        this.toast.success('Producto creado exitosamente');
        this.cargarProductos();
      } catch (error) {
        console.error(error);
        this.toast.error('Error al crear el producto');
      }
    }
  }

  async eliminarProducto(id: number | undefined) {
    if (!id) return;

    const confirmed = await this.modalService.confirm({
      title: 'Eliminar Producto',
      message: '¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      type: 'danger'
    });

    if (confirmed) {
      try {
        await this.productosService.deleteProduct(id);
        console.log('Producto eliminado:', id);
        this.toast.success('Producto eliminado');
        this.cargarProductos();
      } catch (error) {
        console.error('Error eliminando:', error);
        this.toast.error('No se pudo eliminar el producto');
      }
    }
  }

  async toggleActivo(producto: ProductDisplay) {
    try {
      const newState = !producto.activo;
      // Optimistic update
      producto.activo = newState;

      // TODO: Call API when endpoint confirmed
      // await this.productosService.updateProduct(producto.id!, { state: newState });

      console.log(`Producto ${producto.id} estado local cambiado a ${newState}`);

    } catch (error) {
      producto.activo = !producto.activo; // Revert
      console.error('Error actualizando estado:', error);
    }
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