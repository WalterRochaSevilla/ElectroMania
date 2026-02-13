import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { User, RegisterUserRequest } from '../models';
import { API } from '../constants';
import { SKIP_GLOBAL_ERROR_TOAST } from '../interceptors/error.interceptor';
@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly http = inject(HttpClient);
    private usersCache: User[] | null = null;
    private usersCacheAt = 0;
    private usersInFlight: Promise<User[]> | null = null;
    private readonly usersTtlMs = 60_000;
    async getAllUsers(options?: { suppressErrorToast?: boolean; forceRefresh?: boolean; }): Promise<User[]> {
        const forceRefresh = options?.forceRefresh ?? false;
        const now = Date.now();
        if (!forceRefresh && this.usersCache && now - this.usersCacheAt < this.usersTtlMs) {
            return [...this.usersCache];
        }
        if (!forceRefresh && this.usersInFlight) {
            return this.usersInFlight;
        }
        const context = options?.suppressErrorToast
            ? new HttpContext().set(SKIP_GLOBAL_ERROR_TOAST, true)
            : undefined;
        const request = firstValueFrom(this.http.get<User[]>(API.USERS.ALL, { context }))
            .then(users => {
            this.usersCache = users;
            this.usersCacheAt = Date.now();
            return [...users];
        })
            .finally(() => {
            this.usersInFlight = null;
        });
        this.usersInFlight = request;
        return request;
    }
    async getCurrentUser(): Promise<User> {
        return firstValueFrom(this.http.get<User>(API.USERS.GET));
    }
    async createUser(data: RegisterUserRequest): Promise<User> {
        const created = await firstValueFrom(this.http.post<User>(API.AUTH.REGISTER, data));
        this.invalidateUsersCache();
        return created;
    }
    invalidateUsersCache(): void {
        this.usersCache = null;
        this.usersCacheAt = 0;
    }
}