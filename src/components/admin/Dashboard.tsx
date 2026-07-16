'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { adminApiFetch, getAdminErrorMessage } from '@/lib/api/admin';

type ListPayload = {
  data?: Record<string, unknown>[];
  pagination?: {
    total: number;
  };
};

type DashboardData = {
  projects: ListPayload;
  publishedProjects: ListPayload;
  news: ListPayload;
  people: ListPayload;
  offices: ListPayload;
  partners: ListPayload;
  contact: ListPayload;
};

function total(payload?: ListPayload) {
  return payload?.pagination?.total ?? payload?.data?.length ?? 0;
}

function latest(payload?: ListPayload) {
  return payload?.data ?? [];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      adminApiFetch<ListPayload>('admin/projects', { query: { limit: 5 } }),
      adminApiFetch<ListPayload>('admin/projects', { query: { limit: 1, published: true } }),
      adminApiFetch<ListPayload>('admin/news', { query: { limit: 5 } }),
      adminApiFetch<ListPayload>('admin/people', { query: { limit: 1 } }),
      adminApiFetch<ListPayload>('admin/offices', { query: { limit: 1 } }),
      adminApiFetch<ListPayload>('admin/partners', { query: { limit: 1 } }),
      adminApiFetch<ListPayload>('admin/contact', { query: { limit: 5, status: 'NEW' } }),
    ])
      .then(([projects, publishedProjects, news, people, offices, partners, contact]) => {
        setData({ projects, publishedProjects, news, people, offices, partners, contact });
      })
      .catch((err) => setError(getAdminErrorMessage(err)));
  }, []);

  const cards = useMemo(() => [
    { label: 'Projects', value: total(data?.projects), href: '/admin/projects' },
    { label: 'Published Projects', value: total(data?.publishedProjects), href: '/admin/projects' },
    { label: 'News', value: total(data?.news), href: '/admin/news' },
    { label: 'People', value: total(data?.people), href: '/admin/people' },
    { label: 'Offices', value: total(data?.offices), href: '/admin/offices' },
    { label: 'Partners', value: total(data?.partners), href: '/admin/partners' },
    { label: 'New Messages', value: total(data?.contact), href: '/admin/contact' },
  ], [data]);

  return (
    <section>
      <p className="text-xs uppercase tracking-[0.2em] text-black/40">Overview</p>
      <h1 className="mt-1 text-3xl uppercase tracking-[0.1em]">Dashboard</h1>
      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="border border-black/10 bg-white p-5 transition-colors hover:bg-black hover:text-white">
            <p className="text-sm text-current/55">{card.label}</p>
            <p className="mt-3 text-4xl">{data ? card.value : '-'}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Recent title="Latest Projects" items={latest(data?.projects)} href="/admin/projects" />
        <Recent title="Latest News" items={latest(data?.news)} href="/admin/news" />
        <Recent title="Latest Messages" items={latest(data?.contact)} href="/admin/contact" />
      </div>
    </section>
  );
}

function Recent({ title, items, href }: { title: string; items: Record<string, unknown>[]; href: string }) {
  return (
    <section className="border border-black/10 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm uppercase tracking-[0.16em]">{title}</h2>
        <Link href={href} className="text-xs underline">View all</Link>
      </div>
      <div className="grid gap-3">
        {items.length === 0 ? (
          <p className="text-sm text-black/45">No records.</p>
        ) : items.map((item) => (
          <div key={String(item.id)} className="border-t border-black/10 pt-3">
            <p className="truncate text-sm">{String(item.title ?? item.name ?? item.subject ?? item.email ?? 'Untitled')}</p>
            <p className="mt-1 text-xs text-black/40">{String(item.createdAt ?? item.updatedAt ?? '')}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
