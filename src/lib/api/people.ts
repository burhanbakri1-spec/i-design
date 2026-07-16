import { apiFetch } from './client';
import type { PaginatedData, Person, PersonDetails } from './types';

export function getPeople() {
  return apiFetch<PaginatedData<Person>>('/people', {
    next: { revalidate: 300, tags: ['people'] },
  });
}

export function getPersonBySlug(slug: string) {
  return apiFetch<PersonDetails>(`/people/${slug}`, {
    next: { revalidate: 300, tags: ['people', `person:${slug}`] },
  });
}
