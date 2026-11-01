import React from 'react';
import { Calendar, ExternalLink, AlertTriangle, ArrowUpRight } from 'lucide-react';
import type { NewsNotice } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface NewsCardProps {
  news: NewsNotice;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const { language } = useLanguage();

  const title = language === 'bn' ? news.titleBn : news.title;
  const summary = language === 'bn' ? news.summaryBn : news.summary;
  const categoryLabel = language === 'bn' ? news.categoryLabel.bn : news.categoryLabel.en;

  return (
    <article className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-emerald-500/50 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            {categoryLabel}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{news.date}</span>
          </div>
        </div>

        {news.urgent && (
          <div className="mb-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-white shadow-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'জরুরি বিজ্ঞপ্তি / সতর্কতা' : 'Urgent Advisory'}</span>
          </div>
        )}

        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
          {title}
        </h3>

        <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
          {summary}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap text-xs">
        <span className="text-slate-500">
          <strong>{language === 'bn' ? 'উৎস:' : 'Source:'}</strong> {news.source}
        </span>

        <a
          href={news.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          <span>{language === 'bn' ? 'মূল উৎস দেখুন' : 'Read original'}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </article>
  );
};
