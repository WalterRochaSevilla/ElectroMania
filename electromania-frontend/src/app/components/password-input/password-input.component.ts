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
      <button type="button" class="btn-mostrar-contrasena" (click)="toggle()">
        {{ visible ? 'Ocultar' : 'Mostrar' }}
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

    .btn-mostrar-contrasena {
      position: absolute;
      right: 12px;
      background: transparent;
      border: none;
      color: var(--brand-primary);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      padding: 4px 8px;
    }

    .btn-mostrar-contrasena:hover {
      text-decoration: underline;
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
