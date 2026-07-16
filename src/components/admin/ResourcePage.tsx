'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { adminApiFetch, getAdminErrorMessage } from '@/lib/api/admin';
import type { SessionState } from '@/lib/auth/types';
import { useAdminFeedback } from './AdminFeedback';

export type AdminField = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'textarea' | 'checkbox' | 'select' | 'email' | 'url' | 'password' | 'date';
  options?: { label: string; value: string }[];
  required?: boolean;
  table?: boolean;
  form?: boolean;
};

export type ResourceConfig = {
  title: string;
  endpoint: string;
  createLabel?: string;
  fields: AdminField[];
  searchable?: boolean;
  filters?: AdminField[];
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  projectActions?: boolean;
  contactStatusActions?: boolean;
  createHref?: string;
  secondaryActionHref?: string;
  secondaryActionLabel?: string;
  secondaryActionAdminOnly?: boolean;
  rowLink?: (row: AdminRecord) => string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminRecord = Record<string, unknown> & { id: string };

function readItems(payload: unknown): { rows: AdminRecord[]; pagination: Pagination | null } {
  if (Array.isArray(payload)) return { rows: payload as AdminRecord[], pagination: null };
  if (payload && typeof payload === 'object' && 'data' in payload) {
    const value = payload as { data?: unknown; pagination?: Pagination };
    if (Array.isArray(value.data)) return { rows: value.data as AdminRecord[], pagination: value.pagination ?? null };
  }
  return { rows: [], pagination: null };
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') {
    if ('name' in value && typeof value.name === 'string') return value.name;
    return '-';
  }
  return String(value);
}

function getInitialValues(fields: AdminField[], record?: AdminRecord | null) {
  const values: Record<string, string | boolean> = {};
  for (const field of fields.filter((item) => item.form !== false)) {
    const value = record?.[field.name];
    if (field.type === 'checkbox') values[field.name] = Boolean(value);
    else values[field.name] = value === null || value === undefined ? '' : String(value);
  }
  return values;
}

function buildPayload(fields: AdminField[], values: Record<string, string | boolean>) {
  const payload: Record<string, unknown> = {};

  for (const field of fields.filter((item) => item.form !== false)) {
    const value = values[field.name];
    if (field.type === 'checkbox') {
      payload[field.name] = Boolean(value);
    } else if (field.type === 'number') {
      if (value !== '') payload[field.name] = Number(value);
    } else if (value !== '') {
      payload[field.name] = value;
    }
  }

  return payload;
}

