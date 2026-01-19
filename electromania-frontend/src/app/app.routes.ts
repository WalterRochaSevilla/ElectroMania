/*import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ProductosAdminComponent } from './pages/admin/productos-admin/productos-admin.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'producto', component: ProductosComponent },
  { path: 'productos-admin', component: ProductosAdminComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' } 
];*/
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ProductosAdminComponent } from './pages/admin/productos-admin/productos-admin.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { DetalleProductoComponent } from './pages/detalle-producto/detalle-producto.component';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';
import { SobreNosotrosComponent } from './pages/sobre-nosotros/sobre-nosotros.component';
import { ContactenosComponent } from './pages/contactenos/contactenos.component';
import { adminGuard } from './core/guards/admin.guard'; // 
import { UsuariosAdminComponent } from './pages/admin/usuarios-admin/usuarios-admin.component';

export const routes: Routes = [
  // 1. PÁGINA DE INICIO
  { path: '', component: BienvenidaComponent },
  
  // 2. RUTAS PÚBLICAS
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'sobre-nosotros', component: SobreNosotrosComponent },
  { path: 'contactenos', component: ContactenosComponent },
  { path: 'detalle-producto/:id', component: DetalleProductoComponent },
  
  // 3. RUTAS DE ADMINISTRACIÓN - PROTEGIDAS CON GUARD 👈
  {
    path: 'admin',
    canActivate: [adminGuard], // 👈 AQUÍ SE APLICA EL GUARD
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'productos', component: ProductosAdminComponent },
      { path: 'usuarios', component: UsuariosAdminComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  // 4. RUTA POR DEFECTO
  { path: '**', redirectTo: '', pathMatch: 'full' },
];