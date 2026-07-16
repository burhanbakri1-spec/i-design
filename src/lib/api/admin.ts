'use client';

import type { ApiErrorBody } from './types';

type QueryValue = string | number | boolean | null | undefined;

interface AdminApiOptions extends Omit<RequestInit, 'body'> {
  query?: Record<string, QueryValue | QueryValue[]>;
  body?: object | FormData;
  retry?: boolean;
}

export class AdminApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details?: ApiErrorBody,
  ) {
    super(message);
    this.name = 'AdminApiError';
  }
}

let refreshPromise: Promise<boolean> | null = null;

function appendQuery(url: URL, query?: AdminApiOptions['query']) {
  if (!query) return;
  for (const [key, rawValue] of Object.entries(query)) {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];
    for (const value of values) {
      if (value === null || value === undefined || value === '') continue;
      url.searchParams.append(key, String(value));
    }
  }
}

function getMessage(payload: ApiErrorBody | null, fallback: string) {
  if (!payload?.message) return fallback;
  return Array.isArray(payload.message) ? payload.message.join(', ') : payload.message;
}

async function refreshOnce() {
  if (!refreshPromise) {
    refreshPromise = fetch('/api/admin-auth/refresh', { method: 'POST' })
      .then((response) => response.ok)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function adminApiFetch<T>(path: string, options: AdminApiOptions = {}): Promise<T> {
  const { query, body, retry = true, headers, ...fetchOptions } = options;
  const url = new URL(`/api/admin-proxy/${path.replace(/^\/+/, '')}`, window.location.origin);
  appendQuery(url, query);

  const isFormData = body instanceof FormData;
  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      ...(body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  if (response.status === 401 && retry) {
    const refreshed = await refreshOnce();
    if (refreshed) {
      return adminApiFetch<T>(path, { ...options, retry: false });
    }
    window.location.href = '/admin/login';
  }

  const payload = (await response.json().catch(() => null)) as { data?: T } | ApiErrorBody | null;

  if (!response.ok) {
    throw new AdminApiError(getMessage(payload as ApiErrorBody | null, response.statusText), response.status, payload as ApiErrorBody);
  }

  if (!payload || typeof payload !== 'object' || !('data' in payload)) {
    throw new AdminApiError('Unexpected API response', response.status);
  }

  return (payload as { data: T }).data;
}

export function getAdminErrorMessage(error: unknown) {
  if (error instanceof AdminApiError) {
    if (error.status === 400) return error.message || 'Please check the submitted fields.';
    if (error.status === 401) return 'Your session has expired. Please sign in again.';
    if (error.status === 403) return 'You do not have permission to perform this action.';
    if (error.status === 404) return 'The requested record was not found.';
    if (error.status === 409) return error.message || 'This record conflicts with existing data.';
    if (error.status === 413) return 'The selected file is too large.';
    if (error.status === 429) return 'Too many requests. Please try again later.';
    if (error.status === 503) return 'The backend service is currently unavailable.';
    return error.message || 'Something went wrong.';
  }

  return error instanceof Error ? error.message : 'Something went wrong.';
}
