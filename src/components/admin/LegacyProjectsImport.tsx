'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SessionState } from '@/lib/auth/types';
import { adminApiFetch, getAdminErrorMessage } from '@/lib/api/admin';
import {
  buildLegacyProjectRows,
  legacyProjects,
  type CategoryLike,
  type ExistingProjectLike,
  type LegacyProjectImportRow,
} from '@/lib/legacy/project-mapper';
import { useAdminFeedback } from './AdminFeedback';

type ImportMode = 'draft' | 'preserve' | 'publish';
type ResultStatus = 'Success' | 'Failed' | 'Skipped' | 'Duplicate' | 'Updated';

type ImportResult = {
  legacyId: string;
  title: string;
  status: ResultStatus;
  message: string;
};

type PaginatedPayload<T> = {
  data?: T[];
  pagination?: { page: number; limit: number; total: number; totalPages: number };
};

function rowsFromPayload<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === 'object' && Array.isArray((payload as PaginatedPayload<T>).data)) {
    return (payload as PaginatedPayload<T>).data ?? [];
  }
  return [];
}

function getExistingLabel(row: LegacyProjectImportRow) {
  if (row.existingProject) return row.existingProject.slug || row.existingProject.title || row.existingProject.id;
  if (row.duplicateProject) return `Possible: ${row.duplicateProject.title || row.duplicateProject.id}`;
  return '-';
}

