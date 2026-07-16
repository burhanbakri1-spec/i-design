'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApiFetch, getAdminErrorMessage } from '@/lib/api/admin';
import { useAdminFeedback } from './AdminFeedback';
import { projectStatusOptions } from './resourceConfigs';

type RecordMap = Record<string, unknown> & { id: string };

const projectFields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'slug', label: 'Slug' },
  { name: 'shortDescription', label: 'Short Description', textarea: true },
  { name: 'description', label: 'Description', textarea: true },
  { name: 'city', label: 'City' },
  { name: 'country', label: 'Country' },
  { name: 'year', label: 'Year', type: 'number' },
  { name: 'client', label: 'Client' },
  { name: 'sizeM2', label: 'Size M2', type: 'number' },
  { name: 'sizeFt2', label: 'Size FT2', type: 'number' },
  { name: 'latitude', label: 'Latitude', type: 'number' },
  { name: 'longitude', label: 'Longitude', type: 'number' },
  { name: 'seoTitle', label: 'SEO Title' },
  { name: 'seoDescription', label: 'SEO Description', textarea: true },
];

function getProjectPayload(values: Record<string, string | boolean>) {
  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (value === '') continue;
    if (['year', 'sizeM2', 'sizeFt2', 'latitude', 'longitude'].includes(key)) payload[key] = Number(value);
    else payload[key] = value;
  }
  return payload;
}

