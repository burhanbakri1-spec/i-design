import { apiFetch } from './client';
import type { NewsDetails, NewsItem, PaginatedData } from './types';

export interface NewsQuery {
  page?: number;
  limit?: number;
  search?: string;
  year?: number;
  featured?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function getNews(query: NewsQuery = {}) {
  return apiFetch<PaginatedData<NewsItem>>('/news', {
    query,
    next: { revalidate: 60, tags: ['news'] },
  });
}

export function getFeaturedNews() {
  return apiFetch<NewsItem[]>('/news/featured', {
    next: { revalidate: 60, tags: ['news'] },
  });
}

export function getNewsBySlug(slug: string) {
  return apiFetch<NewsDetails>(`/news/${slug}`, {
    next: { revalidate: 60, tags: ['news', `news:${slug}`] },
  });
}
