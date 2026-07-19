import { projects as localProjects, type Project } from '@/data/projects';
import { ApiError, apiFetch } from './client';
import type { PaginatedData, ProjectDetails, ProjectListItem } from './types';

export type ApiBackedProject = Project & {
  apiDetails?: ProjectDetails;
};

export interface ProjectQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  country?: string;
  city?: string;
  year?: number;
  status?: string;
  featured?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const categoryMap: Record<string, Project['category']> = {
  architecture: 'ARCHITECTURE',
  interior: 'INTERIORS',
  interiors: 'INTERIORS',
  landscape: 'LANDSCAPE',
  planning: 'PLANNING',
  'product-design': 'PRODUCTS',
  products: 'PRODUCTS',
};

function normalizeCategory(item: ProjectListItem): Project['category'] {
  const firstCategory = item.categories?.[0]?.slug ?? item.categories?.[0]?.name ?? '';
  return categoryMap[firstCategory.toLowerCase()] ?? 'ARCHITECTURE';
}

function normalizeLocation(item: ProjectListItem) {
  return [item.city, item.country].filter(Boolean).join(', ').toUpperCase();
}

export function toLocalProject(item: ProjectListItem | ProjectDetails): Project {
  const gallery = 'gallery' in item && item.gallery ? item.gallery : [];
  const images = [
    ...(item.coverImage ? [item.coverImage] : []),
    ...((item.media ?? gallery).map((media) => media.url).filter(Boolean)),
  ];

  return {
    id: item.slug,
    title: item.title,
    category: normalizeCategory(item),
    subCategory: item.categories?.[0]?.name ?? '',
    location: normalizeLocation(item),
    year: item.year ? String(item.year) : '',
    description: item.shortDescription ?? item.description ?? '',
    image: item.coverImage ?? images[0] ?? '',
    images,
    color: '#e0e0e0',
  };
}

function logFallback(scope: string, error: unknown) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[api fallback] ${scope}`, error);
  }
}

export async function getProjects(query: ProjectQuery = {}, fallbackProjects: Project[] = []) {
  try {
    const result = await apiFetch<PaginatedData<ProjectListItem>>('/projects', {
      query,
      next: { revalidate: 60, tags: ['projects'] },
    });
    const mapped = result.data.map(toLocalProject);
    return mapped.length > 0 ? mapped : fallbackProjects;
  } catch (error) {
    logFallback('projects', error);
    if (fallbackProjects.length > 0) return fallbackProjects;
    throw error;
  }
}

export async function getFeaturedProjects(fallbackProjects: Project[] = []) {
  try {
    const result = await apiFetch<ProjectListItem[]>('/projects/featured', {
      next: { revalidate: 60, tags: ['projects'] },
    });
    const mapped = result.map(toLocalProject);
    return mapped.length > 0 ? mapped : fallbackProjects;
  } catch (error) {
    logFallback('featured projects', error);
    if (fallbackProjects.length > 0) return fallbackProjects;
    throw error;
  }
}

export async function getProjectBySlug(slug: string) {
  const localProject = localProjects.find((project) => project.id === slug) ?? null;

  try {
    const result = await apiFetch<ProjectDetails>(`/projects/${slug}`, {
      next: { revalidate: 60, tags: ['projects', `project:${slug}`] },
    });
    return { ...toLocalProject(result), apiDetails: result } satisfies ApiBackedProject;
  } catch (error) {
    logFallback(`project:${slug}`, error);
    if (localProject) return localProject satisfies ApiBackedProject;
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
