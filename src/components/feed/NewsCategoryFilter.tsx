import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FEED_CATEGORY_LABELS } from '../../data/aggregated';
import type { FeedCategory } from '../../types/aggregated';
import { FilterChips } from '../common/FilterChips';

interface Props {
  categories: FeedCategory[];
  value: string;
  onChange: (v: string) => void;
}

export const NewsCategoryFilter: React.FC<Props> = ({ categories, value, onChange }) => {
  const { language } = useLanguage();
  const options = [
    { id: 'all', label: language === 'bn' ? 'সব' : 'All' },
    ...categories.map((c) => ({ id: c, label: FEED_CATEGORY_LABELS[c][language] })),
  ];
  return <FilterChips options={options} value={value} onChange={onChange} activeClass="bg-teal-700 text-white" caption="" />;
};
