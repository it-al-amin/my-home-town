import React, { useState } from 'react';
import { Train, Bus, Ship, MapPin, Clock, ExternalLink, ShoppingBag, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { TRANSPORT_ROUTES_DATA } from '../data/transport';
import { MARKETS_DATA } from '../data/markets';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SectionHeader } from '../components/common/SectionHeader';
import { SourceBadge } from '../components/common/SourceBadge';

export const TransportPage: React.FC = () => {
  const { language } = useLanguage();
  const [selectedMode, setSelectedMode] = useState<string>('all');

  const filteredRoutes = TRANSPORT_ROUTES_DATA.filter((r) => {
    return selectedMode === 'all' || r.mode === selectedMode;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumb
        items={[
          { label: 'Transport & Bazars', labelBn: 'যোগাযোগ ও হাট-বাজার', href: '/transport' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            {language === 'bn' ? 'রেলপথ, সড়ক ও হাওর নৌপথ' : 'Transit & Connectivity'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {language === 'bn' ? 'নেত্রকোণার যোগাযোগ ব্যবস্থা ও যাতায়াত' : 'Transport Networks in Netrokona'}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
            {language === 'bn'
              ? 'হাওর ও মোহনগঞ্জ এক্সপ্রেস আন্তঃনগর ট্রেন, ঢাকা-নেত্রকোণা হাইওয়ে বাস সার্ভিস এবং বর্ষাকালে হাওরের ট্রলার ও নৌ যোগাযোগ।'
              : 'Direct intercity rail connections from Dhaka, highway coach networks, and monsoon haor passenger trawlers.'}
          </p>
        </div>
      </div>

      {/* Mode Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setSelectedMode('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            selectedMode === 'all'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          {language === 'bn' ? 'সকল মাধ্যম' : 'All Modes'}
        </button>

        <button
          type="button"
          onClick={() => setSelectedMode('train')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            selectedMode === 'train'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Train className="w-4 h-4" />
          <span>{language === 'bn' ? 'রেলওয়ে ট্রেন' : 'Railway Trains'}</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMode('bus')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            selectedMode === 'bus'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Bus className="w-4 h-4" />
          <span>{language === 'bn' ? 'হাইওয়ে বাস' : 'Highway Buses'}</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMode('waterway')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            selectedMode === 'waterway'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Ship className="w-4 h-4" />
          <span>{language === 'bn' ? 'হাওর নৌপথ' : 'Haor Waterways'}</span>
        </button>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRoutes.map((route) => {
          const title = language === 'bn' ? route.routeTitleBn : route.routeTitle;
          const from = language === 'bn' ? route.fromBn : route.from;
          const to = language === 'bn' ? route.toBn : route.to;
          const description = language === 'bn' ? route.descriptionBn : route.description;
          const duration = language === 'bn' ? route.approxDurationBn : route.approxDuration;
          const stops = language === 'bn' ? route.keyStopsBn : route.keyStops;

          return (
            <div
              key={route.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                    {route.mode === 'train' && <Train className="w-3.5 h-3.5" />}
                    {route.mode === 'bus' && <Bus className="w-3.5 h-3.5" />}
                    {route.mode === 'waterway' && <Ship className="w-3.5 h-3.5" />}
                    <span>{language === 'bn' ? route.modeLabel.bn : route.modeLabel.en}</span>
                  </span>

                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{duration}</span>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {title}
                </h3>

                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">{from}</span>
                  <span className="text-slate-400">⇄</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">{to}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {description}
                </p>

                {/* Key Stops */}
                <div className="pt-2 space-y-1">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                    {language === 'bn' ? 'প্রধান যাত্রাবিরতি ও স্টেশন:' : 'Key Stations / Stops:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {stops.map((s, idx) => (
                      <span key={idx} className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap text-xs">
                {route.officialLink ? (
                  <a
                    href={route.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 inline-flex items-center gap-1"
                  >
                    <span>{language === 'bn' ? 'রেলওয়ে টিকিট পোর্টাল' : 'Official E-Ticketing'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-slate-400">{language === 'bn' ? 'স্থানীয় পরিবহন ব্যবস্থা' : 'Regional Transport'}</span>
                )}

                <SourceBadge source={route.source} sourceUrl={route.sourceUrl} lastVerified={route.lastVerified} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Traditional Bazars & Haats Section */}
      <section id="markets" className="space-y-6 pt-6">
        <SectionHeader
          badge={language === 'bn' ? 'বাণিজ্যিক মোকাম' : 'Commerce & Bazars'}
          title={language === 'bn' ? 'নেত্রকোণার ঐতিহ্যবাহী প্রধান হাট ও বাজার' : 'Major Traditional Bazars & Haat Days'}
          subtitle={language === 'bn' ? 'শ্যামগঞ্জ পাইকারি মোকাম, মোহনগঞ্জ মাছের আড়ৎ এবং শতবর্ষী গ্রামীণ হাটসমূহ।' : 'Regional commodity hubs, weekly haat schedules, and trading specialities.'}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MARKETS_DATA.map((market) => (
            <div key={market.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
                    {language === 'bn' ? market.nameBn : market.name}
                  </h4>
                </div>

                <div className="p-2.5 bg-amber-50/60 dark:bg-amber-900/30 rounded-xl border border-amber-100 dark:border-amber-800 text-xs font-semibold text-amber-900 dark:text-amber-300">
                  🗓️ <strong>{language === 'bn' ? 'হাটের দিন: ' : 'Haat Days: '}</strong>
                  {language === 'bn' ? market.haatDaysBn : market.haatDays}
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  📍 {language === 'bn' ? market.locationBn : market.location}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {language === 'bn' ? market.specialityBn : market.speciality}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${market.name} Netrokona`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-1"
                >
                  <span>{language === 'bn' ? 'গুগল ম্যাপে বাজার দেখুন ↗' : 'View Bazar on Maps ↗'}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
