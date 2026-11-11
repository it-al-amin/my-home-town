import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { FEED_CATEGORY_LABELS, FEED_UPAZILA_LABELS } from '../../data/aggregated';
import type { FeedItem } from '../../types/aggregated';
import { SourceAttribution } from './SourceAttribution';
import { feedDate, feedSummary, feedTitle } from './feedUtils';

export const FeedNewsCard: React.FC<{ item: FeedItem }> = ({ item }) => {
  const { language } = useLanguage();
  const date = feedDate(item.publishedAt, language);
  const upazila = item.upazila ? FEED_UPAZILA_LABELS[item.upazila]?.[language] : null;
  const summary = feedSummary(item, language);

  return (
    <article className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/50 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {FEED_CATEGORY_LABELS[item.category][language]}
          </span>
          {date && (
            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {date}
            </span>
          )}
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 leading-snug">
          {feedTitle(item, language)}
        </h3>
        {summary && (
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-3">{summary}</p>
        )}
        <div className="flex items-center gap-2 flex-wrap mb-3 text-xs text-slate-500 dark:text-slate-400">
          {upazila && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {upazila}
            </span>
          )}
          {item.language !== language && (
            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold">
              {item.language === 'bn' ? 'বাংলা' : 'English'}
            </span>
          )}
        </div>
      </div>
      <SourceAttribution item={item} />
    </article>
  );
};
