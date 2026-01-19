import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { ModalService } from '../../../services/modal.service';
import { UserService } from '../../../services/user.service';
import { UserDisplay, User } from '../../../models';
import { UserFormModalComponent, UserFormData } from '../../../components/user-form-modal/user-form-modal.component';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, UserFormModalComponent],
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.css'
})
export class UsuariosAdminComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private modalService = inject(ModalService);
  private userService = inject(UserService);

  busqueda = '';
  filtroRol = 'all';
  loading = false;

  isModalOpen = false;
  selectedUser: UserFormData | null = null;
  isEditing = false;

  usuarios: UserDisplay[] = [];
  usuariosFiltrados: UserDisplay[] = [];
  private rawUsers: User[] = [];

  async ngOnInit() {
    await this.cargarUsuarios();
  }

  async cargarUsuarios() {
    this.loading = true;
    try {
      const users = await this.userService.getAllUsers();
      this.rawUsers = users;
      this.usuarios = this.mapUsersToDisplay(users);
      this.usuariosFiltrados = [...this.usuarios];
    } catch {
      this.toast.error('Error al cargar usuarios');
      this.usuarios = [];
      this.usuariosFiltrados = [];
    } finally {
      this.loading = false;
    }
  }

  private mapUsersToDisplay(users: User[]): UserDisplay[] {
    return users.map((u, index) => ({
      id: index + 1,
      nombre: u.name,
      email: u.email,
      rol: u.role === 'ADMIN' ? 'Admin' : 'Cliente',
      nitCi: u.nit_ci,
      estado: 'Activo'
    }));
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  filtrarUsuarios() {
    let resultado = [...this.usuarios];

    if (this.busqueda.trim() !== '') {
      const busquedaLower = this.busqueda.toLowerCase();
      resultado = resultado.filter(usuario =>
        usuario.nombre.toLowerCase().includes(busquedaLower) ||
        usuario.email.toLowerCase().includes(busquedaLower) ||
        usuario.nitCi.includes(this.busqueda) ||
        usuario.rol.toLowerCase().includes(busquedaLower)
      );
    }

    if (this.filtroRol !== 'all') {
      resultado = resultado.filter(usuario => usuario.rol === this.filtroRol);
    }

    this.usuariosFiltrados = resultado;
  }

  aplicarFiltroRol(rol: string) {
    this.filtroRol = rol;
    this.filtrarUsuarios();
  }

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

  agregarUsuario() {
    this.selectedUser = null;
    this.isEditing = false;
    this.isModalOpen = true;
  }

  editarUsuario(usuario: UserDisplay) {
    this.selectedUser = {
      uuid: this.findUuidByEmail(usuario.email),
      nombre: usuario.nombre,
      email: usuario.email,
      password: '',
      nitCi: usuario.nitCi,
      socialReason: '',
      rol: usuario.rol as 'Admin' | 'Cliente'
    };
    this.isEditing = true;
    this.isModalOpen = true;
  }

  private findUuidByEmail(email: string): string | undefined {
    return this.rawUsers.find(u => u.email === email)?.uuid;
  }

  handleModalCancel() {
    this.isModalOpen = false;
    this.selectedUser = null;
  }

  async handleModalSave(data: UserFormData) {
    this.isModalOpen = false;

    if (this.isEditing) {
      this.toast.info('La edición de usuarios no está disponible en el backend');
    } else {
      try {
        await this.userService.createUser({
          name: data.nombre,
          email: data.email,
          password: data.password,
          nit_ci: data.nitCi,
          social_reason: data.socialReason
        });
        this.toast.success('Usuario creado exitosamente');
        await this.cargarUsuarios();
      } catch {
        this.toast.error('Error al crear el usuario');
      }
    }
  }

  async eliminarUsuario(id: number) {
    const confirmed = await this.modalService.confirm({
      title: 'Eliminar Usuario',
      message: '¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      type: 'danger'
    });

    if (confirmed) {
      this.usuarios = this.usuarios.filter(u => u.id !== id);
      this.filtrarUsuarios();
      this.toast.success('Usuario eliminado');
    }
  }

  toggleEstado(usuario: UserDisplay) {
    usuario.estado = usuario.estado === 'Activo' ? 'Inactivo' : 'Activo';
    this.toast.info(`Usuario ${usuario.estado === 'Activo' ? 'activado' : 'desactivado'}`);
  }

  async resetPassword(usuario: UserDisplay) {
    const confirmed = await this.modalService.confirm({
      title: 'Resetear Contraseña',
      message: `¿Resetear contraseña del usuario ${usuario.nombre}? Se enviará un correo con la nueva contraseña.`,
      confirmText: 'Resetear',
      type: 'warning'
    });

    if (confirmed) {
      this.toast.success(`Se ha enviado un correo a ${usuario.email}`);
    }
  }
}
