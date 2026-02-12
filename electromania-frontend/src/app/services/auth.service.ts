import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest, LoginResponse, DecodedToken, RegisterUserRequest, UserInfo } from '../models';
import { API, ROLES, isAdminRole, STORAGE_KEYS } from '../constants';
import { StorageService } from './storage.service';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly storageService = inject(StorageService);
    private readonly _authState = signal<boolean>(false);
    readonly isAuthenticated$ = this._authState.asReadonly();
    readonly currentUser = computed<UserInfo | null>(() => {
        if (!this._authState())
            return null;
        return this.getUserInfo();
    });
    constructor() {
        this._authState.set(this.checkAuthState());
    }
    async registerUser(data: RegisterUserRequest): Promise<void> {
        await firstValueFrom(this.http.post(API.AUTH.REGISTER, data));
    }
    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await firstValueFrom(this.http.post<LoginResponse>(API.AUTH.LOGIN, data));
        if (response?.access_token) {
            this.storageService.setSessionItem(STORAGE_KEYS.TOKEN, response.access_token);
            this.storageService.removeLocalItem(STORAGE_KEYS.TOKEN);
            this._authState.set(true);
        }
        return response;
    }
    getRole(): string {
        const token = this.getToken();
        if (!token)
            return ROLES.GUEST;
        try {
            const decoded = jwtDecode<DecodedToken>(token);
            return decoded.user?.role || decoded.role || (decoded.roles && decoded.roles[0]) || ROLES.CLIENTE;
        }
        catch {
            return ROLES.GUEST;
        }
    }
    isAdmin(): boolean {
        const role = this.getRole();
        return isAdminRole(role);
    }
    logout(): void {
        this.clearAuthToken();
        this._authState.set(false);
    }
    getToken(): string | null {
        const sessionToken = this.storageService.getSessionItem(STORAGE_KEYS.TOKEN);
        if (sessionToken) {
            return sessionToken;
        }
        const legacyLocalToken = this.storageService.getLocalItem(STORAGE_KEYS.TOKEN);
        if (!legacyLocalToken) {
            return null;
        }
        this.storageService.setSessionItem(STORAGE_KEYS.TOKEN, legacyLocalToken);
        this.storageService.removeLocalItem(STORAGE_KEYS.TOKEN);
        return legacyLocalToken;
    }
    isAuthenticated(): boolean {
        return !!this.getToken() && !this.isTokenExpired();
    }
    isTokenExpired(): boolean {
        const token = this.getToken();
        if (!token)
            return true;
        try {
            const decoded = jwtDecode<DecodedToken>(token);
            if (!decoded.exp)
                return false;
            const expirationDate = decoded.exp * 1000;
            return Date.now() >= expirationDate;
        }
        catch {
            return true;
        }
    }
    getUserInfo(): UserInfo | null {
        const token = this.getToken();
        if (!token || this.isTokenExpired())
            return null;
        try {
            const decoded = jwtDecode<DecodedToken>(token);
            return {
                id: decoded.user?.uuid || decoded.sub || null,
                email: decoded.user?.email || decoded.email || null,
                nombre: decoded.nombre ?? null,
                role: decoded.user?.role || decoded.role || (decoded.roles && decoded.roles[0]) || ROLES.CLIENTE
            };
        }
        catch {
            return null;
        }
    }
    private checkAuthState(): boolean {
        const isValid = !!this.getToken() && !this.isTokenExpired();
        if (!isValid) {
            this.clearAuthToken();
        }
        return isValid;
    }
    private clearAuthToken(): void {
        this.storageService.removeSessionItem(STORAGE_KEYS.TOKEN);
        this.storageService.removeLocalItem(STORAGE_KEYS.TOKEN);
    }
}