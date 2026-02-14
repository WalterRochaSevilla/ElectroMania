export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse {
    access_token: string;
}

export interface LoginUserResponse{
  uuid: string;
  email: string;
  nit_ci: string;
  social_reason: string;
  role: string;
}

export interface DecodedToken {
    user?: {
        uuid?: string;
        email?: string;
        role?: string;
    };
    role?: string;
    roles?: string[];
    sub?: string;
    email?: string;
    nombre?: string;
    exp?: number;
    iat?: number;
    [key: string]: unknown;
}
export interface UserInfo {
    id: string | null;
    email: string | null;
    nombre: string | null;
    role: string;
}