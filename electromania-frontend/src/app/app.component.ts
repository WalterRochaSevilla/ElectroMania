import { Component, HostListener, Renderer2, inject, OnInit, PLATFORM_ID, signal, ChangeDetectionStrategy } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastComponent } from './components/toast/toast.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service';
import { ROUTES } from './constants';

const SCROLL_THRESHOLD = 100;
const THEME_TRANSITION_MS = 500;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    TranslateModule,
    ToastComponent,
    ConfirmationModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly renderer = inject(Renderer2);
  private readonly themeService = inject(ThemeService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly authService = inject(AuthService);

  readonly isAuthenticated = this.authService.isAuthenticated$;
  readonly currentUser = this.authService.currentUser;

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  readonly isDarkMode = this.themeService.isDark;

  isScrolled = signal(false);
  dropdownOpen = signal(false);
  mobileMenuOpen = signal(false);

  private scrollThrottle = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.isBrowser || this.scrollThrottle) return;
    
    this.scrollThrottle = true;
    requestAnimationFrame(() => {
      try {
        this.isScrolled.set(window.scrollY > SCROLL_THRESHOLD);
      } finally {
        this.scrollThrottle = false;
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.dropdownOpen.set(false);
    }
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.renderer.addClass(this.document.body, 'loaded');
    }
  }

  toggleTheme() {
    this.themeService.toggle();

    if (this.isBrowser) {
      this.renderer.addClass(this.document.body, 'theme-transition');
      setTimeout(() => {
        this.renderer.removeClass(this.document.body, 'theme-transition');
      }, THEME_TRANSITION_MS);
    }
  }

  toggleDropdown() {
    this.dropdownOpen.update(v => !v);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
    if (this.isBrowser) {
      if (this.mobileMenuOpen()) {
        this.renderer.addClass(this.document.body, 'no-scroll');
      } else {
        this.renderer.removeClass(this.document.body, 'no-scroll');
      }
    }
  }

  irA(ruta: string) {
    this.dropdownOpen.set(false);
    this.mobileMenuOpen.set(false);
    if (this.isBrowser) {
      this.renderer.removeClass(this.document.body, 'no-scroll');
    }
    this.router.navigate([`/${ruta}`]);
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  logout() {
    this.authService.logout();
    this.dropdownOpen.set(false);
    this.router.navigate(['/', ROUTES.BIENVENIDA]);
  }

  toggleThemeAndClose() {
    this.toggleTheme();
    this.dropdownOpen.set(false);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logoutAndCloseMenu() {
    this.logout();
    this.toggleMobileMenu();
  }
}