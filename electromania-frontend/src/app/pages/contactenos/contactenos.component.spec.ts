import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactenosComponent } from './contactenos.component';
describe('ContactenosComponent', () => {
    let component: ContactenosComponent;
    let fixture: ComponentFixture<ContactenosComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ContactenosComponent]
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
        spyOn(window, 'open');
        component.openWhatsApp();
        expect(window.open).toHaveBeenCalledWith('https://wa.me/+59177436609?text=Hola,%20me%20interesa%20más%20información%20sobre%20sus%20servicios', '_blank');
    });
});