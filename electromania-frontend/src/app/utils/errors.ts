import { HttpErrorResponse } from '@angular/common/http';

export function getErrorMessage(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.error?.message) {
      return err.error.message;
    }
    if (err.message) {
      return err.message;
    }
    return 'Error de red.';
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'Ocurrió un error inesperado.';
}

export class NotFoundError extends Error {
  override name = 'NotFoundError';
  constructor(message = 'Recurso no encontrado') {
    super(message);
  }
}

export class ValidationError extends Error {
  override name = 'ValidationError';
  constructor(message = 'Error de validación') {
    super(message);
  }
}
