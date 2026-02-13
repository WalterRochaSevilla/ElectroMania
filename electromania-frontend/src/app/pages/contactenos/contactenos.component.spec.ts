import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactenosComponent } from './contactenos.component';
import { vi } from 'vitest';
import { COMMON_TEST_PROVIDERS } from '../../../testing/test-providers';
import { TranslateService } from '@ngx-translate/core';
describe('ContactenosComponent', () => {
    let component: ContactenosComponent;
    let fixture: ComponentFixture<ContactenosComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ContactenosComponent],
            providers: [...COMMON_TEST_PROVIDERS]
        }).compileComponents();
        fixture = TestBed.createComponent(ContactenosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should have correct initial values', () => {
        expect(component.nombre).toBe('Ramiro Nogales');
        expect(component.telefono).toBe('77436609');
        expect(component.localidad).toBe('COCHABAMBA - BOLIVIA');
    });
    it('should open WhatsApp with correct number', () => {
        const translate = TestBed.inject(TranslateService);
        vi.spyOn(translate, 'instant').mockReturnValue('Hola, necesito ayuda con mi pedido');
        const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
        component.openWhatsApp();
        const expectedMessage = encodeURIComponent('Hola, necesito ayuda con mi pedido');
        expect(openSpy).toHaveBeenCalledWith(`https://wa.me/+59177436609?text=${expectedMessage}`, '_blank', 'noopener,noreferrer');
        openSpy.mockRestore();
    });
});