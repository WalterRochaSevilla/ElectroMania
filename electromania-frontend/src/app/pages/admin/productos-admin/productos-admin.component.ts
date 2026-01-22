import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSidebarComponent } from '../../../components/admin-sidebar/admin-sidebar.component';
import { ProductosService } from '../../../services/productos.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { ModalService } from '../../../services/modal.service';
import { ProductFormModalComponent, ProductFormData } from '../../../components/product-form-modal/product-form-modal.component';
import { ProductDisplay } from '../../../models';
import { exportToCsv } from '../../../utils/export';

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

  paginaActual = 1;
  productosPorPagina = 10;

  isModalOpen = false;
  selectedProduct: ProductFormData | null = null;
  isEditing = false;

  productos: ProductDisplay[] = [];

  async ngOnInit() {
    await this.cargarProductos();
  }

  async cargarProductos() {
    try {
      const data = await this.productosService.getAllProducts();
      this.productos = data.map(p => ({
        id: p.product_id,
        nombre: p.product_name,
        categoria: 'General',
        precio: p.price,
        stock: p.stock,
        activo: p.state === 'AVAILABLE'
      }));
    } catch {
      this.toast.error('Error al cargar productos');
    }
  }

  get totalPaginas(): number {
    return Math.ceil(this.productos.length / this.productosPorPagina);
  }

  get stockBajoCount(): number {
    return this.productos.filter(p => p.stock <= 5).length;
  }

  ingresar() {
    this.router.navigate(['/login']);
  }

  Dashboard() {
    this.router.navigate(['/dashboard']);
  }

  Usuarios() {
    this.router.navigate(['/usuarios-admin']);
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

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
      try {
        await this.productosService.updateProduct(data.id, {
          product_name: data.nombre,
          description: data.descripcion,
          price: data.price,
          stock: data.stock
        });
        this.toast.success('Producto actualizado exitosamente');
        this.cargarProductos();
      } catch {
        this.toast.error('Error al actualizar el producto');
      }

    } else {
      try {
        await this.productosService.createProduct({
          product_name: data.nombre,
          description: data.descripcion,
          price: data.price,
          stock: data.stock,
          image: data.imagen
        });
        this.toast.success('Producto creado exitosamente');
        this.cargarProductos();
      } catch {
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
        this.toast.success('Producto eliminado');
        this.cargarProductos();
      } catch {
        this.toast.error('No se pudo eliminar el producto');
      }
    }
  }

  async toggleActivo(producto: ProductDisplay) {
    const newState = !producto.activo;
    producto.activo = newState;
  }

  calcularValorTotal(): string {
    const total = this.productos.reduce((sum, producto) => {
      return sum + (producto.precio * producto.stock);
    }, 0);
    return total.toFixed(2);
  }

  exportarInventario() {
    exportToCsv(this.productos, 'inventario-electromania', [
      { key: 'id', label: 'ID' },
      { key: 'nombre', label: 'Producto' },
      { key: 'categoria', label: 'Categoría' },
      { key: 'precio', label: 'Precio (Bs.)' },
      { key: 'stock', label: 'Stock' },
      { key: 'activo', label: 'Estado' }
    ]);
    this.toast.success('Inventario exportado');
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }
}
