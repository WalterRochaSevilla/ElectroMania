export type UserRole = 'admin' | 'user';
export type UserState = 'ACTIVE' | 'INACTIVE';

export interface User {
  uuid: string;
  name: string;
  email: string;
  nit_ci: string;
  social_reason: string;
  role: UserRole;
  phone: string;
}

export interface UserDisplay {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  nitCi: string;
  estado: string;
}

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  nit_ci: string;
  social_reason: string;
  phone: string;
}
