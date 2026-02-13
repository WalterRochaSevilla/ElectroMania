import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { COMMON_TEST_PROVIDERS } from '../../../testing/test-providers';
describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HomeComponent],
            providers: [...COMMON_TEST_PROVIDERS]
        })
            .compileComponents();
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});