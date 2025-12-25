import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
   /* =========================
     ESTADOS GENERALES
  ========================= */
  modoOscuro: boolean = true;

    // En tu componente
  mostrarFormLogin: boolean = false;
  email: string = '';
  contrasena: string = '';
  mostrarContrasena: boolean = false;

  /* =========================
     HEADER
  ========================= */
  cambiarModo() {
    this.modoOscuro = !this.modoOscuro;
  }
  ingresar() {
    console.log('Botón ingresar presionado');
  }
  
  mostrarLogin() {
    this.mostrarFormLogin = true;
  }

  alternarMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  iniciarSesion() {
    console.log('Iniciando sesión con:', {
      email: this.email,
      contrasena: this.contrasena
    });
    // Aquí iría la lógica real de autenticación
  }
}
