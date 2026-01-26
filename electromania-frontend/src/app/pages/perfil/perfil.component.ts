import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

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
    imports: [CommonModule],
    templateUrl: './perfil.component.html',
    styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
    private userService = inject(UserService);

    user: UserProfile | null = null;
    loading = true;

    async ngOnInit() {
        await this.loadProfile();
    }

    async loadProfile() {
        this.loading = true;
        try {
            this.user = await this.userService.getCurrentUser();
        } catch {
            console.error('Error loading profile');
        } finally {
            this.loading = false;
        }
    }

    getRoleLabel(role: string): string {
        return role === 'ADMIN' ? 'Administrador' : 'Cliente';
    }
}
