import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="sidebar">
      <div class="logo-area">
        <div class="logo-icon">E</div>
        <span class="logo-text">ELECTROMANIA</span>
      </div>

      <nav class="sidebar-nav">
        <!-- Dashboard: Todos los roles (admin y empleado) -->
        <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item">
          <span class="icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </span> 
          Dashboard
        </a>

        <!-- Productos: Admin Y Empleado pueden ver -->
        <a *ngIf="authService.isAdminOrEmployee()" routerLink="/admin/productos" routerLinkActive="active" class="nav-item">
          <span class="icon">
             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </span> 
          Productos
        </a>

        <!-- Usuarios: SOLO Admin -->
        <a *ngIf="authService.isAdmin()" routerLink="/admin/usuarios" routerLinkActive="active" class="nav-item">
          <span class="icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </span> 
          Usuarios
        </a>

        <!-- Indicador especial para Empleados -->
        <div *ngIf="authService.isEmployee()" class="employee-info">
          <div class="role-indicator">
            <span class="icon">👔</span>
            <span class="role-text">Modo Empleado</span>
            <small>Solo visualización</small>
          </div>
        </div>

        <a routerLink="/home" class="nav-item">
          <span class="icon">
             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </span> 
          Ver Tienda
        </a>
      </nav>
      
      <div class="sidebar-footer">
        <!-- Información del usuario/rol -->
        <div class="user-info">
          <div class="role-badge" [class.admin]="authService.isAdmin()" [class.employee]="authService.isEmployee()">
            {{ authService.isAdmin() ? '👑 Administrador' : '👔 Empleado' }}
          </div>
          <small>Rol actual</small>
        </div>
        
        <button class="btn-logout" (click)="logout()">
          <span class="icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </span> 
          Salir
        </button>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      background: #020617;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      padding: 24px;
      height: 100%;
    }

    .logo-area {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 40px;
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      background: var(--brand-primary, #6366f1);
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
    }

    .logo-text {
      font-weight: 800;
      letter-spacing: -0.5px;
      font-size: 1.1rem;
      color: #e2e8f0;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: #94a3b8;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.2s;
      cursor: pointer;
    }

    .nav-item:hover, .nav-item.active {
      background: rgba(99, 102, 241, 0.1);
      color: var(--brand-primary, #6366f1);
    }

    .employee-info {
      margin-top: 20px;
      padding: 12px;
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: 8px;
    }

    .role-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      color: #3b82f6;
      font-size: 0.85rem;
    }

    .role-indicator .icon {
      font-size: 1.5rem;
      margin-bottom: 4px;
    }

    .role-indicator small {
      font-size: 0.7rem;
      color: #94a3b8;
      margin-top: 2px;
    }

    .sidebar-footer {
      margin-top: auto;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 16px;
      color: #64748b;
    }

    .role-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-align: center;
      margin-bottom: 4px;
      min-width: 120px;
    }

    .role-badge.admin {
      background: rgba(139, 92, 246, 0.2);
      color: #8b5cf6;
      border: 1px solid rgba(139, 92, 246, 0.3);
    }

    .role-badge.employee {
      background: rgba(59, 130, 246, 0.2);
      color: #3b82f6;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .btn-logout {
      width: 100%;
      padding: 12px;
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-weight: 600;
    }
    
    .btn-logout:hover {
        background: rgba(239, 68, 68, 0.2);
    }
  `]
})
export class AdminSidebarComponent implements OnInit {
  constructor(
    public authService: AuthService, // ✅ Hacerlo público
    private router: Router
  ) { }

  ngOnInit() {
    // Ya no necesitamos userRole, usamos authService directamente
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}