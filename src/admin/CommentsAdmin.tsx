import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api, firstError } from '../lib/api';
import type { Paged } from '../types/cms';
import { btnGhost, inputCls } from '../components/cms/ContentFieldsForm';

interface Row { id: string; pageKey: string; authorName: string; body: string; status: 'Pending' | 'Approved' | 'Rejected'; createdAtUtc: string }

const STATUS = ['Pending', 'Approved', 'Rejected'] as const;
const LABEL_BN: Record<Row['status'], string> = { Pending: 'অপেক্ষমাণ', Approved: 'অনুমোদিত', Rejected: 'বাতিল' };

/** Moderation queue for visitor comments (approve / reject / delete). */
export const CommentsAdmin: React.FC = () => {
  const { can } = useAuth();
  const { language } = useLanguage();
  const bn = language === 'bn';
  const [status, setStatus] = useState<Row['status'] | ''>('Pending');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paged<Row> | null>(null);
  const [err, setErr] = useState('');
  const canModerate = can('submissions.approve');

  const load = useCallback(() => {
    const qs = new URLSearchParams({ pageNo: String(page), pageSize: '30' });
    if (status) qs.set('status', status);
    api<Paged<Row>>('/api/admin/comments?' + qs).then((d) => { setData(d); setErr(''); }).catch((e) => setErr(firstError(e)));
  }, [page, status]);
  useEffect(load, [load]);

  const act = async (row: Row, action: 'approve' | 'reject' | 'delete') => {
    if (action === 'delete' && !window.confirm(bn ? 'মন্তব্যটি স্থায়ীভাবে মুছবেন?' : 'Delete this comment permanently?')) return;
    try {
      await api(`/api/admin/comments/${row.id}${action === 'delete' ? '' : '/' + action}`, { method: action === 'delete' ? 'DELETE' : 'POST' });
      load();
    } catch (e) {
      setErr(firstError(e));
    }
  };

  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
  const iconBtn = 'p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40';

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{bn ? 'মন্তব্য' : 'Comments'}</h1>
      <select className={`${inputCls} w-auto`} value={status} onChange={(e) => { setStatus(e.target.value as Row['status'] | ''); setPage(1); }}>
        <option value="">{bn ? 'সব' : 'All'}</option>
        {STATUS.map((s) => <option key={s} value={s}>{bn ? LABEL_BN[s] : s}</option>)}
      </select>
      {err && <p className="text-sm text-red-600" role="alert">{err}</p>}

      <ul className="space-y-3">
        {data?.items.map((r) => (
          <li key={r.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
              <span className="font-bold text-slate-900 dark:text-slate-100">{r.authorName}</span>
              <span className="text-slate-500 dark:text-slate-400">
                <Link to={r.pageKey} className="font-mono underline">{r.pageKey}</Link> · {new Date(r.createdAtUtc).toLocaleString()} · {bn ? LABEL_BN[r.status] : r.status}
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line break-words">{r.body}</p>
            {canModerate && (
              <div className="flex gap-2">
                <button className={iconBtn} disabled={r.status === 'Approved'} onClick={() => act(r, 'approve')} title={bn ? 'অনুমোদন' : 'Approve'}><Check className="w-4 h-4 text-emerald-600" /></button>
                <button className={iconBtn} disabled={r.status === 'Rejected'} onClick={() => act(r, 'reject')} title={bn ? 'বাতিল' : 'Reject'}><X className="w-4 h-4 text-amber-600" /></button>
                <button className={iconBtn} onClick={() => act(r, 'delete')} title={bn ? 'মুছুন' : 'Delete'}><Trash2 className="w-4 h-4 text-red-600" /></button>
              </div>
            )}
          </li>
        ))}
        {data && data.items.length === 0 && <li className="text-sm text-slate-500">{bn ? 'কোনো মন্তব্য নেই।' : 'No comments.'}</li>}
      </ul>

      {pages > 1 && (
        <div className="flex items-center gap-2 text-sm">
          <button className={btnGhost} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>←</button>
          <span>{page} / {pages}</span>
          <button className={btnGhost} disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>→</button>
        </div>
      )}
    </div>
  );
};
