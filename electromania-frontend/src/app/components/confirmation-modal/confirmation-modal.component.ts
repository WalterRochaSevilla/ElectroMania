import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ModalService } from '../../services/modal.service';
@Component({
    selector: 'app-confirmation-modal',
    standalone: true,
  imports: [CommonModule, TranslatePipe],
    template: `
    @if (modalService.isOpen()) {
      <div class="modal-overlay" 
           (click)="cancel()" 
           (keyup.escape)="cancel()" 
           tabindex="0" 
           role="button" 
           [attr.aria-label]="'COMMON.CLOSE' | translate">
        
        <div class="modal-content" 
             (click)="$event.stopPropagation()" 
             (keyup)="null" 
             role="dialog" 
             aria-modal="true" 
             tabindex="-1">
          
          <div class="modal-header" [ngClass]="modalService.data().type || 'info'">
            <h3>{{ modalService.data().title }}</h3>
            <button class="close-btn" (click)="cancel()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div class="modal-body">
            <p>{{ modalService.data().message }}</p>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" (click)="cancel()">
              {{ modalService.data().cancelText || ('COMMON.CANCEL' | translate) }}
            </button>
            <button class="btn-confirm" 
                    [ngClass]="modalService.data().type || 'info'"
                    (click)="confirm()">
              {{ modalService.data().confirmText || ('COMMON.CONFIRM' | translate) }}
            </button>
          </div>

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
      max-width: 400px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      animation: scaleIn 0.2s ease-out;
      overflow: hidden;
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
      margin: 0;
    }

    
    .modal-header.danger h3 { color: var(--color-danger); }
    .modal-header.warning h3 { color: var(--color-warning); }
    .modal-header.info h3 { color: var(--brand-primary, #0ea5e9); }

    .close-btn {
      background: transparent;
      border: none;
      color: var(--text-secondary, #94a3b8);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .close-btn svg { width: var(--space-5); height: var(--space-5); }

    :host-context([data-theme='light']) .close-btn {
      color: #64748b;
    }

    .modal-body {
      padding: 1.5rem;
      color: var(--text-secondary, #94a3b8);
      font-size: 0.95rem;
      line-height: 1.5;
    }

    :host-context([data-theme='light']) .modal-body {
      color: #475569;
    }

    .modal-footer {
      padding: 1rem 1.5rem;
      background: transparent;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    button {
      padding: 0.5rem 1rem;
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
      background: var(--surface-ground, #1e293b);
      color: var(--text-primary, #f1f5f9);
    }

    :host-context([data-theme='light']) .btn-cancel {
      color: #64748b;
      border-color: #e2e8f0;
    }
    :host-context([data-theme='light']) .btn-cancel:hover {
      background: #f1f5f9;
      color: #1e293b;
    }

    .btn-confirm {
      color: white;
    }

    .btn-confirm.danger { background: var(--color-danger); }
    .btn-confirm.danger:hover { background: #dc2626; }

    .btn-confirm.warning { background: var(--color-warning); }
    .btn-confirm.warning:hover { background: #d97706; }

    .btn-confirm.info { background: var(--brand-primary, #0ea5e9); }
    .btn-confirm.info:hover { background: var(--brand-primary-dark, #0284c7); }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `]
})
export class ConfirmationModalComponent {
    modalService = inject(ModalService);
    confirm() {
        this.modalService.close(true);
    }
    cancel() {
        this.modalService.close(false);
    }
    @HostListener('document:keydown.escape')
    onKeydownHandler() {
        if (this.modalService.isOpen()) {
            this.cancel();
        }
    }
}