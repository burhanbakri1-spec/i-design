import { apiFetch } from './client';
import type { ContactFormPayload } from './types';

export function submitContact(payload: ContactFormPayload) {
  return apiFetch<{ id: string; status: string; createdAt: string }>('/contact', {
    method: 'POST',
    body: payload,
    cache: 'no-store',
  });
}
