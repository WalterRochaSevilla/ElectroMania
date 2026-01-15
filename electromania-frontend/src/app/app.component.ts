import { Component, OnInit, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isDarkMode = true;
  isScrolled = false;
  dropdownOpen = false;

  constructor(private router: Router, private renderer: Renderer2) {}

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
    // Verificar tema del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      this.isDarkMode = prefersDark;
    }
    
    this.applyTheme(this.isDarkMode ? 'dark' : 'light');
    
    // Añadir clase inicial para animaciones
    this.renderer.addClass(document.body, 'loaded');
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    this.applyTheme(theme);
    
    // Efecto de transición suave
    this.renderer.addClass(document.body, 'theme-transition');
    setTimeout(() => {
      this.renderer.removeClass(document.body, 'theme-transition');
    }, 500);
  }

  private applyTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Actualizar meta tag para theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#050a10' : '#f0f8ff');
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  irA(ruta: string) {
    this.dropdownOpen = false;
    this.router.navigate([`/${ruta}`]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}