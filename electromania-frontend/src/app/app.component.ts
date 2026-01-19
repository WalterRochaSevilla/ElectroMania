import { Component, HostListener, Renderer2, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { ToastComponent } from './components/toast/toast.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    ToastComponent,
    ConfirmationModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private renderer = inject(Renderer2);
  private themeService = inject(ThemeService);

  readonly isDarkMode = this.themeService.isDark;

  isScrolled = false;
  dropdownOpen = false;
  mobileMenuOpen = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 100;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.dropdownOpen = false;
    }
  }

  ngOnInit() {
    this.renderer.addClass(document.body, 'loaded');
  }

  toggleTheme() {
    this.themeService.toggle();

    this.renderer.addClass(document.body, 'theme-transition');
    setTimeout(() => {
      this.renderer.removeClass(document.body, 'theme-transition');
    }, 500);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) {
      this.renderer.addClass(document.body, 'no-scroll');
    } else {
      this.renderer.removeClass(document.body, 'no-scroll');
    }
  }

  irA(ruta: string) {
    this.dropdownOpen = false;
    this.mobileMenuOpen = false;
    this.renderer.removeClass(document.body, 'no-scroll');
    this.router.navigate([`/${ruta}`]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}