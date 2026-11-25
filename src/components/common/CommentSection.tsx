import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, Send } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api, firstError } from '../../lib/api';
import { formatNumber } from '../../lib/format';
import { inputCls, btnPrimary } from '../cms/ContentFieldsForm';

interface PublicComment { id: string; name: string; body: string; createdAtUtc: string }

/** Pages that get no comment box (staff tools and personal tracking pages). */
const NO_COMMENTS = /^\/(admin|login|track)(\/|$)/;

/** Same rule as the API: lowercase path of letters, digits, '-' and '/'. */
const commentPageKey = (pathname: string): string | null => {
  const p = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  return /^\/[a-z0-9\-/]{0,199}$/.test(p) && !NO_COMMENTS.test(p) ? p : null;
};

/** Moderated comments for the current page: visitors post, a moderator approves, then everyone sees it. */
export const CommentSection: React.FC = () => {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const bn = language === 'bn';
  const page = commentPageKey(pathname);

  const [items, setItems] = useState<PublicComment[] | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [website, setWebsite] = useState(''); // honeypot: hidden from people, filled by bots
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!page) return;
    let live = true;
    api<{ items: PublicComment[] }>('/api/public/comments?page=' + encodeURIComponent(page))
      .then((d) => live && (setItems(d.items), setUnavailable(false)))
      .catch(() => live && (setItems([]), setUnavailable(true)));
    return () => {
      live = false;
    };
  }, [page]);

  if (!page) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setNotice(null);
    try {
      await api('/api/public/comments', { json: { page, name, body, website } });
      setBody('');
      setNotice({ ok: true, text: bn ? 'ধন্যবাদ! মডারেটরের অনুমোদনের পর আপনার মন্তব্য এখানে দেখা যাবে।' : 'Thank you! Your comment will appear here after a moderator approves it.' });
    } catch (err) {
      setNotice({ ok: false, text: firstError(err) });
    } finally {
      setSending(false);
    }
  };

  const date = (iso: string) => new Date(iso).toLocaleDateString(bn ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section aria-labelledby="comments-title" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 id="comments-title" className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-600" />
          {bn ? 'মন্তব্য' : 'Comments'}
          {items && items.length > 0 && <span className="text-sm font-semibold text-slate-400">({formatNumber(items.length, bn)})</span>}
        </h2>

        {items === null ? (
          <p className="text-sm text-slate-400">{bn ? 'লোড হচ্ছে…' : 'Loading…'}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {unavailable
              ? bn ? 'মন্তব্য এই মুহূর্তে লোড করা যাচ্ছে না।' : 'Comments cannot be loaded right now.'
              : bn ? 'এখনো কোনো মন্তব্য নেই। প্রথম মন্তব্যটি আপনিই করুন।' : 'No comments yet. Be the first to write one.'}
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((c) => (
              <li key={c.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{c.name}</span>
                  <time dateTime={c.createdAtUtc} className="text-slate-400">{date(c.createdAtUtc)}</time>
                </div>
                <p className="mt-1.5 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line break-words">{c.body}</p>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={submit} className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="grid sm:grid-cols-3 gap-3">
            <label className="sm:col-span-1 text-xs font-semibold text-slate-600 dark:text-slate-300 space-y-1">
              <span>{bn ? 'আপনার নাম' : 'Your name'}</span>
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={80} autoComplete="name" />
            </label>
            <label className="sm:col-span-2 text-xs font-semibold text-slate-600 dark:text-slate-300 space-y-1">
              <span>{bn ? 'মন্তব্য' : 'Comment'}</span>
              <textarea className={`${inputCls} min-h-24`} value={body} onChange={(e) => setBody(e.target.value)} required minLength={2} maxLength={2000} />
            </label>
          </div>
          <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-[11px] text-slate-400">
              {bn ? 'সব মন্তব্য প্রকাশের আগে যাচাই করা হয়। ফোন নম্বর বা ব্যক্তিগত তথ্য লিখবেন না।' : 'Every comment is reviewed before it is published. Please do not post phone numbers or personal details.'}
            </p>
            <button type="submit" disabled={sending} className={`${btnPrimary} inline-flex items-center gap-1.5`}>
              <Send className="w-4 h-4" />
              {sending ? (bn ? 'পাঠানো হচ্ছে…' : 'Sending…') : bn ? 'মন্তব্য পাঠান' : 'Post comment'}
            </button>
          </div>
          {notice && (
            <p role="status" className={`text-sm ${notice.ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600'}`}>{notice.text}</p>
          )}
        </form>
      </div>
    </section>
  );
};
