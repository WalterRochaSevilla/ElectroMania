import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleProductoComponent } from './detalle-producto.component';
import { COMMON_TEST_PROVIDERS } from '../../../testing/test-providers';
describe('DetalleProductoComponent', () => {
    let component: DetalleProductoComponent;
    let fixture: ComponentFixture<DetalleProductoComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DetalleProductoComponent],
            providers: [...COMMON_TEST_PROVIDERS]
        })
            .compileComponents();
        fixture = TestBed.createComponent(DetalleProductoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});