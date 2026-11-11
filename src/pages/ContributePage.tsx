import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ImagePlus, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api, ApiError, firstError } from '../lib/api';
import type { ContentFields, PublicContent } from '../types/cms';
import { btnGhost, btnPrimary, cleanFields, ContentFieldsForm, Field, inputCls } from '../components/cms/ContentFieldsForm';
import { Breadcrumb } from '../components/common/Breadcrumb';

const MAX_IMAGES = 5;
const MAX_BYTES = 5 * 1024 * 1024;
const OK_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const rememberSubmission = (code: string, token: string) => {
  try {
    const all = JSON.parse(localStorage.getItem('nk_submissions') ?? '{}');
    all[code] = token;
    localStorage.setItem('nk_submissions', JSON.stringify(all));
  } catch { /* storage unavailable: the user still has the code on screen */ }
};

export const ImagePicker: React.FC<{ files: File[]; onChange: (f: File[]) => void; error?: string }> = ({ files, onChange, error }) => {
  const { language } = useLanguage();
  const bn = language === 'bn';
  const [local, setLocal] = useState('');
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  const add = (list: FileList | null) => {
    setLocal('');
    const next = [...files];
    for (const f of Array.from(list ?? [])) {
      if (!OK_TYPES.includes(f.type)) { setLocal(bn ? 'শুধু JPG, PNG বা WebP ছবি দিন।' : 'Only JPG, PNG or WebP images are accepted.'); continue; }
      if (f.size > MAX_BYTES) { setLocal(bn ? 'প্রতিটি ছবি সর্বোচ্চ ৫ এমবি।' : 'Each image must be at most 5 MB.'); continue; }
      if (next.length >= MAX_IMAGES) { setLocal(bn ? `সর্বোচ্চ ${MAX_IMAGES}টি ছবি।` : `At most ${MAX_IMAGES} images.`); break; }
      next.push(f);
    }
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 flex-wrap">
        <label className={`${btnGhost} inline-flex items-center gap-2`}>
          <ImagePlus className="w-4 h-4" />{bn ? 'ছবি যোগ করুন' : 'Add photos'}
          <input type="file" accept={OK_TYPES.join(',')} multiple hidden onChange={(e) => { add(e.target.files); e.target.value = ''; }} />
        </label>
        <span className="text-xs text-slate-500 dark:text-slate-400">{bn ? 'সর্বোচ্চ ৫টি, প্রতিটি ৫ এমবি পর্যন্ত। নিজের তোলা বা অনুমতিপ্রাপ্ত ছবি দিন।' : 'Up to 5 photos, 5 MB each. Only photos you took or have permission to share.'}</span>
      </div>
      {(local || error) && <p role="alert" className="text-xs text-red-600 dark:text-red-400">{local || error}</p>}
      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {files.map((f, i) => (
            <figure key={i} className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <img src={previews[i]} alt="" className="w-full h-20 object-cover" />
              <button type="button" aria-label="remove" onClick={() => onChange(files.filter((_, j) => j !== i))} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 cursor-pointer"><X className="w-3 h-3" /></button>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
};

export const ContributePage: React.FC = () => {
  const { language } = useLanguage();
  const bn = language === 'bn';
  const [params] = useSearchParams();
  const correctSlug = params.get('correct');
  const [target, setTarget] = useState<PublicContent | null>(null);
  const [fields, setFields] = useState<ContentFields>({ type: (params.get('type') as ContentFields['type']) || 'Place' });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ code: string; token: string } | null>(null);

  useEffect(() => {
    if (!correctSlug) return;
    api<PublicContent>('/api/public/content/' + encodeURIComponent(correctSlug))
      .then((c) => { setTarget(c); setFields({ type: c.type }); })
      .catch(() => setMsg(bn ? 'সংশোধনের জন্য নির্বাচিত তথ্য পাওয়া যায়নি।' : 'The item to correct could not be found.'));
  }, [correctSlug, bn]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg(''); setErrors({});
    const form = new FormData();
    form.append('payload', JSON.stringify({
      fields: cleanFields(fields),
      submitter: { name, email: email || null, phone: phone || null, message: message || null },
      targetContentId: target?.id ?? null,
    }));
    files.forEach((f) => form.append('images', f));
    try {
      const r = await api<{ trackingCode: string; editToken: string }>('/api/public/submissions', { form });
      rememberSubmission(r.trackingCode, r.editToken);
      setDone({ code: r.trackingCode, token: r.editToken });
    } catch (err) {
      setMsg(firstError(err));
      if (err instanceof ApiError && err.errors) setErrors(err.errors);
    } finally { setBusy(false); }
  };

  if (done) {
    return (
      <div className="max-w-xl mx-auto px-4 py-14 text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{bn ? 'ধন্যবাদ!' : 'Thank you!'}</h1>
        <p className="text-slate-700 dark:text-slate-200">{bn ? 'আপনার তথ্য পর্যালোচনার জন্য জমা হয়েছে। অ্যাডমিন যাচাই ও অনুমোদন না করা পর্যন্ত এটি সাইটে দেখা যাবে না।' : 'Your submission is pending review. It will not appear on the site until an administrator verifies and approves it.'}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">{bn ? 'আপনার ট্র্যাকিং কোড:' : 'Your tracking code:'}</p>
        <p className="text-2xl font-mono font-bold text-teal-700 dark:text-teal-300 select-all">{done.code}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{bn ? 'কোডটি সংরক্ষণ করুন। সংশোধন চাওয়া হলে এই ব্রাউজারেই আপনি তা দিতে পারবেন।' : 'Keep this code. If corrections are requested you can respond from this browser.'}</p>
        <Link className={`${btnPrimary} inline-block`} to={`/track/${done.code}`}>{bn ? 'অবস্থা দেখুন' : 'Track status'}</Link>
      </div>
    );
  }

  const title = (bn ? target?.titleBn || target?.titleEn : target?.titleEn || target?.titleBn) ?? '';
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Breadcrumb items={[{ label: 'Contribute', labelBn: 'তথ্য দিন', href: '/contribute' }]} />
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          {target ? (bn ? 'সংশোধনের প্রস্তাব' : 'Suggest a correction') : (bn ? 'নতুন তথ্য জমা দিন' : 'Share new information')}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          {target ? <>{bn ? 'সংশোধনের বিষয়:' : 'Correcting:'} <b>{title}</b></> : (bn ? 'স্থান, প্রতিষ্ঠান, সেবা, সংবাদ বা অনুষ্ঠানের তথ্য পাঠান। প্রতিটি তথ্য যাচাইয়ের পরই প্রকাশিত হয়।' : 'Send details about a place, institution, service, news item or event. Everything is verified before it is published.')}
        </p>
      </div>
      <form onSubmit={submit} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <ContentFieldsForm value={fields} onChange={setFields} errors={errors} lockType={!!target} partial={!!target} />
          {target && (
            <Field label={bn ? 'কী সংশোধন করতে হবে? *' : 'What should be corrected? *'} error={errors['submitter.message']?.[0]}>
              <textarea className={inputCls} rows={3} maxLength={2000} required value={message} onChange={(e) => setMessage(e.target.value)} />
            </Field>
          )}
          <ImagePicker files={files} onChange={setFiles} error={errors.images?.[0]} />
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <h2 className="font-bold text-slate-900 dark:text-slate-100">{bn ? 'আপনার পরিচয় (গোপন থাকবে, প্রকাশ হবে না)' : 'About you (kept private, never published)'}</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label={bn ? 'নাম *' : 'Name *'} error={errors['submitter.name']?.[0]}><input className={inputCls} required maxLength={150} value={name} onChange={(e) => setName(e.target.value)} /></Field>
            <Field label={bn ? 'ইমেইল' : 'Email'} error={errors['submitter.email']?.[0]}><input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
            <Field label={bn ? 'ফোন' : 'Phone'}><input className={inputCls} maxLength={40} value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
          </div>
          {!target && (
            <Field label={bn ? 'অতিরিক্ত বার্তা' : 'Additional message'}><textarea className={inputCls} rows={2} maxLength={2000} value={message} onChange={(e) => setMessage(e.target.value)} /></Field>
          )}
        </div>
        {msg && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{msg}</p>}
        <button type="submit" disabled={busy} className={btnPrimary}>{busy ? (bn ? 'পাঠানো হচ্ছে…' : 'Sending…') : (bn ? 'জমা দিন' : 'Submit for review')}</button>
      </form>
    </div>
  );
};
