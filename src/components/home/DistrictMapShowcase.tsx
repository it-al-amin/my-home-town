import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Compass, Layers, Sparkles, ExternalLink, Download } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { DistrictVectorMap } from '../map/DistrictVectorMap';
import { UPAZILAS_DATA } from '../../data/upazilas';
import type { Upazila } from '../../types';

export const DistrictMapShowcase: React.FC = () => {
  const { language } = useLanguage();
  const [selectedUpazila, setSelectedUpazila] = useState<Upazila | null>(
    UPAZILAS_DATA.find((u) => u.id === 'netrokona-sadar') || UPAZILAS_DATA[0]
  );

  return (
    <section className="relative bg-[#131722] text-white rounded-3xl p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl border border-slate-800">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column - Heading & Interactive Preview (Matches amar-gaibandha layout) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Small orange accent badge */}
          <div className="flex items-center gap-2">
            <span className="w-8 h-[2px] bg-amber-500 inline-block" />
            <span className="text-xs sm:text-sm font-bold tracking-wider text-amber-400 uppercase">
              {language === 'bn' ? 'জেলার মানচিত্র' : 'District Map'}
            </span>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {language === 'bn' ? 'জেলার মানচিত্র' : 'District Map of Netrokona'}
          </h2>

          {/* Subtitle / Description */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {language === 'bn'
              ? 'দশটি উপজেলা ও ৮৬টি ইউনিয়ন মানচিত্রে ঘুরে দেখুন, তথ্য পড়ুন, ছবি নামিয়ে নিন।'
              : 'Explore all 10 upazilas and 86 unions interactively. Read demographics, rivers, landmarks and download vector maps.'}
          </p>

          {/* Upazila Live Details Mini-Card */}
          {selectedUpazila && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">
                    {language === 'bn' ? 'নির্বাচিত উপজেলা' : 'Selected Upazila'}
                  </span>
                  <h3 className="text-xl font-black text-white">
                    {language === 'bn' ? selectedUpazila.nameBn : selectedUpazila.name}
                  </h3>
                </div>
                <Link
                  to={`/upazilas/${selectedUpazila.slug}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 transition-colors flex items-center gap-1"
                >
                  <span>{language === 'bn' ? 'বিস্তারিত' : 'View'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800 text-center">
                <div className="p-2 rounded-xl bg-slate-800/60">
                  <div className="text-[10px] text-slate-400">{language === 'bn' ? 'জনসংখ্যা' : 'Population'}</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">
                    {language === 'bn' ? `${selectedUpazila.population.toLocaleString('bn-BD')}` : selectedUpazila.population.toLocaleString()}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/60">
                  <div className="text-[10px] text-slate-400">{language === 'bn' ? 'আয়তন' : 'Area'}</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">
                    {language === 'bn' ? `${selectedUpazila.areaKm2} কিমি²` : `${selectedUpazila.areaKm2} km²`}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/60">
                  <div className="text-[10px] text-slate-400">{language === 'bn' ? 'ইউনিয়ন' : 'Unions'}</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">
                    {language === 'bn' ? `${selectedUpazila.unionsCount}টি` : selectedUpazila.unionsCount}
                  </div>
                </div>
              </div>

              {selectedUpazila.highlights && (
                <div className="text-xs text-slate-400 line-clamp-1 pt-1">
                  <strong className="text-slate-300">{language === 'bn' ? 'আকর্ষণ:' : 'Highlights:'} </strong>
                  {(language === 'bn' ? selectedUpazila.highlightsBn : selectedUpazila.highlights).slice(0, 2).join(', ')}
                </div>
              )}

              {/* Unions summary */}
              <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <div>
                  <strong className="text-slate-300">{language === 'bn' ? 'ইউনিয়নসমূহ:' : 'Unions:'} </strong>
                  <span>
                    {(language === 'bn' ? selectedUpazila.unionsListBn : selectedUpazila.unionsList).slice(0, 3).join(', ')}...
                  </span>
                </div>
                <Link
                  to={`/upazilas/${selectedUpazila.slug}`}
                  className="text-teal-400 hover:text-teal-300 underline font-medium text-[11px] shrink-0 ml-2"
                >
                  {language === 'bn' ? `সকল ${selectedUpazila.unionsCount}টি ইউনিয়ন` : `All ${selectedUpazila.unionsCount} unions`}
                </Link>
              </div>
            </div>
          )}

          {/* Action Buttons (Matches amar-gaibandha cream button) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/map"
              className="px-6 py-3.5 rounded-xl text-sm font-bold bg-[#faf6ea] text-slate-900 hover:bg-white shadow-xl hover:shadow-amber-500/10 transition-all flex items-center gap-2.5 group"
            >
              <span>{language === 'bn' ? 'ইন্টারেক্টিভ মানচিত্রে দেখুন' : 'Explore Interactive Map'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/upazilas"
              className="px-5 py-3.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-teal-400" />
              <span>{language === 'bn' ? 'সকল উপজেলা তালিকা' : 'All 10 Upazilas'}</span>
            </Link>
          </div>
        </div>

        {/* Right Column - Interactive Vector District Map */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl mx-auto">
            <DistrictVectorMap
              selectedUpazilaId={selectedUpazila?.id}
              onSelectUpazila={(u) => setSelectedUpazila(u)}
              showInfoCard={false}
              theme="dark"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

