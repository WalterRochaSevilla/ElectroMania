import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  /* =========================
    ESTADOS GENERALES
 ========================= */
  modoOscuro = true;

  // En tu componente
  mostrarFormLogin = false;
  email = '';
  contrasena = '';
  mostrarContrasena = false;


  /* =========================
     HEADER
  ========================= */
  cambiarModo() {
    this.modoOscuro = !this.modoOscuro;
  }
  ingresar() {
    this.router.navigate(['/login']);
  }
  Catalogo() {
    this.router.navigate(['/home']);
  }
  Carrito() {
    this.router.navigate(['/producto']);
  }

  registro() {
    this.router.navigate(['/registro']);
  }

  mostrarLogin() {
    this.mostrarFormLogin = true;
  }

  alternarMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  async iniciarSesion() {
    try {
      await this.authService.login({
        email: this.email,
        password: this.contrasena
      });

      const role = this.authService.getRole();
      if (role === 'admin') {
        this.router.navigate(['/dashboard']);
        this.toast.success('Bienvenido Administrador');
      } else {
        this.router.navigate(['/home']);
        this.toast.success('Sesión iniciada correctamente');
      }
    } catch (error) {
      console.error('Login failed', error);
      this.toast.error('Error al iniciar sesión. Verifique sus credenciales.');
    }
  }
}
