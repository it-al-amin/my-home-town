import React from 'react';
import { Clock, Landmark, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { HISTORY_TIMELINE_DATA } from '../data/history';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SectionHeader } from '../components/common/SectionHeader';
import { SourceBadge } from '../components/common/SourceBadge';

export const HistoryPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumb
        items={[
          { label: 'History & Timeline', labelBn: 'ইতিহাস ও সময়রেখা', href: '/history' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-slate-900 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            {language === 'bn' ? 'ঐতিহাসিক ধারাবাহিকতা' : 'Historical Chronicle'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {language === 'bn' ? 'নেত্রকোণার ইতিহাস ও ঐতিহ্যের সময়রেখা' : 'History & Heritage Timeline of Netrokona'}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
            {language === 'bn'
              ? 'প্রাচীন কামরূপ রাজ্য থেকে সুসং রাজ্যের পত্তন, বারো ভূঁইয়াদের প্রতিরোধ, টঙ্ক কৃষক আন্দোলন, মহান মুক্তিযুদ্ধ এবং ১৯৮৪ সালের পূর্ণাঙ্গ জেলা গঠন।'
              : 'Chronological timeline from ancient Kamarupa and medieval Susang Kingdom through the peasant Tonk Movement, 1971 Liberation War, and modern progress.'}
          </p>
        </div>
      </div>

      {/* Vertical Interactive Timeline */}
      <div className="relative border-l-2 border-emerald-600/40 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-10">
        {HISTORY_TIMELINE_DATA.map((event, idx) => (
          <div key={event.id} className="relative group">
            {/* Timeline Circle Bullet */}
            <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-emerald-600 group-hover:bg-emerald-600 group-hover:scale-125 transition-all shadow-sm" />

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 hover:border-emerald-500/50 shadow-xs hover:shadow-xl transition-all duration-300 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {language === 'bn' ? event.periodLabel.bn : event.periodLabel.en}
                </span>

                <div className="text-xs font-bold text-slate-500 font-mono flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{language === 'bn' ? event.yearDisplayBn : event.yearDisplay}</span>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {language === 'bn' ? event.titleBn : event.title}
              </h3>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {language === 'bn' ? event.descriptionBn : event.description}
              </p>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-700">
                <strong className="text-emerald-800 font-bold">
                  {language === 'bn' ? 'ঐতিহাসিক তাৎপর্য: ' : 'Significance: '}
                </strong>
                {language === 'bn' ? event.significanceBn : event.significance}
              </div>

              <div className="pt-2">
                <SourceBadge source={event.source} sourceUrl={event.sourceUrl} lastVerified={event.lastVerified} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
