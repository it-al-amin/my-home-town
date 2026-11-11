import React from 'react';
import { Landmark, ShieldAlert, ExternalLink, CheckCircle2, Info, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PARLIAMENTARY_SEATS_DATA } from '../data/politics';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SourceBadge } from '../components/common/SourceBadge';

export const PoliticsPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumb
        items={[
          { label: 'Parliamentary Seats', labelBn: 'সংসদীয় আসন ও প্রতিনিধিত্ব', href: '/politics' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            {language === 'bn' ? 'বাংলাদেশ জাতীয় সংসদ' : 'Parliament of Bangladesh'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {language === 'bn' ? 'নেত্রকোণা জেলার সংসদীয় আসনসমূহ' : 'Parliamentary Constituencies of Netrokona'}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
            {language === 'bn'
              ? 'নেত্রকোণা জেলায় জাতীয় সংসদের মোট ৫টি নির্বাচনী এলাকা (আসন ১৫৭ থেকে ১৬১) রয়েছে। সংসদ সচিবালয় ও সরকারি গেজেটের তথ্য অনুযায়ী নিরপেক্ষ ও বস্তুনিষ্ঠ উপস্থাপন।'
              : 'Netrokona comprises 5 parliamentary constituencies (Seats 157 to 161). Factual, neutral documentation based on official Parliament Secretariat gazettes.'}
          </p>
        </div>
      </div>

      {/* Neutral Constitutional Status Callout */}
      <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 space-y-2">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-sm sm:text-base">
          <Info className="w-5 h-5 text-amber-600 shrink-0" />
          <span>{language === 'bn' ? 'সাংবিধানিক ও প্রাতিষ্ঠানিক বর্তমান অবস্থা (গেজেট নোট)' : 'Constitutional & Gazette Status Note'}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
          {language === 'bn'
            ? '২০২৪ সালের ৬ আগস্ট মহামান্য রাষ্ট্রপতির সাংবিধানিক আদেশক্রমে দ্বাদশ জাতীয় সংসদ বিলুপ্ত ঘোষণা করা হয়। বর্তমানে নির্বাচন কমিশন ও অন্তর্বর্তীকালীন সরকার কর্তৃক পরবর্তী জাতীয় সংসদ নির্বাচন অনুষ্ঠিত হওয়ার পূর্ব পর্যন্ত সকল সংসদীয় আসন বিধিমোতাবেক শূন্য রয়েছে। নিরপেক্ষ তথ্য নীতি অনুসারে কোনো সাবেক ব্যক্তিকে বর্তমান প্রতিনিধি হিসেবে উল্লেখ করা হয়নি।'
            : 'Pursuant to the constitutional proclamation by the President on August 6, 2024, the 12th National Parliament was dissolved. All parliamentary seats are currently officially vacant under the Interim Government administration pending general elections. In strict accordance with public record authenticity, no previous MP is portrayed as a sitting member.'}
        </p>
        <div className="pt-2 text-xs text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-2">
          <span>{language === 'bn' ? 'সর্বশেষ যাচাই: ১ মার্চ ২০২৬' : 'Last verified: March 1, 2026'}</span>
          <span>•</span>
          <a
            href="http://www.parliament.gov.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-950 inline-flex items-center gap-1"
          >
            <span>{language === 'bn' ? 'জাতীয় সংসদ সচিবালয় পোর্টাল' : 'Parliament Secretariat'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 5 Parliamentary Seats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PARLIAMENTARY_SEATS_DATA.map((seat) => (
          <div
            key={seat.seatNumber}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
                  {seat.constituencyCode}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-400">
                  {language === 'bn' ? `আসন নং ${seat.seatNumber}` : `Seat #${seat.seatNumber}`}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {language === 'bn' ? seat.nameBn : seat.name}
              </h3>

              {/* Covered Upazilas */}
              <div className="space-y-1 pt-1">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                  {language === 'bn' ? 'অন্তর্ভুক্ত উপজেলাসমূহ:' : 'Constituent Upazilas:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(language === 'bn' ? seat.upazilasCoveredBn : seat.upazilasCovered).map((u, i) => (
                    <span key={i} className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-2.5 py-1 rounded-lg">
                      {u}
                    </span>
                  ))}
                </div>
              </div>

              {/* Current Status Note */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <div className="font-bold text-slate-800 dark:text-slate-100">
                  {language === 'bn' ? 'বর্তমান প্রাতিষ্ঠানিক অবস্থা:' : 'Institutional Status:'}
                </div>
                <p className="line-clamp-3">
                  {language === 'bn' ? seat.currentStatusBn : seat.currentStatus}
                </p>
              </div>

              {/* Historical Context */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'bn' ? seat.historicalNoteBn : seat.historicalNote}
              </p>
            </div>

            {/* Source Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <SourceBadge
                source={seat.source}
                sourceUrl={seat.sourceUrl}
                lastVerified={seat.lastVerified}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
