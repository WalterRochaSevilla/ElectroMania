import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';


export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    console.warn('⚠️ Guard: Usuario no autenticado, redirigiendo a login');
    router.navigate(['/login']);
    return false;
  }

  const userRole = authService.getRole();
  console.log('🔐 Guard: Rol del usuario:', userRole);

  // Permitir si es ADMIN o EMPLEADO
  if (authService.isAdminOrEmployee()) {
    console.log('✅ Guard: Acceso concedido para ADMIN/EMPLEADO');
    return true;
  }

  // Si no es ninguno de los dos, redirigir
  console.warn('🚫 Guard: Usuario no tiene permisos, redirigiendo a home');
  router.navigate(['/home']);
  return false;
};