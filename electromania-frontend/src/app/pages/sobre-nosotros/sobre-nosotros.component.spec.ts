import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SobreNosotrosComponent } from './sobre-nosotros.component';
import { COMMON_TEST_PROVIDERS } from '../../../testing/test-providers';
describe('SobreNosotrosComponent', () => {
    let component: SobreNosotrosComponent;
    let fixture: ComponentFixture<SobreNosotrosComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SobreNosotrosComponent],
            providers: [...COMMON_TEST_PROVIDERS]
        }).compileComponents();
        fixture = TestBed.createComponent(SobreNosotrosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});