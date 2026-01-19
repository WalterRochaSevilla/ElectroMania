import { Injectable, signal, computed } from '@angular/core';

const STORAGE_KEY = 'theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkSignal = signal(true);

  readonly isDark = this.isDarkSignal.asReadonly();
  readonly theme = computed(() => this.isDarkSignal() ? 'dark' : 'light');

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    if (typeof window === 'undefined') return;

    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      this.isDarkSignal.set(savedTheme === 'dark');
    } else {
      this.isDarkSignal.set(prefersDark);
    }

    this.applyTheme();
  }

  toggle(): void {
    this.isDarkSignal.update(v => !v);
    this.applyTheme();
  }

  private applyTheme(): void {
    if (typeof document === 'undefined') return;

    const theme = this.theme();
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#050a10' : '#f0f8ff');
    }
  }
}
