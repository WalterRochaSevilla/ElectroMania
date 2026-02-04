import { Component, OnInit, inject } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="sidebar">
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
        @if (isAdmin) {
          <a routerLink="/productos-admin" routerLinkActive="active" class="nav-item">
            <span class="icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </span>
            Productos
          </a>
        }
    
        <!-- Users: Admin Only -->
        @if (isAdmin) {
          <a routerLink="/usuarios-admin" routerLinkActive="active" class="nav-item">
            <span class="icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
            Usuarios
          </a>
        }
    
        <!-- Orders: Admin Only -->
        @if (isAdmin) {
          <a routerLink="/pedidos-admin" routerLinkActive="active" class="nav-item">
            <span class="icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </span>
            Pedidos
          </a>
        }
    
      </nav>
    </div>
    `,
  styles: [`
    .sidebar {
      width: 220px;
      background: var(--bg-card);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      padding: 24px 16px;
      height: 100%;
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
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.2s;
      cursor: pointer;
    }

    .nav-item:hover, .nav-item.active {
      background: rgba(14, 165, 233, 0.1);
      color: var(--brand-primary);
    }

    /* Light mode override for hover background visibility if needed, 
       but standard rgba should work on light too. */
    :host-context([data-theme='light']) .nav-item:hover,
    :host-context([data-theme='light']) .nav-item.active {
       background: var(--slate-200);
    }

    /* Mobile: hide sidebar since navigation is in hamburger menu */
    @media (max-width: 768px) {
      .sidebar {
        display: none;
      }
    }
  `]
})
export class AdminSidebarComponent implements OnInit {
  private authService = inject(AuthService);

  userRole = '';

  ngOnInit() {
    this.userRole = this.authService.getRole();
  }

  get isAdmin(): boolean {
    return this.userRole === 'admin';
  }
}
