import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { LanguageService } from '../services/language.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);
  const languageService = inject(LanguageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        toast.error(languageService.instant('ERRORS.NETWORK'));
      } else if (error.status === 401) {
        if (authService.isAuthenticated()) {
          authService.logout();
          toast.error(languageService.instant('AUTH.SESSION_EXPIRED'));
          router.navigate(['/login']);
        }
      } else if (error.status === 403) {
        toast.error(languageService.instant('AUTH.NO_PERMISSION'));
      } else if (error.status === 404) {
        // Don't show generic toast for 404 - let the component handle it
      } else if (error.status >= 500) {
        toast.error(languageService.instant('ERRORS.SERVER'));
      }

      return throwError(() => error);
    })
  );
};
