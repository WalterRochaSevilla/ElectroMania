import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [ngClass]="toast.type" (click)="remove(toast.id)" (keyup.enter)="remove(toast.id)" tabindex="0" role="alert">
          <div class="toast-icon">
            @if (toast.type === 'success') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            } @else if (toast.type === 'error') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            } @else if (toast.type === 'warning') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            } @else {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            }
          </div>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" (click)="remove(toast.id); $event.stopPropagation()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      }
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      pointer-events: none; 
    }

    .toast {
      background: var(--surface-card);
      color: var(--text-primary);
      padding: 1rem 1.25rem;
      border-radius: 0.75rem;
      border: 1px solid var(--border-color);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 300px;
      max-width: 450px;
      pointer-events: auto;
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
      backdrop-filter: blur(10px);
    }

    @keyframes slideIn {
      from { transform: translateX(100%) translateY(20px); opacity: 0; }
      to { transform: translateX(0) translateY(0); opacity: 1; }
    }

    .toast-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .toast-icon svg {
      width: var(--space-5);
      height: var(--space-5);
    }

    .toast-message {
      flex: 1;
      font-size: 0.9375rem;
      font-weight: 500;
      line-height: 1.4;
    }

    .toast-close {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: var(--space-1);
      display: flex;
      border-radius: var(--radius-xs);
      transition: var(--transition-fast);
    }

    .toast-close:hover {
      background: var(--surface-hover);
      color: var(--text-primary);
    }

    .toast-close svg {
      width: var(--space-4);
      height: var(--space-4);
    }

    
    .toast.success { border-left: 4px solid var(--color-success); }
    .toast.success .toast-icon { color: var(--color-success); }

    .toast.error { border-left: 4px solid var(--color-danger); }
    .toast.error .toast-icon { color: var(--color-danger); }

    .toast.warning { border-left: 4px solid var(--color-warning); }
    .toast.warning .toast-icon { color: var(--color-warning); }

    .toast.info { border-left: 4px solid var(--color-info); }
    .toast.info .toast-icon { color: var(--color-info); }
  `]
})
export class ToastComponent {
    toastService = inject(ToastService);
    remove(id: number) {
        this.toastService.remove(id);
    }
}