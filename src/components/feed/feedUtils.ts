import type { FeedItem } from '../../types/aggregated';
import type { Language } from '../../types';

export const feedTitle = (i: FeedItem, lang: Language) => (lang === 'bn' ? i.titleBn || i.title : i.title);
export const feedSummary = (i: FeedItem, lang: Language) =>
  (lang === 'bn' ? i.summaryBn || i.summary : i.summary) || '';

export const feedDate = (iso: string | null, lang: Language): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};
