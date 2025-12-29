import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from "./pages/login/login.component";
import { RegistroComponent } from "./pages/registro/registro.component";
import { ProductosComponent } from "./pages/productos/productos.component";
import { DashboardComponent } from "./pages/admin/dashboard/dashboard.component";
import { ProductosAdminComponent } from "./pages/admin/productos-admin/productos-admin.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductosAdminComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'electromania-frontend';
}
