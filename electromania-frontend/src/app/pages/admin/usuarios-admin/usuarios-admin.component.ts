import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { ModalService } from '../../../services/modal.service';
import { UserService } from '../../../services/user.service';
import { LanguageService } from '../../../services/language.service';
import { UserDisplay, User } from '../../../models';
import { UserFormModalComponent, UserFormData } from '../../../components/user-form-modal/user-form-modal.component';
import { AdminSidebarComponent } from '../../../components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, UserFormModalComponent, AdminSidebarComponent, TranslateModule],
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.css'
})
export class UsuariosAdminComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private modalService = inject(ModalService);
  private userService = inject(UserService);
  private languageService = inject(LanguageService);
  private cdr = inject(ChangeDetectorRef);

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
    this.cdr.markForCheck();
    try {
      const users = await this.userService.getAllUsers();
      this.rawUsers = users;
      this.usuarios = this.mapUsersToDisplay(users);
      this.usuariosFiltrados = [...this.usuarios];
    } catch {
      this.toast.error(this.languageService.instant('ADMIN.ERROR_LOAD_USERS'));
      this.usuarios = [];
      this.usuariosFiltrados = [];
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  private mapUsersToDisplay(users: User[]): UserDisplay[] {
    return users.map((u, index) => ({
      id: index + 1,
      nombre: u.name,
      email: u.email,
      rol: u.role.toLowerCase() === 'admin' ? 'Admin' : 'Cliente',
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
    const user = this.rawUsers.find(u => u.email === usuario.email);
    this.selectedUser = {
      uuid: user?.uuid,
      nombre: usuario.nombre,
      email: usuario.email,
      password: '',
      phone: user?.phone || '',
      nitCi: usuario.nitCi,
      socialReason: user?.social_reason || '',
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
      this.toast.info(this.languageService.instant('ADMIN.EDIT_NOT_AVAILABLE'));
    } else {
      try {
        await this.userService.createUser({
          name: data.nombre,
          email: data.email,
          password: data.password,
          nit_ci: data.nitCi,
          social_reason: data.socialReason,
          phone: data.phone
        });
        this.toast.success(this.languageService.instant('ADMIN.USER_CREATED'));
        await this.cargarUsuarios();
      } catch {
        this.toast.error(this.languageService.instant('ADMIN.ERROR_CREATE_USER'));
      }
    }
  }

  async eliminarUsuario(id: number) {
    const confirmed = await this.modalService.confirm({
      title: this.languageService.instant('ADMIN.DELETE_USER_TITLE'),
      message: this.languageService.instant('ADMIN.CONFIRM_DELETE_USER'),
      confirmText: this.languageService.instant('COMMON.DELETE'),
      type: 'danger'
    });

    if (confirmed) {
      this.usuarios = this.usuarios.filter(u => u.id !== id);
      this.filtrarUsuarios();
      this.toast.success(this.languageService.instant('ADMIN.USER_DELETED'));
    }
  }

  toggleEstado(usuario: UserDisplay) {
    usuario.estado = usuario.estado === 'Activo' ? 'Inactivo' : 'Activo';
    this.toast.info(this.languageService.instant(usuario.estado === 'Activo' ? 'ADMIN.USER_ACTIVATED' : 'ADMIN.USER_DEACTIVATED'));
  }

  async resetPassword(usuario: UserDisplay) {
    const confirmed = await this.modalService.confirm({
      title: this.languageService.instant('ADMIN.RESET_PASSWORD'),
      message: this.languageService.instant('ADMIN.RESET_PASSWORD_CONFIRM', { name: usuario.nombre }),
      confirmText: this.languageService.instant('ADMIN.RESET_PASSWORD'),
      type: 'warning'
    });

    if (confirmed) {
      this.toast.success(this.languageService.instant('ADMIN.PASSWORD_RESET_SENT', { email: usuario.email }));
    }
  }
}
