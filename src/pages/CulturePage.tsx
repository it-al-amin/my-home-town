import React from 'react';
import { BookOpen, Music, Sparkles, Utensils, Flag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CULTURE_DATA } from '../data/culture';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SectionHeader } from '../components/common/SectionHeader';

export const CulturePage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumb
        items={[
          { label: 'Culture & Literature', labelBn: 'সংস্কৃতি ও সাহিত্য', href: '/culture' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            {language === 'bn' ? 'লোকসাহিত্য ও ঐতিহ্য' : 'Folk Literature & Heritage'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {language === 'bn' ? 'নেত্রকোণার সংস্কৃতি, সাহিত্য ও লোকঐতিহ্য' : 'Culture & Folklore of Netrokona'}
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed max-w-2xl">
            {language === 'bn'
              ? 'মৈমনসিংহ গীতিকার অমর পালাগান, বাউল সুরের ঝংকার, গারো ও হাজং নৃগোষ্ঠীর সমৃদ্ধ ওয়ানগালা উৎসব এবং শতবর্ষী বালিশ মিষ্টির ঐতিহ্য।'
              : 'immortal Eastern Bengal ballads of Maimansingha Gitika, soulful Baul mysticism, Wangala harvest celebrations, and artisanal sweets.'}
          </p>
        </div>
      </div>

      {/* Cultural Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CULTURE_DATA.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 inline-block">
                {language === 'bn' ? item.categoryLabel.bn : item.categoryLabel.en}
              </span>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {language === 'bn' ? item.titleBn : item.title}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'bn' ? item.descriptionBn : item.description}
              </p>

              {/* Highlights */}
              <div className="pt-2 space-y-1.5">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {language === 'bn' ? 'অনন্য বৈশিষ্ট্যসমূহ:' : 'Key Characteristics:'}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(language === 'bn' ? item.highlightsBn : item.highlights).map((h, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
              <strong>{language === 'bn' ? 'সংরক্ষণ উৎস:' : 'Heritage Source:'}</strong> {item.source}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