function ResourceForm({
  config,
  record,
  onClose,
  onSaved,
}: {
  config: ResourceConfig;
  record: AdminRecord | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { notify } = useAdminFeedback();
  const [values, setValues] = useState<Record<string, string | boolean>>(() => getInitialValues(config.fields, record));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fields = config.fields.filter((field) => field.form !== false);

  useEffect(() => {
    setValues(getInitialValues(config.fields, record));
  }, [config.fields, record]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError('');

    try {
      await adminApiFetch(record ? `${config.endpoint}/${record.id}` : config.endpoint, {
        method: record ? 'PATCH' : 'POST',
        body: buildPayload(config.fields, values),
      });
      notify(record ? 'Record updated successfully.' : 'Record created successfully.', 'success');
      onSaved();
      onClose();
    } catch (err) {
      const message = getAdminErrorMessage(err);
      setError(message);
      notify(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="mb-6 border border-black/10 bg-white p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-lg uppercase tracking-[0.12em]">{record ? 'Edit' : 'Create'} {config.title}</h2>
        <button type="button" onClick={onClose} className="text-sm text-black/50 hover:text-black">
          Close
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className={`grid gap-2 text-sm ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
            <span>{field.label}</span>
            {field.type === 'textarea' ? (
              <textarea
                required={field.required}
                value={String(values[field.name] ?? '')}
                onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                className="min-h-28 border border-black/20 px-3 py-2 outline-none focus:border-black"
              />
            ) : field.type === 'select' ? (
              <select
                required={field.required}
                value={String(values[field.name] ?? '')}
                onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                className="border border-black/20 px-3 py-2 outline-none focus:border-black"
              >
                <option value="">Select</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <input
                type="checkbox"
                checked={Boolean(values[field.name])}
                onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.checked }))}
                className="h-5 w-5"
              />
            ) : (
              <input
                type={field.type ?? 'text'}
                required={field.required}
                value={String(values[field.name] ?? '')}
                onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                className="border border-black/20 px-3 py-2 outline-none focus:border-black"
              />
            )}
          </label>
        ))}
      </div>
      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      <button disabled={saving} className="mt-6 bg-black px-4 py-2 text-sm uppercase tracking-[0.14em] text-white disabled:opacity-50">
        {saving ? 'Saving' : 'Save'}
      </button>
    </form>
  );
}

export default function ResourcePage({ config }: { config: ResourceConfig }) {
  const { notify, confirm } = useAdminFeedback();
  const [rows, setRows] = useState<AdminRecord[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<AdminRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [session, setSession] = useState<SessionState | null>(null);

  const tableFields = useMemo(() => config.fields.filter((field) => field.table !== false), [config.fields]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = await adminApiFetch<unknown>(config.endpoint, {
        query: { page, limit: 20, search, ...filters },
      });
      const result = readItems(payload);
      setRows(result.rows);
      setPagination(result.pagination);
    } catch (err) {
      const message = getAdminErrorMessage(err);
      setError(message);
      notify(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.endpoint, page, filters]);

  useEffect(() => {
    if (!config.secondaryActionAdminOnly) return;
    let mounted = true;
    fetch('/api/admin-auth/session', { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload) => {
        if (mounted) setSession(payload.data);
      })
      .catch(() => {
        if (mounted) setSession(null);
      });

    return () => {
      mounted = false;
    };
  }, [config.secondaryActionAdminOnly]);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    setPage(1);
    load();
  };

  const remove = async (row: AdminRecord) => {
    if (!(await confirm(`Delete "${formatValue(row.title ?? row.name ?? row.email)}"?`))) return;
    try {
      await adminApiFetch(`${config.endpoint}/${row.id}`, { method: 'DELETE' });
      notify('Record deleted successfully.', 'success');
      load();
    } catch (err) {
      notify(getAdminErrorMessage(err), 'error');
    }
  };

  const patchAction = async (path: string, message: string) => {
    try {
      await adminApiFetch(path, { method: 'PATCH' });
      notify(message, 'success');
      load();
    } catch (err) {
      notify(getAdminErrorMessage(err), 'error');
    }
  };

  const updateContactStatus = async (row: AdminRecord, status: string) => {
    try {
      await adminApiFetch(`${config.endpoint}/${row.id}/status`, {
        method: 'PATCH',
        body: { status },
      });
      notify('Message status updated.', 'success');
      load();
    } catch (err) {
      notify(getAdminErrorMessage(err), 'error');
    }
  };

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-black/40">Manage</p>
          <h1 className="mt-1 text-3xl uppercase tracking-[0.1em]">{config.title}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {config.secondaryActionHref && (!config.secondaryActionAdminOnly || session?.user?.role === 'ADMIN') && (
            <Link href={config.secondaryActionHref} className="border border-black px-4 py-3 text-sm uppercase tracking-[0.16em]">
              {config.secondaryActionLabel}
            </Link>
          )}
          {config.canCreate !== false && (
            config.createHref ? (
              <Link href={config.createHref} className="bg-black px-4 py-3 text-sm uppercase tracking-[0.16em] text-white">
                {config.createLabel ?? `New ${config.title}`}
              </Link>
            ) : (
              <button
                onClick={() => {
                  setEditing(null);
                  setShowForm(true);
                }}
                className="bg-black px-4 py-3 text-sm uppercase tracking-[0.16em] text-white"
              >
                {config.createLabel ?? `New ${config.title}`}
              </button>
            )
          )}
        </div>
      </div>

      {showForm && (
        <ResourceForm
          config={config}
          record={editing}
          onClose={() => setShowForm(false)}
          onSaved={load}
        />
      )}

      <form onSubmit={submitSearch} className="mb-4 grid gap-3 border border-black/10 bg-white p-4 md:grid-cols-[1fr_auto]">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search"
          className="border border-black/20 px-3 py-2 outline-none focus:border-black"
        />
        <button className="border border-black px-4 py-2 text-sm uppercase tracking-[0.14em]">Search</button>
        {config.filters?.map((filter) => (
          <select
            key={filter.name}
            value={filters[filter.name] ?? ''}
            onChange={(event) => {
              setPage(1);
              setFilters((current) => ({ ...current, [filter.name]: event.target.value }));
            }}
            className="border border-black/20 px-3 py-2 outline-none focus:border-black"
          >
            <option value="">{filter.label}</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ))}
      </form>

      <div className="overflow-x-auto border border-black/10 bg-white">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="bg-black/[0.03] text-xs uppercase tracking-[0.14em] text-black/50">
            <tr>
              {tableFields.map((field) => <th key={field.name} className="border-b border-black/10 px-3 py-3">{field.label}</th>)}
              <th className="border-b border-black/10 px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-3 py-6 text-black/50" colSpan={tableFields.length + 1}>Loading</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="px-3 py-6 text-black/50" colSpan={tableFields.length + 1}>No records found.</td></tr>
            ) : rows.map((row) => (
              <tr key={row.id} className="border-b border-black/10 last:border-0">
                {tableFields.map((field) => (
                  <td key={field.name} className="max-w-[260px] truncate px-3 py-3">
                    {field.name === 'coverImage' || field.name === 'image' || field.name === 'logo' ? (
                      row[field.name] ? <img src={String(row[field.name])} alt="" className="h-10 w-14 object-cover" /> : '-'
                    ) : formatValue(row[field.name])}
                  </td>
                ))}
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-2">
                    {config.rowLink && <Link className="text-xs underline" href={config.rowLink(row)}>Open</Link>}
                    {config.canEdit !== false && (
                      <button className="text-xs underline" onClick={() => { setEditing(row); setShowForm(true); }} type="button">
                        Edit
                      </button>
                    )}
                    {config.projectActions && (
                      <>
                        <button className="text-xs underline" type="button" onClick={() => patchAction(`${config.endpoint}/${row.id}/${row.published ? 'unpublish' : 'publish'}`, 'Publish status updated.')}>
                          {row.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button className="text-xs underline" type="button" onClick={() => patchAction(`${config.endpoint}/${row.id}/featured`, 'Featured status updated.')}>
                          Featured
                        </button>
                        {row.deletedAt && (
                          <button className="text-xs underline" type="button" onClick={() => patchAction(`${config.endpoint}/${row.id}/restore`, 'Project restored.')}>
                            Restore
                          </button>
                        )}
                      </>
                    )}
                    {config.contactStatusActions && (
                      <>
                        {['NEW', 'READ', 'REPLIED', 'ARCHIVED'].filter((status) => status !== row.status).map((status) => (
                          <button key={status} className="text-xs underline" type="button" onClick={() => updateContactStatus(row, status)}>
                            {status}
                          </button>
                        ))}
                      </>
                    )}
                    {config.canDelete !== false && (
                      <button className="text-xs text-red-700 underline" type="button" onClick={() => remove(row)}>
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      {pagination && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span>Page {pagination.page} of {pagination.totalPages || 1} / {pagination.total} records</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="border border-black/20 px-3 py-2 disabled:opacity-40">Previous</button>
            <button disabled={pagination.totalPages <= page} onClick={() => setPage((value) => value + 1)} className="border border-black/20 px-3 py-2 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </section>
  );
}
