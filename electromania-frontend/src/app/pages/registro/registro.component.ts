import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { RegisterUserRequest } from '../../models';
import { PasswordInputComponent } from '../../components/password-input/password-input.component';
import { isValidEmail, isValidNIT, isValidPassword, passwordsMatch, formatNIT } from '../../utils/validators';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink, PasswordInputComponent],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  nit = '';
  razonSocial = '';
  email = '';
  contrasena = '';
  confirmarContrasena = '';
  aceptaTerminos = false;

  volverAlLogin() {
    this.router.navigate(['/login']);
  }

  formatearNIT() {
    this.nit = formatNIT(this.nit);
  }

  formularioValido(): boolean {
    return isValidNIT(this.nit) &&
      this.razonSocial.trim().length > 0 &&
      isValidEmail(this.email) &&
      isValidPassword(this.contrasena) &&
      passwordsMatch(this.contrasena, this.confirmarContrasena) &&
      this.aceptaTerminos;
  }

  async registrar() {
    if (!this.formularioValido()) {
      this.toast.error('Formulario inválido. Por favor complete todos los campos correctamente.');
      return;
    }

    const data: RegisterUserRequest = {
      email: this.email,
      name: this.razonSocial,
      password: this.contrasena,
      nit_ci: this.nit,
      social_reason: this.razonSocial
    };

    try {
      await this.authService.registerUser(data);

      // Auto-login after successful registration
      try {
        await this.authService.login({ email: this.email, password: this.contrasena });
        this.clearSensitiveData();
        this.toast.success('¡Registro exitoso! Bienvenido a Electromania.');
        this.router.navigate(['/bienvenida']);
      } catch {
        this.clearSensitiveData();
        this.toast.success('Registro exitoso! Ahora puedes iniciar sesión.');
        this.volverAlLogin();
      }
    } catch {
      this.toast.error('Error en el registro. Por favor intente nuevamente.');
    }
  }

  private clearSensitiveData() {
    this.contrasena = '';
    this.confirmarContrasena = '';
  }

  generarContrasena() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let contrasenaGenerada = '';

    for (let i = 0; i < 12; i++) {
      contrasenaGenerada += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    this.contrasena = contrasenaGenerada;
    this.confirmarContrasena = contrasenaGenerada;
  }
}
