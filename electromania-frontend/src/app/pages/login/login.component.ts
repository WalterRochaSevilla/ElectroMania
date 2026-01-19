import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { LoginRequest } from '../../models';
import { PasswordInputComponent } from '../../components/password-input/password-input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, PasswordInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  mostrarFormLogin = false;
  email = '';
  contrasena = '';

  registro() {
    this.router.navigate(['/registro']);
  }

  mostrarLogin() {
    this.mostrarFormLogin = true;
  }

  async iniciarSesion() {
    const credentials: LoginRequest = {
      email: this.email,
      password: this.contrasena
    };

    try {
      await this.authService.login(credentials);

      const role = this.authService.getRole();
      if (role === 'admin') {
        this.router.navigate(['/dashboard']);
        this.toast.success('Bienvenido Administrador');
      } else {
        this.router.navigate(['/home']);
        this.toast.success('Sesión iniciada correctamente');
      }
    } catch {
      this.toast.error('Error al iniciar sesión. Verifique sus credenciales.');
    }
  }
}
