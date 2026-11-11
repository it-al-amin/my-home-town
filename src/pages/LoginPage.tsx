import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { firstError } from '../lib/api';
import { btnPrimary, Field, inputCls } from '../components/cms/ContentFieldsForm';

export const LoginPage: React.FC = () => {
  const { me, login, loading } = useAuth();
  const { language } = useLanguage();
  const bn = language === 'bn';
  const nav = useNavigate();
  const loc = useLocation() as { state?: { from?: string } };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!loading && me) return <Navigate to={loc.state?.from ?? '/admin'} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email.trim(), password);
      nav(loc.state?.from ?? '/admin', { replace: true });
    } catch (err) {
      setError(firstError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <form onSubmit={submit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg p-8 space-y-5">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-teal-600/10 flex items-center justify-center text-teal-600"><ShieldCheck className="w-6 h-6" /></div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{bn ? 'অ্যাডমিন লগইন' : 'Admin sign in'}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {bn ? 'আপনার কেন্দ্রীয় অ্যাকাউন্ট দিয়ে প্রবেশ করুন। নেত্রকোণা ওয়েবসাইটে অ্যাক্সেস থাকতে হবে।' : 'Use your central account. It must have access to the Netrokona website.'}
          </p>
        </div>
        <Field label={bn ? 'ইমেইল' : 'Email'}>
          <input className={inputCls} type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label={bn ? 'পাসওয়ার্ড' : 'Password'}>
          <input className={inputCls} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button type="submit" disabled={busy} className={`${btnPrimary} w-full inline-flex items-center justify-center gap-2`}>
          <LogIn className="w-4 h-4" />{busy ? (bn ? 'অপেক্ষা করুন…' : 'Signing in…') : (bn ? 'প্রবেশ করুন' : 'Sign in')}
        </button>
      </form>
    </div>
  );
};
