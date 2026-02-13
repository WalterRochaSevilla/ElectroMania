import { TestBed } from '@angular/core/testing';
import { ProductosService } from './productos.service';
import { COMMON_TEST_PROVIDERS } from '../../testing/test-providers';
describe('ProductosService', () => {
    let service: ProductosService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [...COMMON_TEST_PROVIDERS]
        });
        service = TestBed.inject(ProductosService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});