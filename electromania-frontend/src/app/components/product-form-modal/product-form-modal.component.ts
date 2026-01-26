import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit, OnDestroy, inject } from '@angular/core';
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
  imagen?: File;
  imagenUrl?: string;
  existingImages?: string[];
  selectedImageUrl?: string;  // The selected primary image URL
}

@Component({
  selector: 'app-product-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isVisible) {
      <div class="pfm-overlay" (click)="onHandleCancel()" (keyup.escape)="onHandleCancel()" tabindex="0" role="button" aria-label="Cerrar modal">
        <div class="pfm-content" (click)="$event.stopPropagation()" (keyup)="null" role="dialog" aria-modal="true" tabindex="-1">
          
          <div class="pfm-header">
            <h3>{{ product ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
            <button type="button" class="pfm-close-btn" (click)="onHandleCancel()">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <form (ngSubmit)="onSubmit()" #productForm="ngForm">
            <div class="pfm-body">
              
              <div class="pfm-form-group">
                <label for="pfm-nombre">Nombre del Producto</label>
                <input type="text" id="pfm-nombre" name="nombre" [(ngModel)]="formData.nombre" required placeholder="Ej: Arduino Uno">
              </div>

              <div class="pfm-form-row">
                <div class="pfm-form-group">
                  <label for="pfm-price">Precio (Bs.)</label>
                  <input type="number" id="pfm-price" name="price" [(ngModel)]="formData.price" required min="0" placeholder="0.00">
                </div>

                <div class="pfm-form-group">
                  <label for="pfm-stock">Stock</label>
                  <input type="number" id="pfm-stock" name="stock" [(ngModel)]="formData.stock" required min="0" placeholder="0">
                </div>
              </div>

              <div class="pfm-form-group">
                <label for="pfm-categoria">Categoría</label>
                <select id="pfm-categoria" name="categoria" [(ngModel)]="selectedCategory" (ngModelChange)="onCategoryChange($event)">
                  @for (cat of categories; track cat) {
                    <option [value]="cat">{{ cat }}</option>
                  }
                  <option value="__custom__">+ Agregar nueva...</option>
                </select>
                @if (showCustomInput) {
                  <input 
                    type="text" 
                    id="pfm-custom-categoria" 
                    name="customCategoria" 
                    [(ngModel)]="formData.categoria" 
                    placeholder="Nombre de la nueva categoría"
                    class="pfm-custom-category-input"
                  >
                }
              </div>

              <div class="pfm-form-group">
                <label for="pfm-descripcion">Descripción</label>
                <textarea id="pfm-descripcion" name="descripcion" [(ngModel)]="formData.descripcion" rows="3" placeholder="Detalles del producto..."></textarea>
              </div>

              <!-- Image Upload Section -->
              <div class="pfm-form-group">
                <span id="pfm-imagen-label" class="pfm-section-label">Imagen del Producto</span>
                
              <!-- Show existing images when editing -->
                @if (hasExistingImages()) {
                  <div class="pfm-existing-images-section">
                    <p class="pfm-existing-label">Imágenes actuales (clic para seleccionar):</p>
                    <div class="pfm-existing-images-grid">
                      @for (img of formData.existingImages; track img; let i = $index) {
                        <button 
                          type="button" 
                          class="pfm-existing-image-btn" 
                          [class.selected]="selectedExistingImage === img"
                          (click)="selectExistingImage(img)"
                        >
                          <img [src]="img" alt="Imagen existente" class="pfm-existing-image-thumb">
                          @if (selectedExistingImage === img) {
                            <span class="pfm-check-mark">✓</span>
                          }
                        </button>
                      }
                    </div>
                  </div>
                }
                
                <!-- Drag & Drop Zone -->
                <div 
                  class="pfm-dropzone"
                  [class.dragover]="isDragOver"
                  [class.has-file]="formData.imagen || imagePreview"
                  (dragover)="onDragOver($event)"
                  (dragleave)="onDragLeave($event)"
                  (drop)="onDrop($event)"
                  (click)="fileInput.click()"
                  (keyup.enter)="fileInput.click()"
                  tabindex="0"
                  role="button"
                  aria-labelledby="pfm-imagen-label"
                >
                  @if (imagePreview) {
                    <div class="pfm-preview-container">
                      <img [src]="imagePreview" alt="Vista previa" class="pfm-image-preview">
                      <button type="button" class="pfm-remove-image" (click)="removeImage($event)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                  } @else {
                    <div class="pfm-dropzone-content">
                      <svg class="pfm-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      <p class="pfm-dropzone-text">{{ hasExistingImages() ? 'Arrastra una nueva imagen para reemplazar' : 'Arrastra una imagen aquí o haz clic para seleccionar' }}</p>
                      <p class="pfm-dropzone-hint">PNG, JPG, WebP (máx. 10MB)</p>
                    </div>
                  }
                </div>
                
                <input 
                  type="file" 
                  #fileInput
                  accept="image/png,image/jpeg,image/webp"
                  (change)="onFileSelected($event)"
                  hidden
                >

                <!-- URL Input Alternative -->
                <div class="pfm-url-input-section">
                  <span class="pfm-divider-text">o ingresa una URL</span>
                  <input 
                    type="url" 
                    id="pfm-imagenUrl" 
                    name="imagenUrl" 
                    [(ngModel)]="formData.imagenUrl" 
                    placeholder="https://ejemplo.com/imagen.jpg"
                    [disabled]="!!formData.imagen"
                  >
                </div>
              </div>
            </div>

            <div class="pfm-footer">
              <button type="button" class="pfm-btn-cancel" (click)="onHandleCancel()">Cancelar</button>
              <button type="submit" class="pfm-btn-save" [disabled]="!productForm.form.valid">
                {{ product ? 'Guardar Cambios' : 'Crear Producto' }}
              </button>
            </div>
          </form>

        </div>
      </div>
    }
  `,
  styles: [`
    .pfm-overlay {
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
      animation: pfmFadeIn 0.2s ease-out;
      outline: none;
    }

    .pfm-content {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 1rem;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
      animation: pfmScaleIn 0.2s ease-out;
      display: flex;
      flex-direction: column;
      max-height: 90vh;
      overflow: hidden;
    }

    .pfm-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      background: var(--bg-card);
    }

    .pfm-header h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .pfm-close-btn {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      padding: 0.25rem;
    }
    .pfm-close-btn svg { width: 20px; height: 20px; }

    /* Form must be flex to enable proper body scrolling */
    .pfm-content form {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
      min-height: 0;
    }

    .pfm-body {
      padding: 1.5rem;
      overflow-y: auto;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      flex: 1;
      min-height: 0;
    }

    .pfm-form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .pfm-form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .pfm-form-group label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .pfm-section-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: block;
    }

    .pfm-form-group input,
    .pfm-form-group select,
    .pfm-form-group textarea {
      padding: 0.75rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-color);
      background: var(--bg-main);
      color: var(--text-primary);
      font-family: inherit;
      font-size: 1rem;
      transition: border-color 0.2s;
      width: 100%;
      box-sizing: border-box;
    }

    .pfm-form-group input:focus,
    .pfm-form-group select:focus,
    .pfm-form-group textarea:focus {
      outline: none;
      border-color: var(--brand-primary);
    }

    .pfm-form-group input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pfm-custom-category-input {
      margin-top: 0.5rem;
    }

    /* Existing Images Section */
    .pfm-existing-images-section {
      margin-bottom: 0.75rem;
    }

    .pfm-existing-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin: 0 0 0.5rem 0;
    }

    .pfm-existing-images-grid {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .pfm-existing-image-btn {
      position: relative;
      padding: 0;
      border: 2px solid transparent;
      border-radius: 0.5rem;
      background: transparent;
      cursor: pointer;
      transition: all 0.2s;
    }

    .pfm-existing-image-btn:hover {
      border-color: var(--brand-primary);
      transform: scale(1.05);
    }

    .pfm-existing-image-btn.selected {
      border-color: var(--brand-primary);
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
    }

    .pfm-existing-image-thumb {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 0.375rem;
      display: block;
    }

    .pfm-check-mark {
      position: absolute;
      top: -6px;
      right: -6px;
      width: 20px;
      height: 20px;
      background: var(--brand-primary);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }

    /* Drag & Drop Zone */
    .pfm-dropzone {
      border: 2px dashed var(--border-color);
      border-radius: 0.75rem;
      padding: 2rem 1rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      background: var(--bg-main);
    }

    .pfm-dropzone:hover, .pfm-dropzone.dragover {
      border-color: var(--brand-primary);
      background: rgba(99, 102, 241, 0.05);
    }

    .pfm-dropzone.has-file {
      border-style: solid;
      padding: 0.5rem;
    }

    .pfm-dropzone-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .pfm-upload-icon {
      width: 48px;
      height: 48px;
      color: var(--text-secondary);
    }

    .pfm-dropzone-text {
      color: var(--text-primary);
      font-weight: 500;
      margin: 0;
      font-size: 0.875rem;
    }

    .pfm-dropzone-hint {
      color: var(--text-secondary);
      font-size: 0.75rem;
      margin: 0;
    }

    .pfm-preview-container {
      position: relative;
      display: inline-block;
    }

    .pfm-image-preview {
      max-width: 100%;
      max-height: 200px;
      border-radius: 0.5rem;
      object-fit: contain;
    }

    .pfm-remove-image {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #ef4444;
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .pfm-remove-image svg {
      width: 14px;
      height: 14px;
    }

    .pfm-url-input-section {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }

    .pfm-divider-text {
      color: var(--text-secondary);
      font-size: 0.75rem;
      text-align: center;
    }

    .pfm-footer {
      padding: 1rem 1.5rem;
      background: var(--bg-card);
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      border-top: 1px solid var(--border-color);
      flex-shrink: 0;
    }

    .pfm-btn-cancel {
      padding: 0.6rem 1.2rem;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      background: transparent;
      color: var(--text-secondary);
      border: 1px solid var(--border-color);
      transition: all 0.2s;
    }
    .pfm-btn-cancel:hover {
      background: var(--bg-main);
      color: var(--text-primary);
    }

    .pfm-btn-save {
      padding: 0.6rem 1.2rem;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      background: var(--brand-primary);
      color: white;
      border: none;
      transition: all 0.2s;
    }
    .pfm-btn-save:hover {
      background: var(--brand-hover);
    }
    .pfm-btn-save:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Hide number input spinners */
    .pfm-form-group input[type="number"] {
      -moz-appearance: textfield;
      appearance: textfield;
    }

    .pfm-form-group input[type="number"]::-webkit-outer-spin-button,
    .pfm-form-group input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    @keyframes pfmFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes pfmScaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `]
})
export class ProductFormModalComponent implements OnChanges, OnInit, OnDestroy {
  private productosService = inject(ProductosService);

  @Input() isVisible = false;
  @Input() product: ProductFormData | null = null;
  @Output() saveProduct = new EventEmitter<ProductFormData>();
  @Output() cancelModal = new EventEmitter<void>();

  formData: ProductFormData = this.getEmptyForm();
  categories: string[] = ['General'];
  selectedCategory = 'General';
  showCustomInput = false;

  // Drag & drop state
  isDragOver = false;
  imagePreview: string | null = null;
  selectedExistingImage: string | null = null;

  async ngOnInit() {
    await this.loadCategories();
  }

  ngOnDestroy() {
    // Ensure body scroll is restored on destroy
    document.body.style.overflow = '';
  }

  async loadCategories() {
    try {
      const cats = await this.productosService.getCategoriasAsStrings();
      this.categories = cats.length > 0 ? cats : ['General'];
    } catch {
      this.categories = ['General'];
    }
  }

  // Check if there are existing images
  hasExistingImages(): boolean {
    return !!(this.formData.existingImages && this.formData.existingImages.length > 0);
  }

  // Drag & Drop handlers
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File) {
    // Validate file type
    if (!file.type.match(/^image\/(png|jpeg|webp)$/)) {
      console.error('Invalid file type');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.error('File too large');
      return;
    }

    this.formData.imagen = file;
    this.formData.imagenUrl = undefined;
    this.selectedExistingImage = null; // Clear existing selection when new file is chosen

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  selectExistingImage(imgUrl: string) {
    // Toggle selection
    if (this.selectedExistingImage === imgUrl) {
      this.selectedExistingImage = null;
    } else {
      this.selectedExistingImage = imgUrl;
      // Clear any new upload when selecting existing
      this.formData.imagen = undefined;
      this.imagePreview = null;
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.formData.imagen = undefined;
    this.imagePreview = null;
    this.selectedExistingImage = null;
  }

  ngOnChanges(changes: SimpleChanges) {
    // Handle body scroll lock when modal visibility changes
    if (changes['isVisible']) {
      if (this.isVisible) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }

    if (changes['product'] && this.product) {
      this.formData = { ...this.product };
      this.selectedCategory = this.categories.includes(this.formData.categoria)
        ? this.formData.categoria
        : '__custom__';
      this.showCustomInput = this.selectedCategory === '__custom__';
      this.imagePreview = null;
      // Pre-select the last (currently displayed) image if exists
      if (this.formData.existingImages && this.formData.existingImages.length > 0) {
        this.selectedExistingImage = this.formData.existingImages[this.formData.existingImages.length - 1];
      } else {
        this.selectedExistingImage = null;
      }
    } else if (changes['isVisible'] && this.isVisible && !this.product) {
      this.formData = this.getEmptyForm();
      this.selectedCategory = 'General';
      this.showCustomInput = false;
      this.imagePreview = null;
      this.selectedExistingImage = null;
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
      imagen: undefined,
      imagenUrl: undefined,
      existingImages: []
    };
  }

  onSubmit() {
    // Include the selected image URL in the form data
    const dataToEmit = {
      ...this.formData,
      selectedImageUrl: this.selectedExistingImage || undefined
    };
    this.saveProduct.emit(dataToEmit);
  }

  onHandleCancel() {
    this.cancelModal.emit();
  }
}
