import { apiFetch } from './client';
import type { PaginatedData, Partner } from './types';

export function getPartners() {
  return apiFetch<PaginatedData<Partner>>('/partners', {
    next: { revalidate: 300, tags: ['partners'] },
  });
}

export function getPartnerBySlug(slug: string) {
  return apiFetch<Partner>(`/partners/${slug}`, {
    next: { revalidate: 300, tags: ['partners', `partner:${slug}`] },
  });
}
