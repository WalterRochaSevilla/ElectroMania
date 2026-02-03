import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AdminSidebarComponent } from '../../../components/admin-sidebar/admin-sidebar.component';
import { ProductosService } from '../../../services/productos.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { ModalService } from '../../../services/modal.service';
import { LanguageService } from '../../../services/language.service';
import { ProductFormModalComponent, ProductFormData } from '../../../components/product-form-modal/product-form-modal.component';
import { ProductDisplay } from '../../../models';
import { exportToCsv } from '../../../utils/export';
import { INVENTORY } from '../../../constants';

@Component({
  selector: 'app-productos-admin',
  standalone: true,
  imports: [FormsModule, AdminSidebarComponent, ProductFormModalComponent, TranslateModule],
  templateUrl: './productos-admin.component.html',
  styleUrl: './productos-admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductosAdminComponent implements OnInit {
  private router = inject(Router);
  private productosService = inject(ProductosService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private modalService = inject(ModalService);
  private languageService = inject(LanguageService);
  private cdr = inject(ChangeDetectorRef);

  paginaActual = 1;
  productosPorPagina = INVENTORY.ITEMS_PER_PAGE;

  isModalOpen = false;
  selectedProduct: ProductFormData | null = null;
  isEditing = false;

  productos: ProductDisplay[] = [];
  totalPaginas = 0;
  stockBajoCount = 0;
  paginatedProducts: ProductDisplay[] = [];

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
        activo: p.state === 'AVAILABLE',
        description: p.description,
        images: p.images || []
      }));
      this.updateDerivedState();
    } catch {
      this.toast.error(this.languageService.instant('ADMIN.ERROR_LOAD_PRODUCTS'));
    }
  }

  private updateDerivedState(): void {
    this.totalPaginas = Math.ceil(this.productos.length / this.productosPorPagina);
    this.stockBajoCount = this.productos.filter(p => p.stock <= INVENTORY.LOW_STOCK_THRESHOLD).length;
    this.updatePaginatedProducts();
    this.cdr.markForCheck();
  }

  private updatePaginatedProducts(): void {
    const start = (this.paginaActual - 1) * this.productosPorPagina;
    const end = start + this.productosPorPagina;
    this.paginatedProducts = this.productos.slice(start, end);
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
      categoria: producto.categoria,
      existingImages: producto.images || []
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
          stock: data.stock,
          image: data.imagen // Include image if a new one was selected
        });

        // If user selected a different existing image as primary, re-add it to make it "newest"
        if (data.selectedImageUrl && !data.imagen) {
          const existingImages = data.existingImages || [];
          const lastImage = existingImages[existingImages.length - 1];
          if (data.selectedImageUrl !== lastImage) {
            // Re-add the selected image URL - backend will delete old record first
            await this.productosService.addProductImage({
              name: data.nombre,
              image_url: data.selectedImageUrl
            });
          }
        }

        this.toast.success(this.languageService.instant('ADMIN.PRODUCT_UPDATED'));
        this.cargarProductos();
      } catch {
        this.toast.error(this.languageService.instant('ADMIN.ERROR_UPDATE_PRODUCT'));
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
        this.toast.success(this.languageService.instant('ADMIN.PRODUCT_CREATED'));
        this.cargarProductos();
      } catch {
        this.toast.error(this.languageService.instant('ADMIN.ERROR_CREATE_PRODUCT'));
      }
    }
  }

  async eliminarProducto(id: number | undefined) {
    if (!id) return;

    const confirmed = await this.modalService.confirm({
      title: this.languageService.instant('ADMIN.DELETE_PRODUCT_TITLE'),
      message: this.languageService.instant('ADMIN.CONFIRM_DELETE_PRODUCT'),
      confirmText: this.languageService.instant('COMMON.DELETE'),
      type: 'danger'
    });

    if (confirmed) {
      try {
        await this.productosService.deleteProduct(id);
        this.toast.success(this.languageService.instant('ADMIN.PRODUCT_DELETED'));
        this.cargarProductos();
      } catch {
        this.toast.error(this.languageService.instant('ADMIN.ERROR_DELETE_PRODUCT'));
      }
    }
  }

  async toggleActivo(producto: ProductDisplay) {
    const newState = !producto.activo;
    const newStateBackend = newState ? 'AVAILABLE' : 'UNAVAILABLE';

    try {
      await this.productosService.updateProduct(producto.id!, {
        state: newStateBackend
      });
      producto.activo = newState;
      this.cdr.markForCheck();
      this.toast.success(this.languageService.instant(newState ? 'ADMIN.PRODUCT_ACTIVATED' : 'ADMIN.PRODUCT_DEACTIVATED'));
    } catch {
      this.toast.error(this.languageService.instant('ADMIN.ERROR_CHANGE_STATE'));
    }
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
      { key: 'nombre', label: this.languageService.instant('ADMIN.PRODUCT') },
      { key: 'categoria', label: this.languageService.instant('PRODUCTS.CATEGORY') },
      { key: 'precio', label: this.languageService.instant('ADMIN.PRICE') + ' (Bs.)' },
      { key: 'stock', label: this.languageService.instant('ADMIN.STOCK') },
      { key: 'activo', label: this.languageService.instant('ADMIN.STATE') }
    ]);
    this.toast.success(this.languageService.instant('ADMIN.INVENTORY_EXPORTED'));
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.updatePaginatedProducts();
      this.cdr.markForCheck();
    }
  }
}
