import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Newspaper, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { FEED_NEWS_ALL, FEED_UPAZILA_LABELS } from '../../data/aggregated';
import type { FeedCategory, FeedItem } from '../../types/aggregated';
import { FeedNewsCard } from './FeedNewsCard';
import { NewsCategoryFilter } from './NewsCategoryFilter';
import { feedSummary, feedTitle } from './feedUtils';

const PAGE_SIZE = 9;

interface Props {
  /** compact: newest few items + link to /news (hidden when empty). full: search, filters, pagination. */
  variant?: 'compact' | 'full';
  items?: FeedItem[];
  limit?: number;
}

export const LatestNewsSection: React.FC<Props> = ({ variant = 'compact', items = FEED_NEWS_ALL, limit = 3 }) => {
  const { language } = useLanguage();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [upazila, setUpazila] = useState('all');
  const [page, setPage] = useState(1);

  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))) as FeedCategory[], [items]);
  const upazilas = useMemo(() => Array.from(new Set(items.map((i) => i.upazila).filter(Boolean))) as string[], [items]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter(
      (i) =>
        (category === 'all' || i.category === category) &&
        (upazila === 'all' || i.upazila === upazila) &&
        (!needle || `${feedTitle(i, language)} ${feedSummary(i, language)} ${i.sourceName}`.toLowerCase().includes(needle)),
    );
  }, [items, q, category, upazila, language]);

  if (variant === 'compact') {
    if (items.length === 0) return null;
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-teal-600" />
            {language === 'bn' ? 'নেত্রকোণার সাম্প্রতিক সংবাদ' : 'Latest Netrokona News'}
          </h2>
          <Link to="/news" className="text-sm font-bold text-teal-700 dark:text-teal-400 hover:underline inline-flex items-center gap-1">
            {language === 'bn' ? 'সব দেখুন' : 'View all'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.slice(0, limit).map((i) => <FeedNewsCard key={i.id} item={i} />)}
        </div>
      </section>
    );
  }

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const reset = <T,>(set: (v: T) => void) => (v: T) => { set(v); setPage(1); };

  return (
    <section className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <Newspaper className="w-5 h-5 text-teal-600" />
        {language === 'bn' ? 'সংগৃহীত সংবাদ (যাচাইকৃত সূত্র)' : 'Aggregated News (reviewed sources)'}
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          {language === 'bn' ? 'এখনো কোনো পর্যালোচিত সংবাদ প্রকাশিত হয়নি।' : 'No reviewed news has been published yet.'}
        </p>
      ) : (
        <>
          <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={q}
                  onChange={(e) => reset(setQ)(e.target.value)}
                  placeholder={language === 'bn' ? 'সংবাদ খুঁজুন…' : 'Search news…'}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </label>
              <select
                value={upazila}
                onChange={(e) => reset(setUpazila)(e.target.value)}
                aria-label={language === 'bn' ? 'উপজেলা' : 'Upazila'}
                className="px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="all">{language === 'bn' ? 'সব উপজেলা' : 'All upazilas'}</option>
                {upazilas.map((u) => (
                  <option key={u} value={u}>{FEED_UPAZILA_LABELS[u]?.[language] ?? u}</option>
                ))}
              </select>
            </div>
            <NewsCategoryFilter categories={categories} value={category} onChange={reset(setCategory)} />
          </div>

          {shown.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">{language === 'bn' ? 'কোনো ফলাফল নেই।' : 'No matching news.'}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {shown.map((i) => <FeedNewsCard key={i.id} item={i} />)}
            </div>
          )}

          {pages > 1 && (
            <nav className="flex items-center justify-center gap-3 text-sm" aria-label="pagination">
              <button type="button" disabled={current === 1} onClick={() => setPage(current - 1)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-slate-600 dark:text-slate-300">{current} / {pages}</span>
              <button type="button" disabled={current === pages} onClick={() => setPage(current + 1)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
};