export default function ProjectEditor({ projectId }: { projectId?: string }) {
  const router = useRouter();
  const { notify, confirm } = useAdminFeedback();
  const [project, setProject] = useState<RecordMap | null>(null);
  const [categories, setCategories] = useState<RecordMap[]>([]);
  const [values, setValues] = useState<Record<string, string | boolean>>({ status: 'CONCEPT', featured: false });
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = Boolean(projectId);

  const load = async () => {
    const cats = await adminApiFetch<unknown>('admin/categories', { query: { limit: 100 } });
    const catRows = Array.isArray(cats) ? cats : (cats as { data?: RecordMap[] }).data ?? [];
    setCategories(catRows as RecordMap[]);

    if (projectId) {
      const item = await adminApiFetch<RecordMap>(`admin/projects/${projectId}`);
      setProject(item);
      const next: Record<string, string | boolean> = { status: String(item.status ?? 'CONCEPT'), featured: Boolean(item.featured) };
      for (const field of projectFields) next[field.name] = item[field.name] === null || item[field.name] === undefined ? '' : String(item[field.name]);
      setValues(next);
      const selected = Array.isArray(item.categories)
        ? item.categories.map((entry) => {
            if (entry && typeof entry === 'object' && 'categoryId' in entry) return String(entry.categoryId);
            if (entry && typeof entry === 'object' && 'id' in entry) return String(entry.id);
            if (entry && typeof entry === 'object' && 'category' in entry && entry.category && typeof entry.category === 'object' && 'id' in entry.category) return String(entry.category.id);
            return '';
          }).filter(Boolean)
        : [];
      setCategoryIds(selected);
    }
  };

  useEffect(() => {
    load().catch((err) => setError(getAdminErrorMessage(err)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError('');

    try {
      const payload = { ...getProjectPayload(values), categoryIds };
      const saved = await adminApiFetch<RecordMap>(projectId ? `admin/projects/${projectId}` : 'admin/projects', {
        method: projectId ? 'PATCH' : 'POST',
        body: payload,
      });
      notify('Project saved successfully.', 'success');
      if (!projectId) router.replace(`/admin/projects/${saved.id}/edit`);
      else {
        setProject(saved);
        load();
      }
    } catch (err) {
      const message = getAdminErrorMessage(err);
      setError(message);
      notify(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const media = useMemo(() => {
    const value = project?.media ?? project?.gallery;
    return Array.isArray(value) ? (value as RecordMap[]) : [];
  }, [project]);

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-black/40">{isEdit ? 'Edit' : 'Create'}</p>
        <h1 className="mt-1 text-3xl uppercase tracking-[0.1em]">Project</h1>
      </div>

      <form onSubmit={submit} className="border border-black/10 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2">
          {projectFields.map((field) => (
            <label key={field.name} className={`grid gap-2 text-sm ${field.textarea ? 'md:col-span-2' : ''}`}>
              <span>{field.label}</span>
              {field.textarea ? (
                <textarea
                  value={String(values[field.name] ?? '')}
                  onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                  className="min-h-24 border border-black/20 px-3 py-2 outline-none focus:border-black"
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
          <label className="grid gap-2 text-sm">
            <span>Status</span>
            <select
              value={String(values.status ?? 'CONCEPT')}
              onChange={(event) => setValues((current) => ({ ...current, status: event.target.value }))}
              className="border border-black/20 px-3 py-2 outline-none focus:border-black"
            >
              {projectStatusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={Boolean(values.featured)}
              onChange={(event) => setValues((current) => ({ ...current, featured: event.target.checked }))}
              className="h-5 w-5"
            />
            Featured
          </label>
          <fieldset className="md:col-span-2">
            <legend className="mb-2 text-sm">Categories</legend>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={categoryIds.includes(category.id)}
                    onChange={(event) => {
                      setCategoryIds((current) => event.target.checked ? [...current, category.id] : current.filter((id) => id !== category.id));
                    }}
                  />
                  {String(category.name)}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
        <button disabled={saving} className="mt-6 bg-black px-4 py-2 text-sm uppercase tracking-[0.14em] text-white disabled:opacity-50">
          {saving ? 'Saving' : 'Save Project'}
        </button>
      </form>

      {projectId && project && (
        <>
          <MediaManager projectId={projectId} media={media} onChanged={load} />
          <RelatedProjectData projectId={projectId} type="people" title="Project Team" />
          <RelatedProjectData projectId={projectId} type="partners" title="Project Partners" />
          <AwardsManager projectId={projectId} />
        </>
      )}
    </section>
  );
}

function MediaManager({ projectId, media, onChanged }: { projectId: string; media: RecordMap[]; onChanged: () => void }) {
  const { notify, confirm } = useAdminFeedback();
  const [files, setFiles] = useState<FileList | null>(null);
  const [caption, setCaption] = useState('');
  const [altText, setAltText] = useState('');
  const [uploading, setUploading] = useState(false);

  const upload = async () => {
    if (!files || files.length === 0 || uploading) return;
    const form = new FormData();
    if (files.length === 1) form.append('file', files[0]);
    else Array.from(files).forEach((file) => form.append('files', file));
    if (caption) form.append('caption', caption);
    if (altText) form.append('altText', altText);

    setUploading(true);
    try {
      await adminApiFetch(`admin/projects/${projectId}/media${files.length > 1 ? '/bulk' : ''}`, {
        method: 'POST',
        body: form,
      });
      notify('Media uploaded successfully.', 'success');
      setFiles(null);
      setCaption('');
      setAltText('');
      onChanged();
    } catch (err) {
      notify(getAdminErrorMessage(err), 'error');
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: string) => {
    if (!(await confirm('Delete this image?'))) return;
    await adminApiFetch(`admin/media/${id}`, { method: 'DELETE' });
    notify('Image deleted.', 'success');
    onChanged();
  };

  return (
    <section className="border border-black/10 bg-white p-5">
      <h2 className="text-lg uppercase tracking-[0.12em]">Project Media</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <input type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => setFiles(event.target.files)} />
        <input placeholder="Caption" value={caption} onChange={(event) => setCaption(event.target.value)} className="border border-black/20 px-3 py-2" />
        <input placeholder="Alt text" value={altText} onChange={(event) => setAltText(event.target.value)} className="border border-black/20 px-3 py-2" />
        <button type="button" disabled={uploading || !files} onClick={upload} className="bg-black px-4 py-2 text-sm text-white disabled:opacity-50">
          {uploading ? 'Uploading' : 'Upload'}
        </button>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {media.map((item) => (
          <div key={item.id} className="border border-black/10 p-2">
            <img src={String(item.url)} alt={String(item.altText ?? '')} className="aspect-[4/3] w-full object-cover" />
            <p className="mt-2 truncate text-xs text-black/50">{String(item.caption ?? item.altText ?? '')}</p>
            <div className="mt-2 flex gap-2 text-xs">
              <button type="button" className="underline" onClick={() => adminApiFetch(`admin/projects/${projectId}/media/${item.id}/cover`, { method: 'PATCH' }).then(onChanged)}>
                Set cover
              </button>
              <button type="button" className="text-red-700 underline" onClick={() => remove(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RelatedProjectData({ projectId, type, title }: { projectId: string; type: 'people' | 'partners'; title: string }) {
  const { notify } = useAdminFeedback();
  const [relationId, setRelationId] = useState('');
  const [role, setRole] = useState('');

  const add = async () => {
    if (!relationId) return;
    try {
      await adminApiFetch(`admin/projects/${projectId}/${type}`, {
        method: 'POST',
        body: type === 'people' ? { personId: relationId, role } : { partnerId: relationId, role },
      });
      notify(`${title} updated.`, 'success');
      setRelationId('');
      setRole('');
    } catch (err) {
      notify(getAdminErrorMessage(err), 'error');
    }
  };

  return (
    <section className="border border-black/10 bg-white p-5">
      <h2 className="text-lg uppercase tracking-[0.12em]">{title}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <input value={relationId} onChange={(event) => setRelationId(event.target.value)} placeholder={`${type === 'people' ? 'Person' : 'Partner'} ID`} className="border border-black/20 px-3 py-2" />
        <input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Role" className="border border-black/20 px-3 py-2" />
        <button type="button" onClick={add} className="bg-black px-4 py-2 text-sm text-white">Add</button>
      </div>
    </section>
  );
}

function AwardsManager({ projectId }: { projectId: string }) {
  const { notify, confirm } = useAdminFeedback();
  const [awards, setAwards] = useState<RecordMap[]>([]);
  const [values, setValues] = useState({ title: '', organization: '', year: '', description: '' });

  const load = () => adminApiFetch<RecordMap[]>(`admin/projects/${projectId}/awards`).then(setAwards).catch(() => setAwards([]));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const add = async () => {
    if (!values.title) return;
    try {
      await adminApiFetch(`admin/projects/${projectId}/awards`, {
        method: 'POST',
        body: { ...values, year: values.year ? Number(values.year) : undefined },
      });
      notify('Award added.', 'success');
      setValues({ title: '', organization: '', year: '', description: '' });
      load();
    } catch (err) {
      notify(getAdminErrorMessage(err), 'error');
    }
  };

  const remove = async (id: string) => {
    if (!(await confirm('Delete this award?'))) return;
    await adminApiFetch(`admin/awards/${id}`, { method: 'DELETE' });
    notify('Award deleted.', 'success');
    load();
  };

  return (
    <section className="border border-black/10 bg-white p-5">
      <h2 className="text-lg uppercase tracking-[0.12em]">Awards</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <input value={values.title} onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))} placeholder="Title" className="border border-black/20 px-3 py-2" />
        <input value={values.organization} onChange={(event) => setValues((current) => ({ ...current, organization: event.target.value }))} placeholder="Organization" className="border border-black/20 px-3 py-2" />
        <input value={values.year} onChange={(event) => setValues((current) => ({ ...current, year: event.target.value }))} placeholder="Year" type="number" className="border border-black/20 px-3 py-2" />
        <button type="button" onClick={add} className="bg-black px-4 py-2 text-sm text-white">Add Award</button>
      </div>
      <div className="mt-4 grid gap-2">
        {awards.map((award) => (
          <div key={award.id} className="flex items-center justify-between border border-black/10 px-3 py-2 text-sm">
            <span>{String(award.title)} {award.year ? `(${String(award.year)})` : ''}</span>
            <button className="text-red-700 underline" onClick={() => remove(award.id)}>Delete</button>
          </div>
        ))}
      </div>
    </section>
  );
}
