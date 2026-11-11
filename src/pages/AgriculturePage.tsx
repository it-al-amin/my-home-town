import React from 'react';
import { Wheat, Calendar, PhoneCall, ExternalLink, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { AGRICULTURE_DATA } from '../data/agriculture';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SectionHeader } from '../components/common/SectionHeader';
import { RecentUpdates } from '../components/feed/RecentUpdates';
import { FEED_UPDATES } from '../data/aggregated';

export const AgriculturePage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumb
        items={[
          { label: 'Agriculture', labelBn: 'কৃষি ও খাদ্য', href: '/agriculture' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            {language === 'bn' ? 'শস্যভাণ্ডার ও কৃষি সম্প্রসারণ' : 'Agrarian Granary'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {language === 'bn' ? 'নেত্রকোণার কৃষি ও বোরো ধানের ঐতিহ্য' : 'Agriculture & Boro Crops of Netrokona'}
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed max-w-2xl">
            {language === 'bn' ? AGRICULTURE_DATA.overview.bn : AGRICULTURE_DATA.overview.en}
          </p>
        </div>
      </div>

      {/* Krishi Call Center Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'bn' ? 'জাতীয় কৃষি কল সেন্টার — ১৬১২৩' : 'National Krishi Call Center — 16123'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {language === 'bn' ? 'ফসলের রোগবালাই, সার-কীটনাশক এবং আধুনিক চাষাবাদের জন্য সরাসরি কৃষি কর্মকর্তার সাথে কথা বলুন।' : 'Free expert agricultural consultation on crop diseases, fertilizers, and pest management.'}
            </p>
          </div>
        </div>

        <a
          href="tel:16123"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-colors shrink-0"
        >
          📞 16123 {language === 'bn' ? 'কল করুন' : 'Call 16123'}
        </a>
      </div>

      {/* Major Crops Section */}
      <section className="space-y-6">
        <SectionHeader
          badge={language === 'bn' ? 'প্রধান ফসলসমূহ' : 'Major Crops'}
          title={language === 'bn' ? 'নেত্রকোণার প্রধান কৃষিজ ফসল' : 'Primary Agricultural Produce'}
          subtitle={language === 'bn' ? 'বোরো ধান, রোপা আমন, সরিষা ও সোনালী আঁশ পাট।' : 'Paddy varieties, seasonal oilseeds, and traditional cash crops.'}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AGRICULTURE_DATA.crops.map((crop) => (
            <div key={crop.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-slate-900">
                  {language === 'bn' ? crop.nameBn : crop.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {language === 'bn' ? crop.seasonBn : crop.season}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {language === 'bn' ? crop.descriptionBn : crop.description}
              </p>

              <div className="pt-2">
                <span className="text-xs font-bold text-slate-500 block mb-1">
                  {language === 'bn' ? 'প্রধান উৎপাদনকারী উপজেলাসমূহ:' : 'Prominent Producing Upazilas:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(language === 'bn' ? crop.prominentUpazilasBn : crop.prominentUpazilas).map((u, i) => (
                    <span key={i} className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Extension Support Services */}
      <section className="bg-slate-100 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4">
        <SectionHeader
          badge={language === 'bn' ? 'কৃষি সম্প্রসারণ' : 'Farmer Support'}
          title={language === 'bn' ? 'সরকারি কৃষি সেবা ও ভর্তুকি' : 'Government Agricultural Subsidies'}
          subtitle={language === 'bn' ? 'হাওরে দ্রুত ধান কাটার কম্বাইন হারভেস্টার এবং বীজ ও সার প্রণোদনা।' : 'Combine harvester subsidies, emergency flash flood monitoring, and fertilizers.'}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AGRICULTURE_DATA.services.map((s, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">
                  {language === 'bn' ? s.titleBn : s.title}
                </h4>
                <div className="text-xs text-slate-500">
                  📍 {language === 'bn' ? s.officeBn : s.office}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-700">
                  📞 {s.phone}
                </span>
                <a
                  href={s.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
                >
                  <span>{language === 'bn' ? 'ডিএই পোর্টাল' : 'DAE Portal'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <RecentUpdates items={FEED_UPDATES.agriculture} title="Agriculture, Fisheries & Livestock Updates" titleBn="কৃষি, মৎস্য ও প্রাণিসম্পদ সংক্রান্ত সাম্প্রতিক খবর" />
    </div>
  );
};
