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
        <!-- Dashboard: All Roles -->
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <span class="icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </span> 
          Dashboard
        </a>

        <!-- Products: Admin Only -->
        <a *ngIf="isAdmin" routerLink="/productos-admin" routerLinkActive="active" class="nav-item">
          <span class="icon">
             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </span> 
          Productos
        </a>

        <!-- Users: Admin Only -->
        <a *ngIf="isAdmin" routerLink="/usuarios-admin" routerLinkActive="active" class="nav-item">
          <span class="icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </span> 
          Usuarios
        </a>

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

    .user-info {
        color: #64748b;
        margin-bottom: 12px;
        text-transform: uppercase;
        font-size: 0.75rem;
        text-align: center;
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
  userRole: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.userRole = this.authService.getRole();
  }

  get isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
