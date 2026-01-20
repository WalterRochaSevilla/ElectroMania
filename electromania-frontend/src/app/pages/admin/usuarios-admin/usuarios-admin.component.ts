import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductosService } from '../../../services/productos.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.css'
})
export class UsuariosAdminComponent {
  /* =========================
     ESTADOS GENERALES
  ========================= */
  modoOscuro = true;
  busqueda = '';
  filtroRol = 'all';

  /* =========================
     USUARIOS DE EJEMPLO
  ========================= */
  usuarios = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan.perez@email.com',
      rol: 'Admin',
      nitCi: '1234567',
      estado: 'Activo'
    },
    {
      id: 2,
      nombre: 'María García',
      email: 'maria.garcia@email.com',
      rol: 'Vendedor',
      nitCi: '7654321',
      estado: 'Activo'
    },
    {
      id: 3,
      nombre: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      rol: 'Cliente',
      nitCi: '9876543',
      estado: 'Inactivo'
    },
    {
      id: 4,
      nombre: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      rol: 'Vendedor',
      nitCi: '2345678',
      estado: 'Activo'
    },
    {
      id: 5,
      nombre: 'Luis Fernández',
      email: 'luis.fernandez@email.com',
      rol: 'Admin',
      nitCi: '8765432',
      estado: 'Activo'
    },
    {
      id: 6,
      nombre: 'Sofía López',
      email: 'sofia.lopez@email.com',
      rol: 'Cliente',
      nitCi: '3456789',
      estado: 'Inactivo'
    },
    {
      id: 7,
      nombre: 'Pedro Sánchez',
      email: 'pedro.sanchez@email.com',
      rol: 'Vendedor',
      nitCi: '6543210',
      estado: 'Activo'
    },
    {
      id: 8,
      nombre: 'Laura Gómez',
      email: 'laura.gomez@email.com',
      rol: 'Cliente',
      nitCi: '4321098',
      estado: 'Activo'
    },
    {
      id: 9,
      nombre: 'Diego Ramírez',
      email: 'diego.ramirez@email.com',
      rol: 'Admin',
      nitCi: '2109876',
      estado: 'Inactivo'
    },
    {
      id: 10,
      nombre: 'Elena Torres',
      email: 'elena.torres@email.com',
      rol: 'Vendedor',
      nitCi: '8901234',
      estado: 'Activo'
    }
  ];

  usuariosFiltrados = [...this.usuarios];

  /* =========================
     INYECCIÓN DE DEPENDENCIAS
  ========================= */
  constructor(private router: Router,
    private productosService: ProductosService,
    public authService: AuthService
  ) {
    this.productosService.getProductos().subscribe(productos => {
      console.log(productos);
      alert(productos);
    })
  }

  /* =========================
     HEADER
  ========================= */
  cambiarModo() {
    this.modoOscuro = !this.modoOscuro;
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }

  /* =========================
     FILTRADO Y BÚSQUEDA
  ========================= */
  filtrarUsuarios() {
    let resultado = [...this.usuarios];

    // Filtro por búsqueda
    if (this.busqueda.trim() !== '') {
      const busquedaLower = this.busqueda.toLowerCase();
      resultado = resultado.filter(usuario =>
        usuario.nombre.toLowerCase().includes(busquedaLower) ||
        usuario.email.toLowerCase().includes(busquedaLower) ||
        usuario.nitCi.includes(this.busqueda) ||
        usuario.rol.toLowerCase().includes(busquedaLower)
      );
    }

    // Filtro por rol
    if (this.filtroRol !== 'all') {
      resultado = resultado.filter(usuario => usuario.rol === this.filtroRol);
    }

    this.usuariosFiltrados = resultado;
  }

  aplicarFiltroRol(rol: string) {
    this.filtroRol = rol;
    this.filtrarUsuarios();
  }

  /* =========================
     FUNCIONES DE USUARIOS
  ========================= */
  obtenerIniciales(nombre: string): string {
    return nombre
      .split(' ')
      .map(palabra => palabra.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  contarActivos(): number {
    return this.usuarios.filter(u => u.estado === 'Activo').length;
  }

  contarInactivos(): number {
    return this.usuarios.filter(u => u.estado === 'Inactivo').length;
  }

  /* =========================
     ACCIONES CRUD
  ========================= */
  agregarUsuario() {
    console.log('Agregar nuevo usuario');
    // Aquí iría la lógica para abrir modal/formulario
  }

  editarUsuario(usuario: any) {
    console.log('Editar usuario:', usuario);
    // Aquí iría la lógica para editar
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarios = this.usuarios.filter(u => u.id !== id);
      this.filtrarUsuarios();
      console.log('Usuario eliminado:', id);
    }
  }

  toggleEstado(usuario: any) {
    usuario.estado = usuario.estado === 'Activo' ? 'Inactivo' : 'Activo';
    console.log(`Usuario ${usuario.id} ${usuario.estado === 'Activo' ? 'activado' : 'desactivado'}`);
  }

  resetPassword(id: number) {
    if (confirm('¿Resetear contraseña del usuario? Se enviará un correo con nueva contraseña.')) {
      console.log('Contraseña reseteada para usuario:', id);
      // Aquí iría la lógica para resetear contraseña
    }
  }
}