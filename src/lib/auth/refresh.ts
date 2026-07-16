import { apiFetch } from '@/lib/api/client';
import type { RefreshResponse } from './types';

export function refreshAdminSession(refreshToken: string) {
  return apiFetch<RefreshResponse>('/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
    cache: 'no-store',
  });
}
