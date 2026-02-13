import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductosComponent } from './productos.component';
import { COMMON_TEST_PROVIDERS } from '../../../testing/test-providers';
describe('ProductosComponent', () => {
    let component: ProductosComponent;
    let fixture: ComponentFixture<ProductosComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProductosComponent],
            providers: [...COMMON_TEST_PROVIDERS]
        })
            .compileComponents();
        fixture = TestBed.createComponent(ProductosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});