function downloadFile(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function LegacyProjectsImport() {
  const { notify } = useAdminFeedback();
  const [session, setSession] = useState<SessionState | null>(null);
  const [rows, setRows] = useState<LegacyProjectImportRow[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [missingCategories, setMissingCategories] = useState<{ name: string; slug: string }[]>([]);
  const [mode, setMode] = useState<ImportMode>('draft');
  const [updateExisting, setUpdateExisting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [results, setResults] = useState<ImportResult[]>([]);

  const canUsePage = session?.authenticated && session.user?.role === 'ADMIN';

  const loadComparison = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [categoriesPayload, projectsPayload] = await Promise.all([
        adminApiFetch<unknown>('admin/categories', { query: { limit: 500 } }),
        adminApiFetch<unknown>('admin/projects', { query: { limit: 500 } }),
      ]);
      const categories = rowsFromPayload<CategoryLike>(categoriesPayload);
      const existingProjects = rowsFromPayload<ExistingProjectLike>(projectsPayload);
      const mappedRows = buildLegacyProjectRows(categories, existingProjects);
      const missing = mappedRows
        .flatMap((row) => row.missingCategories)
        .filter((category, index, all) => all.findIndex((item) => item.slug === category.slug) === index);

      setRows(mappedRows);
      setMissingCategories(missing);
      setSelected(new Set(mappedRows.filter((row) => row.status === 'Ready').map((row) => row.legacyId)));
    } catch (err) {
      const message = getAdminErrorMessage(err);
      setError(message);
      notify(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/admin-auth/session', { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload) => {
        if (!mounted) return;
        setSession(payload.data);
        if (payload.data?.authenticated && payload.data?.user?.role === 'ADMIN') {
          loadComparison();
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setSession({ authenticated: false, user: null });
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [loadComparison]);

  const summary = useMemo(() => ({
    total: rows.length,
    ready: rows.filter((row) => row.status === 'Ready').length,
    existing: rows.filter((row) => row.status === 'Already imported').length,
    duplicate: rows.filter((row) => row.status === 'Possible duplicate').length,
    invalid: rows.filter((row) => row.status === 'Invalid data').length,
    mediaPending: rows.filter((row) => row.mediaPending.length > 0).length,
  }), [rows]);

  const toggleRow = (legacyId: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(legacyId)) next.delete(legacyId);
      else next.add(legacyId);
      return next;
    });
  };

  const createMissingCategories = async () => {
    if (!missingCategories.length) return;
    setImporting(true);
    setProgress('Creating missing categories');
    try {
      for (const category of missingCategories) {
        await adminApiFetch('admin/categories', {
          method: 'POST',
          body: { name: category.name, slug: category.slug },
        });
      }
      notify('Missing categories created.', 'success');
      await loadComparison();
    } catch (err) {
      notify(getAdminErrorMessage(err), 'error');
    } finally {
      setImporting(false);
      setProgress('');
    }
  };

  const importSelected = async (nextMode = mode, forcedRows?: LegacyProjectImportRow[]) => {
    const selectedRows = forcedRows ?? rows.filter((row) => selected.has(row.legacyId));
    const nextResults: ImportResult[] = [];
    setImporting(true);
    setResults([]);
    setMode(nextMode);

    for (let index = 0; index < selectedRows.length; index += 1) {
      const row = selectedRows[index];
      setProgress(`${index + 1} / ${selectedRows.length} projects imported`);

      if (row.validationErrors.length || row.missingCategories.length) {
        nextResults.push({ legacyId: row.legacyId, title: row.title, status: 'Skipped', message: [...row.validationErrors, ...row.missingCategories.map((item) => `Missing category: ${item.slug}`)].join(', ') });
        setResults([...nextResults]);
        continue;
      }

      if ((row.existingProject || row.duplicateProject) && !updateExisting) {
        nextResults.push({ legacyId: row.legacyId, title: row.title, status: 'Duplicate', message: 'Existing project skipped. Enable update existing to patch it.' });
        setResults([...nextResults]);
        continue;
      }

      try {
        const existingId = row.existingProject?.id ?? row.duplicateProject?.id;
        const project = await adminApiFetch<ExistingProjectLike>(existingId ? `admin/projects/${existingId}` : 'admin/projects', {
          method: existingId ? 'PATCH' : 'POST',
          body: row.payload,
        });
        const projectId = project.id || existingId;

        if (projectId && nextMode === 'publish') {
          await adminApiFetch(`admin/projects/${projectId}/publish`, { method: 'PATCH', body: {} });
        } else if (projectId && nextMode === 'draft') {
          await adminApiFetch(`admin/projects/${projectId}/unpublish`, { method: 'PATCH' });
        }

        nextResults.push({
          legacyId: row.legacyId,
          title: row.title,
          status: existingId ? 'Updated' : 'Success',
          message: row.mediaPending.length ? 'Project imported. Media pending migration.' : 'Project imported.',
        });
      } catch (err) {
        nextResults.push({ legacyId: row.legacyId, title: row.title, status: 'Failed', message: getAdminErrorMessage(err) });
      }

      setResults([...nextResults]);
    }

    setImporting(false);
    setProgress('');
    await loadComparison();
  };

  const downloadJson = () => {
    downloadFile('legacy-project-import-report.json', JSON.stringify({ summary, missingCategories, results }, null, 2), 'application/json');
  };

  const downloadCsv = () => {
    const lines = ['title,status,message', ...results.map((result) => [result.title, result.status, result.message].map((value) => `"${value.replace(/"/g, '""')}"`).join(','))];
    downloadFile('legacy-project-import-report.csv', lines.join('\n'), 'text/csv');
  };

  if (loading) {
    return <section className="text-sm uppercase tracking-[0.2em] text-black/50">Loading legacy import</section>;
  }

  if (!canUsePage) {
    return (
      <section className="border border-black/10 bg-white p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-black/40">403</p>
        <h1 className="mt-2 text-2xl uppercase tracking-[0.12em]">Admin access required</h1>
        <p className="mt-3 text-sm text-black/60">Only ADMIN users can import legacy projects.</p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-black/40">Projects</p>
          <h1 className="mt-1 text-3xl uppercase tracking-[0.1em]">Import Legacy Projects</h1>
        </div>
        <Link href="/admin/projects" className="border border-black px-4 py-3 text-sm uppercase tracking-[0.16em]">
          Back to projects
        </Link>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-6">
        {Object.entries(summary).map(([key, value]) => (
          <div key={key} className="border border-black/10 bg-white p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-black/40">{key}</p>
            <p className="mt-2 text-2xl">{value}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 grid gap-3 border border-black/10 bg-white p-4 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setSelected(new Set(rows.map((row) => row.legacyId)))} className="border border-black/20 px-3 py-2 text-xs uppercase tracking-[0.14em]">Select all</button>
          <button type="button" onClick={() => setSelected(new Set())} className="border border-black/20 px-3 py-2 text-xs uppercase tracking-[0.14em]">Select none</button>
          <button type="button" onClick={loadComparison} disabled={importing} className="border border-black/20 px-3 py-2 text-xs uppercase tracking-[0.14em] disabled:opacity-50">Refresh comparison</button>
          <button type="button" onClick={createMissingCategories} disabled={importing || !missingCategories.length} className="border border-black/20 px-3 py-2 text-xs uppercase tracking-[0.14em] disabled:opacity-50">Create missing categories</button>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.14em]">
            <input type="checkbox" checked={updateExisting} onChange={(event) => setUpdateExisting(event.target.checked)} />
            Update existing
          </label>
          <button type="button" onClick={() => importSelected('draft')} disabled={importing || !selected.size} className="bg-black px-3 py-2 text-xs uppercase tracking-[0.14em] text-white disabled:opacity-50">Import as drafts</button>
          <button type="button" onClick={() => importSelected('publish')} disabled={importing || !selected.size} className="bg-black px-3 py-2 text-xs uppercase tracking-[0.14em] text-white disabled:opacity-50">Import and publish</button>
          <button type="button" onClick={() => importSelected(mode)} disabled={importing || !selected.size} className="border border-black px-3 py-2 text-xs uppercase tracking-[0.14em] disabled:opacity-50">Import selected</button>
        </div>
      </div>

      {missingCategories.length > 0 && (
        <p className="mb-4 border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
          Missing categories: {missingCategories.map((category) => category.slug).join(', ')}
        </p>
      )}
      {progress && <p className="mb-4 text-sm text-black/60">{progress}</p>}
      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}

      <div className="overflow-x-auto border border-black/10 bg-white">
        <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
          <thead className="bg-black/[0.03] text-xs uppercase tracking-[0.14em] text-black/50">
            <tr>
              {['', 'Title', 'Slug', 'Location', 'Year', 'Category', 'Images', 'Import status', 'Existing in database', 'Actions'].map((heading) => (
                <th key={heading || 'select'} className="border-b border-black/10 px-3 py-3">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.legacyId} className="border-b border-black/10 last:border-0">
                <td className="px-3 py-3">
                  <input type="checkbox" checked={selected.has(row.legacyId)} onChange={() => toggleRow(row.legacyId)} />
                </td>
                <td className="px-3 py-3">{row.title}</td>
                <td className="px-3 py-3">{row.slug}</td>
                <td className="px-3 py-3">{row.location}</td>
                <td className="px-3 py-3">{row.year}</td>
                <td className="px-3 py-3">{row.category}</td>
                <td className="px-3 py-3">{row.imageCount}</td>
                <td className="px-3 py-3">{row.status}</td>
                <td className="px-3 py-3">{getExistingLabel(row)}</td>
                <td className="px-3 py-3">
                  <button type="button" onClick={() => { setSelected(new Set([row.legacyId])); importSelected(mode, [row]); }} className="text-xs underline">
                    Import only
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {results.length > 0 && (
        <div className="mt-6 border border-black/10 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg uppercase tracking-[0.12em]">Import report</h2>
            <div className="flex gap-2">
              <button type="button" onClick={downloadJson} className="border border-black/20 px-3 py-2 text-xs uppercase tracking-[0.14em]">Download JSON</button>
              <button type="button" onClick={downloadCsv} className="border border-black/20 px-3 py-2 text-xs uppercase tracking-[0.14em]">Download CSV</button>
            </div>
          </div>
          <div className="mt-4 grid gap-2 text-sm">
            {results.map((result) => (
              <p key={result.legacyId} className="border-t border-black/10 pt-2">
                <span className="font-medium">{result.title}</span> - {result.status}: {result.message}
              </p>
            ))}
          </div>
        </div>
      )}

      <p className="mt-4 text-xs uppercase tracking-[0.16em] text-black/40">
        Legacy source: {legacyProjects.length} projects. Images are reported as media pending migration and are not sent to the API.
      </p>
    </section>
  );
}
