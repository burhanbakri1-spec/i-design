'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { AuthUser, SessionState } from '@/lib/auth/types';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/news', label: 'News' },
  { href: '/admin/people', label: 'People' },
  { href: '/admin/offices', label: 'Offices' },
  { href: '/admin/partners', label: 'Partners' },
  { href: '/admin/users', label: 'Users', adminOnly: true },
  { href: '/admin/contact', label: 'Contact Messages' },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<SessionState>({ authenticated: false, user: null });
  const [loading, setLoading] = useState(pathname !== '/admin/login');
  const [menuOpen, setMenuOpen] = useState(false);

  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (isLogin) return;

    let mounted = true;
    fetch('/api/admin-auth/session', { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload) => {
        if (!mounted) return;
        setSession(payload.data);
        if (!payload.data?.authenticated) router.replace('/admin/login');
      })
      .catch(() => {
        if (mounted) router.replace('/admin/login');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isLogin, router]);

  const visibleLinks = useMemo(() => {
    return links.filter((link) => !link.adminOnly || session.user?.role === 'ADMIN');
  }, [session.user?.role]);

  const logout = async () => {
    await fetch('/api/admin-auth/logout', { method: 'POST' }).catch(() => undefined);
    router.replace('/admin/login');
  };

  if (isLogin) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f4] px-6 py-8 text-sm uppercase tracking-[0.2em] text-black/50">
        Loading admin
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f4] text-[#171717]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-black/10 bg-white px-5 py-5 lg:block">
        <Link href="/admin" className="block text-lg uppercase tracking-[0.2em]">
          i DESIGN
        </Link>
        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-black/40">Admin Panel</p>
        <nav className="mt-10 flex flex-col gap-1">
          {visibleLinks.map((link) => {
            const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded px-3 py-2 text-sm transition-colors ${active ? 'bg-black text-white' : 'text-black/65 hover:bg-black/5 hover:text-black'}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-black/10 bg-white/95 px-4 backdrop-blur lg:px-8">
          <div>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="mr-3 inline-flex h-9 w-9 items-center justify-center border border-black/10 lg:hidden"
              aria-label="Toggle admin menu"
            >
              <span className="text-lg">+</span>
            </button>
            <span className="text-sm uppercase tracking-[0.18em] text-black/50">
              {pathname.split('/').filter(Boolean).join(' / ') || 'admin'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm">{session.user?.name}</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-black/40">{session.user?.role}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="border border-black px-3 py-2 text-xs uppercase tracking-[0.16em] transition-colors hover:bg-black hover:text-white"
            >
              Logout
            </button>
          </div>
        </header>

        {menuOpen && (
          <nav className="border-b border-black/10 bg-white px-4 py-3 lg:hidden">
            <div className="grid gap-1">
              {visibleLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-2 py-2 text-sm text-black/70"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}

        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
