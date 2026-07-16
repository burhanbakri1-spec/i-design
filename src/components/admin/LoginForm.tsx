'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    const response = await fetch('/api/admin-auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!response.ok) {
      setError('Invalid email or password.');
      return;
    }

    router.replace(searchParams.get('next') || '/admin');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f4] px-4">
      <form onSubmit={submit} className="w-full max-w-md border border-black/10 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.24em] text-black/40">i DESIGN Admin</p>
        <h1 className="mt-3 text-3xl uppercase tracking-[0.1em]">Sign in</h1>
        <div className="mt-8 grid gap-5">
          <label className="grid gap-2 text-sm">
            <span>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="border border-black/20 px-3 py-3 outline-none focus:border-black"
              autoComplete="email"
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span>Password</span>
            <span className="flex border border-black/20 focus-within:border-black">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-w-0 flex-1 px-3 py-3 outline-none"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="px-3 text-xs uppercase tracking-[0.12em] text-black/50"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </span>
          </label>
        </div>
        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
        <button
          disabled={loading}
          className="mt-8 w-full bg-black px-4 py-3 text-sm uppercase tracking-[0.18em] text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Signing in' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
