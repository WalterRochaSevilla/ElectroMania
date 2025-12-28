import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  /* =========================
     ESTADOS GENERALES
  ========================= */
  modoOscuro: boolean = true;
  periodoSeleccionado: string = '7d';

  /* =========================
     DATOS DEL GRÁFICO (simulados)
  ========================= */
  datosVentas = [
    { dia: 'Lun', ventas: 7000 },
    { dia: 'Mar', ventas: 8500 },
    { dia: 'Mié', ventas: 6000 },
    { dia: 'Jue', ventas: 9000 },
    { dia: 'Vie', ventas: 7500 },
    { dia: 'Sáb', ventas: 9500 },
    { dia: 'Dom', ventas: 8000 }
  ];

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

  cerrarSesion() {
    // Lógica para cerrar sesión
    this.router.navigate(['/login']);
  }

  irAProductos() {
    this.router.navigate(['/productos']);
  }

  irAUsuarios() {
    this.router.navigate(['/usuarios']);
  }
}