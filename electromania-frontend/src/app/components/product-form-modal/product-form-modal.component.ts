import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../services/productos.service';

export interface ProductFormData {
    id?: number;
    nombre: string;
    descripcion: string;
    price: number;
    stock: number;
    categoria: string;
    imagen?: string;
}

@Component({
    selector: 'app-product-form-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    @if (isVisible) {
      <div class="modal-overlay" (click)="onHandleCancel()" (keyup.escape)="onHandleCancel()" tabindex="0" role="button" aria-label="Cerrar modal">
        <div class="modal-content" (click)="$event.stopPropagation()" (keyup)="null" role="dialog" aria-modal="true" tabindex="-1">
          
          <div class="modal-header">
            <h3>{{ product ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
            <button class="close-btn" (click)="onHandleCancel()">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <form (ngSubmit)="onSubmit()" #productForm="ngForm">
            <div class="modal-body">
              
              <div class="form-group">
                <label for="nombre">Nombre del Producto</label>
                <input type="text" id="nombre" name="nombre" [(ngModel)]="formData.nombre" required placeholder="Ej: Arduino Uno">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="price">Precio (Bs.)</label>
                  <input type="number" id="price" name="price" [(ngModel)]="formData.price" required min="0" placeholder="0.00">
                </div>

                <div class="form-group">
                  <label for="stock">Stock</label>
                  <input type="number" id="stock" name="stock" [(ngModel)]="formData.stock" required min="0" placeholder="0">
                </div>
              </div>

              <div class="form-group">
                <label for="categoria">Categoría</label>
                <select id="categoria" name="categoria" [(ngModel)]="selectedCategory" (ngModelChange)="onCategoryChange($event)">
                  @for (cat of categories; track cat) {
                    <option [value]="cat">{{ cat }}</option>
                  }
                  <option value="__custom__">+ Agregar nueva...</option>
                </select>
                @if (showCustomInput) {
                  <input 
                    type="text" 
                    id="custom-categoria" 
                    name="customCategoria" 
                    [(ngModel)]="formData.categoria" 
                    placeholder="Nombre de la nueva categoría"
                    class="custom-category-input"
                  >
                }
              </div>

              <div class="form-group">
                <label for="descripcion">Descripción</label>
                <textarea id="descripcion" name="descripcion" [(ngModel)]="formData.descripcion" rows="3" placeholder="Detalles del producto..."></textarea>
              </div>

              <div class="form-group">
                <label for="imagen">URL de Imagen (opcional)</label>
                <input type="url" id="imagen" name="imagen" [(ngModel)]="formData.imagen" placeholder="https://ejemplo.com/imagen.jpg">
              </div>

            </div>

            <div class="modal-footer">
              <button type="button" class="btn-cancel" (click)="onHandleCancel()">Cancelar</button>
              <button type="submit" class="btn-save" [disabled]="!productForm.form.valid">
                {{ product ? 'Guardar Cambios' : 'Crear Producto' }}
              </button>
            </div>
          </form>

        </div>
      </div>
    }
  `,
    styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease-out;
      outline: none;
    }

    .modal-content {
      background: var(--bg-card, #1e293b);
      border: 1px solid var(--border-color, #334155);
      border-radius: 1rem;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
      animation: scaleIn 0.2s ease-out;
      display: flex;
      flex-direction: column;
      max-height: 90vh;
    }

    :host-context([data-theme='light']) .modal-content {
      background: #ffffff;
      border-color: #e2e8f0;
    }

    .modal-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-color, #334155);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary, #f1f5f9);
      margin: 0;
    }

    :host-context([data-theme='light']) .modal-header h3 {
      color: #1e293b;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
    }
    .close-btn svg { width: 20px; height: 20px; }

    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary, #94a3b8);
    }

    :host-context([data-theme='light']) label {
      color: #64748b;
    }

    input, select, textarea {
      padding: 0.75rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-color, #334155);
      background: var(--bg-main, #0f172a);
      color: var(--text-primary, #f1f5f9);
      font-family: inherit;
      transition: border-color 0.2s;
    }

    :host-context([data-theme='light']) input,
    :host-context([data-theme='light']) select,
    :host-context([data-theme='light']) textarea {
      background: #f8fafc;
      border-color: #e2e8f0;
      color: #1e293b;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--brand-primary, #6366f1);
    }

    .modal-footer {
      padding: 1rem 1.5rem;
      background: transparent;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    button {
      padding: 0.6rem 1.2rem;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .btn-cancel {
      background: transparent;
      color: var(--text-secondary, #94a3b8);
      border: 1px solid var(--border-color, #334155);
    }
    .btn-cancel:hover {
      background: var(--bg-card, #1e293b);
      color: var(--text-primary, #f1f5f9);
    }

    :host-context([data-theme='light']) .btn-cancel {
      color: #64748b;
      border-color: #e2e8f0;
    }
    :host-context([data-theme='light']) .btn-cancel:hover {
      background: #e2e8f0;
      color: #1e293b;
    }

    .btn-save {
      background: var(--brand-primary, #6366f1);
      color: white;
    }
    .btn-save:hover {
      background: #4f46e5;
    }
    .btn-save:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Hide number input spinners */
    input[type="number"] {
      -moz-appearance: textfield;
      appearance: textfield;
    }

    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .custom-category-input {
      margin-top: 0.5rem;
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `]
})
export class ProductFormModalComponent implements OnChanges, OnInit {
    private productosService = inject(ProductosService);

    @Input() isVisible = false;
    @Input() product: ProductFormData | null = null;
    @Output() saveProduct = new EventEmitter<ProductFormData>();
    @Output() cancelModal = new EventEmitter<void>();

    formData: ProductFormData = this.getEmptyForm();
    categories: string[] = ['General'];
    selectedCategory = 'General';
    showCustomInput = false;

    async ngOnInit() {
        await this.loadCategories();
    }

    async loadCategories() {
        try {
            const cats = await this.productosService.getCategoriasAsStrings();
            this.categories = cats.length > 0 ? cats : ['General'];
        } catch {
            this.categories = ['General'];
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['product'] && this.product) {
            this.formData = { ...this.product };
            this.selectedCategory = this.categories.includes(this.formData.categoria) 
                ? this.formData.categoria 
                : '__custom__';
            this.showCustomInput = this.selectedCategory === '__custom__';
        } else if (changes['isVisible'] && this.isVisible && !this.product) {
            this.formData = this.getEmptyForm();
            this.selectedCategory = 'General';
            this.showCustomInput = false;
        }
    }

    onCategoryChange(value: string) {
        if (value === '__custom__') {
            this.showCustomInput = true;
            this.formData.categoria = '';
        } else {
            this.showCustomInput = false;
            this.formData.categoria = value;
        }
    }

    getEmptyForm(): ProductFormData {
        return {
            nombre: '',
            descripcion: '',
            price: 0,
            stock: 0,
            categoria: 'General',
            imagen: ''
        };
    }

    onSubmit() {
        this.saveProduct.emit(this.formData);
    }

    onHandleCancel() {
        this.cancelModal.emit();
    }
}
