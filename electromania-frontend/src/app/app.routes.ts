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

export const routes: Routes = [
  // 1. La Bienvenida es el inicio (solo debe haber un path '')
  { path: '', component: BienvenidaComponent },
  { path: 'sobre-nosotros', component: SobreNosotrosComponent },
  { path: 'contactenos', component: ContactenosComponent },
  // 2. Rutas normales
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'producto', component: ProductosComponent },
  { path: 'productos-admin', component: ProductosAdminComponent },
  { path: 'dashboard', component: DashboardComponent },
  
  // 3. Ruta de detalle con parámetro
  { path: 'detalle-producto/:id', component: DetalleProductoComponent },

  // 4. Comodín: Si escriben cualquier otra cosa, vuelven a la Bienvenida
  { path: '**', redirectTo: '', pathMatch: 'full' },
];