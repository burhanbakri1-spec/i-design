import { NextResponse } from 'next/server';
import { refresh } from '@/lib/api/auth';
import { clearAdminSession, getAdminTokens, setAdminSession } from '@/lib/auth/session';

export async function POST() {
  const { refreshToken } = await getAdminTokens();

  if (!refreshToken) {
    await clearAdminSession();
    return NextResponse.json({ success: false, message: 'Session expired' }, { status: 401 });
  }

  try {
    const data = await refresh(refreshToken);
    await setAdminSession(data.accessToken, data.refreshToken);
    return NextResponse.json({ success: true, data: { user: data.user } });
  } catch {
    await clearAdminSession();
    return NextResponse.json({ success: false, message: 'Session expired' }, { status: 401 });
  }
}
