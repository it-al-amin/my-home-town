import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { DistrictVectorMap } from '../map/DistrictVectorMap';
import { UPAZILAS_DATA } from '../../data/upazilas';
import type { Upazila } from '../../types';

export const DistrictMapShowcase: React.FC = () => {
  const { language } = useLanguage();
  const bn = language === 'bn';
  const [selectedUpazila, setSelectedUpazila] = useState<Upazila | null>(
    UPAZILAS_DATA.find((u) => u.id === 'netrokona-sadar') || UPAZILAS_DATA[0],
  );

  const stat = 'p-2.5 rounded-xl bg-emerald-50/70 dark:bg-slate-800/70 border border-emerald-100 dark:border-slate-700';

  return (
    <section className="relative overflow-hidden rounded-3xl border border-emerald-100 dark:border-slate-800 bg-gradient-to-br from-white via-emerald-50/60 to-sky-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-5 sm:p-10 lg:p-12 shadow-xl shadow-emerald-900/5">
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-10 w-80 h-80 rounded-full bg-teal-200/40 dark:bg-teal-900/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-10 bg-[radial-gradient(#99f6e4_1px,transparent_1px)] [background-size:26px_26px]" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-5 space-y-5 min-w-0">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-emerald-700 dark:text-emerald-400">
            <span className="w-6 h-0.5 bg-amber-500" />
            {bn ? 'জেলার মানচিত্র' : 'District map'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {bn ? 'মানচিত্রে নেত্রকোণা' : 'Netrokona on the map'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {bn
              ? 'আসল সীমানায় আঁকা ১০টি উপজেলা — রঙ দেখায় জনঘনত্ব। যেকোনো উপজেলায় ক্লিক করে তথ্য দেখুন।'
              : 'All 10 upazilas drawn on their real boundaries — colour shows population density. Click any upazila for details.'}
          </p>

          {selectedUpazila && (
            <div className="rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    {bn ? 'নির্বাচিত উপজেলা' : 'Selected upazila'}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white truncate">{bn ? selectedUpazila.nameBn : selectedUpazila.name}</h3>
                </div>
                <Link
                  to={`/upazilas/${selectedUpazila.slug}`}
                  className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors flex items-center gap-1"
                >
                  {bn ? 'বিস্তারিত' : 'Details'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <dl className="grid grid-cols-3 gap-2 text-center">
                {[
                  [bn ? 'জনসংখ্যা' : 'Population', selectedUpazila.population.toLocaleString(bn ? 'bn-BD' : 'en-US')],
                  [bn ? 'আয়তন' : 'Area', bn ? `${selectedUpazila.areaKm2.toLocaleString('bn-BD')} কিমি²` : `${selectedUpazila.areaKm2} km²`],
                  [bn ? 'ইউনিয়ন' : 'Unions', bn ? `${selectedUpazila.unionsCount.toLocaleString('bn-BD')}টি` : selectedUpazila.unionsCount],
                ].map(([label, value]) => (
                  <div key={String(label)} className={stat}>
                    <dt className="text-[11px] text-slate-500 dark:text-slate-400">{label}</dt>
                    <dd className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5 tabular-nums">{value}</dd>
                  </div>
                ))}
              </dl>
              {selectedUpazila.highlights && (
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  <strong className="text-slate-800 dark:text-slate-200">{bn ? 'আকর্ষণ: ' : 'Highlights: '}</strong>
                  {(bn ? selectedUpazila.highlightsBn : selectedUpazila.highlights).slice(0, 2).join(', ')}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/map"
              className="inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md transition-colors group"
            >
              {bn ? 'ইন্টারেক্টিভ মানচিত্র' : 'Open interactive map'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/upazilas"
              className="inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              {bn ? 'সকল উপজেলা' : 'All 10 upazilas'}
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7 min-w-0">
          <div className="w-full max-w-xl mx-auto">
            <DistrictVectorMap
              selectedUpazilaId={selectedUpazila?.id}
              onSelectUpazila={(u) => setSelectedUpazila(u)}
              showInfoCard={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
