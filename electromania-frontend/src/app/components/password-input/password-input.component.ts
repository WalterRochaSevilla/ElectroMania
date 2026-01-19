import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-password-input',
  standalone: true,
  template: `
    <div class="input-contenedor password-input">
      <input
        [type]="visible ? 'text' : 'password'"
        [id]="inputId"
        [placeholder]="placeholder"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />
      <button type="button" class="btn-toggle-visibility" (click)="toggle()" aria-label="Toggle password visibility">
        @if (visible) {
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        } @else {
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        }
      </button>
    </div>
  `,
  styles: [`
    .input-contenedor {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-contenedor input {
      width: 100%;
      padding: 12px 80px 12px 16px;
      background: var(--bg-main);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-primary);
      font-family: inherit;
      font-size: 1rem;
      outline: none;
      transition: all 0.2s;
    }

    .input-contenedor input:focus {
      border-color: var(--brand-primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .btn-toggle-visibility {
      position: absolute;
      right: 12px;
      display: flex;
      align-items: center;
      background: transparent;
      border: none;
      color: var(--brand-primary);
      cursor: pointer;
      padding: 4px;
      transition: opacity 0.2s;
    }

    .btn-toggle-visibility:hover {
      opacity: 0.7;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
  ],
})
export class PasswordInputComponent implements ControlValueAccessor {
  @Input() inputId = 'password';
  @Input() placeholder = '········';
  @Output() visibilityChange = new EventEmitter<boolean>();

  visible = false;
  value = '';

  private onChange: (value: string) => void = () => undefined;
  onTouched: () => void = () => undefined;

  toggle() {
    this.visible = !this.visible;
    this.visibilityChange.emit(this.visible);
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
