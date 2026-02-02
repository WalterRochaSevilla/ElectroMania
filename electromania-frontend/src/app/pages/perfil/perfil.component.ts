import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { isAdminRole } from '../../constants/roles';

interface UserProfile {
    uuid: string;
    name: string;
    email: string;
    nit_ci: string;
    social_reason: string;
    role: string;
}

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './perfil.component.html',
    styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
    private userService = inject(UserService);
    private translate = inject(TranslateService);
    private cdr = inject(ChangeDetectorRef);

    user: UserProfile | null = null;
    loading = true;
    isAdminRole = isAdminRole;

    async ngOnInit() {
        await this.loadProfile();
    }

    async loadProfile() {
        this.loading = true;
        this.cdr.markForCheck();
        try {
            this.user = await this.userService.getCurrentUser();
        } catch {
            console.error('Error loading profile');
        } finally {
            this.loading = false;
            this.cdr.markForCheck();
        }
    }

    getRoleLabel(role: string): string {
        return isAdminRole(role)
            ? this.translate.instant('PROFILE.ADMIN')
            : this.translate.instant('PROFILE.CLIENT');
    }
}
