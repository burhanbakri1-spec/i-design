import { apiFetch } from './client';
import type { SearchResults } from './types';

export interface SearchQuery {
  q: string;
  types?: string[];
  limit?: number;
  signal?: AbortSignal;
}

export function searchSite({ q, types, limit = 5, signal }: SearchQuery) {
  if (q.trim().length < 2) {
    return Promise.resolve<SearchResults>({
      query: q,
      projects: [],
      news: [],
      people: [],
      offices: [],
      partners: [],
      totals: { projects: 0, news: 0, people: 0, offices: 0, partners: 0 },
    });
  }

  return apiFetch<SearchResults>('/search', {
    query: {
      q: q.trim(),
      types: types?.join(','),
      limit,
    },
    signal,
    cache: 'no-store',
  });
}
