import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api, firstError, mediaUrl } from '../lib/api';
import { CMS_TYPE_LABELS, STATUS_LABELS, SUBMISSION_STATUSES } from '../types/cms';
import type { CmsContentType, ContentFields, Paged, SubmissionStatus } from '../types/cms';
import { btnGhost, btnPrimary, inputCls } from '../components/cms/ContentFieldsForm';

interface Row { id: string; trackingCode: string; kind: string; type: CmsContentType; status: SubmissionStatus; submitterName: string; duplicateScore: number; createdAtUtc: string }
interface Detail {
  id: string; trackingCode: string; kind: string; type: CmsContentType; status: SubmissionStatus; version: number;
  submitterName: string; submitterEmail: string | null; submitterPhone: string | null; message: string | null; publicNote: string | null;
  duplicateScore: number; duplicateContent: { id: string; slug: string; titleEn: string; titleBn: string; state: string } | null; duplicateOfSubmissionId: string | null;
  target: ContentFields | null; resultContentId: string | null; fields: ContentFields; reviewedBy: string | null;
  media: { id: string; status: string; url: string; width: number; height: number }[];
  history: { from: string | null; to: string; internalRemark: string | null; publicNote: string | null; atUtc: string; reviewer: string }[];
}

const badge: Record<SubmissionStatus, string> = {
  Pending: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  UnderReview: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
  NeedsCorrection: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  Approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
};

