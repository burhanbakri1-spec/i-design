import { NextResponse } from 'next/server';
import { getProfile } from '@/lib/api/auth';
import { refreshAdminSession } from '@/lib/auth/refresh';
import { clearAdminSession, getAdminTokens, setAdminSession } from '@/lib/auth/session';

export async function GET() {
  const { accessToken, refreshToken } = await getAdminTokens();

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ success: true, data: { authenticated: false, user: null } });
  }

  if (accessToken) {
    try {
      const user = await getProfile(accessToken);
      return NextResponse.json({ success: true, data: { authenticated: true, user } });
    } catch {
      // Try refresh below.
    }
  }

  if (!refreshToken) {
    await clearAdminSession();
    return NextResponse.json({ success: true, data: { authenticated: false, user: null } });
  }

  try {
    const refreshed = await refreshAdminSession(refreshToken);
    await setAdminSession(refreshed.accessToken, refreshed.refreshToken);
    return NextResponse.json({ success: true, data: { authenticated: true, user: refreshed.user } });
  } catch {
    await clearAdminSession();
    return NextResponse.json({ success: true, data: { authenticated: false, user: null } });
  }
}
