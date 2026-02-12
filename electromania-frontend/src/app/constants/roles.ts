export const ROLES = {
    ADMIN: 'admin',
    ADMINISTRADOR: 'administrador',
    CLIENTE: 'cliente',
    USER: 'user',
    GUEST: 'guest',
} as const;
export type UserRole = typeof ROLES[keyof typeof ROLES];
export function isAdminRole(role: string): boolean {
    const normalizedRole = role.toLowerCase();
    return normalizedRole === ROLES.ADMIN || normalizedRole === ROLES.ADMINISTRADOR;
}