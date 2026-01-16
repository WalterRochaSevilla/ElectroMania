import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  /* =========================
     ESTADOS GENERALES
  ========================= */
  modoOscuro = true;

  /* =========================
     DATOS DEL FORMULARIO
  ========================= */
  nit = '';
  razonSocial = '';
  email = '';
  contrasena = '';
  confirmarContrasena = '';
  aceptaTerminos = false;
  
  mostrarContrasena = false;
  mostrarConfirmarContrasena = false;

  /* =========================
     INYECCIÓN DE DEPENDENCIAS
  ========================= */
  constructor(private router: Router,
    private authService: AuthService
  ) {}

  /* =========================
     HEADER
  ========================= */
  cambiarModo() {
    this.modoOscuro = !this.modoOscuro;
  }

  volverAlLogin() {
    // Navegar a la página de login
    this.router.navigate(['/login']);
  }
  Catalogo() {
    this.router.navigate(['/home']);
  }
  Carrito() {
    this.router.navigate(['/producto']);
  }

  /* =========================
     FUNCIONALIDADES DEL FORMULARIO
  ========================= */
  alternarMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  alternarMostrarConfirmarContrasena() {
    this.mostrarConfirmarContrasena = !this.mostrarConfirmarContrasena;
  }

  // Formatear NIT mientras se escribe (opcional)
  formatearNIT() {
    // Remover caracteres no numéricos
    this.nit = this.nit.replace(/\D/g, '');
    
    // Limitar a 15 caracteres (típico para NIT boliviano)
    if (this.nit.length > 15) {
      this.nit = this.nit.substring(0, 15);
    }
  }

  // Validar formulario
  formularioValido(): boolean {
    return this.nit.length >= 7 && 
           this.razonSocial.trim().length > 0 &&
           this.validarEmail(this.email) &&
           this.contrasena.length >= 6 &&
           this.contrasena === this.confirmarContrasena &&
           this.aceptaTerminos;
  }

  // Validar formato de email
  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validar que las contraseñas coincidan
  contrasenasCoinciden(): boolean {
    return this.contrasena === this.confirmarContrasena;
  }

  /* =========================
     REGISTRO
  ========================= */
  registrar() {
    if (!this.formularioValido()) {
      console.error('Formulario inválido. Por favor complete todos los campos correctamente.');
      return;
    }

    console.log('Registrando usuario con los siguientes datos:', {
      nit: this.nit,
      razonSocial: this.razonSocial,
      email: this.email,
      aceptaTerminos: this.aceptaTerminos,
      fechaRegistro: new Date().toISOString()
    });

    const data = {
      email: this.email,
      name: this.razonSocial,
      password: this.contrasena,
      nit_ci: this.nit,
      social_reason: this.razonSocial
    }

    // Aquí iría la lógica real de registro:
    // 1. Validar que el email no esté registrado
    // 2. Encriptar contraseña
    // 3. Enviar datos al backend
    // 4. Manejar respuesta del servidor
    
    // Simulación de registro exitoso

    this.authService.registerUser(data).then((response) => {
      console.log('Respuesta del servidor:', response);
    })

    const registroExitoso = true;
    
    if (registroExitoso) {
      console.log('¡Registro exitoso! Redirigiendo al login...');
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      this.volverAlLogin();
    } else {
      console.error('Error en el registro. Por favor intente nuevamente.');
      alert('Error en el registro. Por favor verifique sus datos.');
    }
  }

  /* =========================
     FUNCIONES AUXILIARES
  ========================= */
  // Puedes agregar más validaciones específicas aquí
  validarNIT(nit: string): boolean {
    // Validación básica de NIT boliviano (puedes mejorarla)
    return nit.length >= 7 && nit.length <= 15 && /^\d+$/.test(nit);
  }

  // Generar contraseña aleatoria (opcional para botón "generar contraseña")
  generarContrasena() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let contrasenaGenerada = '';
    
    for (let i = 0; i < 12; i++) {
      contrasenaGenerada += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    
    this.contrasena = contrasenaGenerada;
    this.confirmarContrasena = contrasenaGenerada;
    this.mostrarContrasena = true;
    this.mostrarConfirmarContrasena = true;
  }
}