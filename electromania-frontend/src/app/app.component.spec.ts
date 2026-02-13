import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { COMMON_TEST_PROVIDERS } from '../testing/test-providers';
import { vi } from 'vitest';
describe('AppComponent', () => {
    beforeEach(async () => {
        vi.stubGlobal('matchMedia', vi.fn().mockImplementation(() => ({
            matches: false,
            media: '',
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })));
        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [...COMMON_TEST_PROVIDERS],
        }).compileComponents();
    });
    it('debe crear la aplicación', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
    it('debe tener el modo oscuro activo por defecto', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app.isDarkMode()).toBe(true);
    });
    it('debe renderizar el nombre de la marca en el navbar', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.brand-name')?.textContent).toContain('ElectroMania');
    });
});