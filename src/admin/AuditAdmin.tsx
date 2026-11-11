import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api, firstError } from '../lib/api';
import type { Paged } from '../types/cms';
import { btnGhost, inputCls } from '../components/cms/ContentFieldsForm';

interface Row { id: number; atUtc: string; action: string; entityType: string; entityId: string | null; details: string | null; user: string | null }

export const AuditAdmin: React.FC = () => {
  const { language } = useLanguage();
  const bn = language === 'bn';
  const [entityType, setEntityType] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paged<Row> | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    const qs = new URLSearchParams({ page: String(page), pageSize: '30' });
    if (entityType) qs.set('entityType', entityType);
    api<Paged<Row>>('/api/admin/audit?' + qs).then((d) => { setData(d); setErr(''); }).catch((e) => setErr(firstError(e)));
  }, [entityType, page]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{bn ? 'অডিট লগ' : 'Audit log'}</h1>
      <select className={`${inputCls} w-auto`} value={entityType} onChange={(e) => { setEntityType(e.target.value); setPage(1); }}>
        <option value="">{bn ? 'সব' : 'All'}</option>
        {['Content', 'Submission', 'Media', 'Member', 'Role', 'Auth'].map((t) => <option key={t}>{t}</option>)}
      </select>
      {err && <p className="text-sm text-red-600" role="alert">{err}</p>}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
        <table className="w-full text-xs text-slate-800 dark:text-slate-100">
          <thead><tr className="text-left text-slate-500 dark:text-slate-400"><th className="p-3">{bn ? 'সময়' : 'When'}</th><th>{bn ? 'ব্যবহারকারী' : 'User'}</th><th>{bn ? 'কাজ' : 'Action'}</th><th>{bn ? 'বিষয়' : 'Entity'}</th><th>{bn ? 'বিবরণ' : 'Details'}</th></tr></thead>
          <tbody>
            {data?.items.map((r) => (
              <tr key={r.id} className="border-t border-slate-100 dark:border-slate-800 align-top">
                <td className="p-3 whitespace-nowrap">{new Date(r.atUtc).toLocaleString()}</td>
                <td>{r.user ?? '—'}</td>
                <td className="font-mono">{r.action}</td>
                <td>{r.entityType}{r.entityId ? ` ${r.entityId.slice(0, 8)}…` : ''}</td>
                <td className="max-w-xs truncate" title={r.details ?? ''}>{r.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data && data.total > data.pageSize && (
        <div className="flex items-center justify-center gap-3 text-sm text-slate-600 dark:text-slate-300">
          <button className={btnGhost} disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
          <span>{page} / {Math.ceil(data.total / data.pageSize)}</span>
          <button className={btnGhost} disabled={page >= Math.ceil(data.total / data.pageSize)} onClick={() => setPage(page + 1)}>›</button>
        </div>
      )}
    </div>
  );
};
