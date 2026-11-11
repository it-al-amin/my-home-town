import React, { useState } from 'react';
import { Newspaper, Calendar, AlertTriangle, ExternalLink, Filter, Plus, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { NewsCard } from '../components/cards/NewsCard';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SubmitPostModal } from '../components/common/SubmitPostModal';
import { LatestNewsSection } from '../components/feed/LatestNewsSection';
import { GovernmentNoticeList } from '../components/feed/GovernmentNoticeList';

export const NewsPage: React.FC = () => {
  const { language } = useLanguage();
  const { approvedNews } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const categories = [
    { id: 'all', label: language === 'bn' ? 'সকল নোটিশ ও সংবাদ' : 'All Updates' },
    { id: 'weather', label: language === 'bn' ? 'আবহাওয়া ও বন্যা' : 'Weather & Flood' },
    { id: 'tourism', label: language === 'bn' ? 'পর্যটন ও পরিবেশ' : 'Tourism' },
    { id: 'education', label: language === 'bn' ? 'শিক্ষা ও ভর্তি' : 'Education' },
    { id: 'fisheries', label: language === 'bn' ? 'মৎস্য সম্পদ' : 'Fisheries' },
    { id: 'agriculture', label: language === 'bn' ? 'কৃষি ও ফসল' : 'Agriculture' },
    { id: 'health', label: language === 'bn' ? 'স্বাস্থ্য ও চিকিৎসা' : 'Health' },
    { id: 'district', label: language === 'bn' ? 'জেলা সংবাদ' : 'District News' },
  ];

  const filteredNews = approvedNews.filter((n) => {
    return selectedCategory === 'all' || n.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'News & Notices', labelBn: 'সংবাদ ও নাগরিক নোটিশ', href: '/news' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-teal-900/40">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
            {language === 'bn' ? 'জেলা বুলেটিন ও তাজা খবর' : 'District Bulletin & Live Updates'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {language === 'bn' ? 'নেত্রকোণা জেলা সংবাদ, নোটিশ ও সতর্কতা' : 'District News, Notices & Advisories'}
          </h1>
          <p className="text-sm sm:text-base text-slate-200">
            {language === 'bn'
              ? 'বন্যা ও আবহাওয়া পূর্বাভাস, পর্যটন আপডেট, কৃষি ও মৎস্য নোটিশ এবং যাচাইকৃত নাগরিক সংবাদ।'
              : 'Hydrology updates, agricultural advisories, and approved community reports with verified source citations.'}
          </p>
        </div>

        {/* Action Button: Citizen Submit Post */}
        <div className="shrink-0 relative z-10">
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{language === 'bn' ? 'সংবাদ বা নোটিশ পাঠান' : 'Submit News / Report'}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 flex-wrap bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
        <span className="text-slate-400 font-semibold px-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'ফিল্টার:' : 'Filter:'}</span>
        </span>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === c.id
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>

      <LatestNewsSection variant="full" />
      <GovernmentNoticeList limit={20} />

      {/* Community Submit Modal */}
      <SubmitPostModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
};
