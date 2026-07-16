import type { ApiErrorBody, ApiResponse } from './types';

type QueryValue = string | number | boolean | null | undefined;

export interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  query?: object;
  body?: object;
  timeoutMs?: number;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details?: ApiErrorBody,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getApiBaseUrl() {
  const value = process.env.NEXT_PUBLIC_API_URL;
  if (!value) {
    throw new Error('NEXT_PUBLIC_API_URL is required');
  }
  return value.replace(/\/$/, '');
}

function isQueryValue(value: unknown): value is QueryValue {
  return ['string', 'number', 'boolean'].includes(typeof value) || value === null || value === undefined;
}

function appendQuery(url: URL, query?: ApiFetchOptions['query']) {
  if (!query) return;

  for (const [key, rawValue] of Object.entries(query)) {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];
    for (const value of values) {
      if (!isQueryValue(value)) continue;
      if (value === null || value === undefined || value === '') continue;
      url.searchParams.append(key, String(value));
    }
  }
}

function getErrorMessage(body: ApiErrorBody | null, fallback: string) {
  if (!body?.message) return fallback;
  return Array.isArray(body.message) ? body.message.join(', ') : body.message;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { query, body, timeoutMs = 10000, headers, ...fetchOptions } = options;
  const url = new URL(`${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`);
  appendQuery(url, query);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const payload = (await response.json().catch(() => null)) as ApiResponse<T> | ApiErrorBody | null;

    if (!response.ok) {
      const errorBody = payload as ApiErrorBody | null;
      throw new ApiError(getErrorMessage(errorBody, response.statusText), response.status, errorBody ?? undefined);
    }

    if (!payload || typeof payload !== 'object' || !('data' in payload)) {
      throw new ApiError('Unexpected API response shape', response.status);
    }

    return (payload as ApiResponse<T>).data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('API request timed out', 408);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
