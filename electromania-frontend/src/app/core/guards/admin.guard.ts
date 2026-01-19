import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  // 1. Inyectamos los servicios que necesitamos
  const authService = inject(AuthService);
  const router = inject(Router);

  // 2. Verificamos si el usuario está autenticado
  if (!authService.isAuthenticated()) {
    console.warn('⚠️ Guard: Usuario no autenticado, redirigiendo a login');
    router.navigate(['/login']);
    return false;
  }

  // 3. Obtenemos el rol del usuario desde el token
  const userRole = authService.getRole();
  console.log('🔐 Guard: Rol del usuario:', userRole);

  // 4. Verificamos si es ADMIN
  if (userRole === 'ADMIN' || userRole === 'admin') {
    console.log('✅ Guard: Acceso concedido para ADMIN');
    return true;
  }

  // 5. Si no es ADMIN, redirigimos a home
  console.warn('🚫 Guard: Usuario no es ADMIN, redirigiendo a home');
  router.navigate(['/home']);
  return false;
};