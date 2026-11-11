import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CMS_TYPES, CMS_TYPE_LABELS, CMS_UPAZILAS } from '../../types/cms';
import type { ContentFields } from '../../types/cms';
import { FEED_UPAZILA_LABELS } from '../../data/aggregated';

export const inputCls =
  'w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500';
export const btnPrimary =
  'px-4 py-2 rounded-xl text-sm font-bold bg-teal-700 hover:bg-teal-600 text-white disabled:opacity-50 cursor-pointer transition-colors';
export const btnGhost =
  'px-4 py-2 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 cursor-pointer';

export const Field: React.FC<{ label: string; error?: string; hint?: string; children: React.ReactNode }> = ({ label, error, hint, children }) => (
  <label className="block space-y-1">
    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</span>
    {children}
    {hint && !error && <span className="block text-[11px] text-slate-400">{hint}</span>}
    {error && <span className="block text-[11px] text-red-600 dark:text-red-400" role="alert">{error}</span>}
  </label>
);

interface Props {
  value: ContentFields;
  onChange: (v: ContentFields) => void;
  errors?: Record<string, string[]>;
  lockType?: boolean;
  /** correction mode: every field is optional and only changed fields are applied */
  partial?: boolean;
}

/** One form for admin create/edit, public "add information" and public corrections. Plain text only. */
export const ContentFieldsForm: React.FC<Props> = ({ value, onChange, errors = {}, lockType, partial }) => {
  const { language } = useLanguage();
  const bn = language === 'bn';
  const set = <K extends keyof ContentFields>(k: K, v: ContentFields[K]) => onChange({ ...value, [k]: v === '' ? null : v });
  const err = (k: string) => errors[k]?.[0];
  const txt = (k: keyof ContentFields, max = 300) => (
    <input className={inputCls} maxLength={max} value={(value[k] as string | null | undefined) ?? ''} onChange={(e) => set(k, e.target.value as never)} />
  );
  const area = (k: keyof ContentFields, rows = 3, max = 1000) => (
    <textarea className={inputCls} rows={rows} maxLength={max} value={(value[k] as string | null | undefined) ?? ''} onChange={(e) => set(k, e.target.value as never)} />
  );
  const num = (k: 'latitude' | 'longitude') => (
    <input className={inputCls} type="number" step="any" value={value[k] ?? ''} onChange={(e) => set(k, e.target.value === '' ? null : Number(e.target.value))} />
  );
  const isEvent = value.type === 'Event';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label={bn ? 'ধরন' : 'Type'} error={err('type')}>
        <select className={inputCls} value={value.type} disabled={lockType} onChange={(e) => onChange({ ...value, type: e.target.value as ContentFields['type'] })}>
          {CMS_TYPES.map((t) => <option key={t} value={t}>{CMS_TYPE_LABELS[t][language]}</option>)}
        </select>
      </Field>
      <Field label={bn ? 'উপজেলা' : 'Upazila'} error={err('upazilaId')}>
        <select className={inputCls} value={value.upazilaId ?? ''} onChange={(e) => set('upazilaId', e.target.value)}>
          <option value="">{bn ? '— নির্বাচন করুন —' : '— select —'}</option>
          {CMS_UPAZILAS.map((u) => <option key={u} value={u}>{FEED_UPAZILA_LABELS[u][language]}</option>)}
        </select>
      </Field>
      <Field label={bn ? 'শিরোনাম (ইংরেজি)' : 'Title (English)'} error={err('titleEn') ?? err('title')}>{txt('titleEn')}</Field>
      <Field label={bn ? 'শিরোনাম (বাংলা)' : 'Title (Bengali)'} error={err('titleBn')}>{txt('titleBn')}</Field>
      <Field label={bn ? 'সংক্ষিপ্ত বিবরণ (ইংরেজি)' : 'Summary (English)'} error={err('summaryEn')}>{area('summaryEn', 3, 1000)}</Field>
      <Field label={bn ? 'সংক্ষিপ্ত বিবরণ (বাংলা)' : 'Summary (Bengali)'} error={err('summaryBn')}>{area('summaryBn', 3, 1000)}</Field>
      <Field label={bn ? 'বিস্তারিত (ইংরেজি)' : 'Details (English)'} error={err('bodyEn')}>{area('bodyEn', 5, 20000)}</Field>
      <Field label={bn ? 'বিস্তারিত (বাংলা)' : 'Details (Bengali)'} error={err('bodyBn')}>{area('bodyBn', 5, 20000)}</Field>
      <Field label={bn ? 'ঠিকানা (ইংরেজি)' : 'Address (English)'} error={err('addressEn')}>{txt('addressEn', 500)}</Field>
      <Field label={bn ? 'ঠিকানা (বাংলা)' : 'Address (Bengali)'} error={err('addressBn')}>{txt('addressBn', 500)}</Field>
      <Field label={bn ? 'অক্ষাংশ' : 'Latitude'} error={err('latitude')} hint="24.88">{num('latitude')}</Field>
      <Field label={bn ? 'দ্রাঘিমাংশ' : 'Longitude'} error={err('longitude')} hint="90.73">{num('longitude')}</Field>
      <Field label={bn ? 'ফোন' : 'Phone'} error={err('phone')}>{txt('phone', 20)}</Field>
      <Field label={bn ? 'ইমেইল (প্রতিষ্ঠানের)' : 'Email (of the place)'} error={err('email')}>{txt('email', 256)}</Field>
      <Field label={bn ? 'ওয়েবসাইট' : 'Website'} error={err('website')} hint="https://…">{txt('website', 500)}</Field>
      <Field label={bn ? 'ক্যাটাগরি' : 'Category'} error={err('category')}>{txt('category', 80)}</Field>
      <Field label={bn ? 'তথ্যসূত্র (নাম)' : 'Source name'} error={err('sourceName')}>{txt('sourceName', 200)}</Field>
      <Field label={bn ? 'তথ্যসূত্র (লিংক)' : 'Source link'} error={err('sourceUrl')} hint="https://…">{txt('sourceUrl', 500)}</Field>
      {isEvent && (
        <>
          <Field label={bn ? 'শুরু' : 'Starts'} error={err('eventStartUtc')}>
            <input className={inputCls} type="datetime-local" value={(value.eventStartUtc ?? '').slice(0, 16)} onChange={(e) => set('eventStartUtc', e.target.value ? new Date(e.target.value).toISOString() : null)} />
          </Field>
          <Field label={bn ? 'শেষ' : 'Ends'} error={err('eventEndUtc')}>
            <input className={inputCls} type="datetime-local" value={(value.eventEndUtc ?? '').slice(0, 16)} onChange={(e) => set('eventEndUtc', e.target.value ? new Date(e.target.value).toISOString() : null)} />
          </Field>
        </>
      )}
      {partial && (
        <p className="sm:col-span-2 text-xs text-slate-500 dark:text-slate-400">
          {bn ? 'শুধু যে তথ্যগুলো ঠিক করতে চান সেগুলো পূরণ করুন; ফাঁকা ঘরগুলো অপরিবর্তিত থাকবে।' : 'Fill in only what should change; empty fields stay as they are.'}
        </p>
      )}
    </div>
  );
};

/** Removes empty strings so the API receives nulls. */
export const cleanFields = (f: ContentFields): ContentFields =>
  Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v === '' ? null : v])) as unknown as ContentFields;
