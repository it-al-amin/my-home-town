import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FileText, History, Inbox, LayoutDashboard, LogOut, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { STATUS_LABELS, SUBMISSION_STATUSES } from '../types/cms';
import { btnGhost } from '../components/cms/ContentFieldsForm';

interface Stats {
  content: { state: string; count: number }[];
  submissions: { status: string; count: number }[];
  potentialDuplicates: number;
}

export const AdminLayout: React.FC = () => {
  const { me, can, logout } = useAuth();
  const { language } = useLanguage();
  const bn = language === 'bn';
  const nav = useNavigate();
  const link = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
      isActive ? 'bg-teal-700 text-white' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
      <aside className="space-y-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-1">
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{me?.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{me?.email}</p>
          <p className="text-[11px] text-teal-700 dark:text-teal-300 font-semibold">{me?.roles.join(', ') || (bn ? 'কোনো ভূমিকা নেই' : 'No role')}</p>
        </div>
        <nav className="flex lg:flex-col gap-1 flex-wrap">
          <NavLink to="/admin" end className={link}><LayoutDashboard className="w-4 h-4" />{bn ? 'ড্যাশবোর্ড' : 'Dashboard'}</NavLink>
          {can('content.view') && <NavLink to="/admin/content" className={link}><FileText className="w-4 h-4" />{bn ? 'কনটেন্ট' : 'Content'}</NavLink>}
          {can('submissions.view') && <NavLink to="/admin/submissions" className={link}><Inbox className="w-4 h-4" />{bn ? 'জমা দেওয়া তথ্য' : 'Submissions'}</NavLink>}
          {can('members.manage') && <NavLink to="/admin/members" className={link}><Users className="w-4 h-4" />{bn ? 'সদস্য ও ভূমিকা' : 'Members & roles'}</NavLink>}
          {can('audit.view') && <NavLink to="/admin/audit" className={link}><History className="w-4 h-4" />{bn ? 'অডিট লগ' : 'Audit log'}</NavLink>}
        </nav>
        <button className={`${btnGhost} w-full inline-flex items-center justify-center gap-2`} onClick={async () => { await logout(); nav('/login'); }}>
          <LogOut className="w-4 h-4" />{bn ? 'লগআউট' : 'Sign out'}
        </button>
      </aside>
      <section className="min-w-0"><Outlet /></section>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const { can } = useAuth();
  const { language } = useLanguage();
  const bn = language === 'bn';
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => { if (can('content.view')) api<Stats>('/api/admin/stats').then(setStats).catch(() => setStats(null)); }, [can]);
  const sub = (s: string) => stats?.submissions.find((x) => x.status === s)?.count ?? 0;
  const content = (s: string) => stats?.content.find((x) => x.state === s)?.count ?? 0;
  const card = 'bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{bn ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin dashboard'}</h1>
      {!stats ? <p className="text-slate-500">…</p> : (
        <>
          <div>
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">{bn ? 'জমা দেওয়া তথ্য' : 'Public submissions'}</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {SUBMISSION_STATUSES.map((s) => (
                <div key={s} className={card}>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{sub(s)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{STATUS_LABELS[s][language]}</p>
                </div>
              ))}
            </div>
            {stats.potentialDuplicates > 0 && (
              <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                {bn ? `${stats.potentialDuplicates}টি সম্ভাব্য ডুপ্লিকেট পর্যালোচনার অপেক্ষায়।` : `${stats.potentialDuplicates} possible duplicate(s) waiting for review.`}
              </p>
            )}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">{bn ? 'কনটেন্ট' : 'Content'}</h2>
            <div className="grid grid-cols-3 gap-3">
              {['Published', 'Draft', 'Archived'].map((s) => (
                <div key={s} className={card}><p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{content(s)}</p><p className="text-xs text-slate-500 dark:text-slate-400">{s}</p></div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
