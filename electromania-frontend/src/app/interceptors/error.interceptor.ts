import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        toast.error('Error de conexion. Verifique su red.');
      } else if (error.status === 401) {
        if (authService.isAuthenticated()) {
          authService.logout();
          toast.error('Sesion expirada. Por favor inicie sesion nuevamente.');
          router.navigate(['/login']);
        }
      } else if (error.status === 403) {
        toast.error('No tiene permisos para realizar esta accion.');
      } else if (error.status === 404) {
        // Don't show generic toast for 404 - let the component handle it
      } else if (error.status >= 500) {
        toast.error('Error del servidor. Intente nuevamente mas tarde.');
      }

      return throwError(() => error);
    })
  );
};
