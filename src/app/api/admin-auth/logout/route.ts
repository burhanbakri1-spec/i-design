import { NextResponse } from 'next/server';
import { logout } from '@/lib/api/auth';
import { clearAdminSession, getAdminTokens } from '@/lib/auth/session';

export async function POST() {
  const { accessToken } = await getAdminTokens();

  if (accessToken) {
    await logout(accessToken).catch(() => undefined);
  }

  await clearAdminSession();
  return NextResponse.json({ success: true, data: { loggedOut: true } });
}
