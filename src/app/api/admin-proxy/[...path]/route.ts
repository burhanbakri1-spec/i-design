import { NextRequest, NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api/client';
import { refreshAdminSession } from '@/lib/auth/refresh';
import { clearAdminSession, getAdminTokens, setAdminSession } from '@/lib/auth/session';

type Context = {
  params: Promise<{ path: string[] }>;
};

async function proxy(request: NextRequest, context: Context, hasRetried = false): Promise<NextResponse> {
  const { path } = await context.params;
  const { accessToken, refreshToken } = await getAdminTokens();

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  let token = accessToken;
  if (!token && refreshToken && !hasRetried) {
    try {
      const refreshed = await refreshAdminSession(refreshToken);
      await setAdminSession(refreshed.accessToken, refreshed.refreshToken);
      token = refreshed.accessToken;
    } catch {
      await clearAdminSession();
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
  }

  const url = new URL(`${getApiBaseUrl()}/${path.join('/')}`);
  url.search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  headers.set('Authorization', `Bearer ${token}`);
  headers.delete('cookie');
  headers.delete('host');

  const response = await fetch(url, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.arrayBuffer(),
    cache: 'no-store',
  });

  if (response.status === 401 && refreshToken && !hasRetried) {
    try {
      const refreshed = await refreshAdminSession(refreshToken);
      await setAdminSession(refreshed.accessToken, refreshed.refreshToken);
      return proxy(request, context, true);
    } catch {
      await clearAdminSession();
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
  }

  const body = await response.arrayBuffer();
  return new NextResponse(body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
    },
  });
}

export function GET(request: NextRequest, context: Context) {
  return proxy(request, context);
}

export function POST(request: NextRequest, context: Context) {
  return proxy(request, context);
}

export function PATCH(request: NextRequest, context: Context) {
  return proxy(request, context);
}

export function DELETE(request: NextRequest, context: Context) {
  return proxy(request, context);
}
