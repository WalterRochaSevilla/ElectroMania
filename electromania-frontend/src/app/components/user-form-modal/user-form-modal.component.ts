import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordInputComponent } from '../password-input/password-input.component';
import { isValidEmail, isValidNIT, isValidPassword, formatNIT } from '../../utils/validators';
export interface UserFormData {
    uuid?: string;
    nombre: string;
    email: string;
    password: string;
    phone: string;
    nit_ci: string;
    social_reason: string;
    rol: 'Admin' | 'Cliente';
}
@Component({
    selector: 'app-user-form-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, PasswordInputComponent],
    template: `
    @if (isVisible) {
      <div class="modal-overlay" (click)="onHandleCancel()" (keyup.escape)="onHandleCancel()" tabindex="0" role="button" [attr.aria-label]="'COMMON.CLOSE' | translate">
        <div class="modal-content" (click)="$event.stopPropagation()" (keyup)="null" role="dialog" aria-modal="true" tabindex="-1">
          
          <div class="modal-header">
            <h3>{{ (user ? 'USER_MODAL.EDIT_USER' : 'USER_MODAL.NEW_USER') | translate }}</h3>
            <button class="close-btn" (click)="onHandleCancel()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <form (ngSubmit)="onSubmit()" #userForm="ngForm">
            <div class="modal-body">
              
              <div class="form-group">
                <label for="nombre">{{ 'USER_MODAL.FULL_NAME' | translate }}</label>
                <input type="text" id="nombre" name="nombre" [(ngModel)]="formData.nombre" required [placeholder]="'USER_MODAL.FULL_NAME_PLACEHOLDER' | translate">
              </div>

              <div class="form-group">
                <label for="email">{{ 'USER_MODAL.EMAIL' | translate }}</label>
                <input type="email" id="email" name="email" [(ngModel)]="formData.email" required [placeholder]="'USER_MODAL.EMAIL_PLACEHOLDER' | translate">
                @if (formData.email && !isEmailValid) {
                  <span class="error-text">{{ 'USER_MODAL.EMAIL_INVALID' | translate }}</span>
                }
              </div>

              @if (!user) {
                <div class="form-group">
                  <label for="password">{{ 'USER_MODAL.PASSWORD' | translate }}</label>
                  <app-password-input inputId="password" [(ngModel)]="formData.password" name="password" [placeholder]="'USER_MODAL.PASSWORD_PLACEHOLDER' | translate"></app-password-input>
                  @if (formData.password && !isPasswordValid) {
                    <span class="error-text">{{ 'USER_MODAL.PASSWORD_MIN' | translate }}</span>
                  }
                </div>
              }

              <div class="form-group">
                <label for="phone">{{ 'USER_MODAL.PHONE' | translate }}</label>
                <input type="tel" id="phone" name="phone" [(ngModel)]="formData.phone" required [placeholder]="'USER_MODAL.PHONE_PLACEHOLDER' | translate">
                @if (formData.phone && formData.phone.length < 7) {
                  <span class="error-text">{{ 'USER_MODAL.PHONE_MIN' | translate }}</span>
                }
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="nitCi">{{ 'USER_MODAL.NIT_CI' | translate }}</label>
                  <input type="text" id="nitCi" name="nitCi" [ngModel]="formData.nit_ci" (ngModelChange)="onNitChange($event)" required [placeholder]="'USER_MODAL.NIT_CI_PLACEHOLDER' | translate">
                  @if (formData.nit_ci && !isNitValid) {
                    <span class="error-text">{{ 'USER_MODAL.NIT_INVALID' | translate }}</span>
                  }
                </div>

                <div class="form-group">
                  <label for="rol">{{ 'USER_MODAL.ROLE' | translate }}</label>
                  <select id="rol" name="rol" [(ngModel)]="formData.rol">
                    <option value="Cliente">{{ 'USER_MODAL.ROLE_CLIENT' | translate }}</option>
                    <option value="Admin">{{ 'USER_MODAL.ROLE_ADMIN' | translate }}</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="socialReason">{{ 'USER_MODAL.SOCIAL_REASON' | translate }}</label>
                <input type="text" id="socialReason" name="socialReason" [(ngModel)]="formData.social_reason" [placeholder]="'USER_MODAL.SOCIAL_REASON_PLACEHOLDER' | translate">
              </div>

            </div>

            <div class="modal-footer">
              <button type="button" class="btn-cancel" (click)="onHandleCancel()">{{ 'COMMON.CANCEL' | translate }}</button>
              <button type="submit" class="btn-save" [disabled]="!isFormValid">
                {{ (user ? 'COMMON.SAVE_CHANGES' : 'USER_MODAL.CREATE_USER') | translate }}
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
    .close-btn svg { width: var(--space-5); height: var(--space-5); }

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
      border-color: var(--brand-primary, #0ea5e9);
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
      transition: var(--transition-fast);
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
      background: var(--brand-primary, #0ea5e9);
      color: white;
    }
    .btn-save:hover {
      background: #0284c7;
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
    @Input()
    isVisible = false;
    @Input()
    user: UserFormData | null = null;
    @Output()
    saveUser = new EventEmitter<UserFormData>();
    @Output()
    cancelModal = new EventEmitter<void>();
    formData: UserFormData = this.getEmptyForm();
    get isEmailValid(): boolean {
        return isValidEmail(this.formData.email);
    }
    get isNitValid(): boolean {
        return isValidNIT(this.formData.nit_ci);
    }
    get isPasswordValid(): boolean {
        return this.user !== null || isValidPassword(this.formData.password);
    }
    get isPhoneValid(): boolean {
        return this.formData.phone.trim().length >= 7;
    }
    get isFormValid(): boolean {
        const baseValid = this.formData.nombre.trim() !== '' &&
            this.isEmailValid &&
            this.isPhoneValid &&
            this.isNitValid;
        if (this.user) {
            return baseValid;
        }
        return baseValid && this.isPasswordValid;
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes['user'] && this.user) {
            this.formData = { ...this.user };
        }
        else if (changes['isVisible'] && this.isVisible && !this.user) {
            this.formData = this.getEmptyForm();
        }
    }
    getEmptyForm(): UserFormData {
        return {
            nombre: '',
            email: '',
            password: '',
            phone: '',
            nit_ci: '',
            social_reason: '',
            rol: 'Cliente'
        };
    }
    onNitChange(value: string) {
        this.formData.nit_ci = formatNIT(value);
    }
    onSubmit() {
        this.saveUser.emit(this.formData);
    }
    onHandleCancel() {
        this.cancelModal.emit();
    }
}