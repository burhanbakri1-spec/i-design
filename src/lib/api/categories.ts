import { apiFetch } from './client';
import type { Category, CategoryTreeItem } from './types';

export function getCategories() {
  return apiFetch<Category[]>('/categories', {
    next: { revalidate: 300, tags: ['categories'] },
  });
}

export function getCategoryTree() {
  return apiFetch<CategoryTreeItem[]>('/categories/tree', {
    next: { revalidate: 300, tags: ['categories'] },
  });
}
