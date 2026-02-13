import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariosAdminComponent } from './usuarios-admin.component';
import { COMMON_TEST_PROVIDERS } from '../../../../testing/test-providers';
describe('UsuariosAdminComponent', () => {
    let component: UsuariosAdminComponent;
    let fixture: ComponentFixture<UsuariosAdminComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UsuariosAdminComponent],
            providers: [...COMMON_TEST_PROVIDERS]
        })
            .compileComponents();
        fixture = TestBed.createComponent(UsuariosAdminComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});