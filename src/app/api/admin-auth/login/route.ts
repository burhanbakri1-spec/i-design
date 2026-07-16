import { NextResponse } from 'next/server';
import { login } from '@/lib/api/auth';
import { setAdminSession } from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const data = await login({ email: body.email ?? '', password: body.password ?? '' });
    await setAdminSession(data.accessToken, data.refreshToken);

    return NextResponse.json({
      success: true,
      data: { user: data.user },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid email or password' },
      { status: 401 },
    );
  }
}
