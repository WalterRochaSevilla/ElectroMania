import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BienvenidaComponent } from './bienvenida.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { vi } from 'vitest';
import { COMMON_TEST_PROVIDERS } from '../../../testing/test-providers';
import { ProductosService } from '../../services/productos.service';
describe('BienvenidaComponent', () => {
    let component: BienvenidaComponent;
    let fixture: ComponentFixture<BienvenidaComponent>;
    let routerSpy: Pick<Router, 'navigate'>;
    const mockCards = Array.from({ length: 12 }, (_, index) => ({
        product_id: index + 1,
        product_name: `Producto ${index + 1}`,
        description: 'Descripción',
        price: 100,
        stock: 10,
        images: [],
        isOffer: false
    }));
    beforeEach(async () => {
        routerSpy = {
            navigate: vi.fn()
        };
        await TestBed.configureTestingModule({
            imports: [BienvenidaComponent, CommonModule],
            providers: [
                ...COMMON_TEST_PROVIDERS,
                { provide: Router, useValue: routerSpy },
                {
                    provide: ProductosService,
                    useValue: {
                        getAllProducts: vi.fn().mockResolvedValue([]),
                        toProductCards: vi.fn().mockReturnValue(mockCards)
                    }
                }
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
        expect(component.ofertasAbiertas()).toBe(true);
    });
    it('debe alternar el estado de ofertas', () => {
        component.toggleOfertas();
        expect(component.ofertasAbiertas()).toBe(false);
        component.toggleOfertas();
        expect(component.ofertasAbiertas()).toBe(true);
    });
    it('debe tener 6 productos destacados', () => {
        component.productosDestacados.set(mockCards.slice(0, 6));
        expect(component.productosDestacados().length).toBe(6);
    });
    it('debe tener 6 productos en oferta', () => {
        component.productosOferta.set(mockCards.slice(6, 12));
        expect(component.productosOferta().length).toBe(6);
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