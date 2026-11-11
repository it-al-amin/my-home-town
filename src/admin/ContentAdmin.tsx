import React, { useCallback, useEffect, useState } from 'react';
import { ImagePlus, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api, firstError, ApiError, mediaUrl } from '../lib/api';
import { CMS_TYPES, CMS_TYPE_LABELS } from '../types/cms';
import type { ContentFields, Paged } from '../types/cms';
import { btnGhost, btnPrimary, cleanFields, ContentFieldsForm } from '../components/cms/ContentFieldsForm';

interface Row extends ContentFields {
  id: string; slug: string; publishState: 'Draft' | 'Published' | 'Archived'; isActive: boolean; version: number; updatedAtUtc: string;
  media?: { id: string; width: number; height: number; isCover: boolean; credit: string | null; status: string }[];
}

const stateCls: Record<string, string> = {
  Published: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  Draft: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  Archived: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
};

export const ContentAdmin: React.FC = () => {
  const { can } = useAuth();
  const { language } = useLanguage();
  const bn = language === 'bn';
  const [type, setType] = useState('');
  const [state, setState] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [list, setList] = useState<Paged<Row> | null>(null);
  const [editing, setEditing] = useState<Row | 'new' | null>(null);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    const qs = new URLSearchParams({ page: String(page), pageSize: '15' });
    if (type) qs.set('type', type);
    if (state) qs.set('state', state);
    if (q) qs.set('q', q);
    try { setList(await api<Paged<Row>>('/api/admin/content?' + qs)); } catch (e) { setMsg(firstError(e)); }
  }, [type, state, q, page]);
  useEffect(() => { void load(); }, [load]);

  if (editing) return <ContentEditor item={editing === 'new' ? null : editing} onClose={() => { setEditing(null); void load(); }} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{bn ? 'কনটেন্ট' : 'Content'}</h1>
        {can('content.create') && <button className={`${btnPrimary} inline-flex items-center gap-2`} onClick={() => setEditing('new')}><Plus className="w-4 h-4" />{bn ? 'নতুন' : 'New'}</button>}
      </div>
      <div className="flex gap-2 flex-wrap">
        <select className="px-3 py-2 rounded-xl text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
          <option value="">{bn ? 'সব ধরন' : 'All types'}</option>
          {CMS_TYPES.map((t) => <option key={t} value={t}>{CMS_TYPE_LABELS[t][language]}</option>)}
        </select>
        <select className="px-3 py-2 rounded-xl text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100" value={state} onChange={(e) => { setState(e.target.value); setPage(1); }}>
          <option value="">{bn ? 'সব অবস্থা' : 'Any state'}</option>
          {['Draft', 'Published', 'Archived'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <input className="px-3 py-2 rounded-xl text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 flex-1 min-w-40" placeholder={bn ? 'খুঁজুন…' : 'Search title…'} value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
      </div>
      {msg && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{msg}</p>}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
        {list?.items.length === 0 && <p className="p-6 text-sm text-slate-500">{bn ? 'কিছু পাওয়া যায়নি।' : 'Nothing found.'}</p>}
        {list?.items.map((r) => (
          <button key={r.id} type="button" onClick={() => setEditing(r)} className="w-full text-left p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{(bn ? r.titleBn || r.titleEn : r.titleEn || r.titleBn) || r.slug}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{CMS_TYPE_LABELS[r.type][language]} · {r.upazilaId ?? '—'} · {new Date(r.updatedAtUtc).toLocaleDateString()}</p>
            </div>
            {!r.isActive && <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">inactive</span>}
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${stateCls[r.publishState]}`}>{r.publishState}</span>
          </button>
        ))}
      </div>
      {list && list.total > list.pageSize && (
        <div className="flex items-center justify-center gap-3 text-sm text-slate-600 dark:text-slate-300">
          <button className={btnGhost} disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
          <span>{page} / {Math.ceil(list.total / list.pageSize)}</span>
          <button className={btnGhost} disabled={page >= Math.ceil(list.total / list.pageSize)} onClick={() => setPage(page + 1)}>›</button>
        </div>
      )}
    </div>
  );
};

const ContentEditor: React.FC<{ item: Row | null; onClose: () => void }> = ({ item, onClose }) => {
  const { can } = useAuth();
  const { language } = useLanguage();
  const bn = language === 'bn';
  const [row, setRow] = useState<Row | null>(item);
  const [fields, setFields] = useState<ContentFields>(item ?? { type: 'Place' });
  const [active, setActive] = useState(item?.isActive ?? true);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const reload = async (id: string) => { const r = await api<Row>('/api/admin/content/' + id); setRow(r); setActive(r.isActive); return r; };
  const run = async (fn: () => Promise<void>) => {
    setBusy(true); setMsg(''); setErrors({});
    try { await fn(); } catch (e) { setMsg(firstError(e)); if (e instanceof ApiError && e.errors) setErrors(e.errors); } finally { setBusy(false); }
  };

  const save = () => run(async () => {
    const body = { fields: cleanFields(fields), isActive: active, version: row?.version };
    if (!row) { const c = await api<Row>('/api/admin/content', { json: body }); await reload(c.id); setMsg(bn ? 'সংরক্ষিত।' : 'Saved.'); }
    else { await api('/api/admin/content/' + row.id, { method: 'PUT', json: body }); await reload(row.id); setMsg(bn ? 'সংরক্ষিত।' : 'Saved.'); }
  });
  const setPublish = (s: string) => run(async () => { if (row) { await api(`/api/admin/content/${row.id}/state`, { json: { state: s, version: row.version } }); await reload(row.id); } });
  const remove = () => run(async () => {
    if (!row || !window.confirm(bn ? 'স্থায়ীভাবে মুছে ফেলবেন?' : 'Delete permanently?')) return;
    await api('/api/admin/content/' + row.id, { method: 'DELETE' }); onClose();
  });
  const upload = (files: FileList | null) => run(async () => {
    if (!row || !files?.length) return;
    const f = new FormData(); Array.from(files).forEach((x) => f.append('files', x));
    await api('/api/admin/media/content/' + row.id, { form: f }); await reload(row.id);
  });
  const delImg = (id: string) => run(async () => { await api('/api/admin/media/' + id, { method: 'DELETE' }); if (row) await reload(row.id); });
  const cover = (id: string) => run(async () => { await api('/api/admin/media/' + id, { method: 'PUT', json: { isCover: true } }); if (row) await reload(row.id); });

  const readOnly = row ? !can('content.edit') : !can('content.create');
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{row ? (bn ? 'কনটেন্ট সম্পাদনা' : 'Edit content') : (bn ? 'নতুন কনটেন্ট' : 'New content')}</h1>
        <button className={btnGhost} onClick={onClose}>{bn ? 'ফিরে যান' : 'Back'}</button>
      </div>
      {row && (
        <div className="flex items-center gap-2 flex-wrap text-sm">
          <span className={`font-bold px-2 py-0.5 rounded-full ${stateCls[row.publishState]}`}>{row.publishState}</span>
          {can('content.publish') && row.publishState !== 'Published' && <button disabled={busy} className={btnPrimary} onClick={() => setPublish('Published')}>{bn ? 'প্রকাশ করুন' : 'Publish'}</button>}
          {can('content.publish') && row.publishState === 'Published' && <button disabled={busy} className={btnGhost} onClick={() => setPublish('Draft')}>{bn ? 'প্রকাশ প্রত্যাহার' : 'Unpublish'}</button>}
          {can('content.publish') && row.publishState !== 'Archived' && <button disabled={busy} className={btnGhost} onClick={() => setPublish('Archived')}>{bn ? 'আর্কাইভ' : 'Archive'}</button>}
          <span className="text-xs text-slate-500">v{row.version}</span>
        </div>
      )}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <ContentFieldsForm value={fields} onChange={setFields} errors={errors} lockType={!!row} />
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          {bn ? 'সক্রিয় (নিষ্ক্রিয় কনটেন্ট প্রকাশিত হলেও জনসমক্ষে দেখানো হয় না)' : 'Active (inactive content is hidden publicly even if published)'}
        </label>
        {msg && <p role="status" className="text-sm text-slate-700 dark:text-slate-200">{msg}</p>}
        <div className="flex gap-2 flex-wrap">
          <button disabled={busy || readOnly} className={btnPrimary} onClick={save}>{bn ? 'সংরক্ষণ' : 'Save'}</button>
          {row && can('content.delete') && <button disabled={busy} className={`${btnGhost} inline-flex items-center gap-1 text-red-600`} onClick={remove}><Trash2 className="w-4 h-4" />{bn ? 'মুছুন' : 'Delete'}</button>}
        </div>
      </div>
      {row && can('media.manage') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 dark:text-slate-100">{bn ? 'ছবি' : 'Images'}</h2>
            <label className={`${btnGhost} inline-flex items-center gap-2`}>
              <ImagePlus className="w-4 h-4" />{bn ? 'ছবি যোগ করুন' : 'Add images'}
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => { void upload(e.target.files); e.target.value = ''; }} />
            </label>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{bn ? 'JPG/PNG/WebP, সর্বোচ্চ ৫ এমবি। সার্ভার ছবি পুনরায় এনকোড করে মেটাডেটা মুছে ফেলে।' : 'JPG/PNG/WebP, max 5 MB. The server re-encodes images and strips metadata.'}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {row.media?.map((m) => (
              <figure key={m.id} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <img src={mediaUrl(`/api/admin/media/${m.id}/file`)} alt="" className="w-full h-28 object-cover" />
                <figcaption className="p-2 flex items-center justify-between gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                  {m.isCover ? <b>{bn ? 'কভার' : 'Cover'}</b> : <button className="underline cursor-pointer" onClick={() => cover(m.id)}>{bn ? 'কভার করুন' : 'Set cover'}</button>}
                  <button aria-label="delete" className="text-red-600 cursor-pointer" onClick={() => delImg(m.id)}><Trash2 className="w-3.5 h-3.5" /></button>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
