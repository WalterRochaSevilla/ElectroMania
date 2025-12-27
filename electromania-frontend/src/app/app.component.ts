import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from "./pages/login/login.component";
import { RegistroComponent } from "./pages/registro/registro.component";
import { ProductosComponent } from "./pages/productos/productos.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'electromania-frontend';
}
