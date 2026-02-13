import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroComponent } from './registro.component';
import { COMMON_TEST_PROVIDERS } from '../../../testing/test-providers';
describe('RegistroComponent', () => {
    let component: RegistroComponent;
    let fixture: ComponentFixture<RegistroComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RegistroComponent],
            providers: [...COMMON_TEST_PROVIDERS]
        })
            .compileComponents();
        fixture = TestBed.createComponent(RegistroComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});