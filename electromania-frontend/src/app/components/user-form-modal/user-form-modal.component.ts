import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordInputComponent } from '../password-input/password-input.component';
import { isValidEmail, isValidNIT, isValidPassword, formatNIT } from '../../utils/validators';

export interface UserFormData {
  uuid?: string;
  nombre: string;
  email: string;
  password: string;
  nitCi: string;
  socialReason: string;
  rol: 'Admin' | 'Cliente';
}

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, PasswordInputComponent],
  template: `
    @if (isVisible) {
      <div class="modal-overlay" (click)="onHandleCancel()" (keyup.escape)="onHandleCancel()" tabindex="0" role="button" aria-label="Cerrar modal">
        <div class="modal-content" (click)="$event.stopPropagation()" (keyup)="null" role="dialog" aria-modal="true" tabindex="-1">
          
          <div class="modal-header">
            <h3>{{ user ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>
            <button class="close-btn" (click)="onHandleCancel()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <form (ngSubmit)="onSubmit()" #userForm="ngForm">
            <div class="modal-body">
              
              <div class="form-group">
                <label for="nombre">Nombre Completo</label>
                <input type="text" id="nombre" name="nombre" [(ngModel)]="formData.nombre" required placeholder="Ej: Juan Pérez">
              </div>

              <div class="form-group">
                <label for="email">Correo Electrónico</label>
                <input type="email" id="email" name="email" [(ngModel)]="formData.email" required placeholder="usuario@ejemplo.com">
                @if (formData.email && !isEmailValid) {
                  <span class="error-text">Ingrese un correo válido</span>
                }
              </div>

              @if (!user) {
                <div class="form-group">
                  <label for="password">Contraseña</label>
                  <app-password-input inputId="password" [(ngModel)]="formData.password" name="password" placeholder="Mínimo 6 caracteres"></app-password-input>
                  @if (formData.password && !isPasswordValid) {
                    <span class="error-text">Mínimo 6 caracteres</span>
                  }
                </div>
              }

              <div class="form-row">
                <div class="form-group">
                  <label for="nitCi">NIT/CI</label>
                  <input type="text" id="nitCi" name="nitCi" [ngModel]="formData.nitCi" (ngModelChange)="onNitChange($event)" required placeholder="12345678">
                  @if (formData.nitCi && !isNitValid) {
                    <span class="error-text">NIT inválido (7-15 dígitos)</span>
                  }
                </div>

                <div class="form-group">
                  <label for="rol">Rol</label>
                  <select id="rol" name="rol" [(ngModel)]="formData.rol">
                    <option value="Cliente">Cliente</option>
                    <option value="Admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="socialReason">Razón Social</label>
                <input type="text" id="socialReason" name="socialReason" [(ngModel)]="formData.socialReason" placeholder="Empresa S.R.L. (opcional)">
              </div>

            </div>

            <div class="modal-footer">
              <button type="button" class="btn-cancel" (click)="onHandleCancel()">Cancelar</button>
              <button type="submit" class="btn-save" [disabled]="!isFormValid">
                {{ user ? 'Guardar Cambios' : 'Crear Usuario' }}
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
      color: var(--text-secondary, #94a3b8);
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

    input, select {
      padding: 0.75rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-color, #334155);
      background: var(--bg-main, #0f172a);
      color: var(--text-primary, #f1f5f9);
      font-family: inherit;
      transition: border-color 0.2s;
    }

    :host-context([data-theme='light']) input,
    :host-context([data-theme='light']) select {
      background: #f8fafc;
      border-color: #e2e8f0;
      color: #1e293b;
    }

    input:focus, select:focus {
      outline: none;
      border-color: var(--brand-primary, #6366f1);
    }

    .error-text {
      font-size: 0.75rem;
      color: #ef4444;
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

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `]
})
export class UserFormModalComponent implements OnChanges {
  @Input() isVisible = false;
  @Input() user: UserFormData | null = null;
  @Output() saveUser = new EventEmitter<UserFormData>();
  @Output() cancelModal = new EventEmitter<void>();

  formData: UserFormData = this.getEmptyForm();

  get isEmailValid(): boolean {
    return isValidEmail(this.formData.email);
  }

  get isNitValid(): boolean {
    return isValidNIT(this.formData.nitCi);
  }

  get isPasswordValid(): boolean {
    return this.user !== null || isValidPassword(this.formData.password);
  }

  get isFormValid(): boolean {
    const baseValid = this.formData.nombre.trim() !== '' &&
      this.isEmailValid &&
      this.isNitValid;

    if (this.user) {
      return baseValid;
    }
    return baseValid && this.isPasswordValid;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      this.formData = { ...this.user };
    } else if (changes['isVisible'] && this.isVisible && !this.user) {
      this.formData = this.getEmptyForm();
    }
  }

  getEmptyForm(): UserFormData {
    return {
      nombre: '',
      email: '',
      password: '',
      nitCi: '',
      socialReason: '',
      rol: 'Cliente'
    };
  }

  onNitChange(value: string) {
    this.formData.nitCi = formatNIT(value);
  }

  onSubmit() {
    this.saveUser.emit(this.formData);
  }

  onHandleCancel() {
    this.cancelModal.emit();
  }
}
