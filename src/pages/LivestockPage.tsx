import React from 'react';
import { Bird, ShieldCheck, HeartPulse, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LIVESTOCK_DATA } from '../data/livestock';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SectionHeader } from '../components/common/SectionHeader';

export const LivestockPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumb
        items={[
          { label: 'Livestock', labelBn: 'প্রাণিসম্পদ ও হাঁস পালন', href: '/livestock' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-950 via-stone-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
            {language === 'bn' ? 'হাঁস পালন ও গ্রামীণ অর্থনীতি' : 'Livestock & Duck Rearing'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {language === 'bn' ? 'নেত্রকোণার প্রাণিসম্পদ ও হাঁস পালন' : 'Livestock & Poultry Resources of Netrokona'}
          </h1>
          <p className="text-sm sm:text-base text-amber-100 leading-relaxed max-w-2xl">
            {language === 'bn' ? LIVESTOCK_DATA.overview.bn : LIVESTOCK_DATA.overview.en}
          </p>
        </div>
      </div>

      {/* Activities Grid */}
      <section className="space-y-6">
        <SectionHeader
          badge={language === 'bn' ? 'প্রধান কার্যক্রম' : 'Agro-Activities'}
          title={language === 'bn' ? 'হাওরের হাঁসের খামার ও দুগ্ধ উৎপাদন' : 'Haor Duck Herds & Dairy Husbandry'}
          subtitle={language === 'bn' ? 'উন্মুক্ত জলাশয়ে প্রাকৃতিক উপায়ে হাঁস পালন এবং উন্নত জাতের গাভী পালন।' : 'Open-water duck grazing in haors and modern cattle cooperatives.'}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LIVESTOCK_DATA.activities.map((act) => (
            <div key={act.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                <Bird className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {language === 'bn' ? act.nameBn : act.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'bn' ? act.descriptionBn : act.description}
              </p>
              <div className="pt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                📍 {language === 'bn' ? `প্রধান এলাকা: ${act.keyAreasBn}` : `Key areas: ${act.keyAreas}`}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Veterinary Hospitals & Services */}
      <section className="bg-amber-50/60 dark:bg-amber-900/30 rounded-3xl p-6 sm:p-8 border border-amber-200 dark:border-amber-800 space-y-6">
        <SectionHeader
          badge={language === 'bn' ? 'পশু চিকিৎসা' : 'Veterinary Care'}
          title={language === 'bn' ? 'সরকারি প্রাণিসম্পদ হাসপাতাল ও টিকাদান সেবা' : 'Government Veterinary Services'}
          subtitle={language === 'bn' ? 'বিনামূল্যে গবাদিপশু ও হাঁসের চিকিৎসা, কৃত্রিম প্রজনন ও নিয়মিত টিকা।' : 'Free outpatient healthcare, breed upgrade, and epidemic prevention vaccines.'}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LIVESTOCK_DATA.services.map((srv, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-amber-200 dark:border-amber-800 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {language === 'bn' ? srv.titleBn : srv.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {language === 'bn' ? srv.descriptionBn : srv.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {srv.authority}
                </span>
                <a
                  href={srv.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-amber-800 dark:text-amber-300 hover:text-amber-950 inline-flex items-center gap-1"
                >
                  <span>{language === 'bn' ? 'ডিএলএস পোর্টাল' : 'DLS Portal'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
