import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { api, ApiError, firstError } from '../lib/api';
import { STATUS_LABELS } from '../types/cms';
import type { ContentFields, SubmissionStatus } from '../types/cms';
import { btnPrimary, cleanFields, ContentFieldsForm, Field, inputCls } from '../components/cms/ContentFieldsForm';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ImagePicker } from './ContributePage';

interface Tracking {
  trackingCode: string; kind: string; type: string; status: SubmissionStatus; publicNote: string | null;
  createdAtUtc: string; updatedAtUtc: string; publishedSlug: string | null; canEdit: boolean;
  timeline: { status: SubmissionStatus; note: string | null; at: string }[]; fields: ContentFields | null;
}

const tokenFor = (code: string): string => {
  try { return (JSON.parse(localStorage.getItem('nk_submissions') ?? '{}') as Record<string, string>)[code] ?? ''; } catch { return ''; }
};

export const TrackPage: React.FC = () => {
  const { code: urlCode } = useParams();
  const nav = useNavigate();
  const { language } = useLanguage();
  const bn = language === 'bn';
  const [code, setCode] = useState(urlCode ?? '');
  const [data, setData] = useState<Tracking | null>(null);
  const [error, setError] = useState('');
  const [fields, setFields] = useState<ContentFields | null>(null);
  const [token, setToken] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saved, setSaved] = useState(false);

  const load = useCallback(async (c: string) => {
    setError(''); setData(null); setSaved(false);
    try {
      const t = await api<Tracking>('/api/public/submissions/' + encodeURIComponent(c.trim()));
      setData(t); setFields(t.fields); setToken(tokenFor(t.trackingCode));
    } catch (e) { setError(e instanceof ApiError && e.status === 404 ? (bn ? 'এই কোডে কিছু পাওয়া যায়নি।' : 'No submission found with that code.') : firstError(e)); }
  }, [bn]);
  useEffect(() => { if (urlCode) void load(urlCode); }, [urlCode, load]);

  const resubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !fields) return;
    setErrors({}); setError('');
    const form = new FormData();
    form.append('payload', JSON.stringify(cleanFields(fields)));
    form.append('editToken', token);
    files.forEach((f) => form.append('images', f));
    try { await api('/api/public/submissions/' + data.trackingCode, { method: 'PUT', form }); setSaved(true); await load(data.trackingCode); }
    catch (err) { setError(firstError(err)); if (err instanceof ApiError && err.errors) setErrors(err.errors); }
  };

  const box = 'bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5';
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Breadcrumb items={[{ label: 'Track submission', labelBn: 'জমা দেওয়া তথ্যের অবস্থা', href: '/track' }]} />
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{bn ? 'জমা দেওয়া তথ্যের অবস্থা' : 'Track your submission'}</h1>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); nav('/track/' + code.trim().toUpperCase()); }}>
        <input className={`${inputCls} font-mono`} placeholder="NK-XXXXX-XXXXX" value={code} onChange={(e) => setCode(e.target.value)} />
        <button className={btnPrimary} type="submit">{bn ? 'দেখুন' : 'Check'}</button>
      </form>
      {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {data && (
        <div className="space-y-4">
          <div className={box}>
            <p className="text-xs text-slate-500 dark:text-slate-400">{data.trackingCode} · {data.kind === 'Correction' ? (bn ? 'সংশোধন' : 'Correction') : data.type}</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{STATUS_LABELS[data.status][language]}</p>
            {data.publicNote && <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl p-3">💬 {data.publicNote}</p>}
            {data.status === 'Approved' && data.publishedSlug && <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">{bn ? 'প্রকাশিত হয়েছে।' : 'It has been published.'}</p>}
            {data.status === 'Approved' && !data.publishedSlug && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{bn ? 'অনুমোদিত; শীঘ্রই প্রকাশিত হতে পারে।' : 'Approved; it may be published shortly.'}</p>}
          </div>
          <ol className={`${box} space-y-2`}>
            {data.timeline.map((t, i) => (
              <li key={i} className="text-sm border-l-2 border-teal-500 pl-3 text-slate-800 dark:text-slate-100">
                <b>{STATUS_LABELS[t.status][language]}</b> <span className="text-slate-500">· {new Date(t.at).toLocaleString()}</span>
                {t.note && <p className="text-slate-600 dark:text-slate-300">{t.note}</p>}
              </li>
            ))}
          </ol>
          {data.canEdit && fields && (
            <form onSubmit={resubmit} className={`${box} space-y-4`}>
              <h2 className="font-bold text-slate-900 dark:text-slate-100">{bn ? 'সংশোধন করে আবার জমা দিন' : 'Update and resubmit'}</h2>
              <ContentFieldsForm value={fields} onChange={setFields} errors={errors} lockType partial={data.kind === 'Correction'} />
              <ImagePicker files={files} onChange={setFiles} error={errors.images?.[0]} />
              {!token && (
                <Field label={bn ? 'এডিট টোকেন' : 'Edit token'} hint={bn ? 'জমা দেওয়ার সময় যে ব্রাউজারে ছিলেন সেখানে এটি স্বয়ংক্রিয়ভাবে পূরণ হয়।' : 'Filled automatically in the browser you used to submit.'}>
                  <input className={inputCls} value={token} onChange={(e) => setToken(e.target.value)} />
                </Field>
              )}
              {saved && <p className="text-sm text-emerald-700">{bn ? 'পুনরায় জমা হয়েছে।' : 'Resubmitted.'}</p>}
              <button className={btnPrimary} type="submit">{bn ? 'আবার জমা দিন' : 'Resubmit'}</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
