import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/bienvenida/bienvenida.component').then(m => m.BienvenidaComponent),
  },
  {
    path: 'sobre-nosotros',
    loadComponent: () => import('./pages/sobre-nosotros/sobre-nosotros.component').then(m => m.SobreNosotrosComponent),
  },
  {
    path: 'contactenos',
    loadComponent: () => import('./pages/contactenos/contactenos.component').then(m => m.ContactenosComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.component').then(m => m.RegistroComponent),
  },
  {
    path: 'producto',
    loadComponent: () => import('./pages/productos/productos.component').then(m => m.ProductosComponent),
  },
  {
    path: 'productos-admin',
    loadComponent: () => import('./pages/admin/productos-admin/productos-admin.component').then(m => m.ProductosAdminComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.adminRoutes),
    canActivate: [adminGuard],
  },
  {
    path: 'usuarios-admin',
    loadComponent: () => import('./pages/admin/usuarios-admin/usuarios-admin.component').then(m => m.UsuariosAdminComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'pedidos-admin',
    loadComponent: () => import('./pages/admin/pedidos/pedidos.component').then(m => m.PedidosComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'detalle-producto/:id',
    loadComponent: () => import('./pages/detalle-producto/detalle-producto.component').then(m => m.DetalleProductoComponent),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];