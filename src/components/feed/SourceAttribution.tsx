import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { FeedItem } from '../../types/aggregated';

/** Always shows who published the item and links to the original; we never reproduce full articles. */
export const SourceAttribution: React.FC<{ item: FeedItem }> = ({ item }) => {
  const { language } = useLanguage();
  return (
    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap text-xs">
      <span className="text-slate-500 dark:text-slate-400">
        <strong>{language === 'bn' ? 'উৎস:' : 'Source:'}</strong> {item.sourceName}
      </span>
      <a
        href={item.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
      >
        <span>{language === 'bn' ? 'মূল উৎস দেখুন' : 'Read original'}</span>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};
