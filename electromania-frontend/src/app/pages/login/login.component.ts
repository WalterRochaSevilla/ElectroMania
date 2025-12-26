import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
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
     INYECCIÓN DE DEPENDENCIAS
  ========================= */
  constructor(private router: Router) {}


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
    this.router.navigate(['/registro']); //arreglar esta navegacion
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
