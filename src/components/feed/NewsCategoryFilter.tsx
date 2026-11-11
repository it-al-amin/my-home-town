import React from 'react';
import { Filter } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { FEED_CATEGORY_LABELS } from '../../data/aggregated';
import type { FeedCategory } from '../../types/aggregated';

interface Props {
  categories: FeedCategory[];
  value: string;
  onChange: (v: string) => void;
}

export const NewsCategoryFilter: React.FC<Props> = ({ categories, value, onChange }) => {
  const { language } = useLanguage();
  const chip = (id: string, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => onChange(id)}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
        value === id
          ? 'bg-teal-700 text-white'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className="flex items-center gap-1.5 flex-wrap text-xs">
      <Filter className="w-3.5 h-3.5 text-slate-400 mx-1" />
      {chip('all', language === 'bn' ? 'সব' : 'All')}
      {categories.map((c) => chip(c, FEED_CATEGORY_LABELS[c][language]))}
    </div>
  );
};
