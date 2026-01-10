import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ProductosAdminComponent } from './pages/admin/productos-admin/productos-admin.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ConectionComponent } from './pages/conection/conection.component';
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'producto', component: ProductosComponent },
  { path: 'productos-admin', component: ProductosAdminComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path : 'conection', component: ConectionComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' } 
];