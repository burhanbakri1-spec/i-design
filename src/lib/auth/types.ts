export type UserRole = 'ADMIN' | 'EDITOR';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  tokenVersion?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse extends LoginResponse {}

export interface SessionState {
  authenticated: boolean;
  user: AuthUser | null;
}
