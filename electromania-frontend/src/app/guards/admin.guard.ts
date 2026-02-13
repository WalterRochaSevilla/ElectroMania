import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { LanguageService } from '../services/language.service';
export const adminGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const toast = inject(ToastService);
    const languageService = inject(LanguageService);
    if (authService.isAuthenticated() && authService.isAdmin()) {
        return true;
    }
    toast.error(languageService.instant('AUTH.ACCESS_DENIED'));
    router.navigate(['/home']);
    return false;
};