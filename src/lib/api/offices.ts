import { apiFetch } from './client';
import type { Office, OfficeDetails, PaginatedData } from './types';

export function getOffices() {
  return apiFetch<PaginatedData<Office>>('/offices', {
    next: { revalidate: 300, tags: ['offices'] },
  });
}

export function getOfficeBySlug(slug: string) {
  return apiFetch<OfficeDetails>(`/offices/${slug}`, {
    next: { revalidate: 300, tags: ['offices', `office:${slug}`] },
  });
}