export const SubmissionsAdmin: React.FC = () => {
  const { language } = useLanguage();
  const bn = language === 'bn';
  const [status, setStatus] = useState('Pending');
  const [dupOnly, setDupOnly] = useState(false);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [list, setList] = useState<Paged<Row> | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    const qs = new URLSearchParams({ page: String(page), pageSize: '15' });
    if (status) qs.set('status', status);
    if (dupOnly) qs.set('duplicates', 'true');
    if (q) qs.set('q', q);
    try { setList(await api<Paged<Row>>('/api/admin/submissions?' + qs)); setErr(''); } catch (e) { setErr(firstError(e)); }
  }, [status, dupOnly, q, page]);
  useEffect(() => { void load(); }, [load]);

  if (openId) return <SubmissionDetail id={openId} onClose={() => { setOpenId(null); void load(); }} />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{bn ? 'জমা দেওয়া তথ্য' : 'Public submissions'}</h1>
      <div className="flex gap-2 flex-wrap items-center">
        <select className={`${inputCls} w-auto`} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">{bn ? 'সব' : 'All'}</option>
          {SUBMISSION_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s][language]}</option>)}
        </select>
        <input className={`${inputCls} flex-1 min-w-40`} placeholder={bn ? 'কোড, নাম বা শিরোনাম…' : 'Code, name or title…'} value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        <label className="text-sm flex items-center gap-1 text-slate-700 dark:text-slate-200"><input type="checkbox" checked={dupOnly} onChange={(e) => { setDupOnly(e.target.checked); setPage(1); }} />{bn ? 'সম্ভাব্য ডুপ্লিকেট' : 'Possible duplicates'}</label>
      </div>
      {err && <p className="text-sm text-red-600" role="alert">{err}</p>}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
        {list?.items.length === 0 && <p className="p-6 text-sm text-slate-500">{bn ? 'কিছু নেই।' : 'Nothing here.'}</p>}
        {list?.items.map((r) => (
          <button key={r.id} className="w-full text-left p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer" onClick={() => setOpenId(r.id)}>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{r.trackingCode} · {CMS_TYPE_LABELS[r.type][language]} {r.kind === 'Correction' && <em className="text-xs">({bn ? 'সংশোধন' : 'correction'})</em>}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{r.submitterName} · {new Date(r.createdAtUtc).toLocaleString()}</p>
            </div>
            {r.duplicateScore >= 0.8 && <span title="possible duplicate" className="text-amber-600"><AlertTriangle className="w-4 h-4" /></span>}
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${badge[r.status]}`}>{STATUS_LABELS[r.status][language]}</span>
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

const SubmissionDetail: React.FC<{ id: string; onClose: () => void }> = ({ id, onClose }) => {
  const { can } = useAuth();
  const { language } = useLanguage();
  const bn = language === 'bn';
  const [d, setD] = useState<Detail | null>(null);
  const [internal, setInternal] = useState('');
  const [publicNote, setPublicNote] = useState('');
  const [publish, setPublish] = useState(false);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => { try { setD(await api<Detail>('/api/admin/submissions/' + id)); } catch (e) { setMsg(firstError(e)); } }, [id]);
  useEffect(() => { void load(); }, [load]);

  const act = async (path: string, body: object) => {
    if (!d) return;
    setBusy(true); setMsg('');
    try { await api(`/api/admin/submissions/${id}/${path}`, { json: { ...body, internalRemark: internal || null, publicNote: publicNote || null, version: d.version } }); setInternal(''); setPublicNote(''); await load(); }
    catch (e) { setMsg(firstError(e)); await load(); } finally { setBusy(false); }
  };

  if (!d) return <p className="text-slate-500">{msg || '…'}</p>;
  const closed = d.status === 'Approved';
  const kv = (k: string, v: unknown) => v ? <div key={k} className="grid grid-cols-[130px_1fr] gap-2 text-sm"><dt className="text-slate-500 dark:text-slate-400">{k}</dt><dd className="text-slate-900 dark:text-slate-100 break-words whitespace-pre-wrap">{String(v)}</dd></div> : null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{d.trackingCode}</h1>
        <button className={btnGhost} onClick={onClose}>{bn ? 'ফিরে যান' : 'Back'}</button>
      </div>
      <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${badge[d.status]}`}>{STATUS_LABELS[d.status][language]}</span>

      {d.duplicateScore >= 0.8 && (
        <div className="rounded-2xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-900 dark:text-amber-200 flex gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold">{bn ? 'সম্ভাব্য ডুপ্লিকেট' : 'Possible duplicate'} ({Math.round(d.duplicateScore * 100)}%)</p>
            {d.duplicateContent && <p>{bn ? 'বিদ্যমান কনটেন্ট:' : 'Existing content:'} {d.duplicateContent.titleEn || d.duplicateContent.titleBn} ({d.duplicateContent.state})</p>}
            {d.duplicateOfSubmissionId && <p>{bn ? 'আরেকটি খোলা সাবমিশনের সাথে মিল আছে।' : 'Similar to another open submission.'}</p>}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-2">
          <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{d.kind === 'Correction' ? (bn ? 'প্রস্তাবিত সংশোধন' : 'Proposed corrections') : (bn ? 'প্রস্তাবিত কনটেন্ট' : 'Proposed content')}</h2>
          <dl className="space-y-1.5">{Object.entries(d.fields).map(([k, v]) => kv(k, v))}</dl>
        </div>
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-2">
            <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{bn ? 'প্রেরক (গোপনীয়)' : 'Submitter (private)'}</h2>
            <dl className="space-y-1.5">{kv(bn ? 'নাম' : 'Name', d.submitterName)}{kv('Email', d.submitterEmail)}{kv(bn ? 'ফোন' : 'Phone', d.submitterPhone)}{kv(bn ? 'বার্তা' : 'Message', d.message)}</dl>
          </div>
          {d.media.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-2">{bn ? 'ছবি' : 'Images'}</h2>
              <div className="grid grid-cols-3 gap-2">
                {d.media.map((m) => <figure key={m.id}><img src={mediaUrl(m.url)} alt="" className="w-full h-24 object-cover rounded-lg" /><figcaption className="text-[10px] text-slate-500 text-center">{m.status}</figcaption></figure>)}
              </div>
            </div>
          )}
        </div>
      </div>

      {!closed && (can('submissions.review') || can('submissions.approve')) && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <h2 className="font-bold text-slate-900 dark:text-slate-100">{bn ? 'পর্যালোচনা' : 'Review'}</h2>
          <textarea className={inputCls} rows={2} placeholder={bn ? 'অভ্যন্তরীণ মন্তব্য (শুধু কর্মীরা দেখবেন)' : 'Internal remark (staff only)'} value={internal} onChange={(e) => setInternal(e.target.value)} />
          <textarea className={inputCls} rows={2} placeholder={bn ? 'প্রেরকের জন্য নোট (ট্র্যাকিং পাতায় দেখা যাবে)' : 'Note to the contributor (shown on the tracking page)'} value={publicNote} onChange={(e) => setPublicNote(e.target.value)} />
          {can('submissions.approve') && can('content.publish') && d.kind === 'NewContent' && (
            <label className="text-sm flex items-center gap-2 text-slate-700 dark:text-slate-200"><input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />{bn ? 'অনুমোদনের সাথে সাথে প্রকাশ করুন (না হলে খসড়া হবে)' : 'Publish immediately on approval (otherwise it becomes a draft)'}</label>
          )}
          <div className="flex gap-2 flex-wrap">
            {can('submissions.review') && d.status !== 'UnderReview' && d.status !== 'Rejected' && <button disabled={busy} className={btnGhost} onClick={() => act('status', { status: 'UnderReview' })}>{bn ? 'পর্যালোচনা শুরু' : 'Start review'}</button>}
            {can('submissions.review') && d.status !== 'NeedsCorrection' && d.status !== 'Rejected' && <button disabled={busy || !publicNote.trim()} className={btnGhost} title={bn ? 'প্রেরকের জন্য নোট লিখুন' : 'Write a note for the contributor first'} onClick={() => act('status', { status: 'NeedsCorrection' })}>{bn ? 'সংশোধন চান' : 'Needs correction'}</button>}
            {can('submissions.approve') && d.status !== 'Rejected' && d.status !== 'NeedsCorrection' && <button disabled={busy} className={btnPrimary} onClick={() => act('approve', { publish })}>{bn ? 'অনুমোদন' : 'Approve'}</button>}
            {can('submissions.approve') && d.status !== 'Rejected' && <button disabled={busy || !publicNote.trim()} className={`${btnGhost} text-red-600`} onClick={() => act('status', { status: 'Rejected' })}>{bn ? 'প্রত্যাখ্যান' : 'Reject'}</button>}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{bn ? 'সংশোধন চাওয়া ও প্রত্যাখ্যানের জন্য প্রেরকের নোট বাধ্যতামূলক।' : 'A contributor note is required to request corrections or reject.'}</p>
        </div>
      )}
      {msg && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{msg}</p>}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
        <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-3">{bn ? 'পর্যালোচনার ইতিহাস' : 'Review history'}</h2>
        <ol className="space-y-3">
          {d.history.map((h, i) => (
            <li key={i} className="text-sm border-l-2 border-teal-500 pl-3">
              <p className="font-semibold text-slate-900 dark:text-slate-100">{h.from ? `${h.from} → ` : ''}{h.to} <span className="font-normal text-slate-500 dark:text-slate-400">· {h.reviewer} · {new Date(h.atUtc).toLocaleString()}</span></p>
              {h.internalRemark && <p className="text-slate-600 dark:text-slate-300">🔒 {h.internalRemark}</p>}
              {h.publicNote && <p className="text-slate-600 dark:text-slate-300">💬 {h.publicNote}</p>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
