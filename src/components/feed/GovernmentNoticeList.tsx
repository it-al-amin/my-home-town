import React from 'react';
import { ArrowUpRight, Bell } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { FEED_ALL_NOTICES, FEED_CATEGORY_LABELS } from '../../data/aggregated';
import type { FeedItem } from '../../types/aggregated';
import { feedDate, feedTitle } from './feedUtils';

interface Props {
  items?: FeedItem[];
  limit?: number;
  className?: string;
}

/** Compact list of notices, tenders and circulars. Renders nothing when there are none. */
export const GovernmentNoticeList: React.FC<Props> = ({ items = FEED_ALL_NOTICES, limit = 6, className = '' }) => {
  const { language } = useLanguage();
  if (items.length === 0) return null;
  return (
    <section className={`space-y-3 ${className}`}>
      <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <Bell className="w-5 h-5 text-amber-600" />
        {language === 'bn' ? 'সরকারি নোটিশ ও বিজ্ঞপ্তি' : 'Government Notices & Announcements'}
      </h2>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        {items.slice(0, limit).map((n) => (
          <li key={n.id}>
            <a href={n.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">{feedTitle(n, language)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap gap-x-3">
                  <span className="font-bold text-amber-700 dark:text-amber-400">{FEED_CATEGORY_LABELS[n.category][language]}</span>
                  {feedDate(n.publishedAt, language) && <span>{feedDate(n.publishedAt, language)}</span>}
                  <span>{n.sourceName}</span>
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};
