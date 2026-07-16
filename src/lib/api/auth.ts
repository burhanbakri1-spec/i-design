import { apiFetch } from './client';
import type { AuthUser, LoginPayload, LoginResponse, RefreshResponse } from '@/lib/auth/types';

export function login(payload: LoginPayload) {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
    cache: 'no-store',
  });
}

export function refresh(refreshToken: string) {
  return apiFetch<RefreshResponse>('/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
    cache: 'no-store',
  });
}

export function getProfile(accessToken: string) {
  return apiFetch<AuthUser>('/auth/profile', {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
}

export function logout(accessToken: string) {
  return apiFetch<{ loggedOut: boolean }>('/auth/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
}
