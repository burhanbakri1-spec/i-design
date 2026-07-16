import { cookies } from 'next/headers';

export const ADMIN_ACCESS_COOKIE = 'idesign_admin_access';
export const ADMIN_REFRESH_COOKIE = 'idesign_admin_refresh';

const cookiePath = '/';

export async function setAdminSession(accessToken: string, refreshToken: string) {
  const store = await cookies();
  const secure = process.env.NODE_ENV === 'production';

  store.set(ADMIN_ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: cookiePath,
    maxAge: 60 * 15,
  });

  store.set(ADMIN_REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: cookiePath,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(ADMIN_ACCESS_COOKIE);
  store.delete(ADMIN_REFRESH_COOKIE);
}

export async function getAdminTokens() {
  const store = await cookies();
  return {
    accessToken: store.get(ADMIN_ACCESS_COOKIE)?.value ?? null,
    refreshToken: store.get(ADMIN_REFRESH_COOKIE)?.value ?? null,
  };
}
