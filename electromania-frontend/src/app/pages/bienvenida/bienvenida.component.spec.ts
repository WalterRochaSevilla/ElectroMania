import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BienvenidaComponent } from './bienvenida.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
describe('BienvenidaComponent', () => {
    let component: BienvenidaComponent;
    let fixture: ComponentFixture<BienvenidaComponent>;
    let routerSpy: jasmine.SpyObj<Router>;
    beforeEach(async () => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        await TestBed.configureTestingModule({
            imports: [BienvenidaComponent, CommonModule],
            providers: [
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(BienvenidaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('debe crear el componente', () => {
        expect(component).toBeTruthy();
    });
    it('debe inicializar con ofertas cerradas', () => {
        expect(component.ofertasAbiertas).toBeFalse();
    });
    it('debe alternar el estado de ofertas', () => {
        component.toggleOfertas();
        expect(component.ofertasAbiertas).toBeTrue();
        component.toggleOfertas();
        expect(component.ofertasAbiertas).toBeFalse();
    });
    it('debe tener 6 productos destacados', () => {
        expect(component.productosDestacados.length).toBe(6);
    });
    it('debe tener 6 productos en oferta', () => {
        expect(component.productosOferta.length).toBe(6);
    });
    it('debe navegar a tienda al hacer click en explorar', () => {
        component.irATienda();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    });
    it('debe manejar imágenes por defecto', () => {
        const mockEvent = new Event('error');
        const mockImg = document.createElement('img');
        Object.defineProperty(mockEvent, 'target', { value: mockImg });
        expect(() => {
            component.setDefaultImage(mockEvent);
        }).not.toThrow();
    });
    it('debe calcular correctamente el precio con descuento', () => {
        const productoConDescuento = {
            product_id: 1,
            product_name: 'Test',
            price: 100,
            description: '',
            stock: 10,
            images: [],
            isOffer: true
        };
        const precio = component.getPrecioConDescuento(productoConDescuento);
        expect(precio).toBe(85);
    });
});