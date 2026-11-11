import React from 'react';
import { Radio } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { FeedItem } from '../../types/aggregated';
import { FeedNewsCard } from './FeedNewsCard';

interface Props {
  items: FeedItem[];
  title: string;
  titleBn: string;
  limit?: number;
}

/** "Recent updates" block for topic pages (education, health, agriculture...). Hidden when empty,
 *  and always additive: it never replaces the verified static content of the page. */
export const RecentUpdates: React.FC<Props> = ({ items, title, titleBn, limit = 3 }) => {
  const { language } = useLanguage();
  if (items.length === 0) return null;
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Radio className="w-5 h-5 text-teal-600" />
          {language === 'bn' ? titleBn : title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {language === 'bn'
            ? 'পর্যালোচিত সংবাদসূত্র থেকে সংগৃহীত; মূল প্রকাশনার লিংকসহ।'
            : 'Collected from reviewed news and government sources, with links to the originals.'}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.slice(0, limit).map((i) => <FeedNewsCard key={i.id} item={i} />)}
      </div>
    </section>
  );
};
