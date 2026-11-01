import React from 'react';
import { Fish, Waves, ShoppingBag, ShieldCheck, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { FISHERIES_DATA } from '../data/fisheries';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SectionHeader } from '../components/common/SectionHeader';

export const FisheriesPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumb
        items={[
          { label: 'Fisheries & Haor', labelBn: 'মৎস্য সম্পদ ও হাওর', href: '/fisheries' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-cyan-950 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
            {language === 'bn' ? 'হাওর অর্থনীতি ও জীববৈচিত্র্য' : 'Haor Fisheries Hub'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {language === 'bn' ? 'নেত্রকোণার মৎস্য সম্পদ ও হাওর ঐতিহ্য' : 'Fisheries & Haor Resources of Netrokona'}
          </h1>
          <p className="text-sm sm:text-base text-cyan-100 leading-relaxed max-w-2xl">
            {language === 'bn' ? FISHERIES_DATA.haorFisheriesOverview.bn : FISHERIES_DATA.haorFisheriesOverview.en}
          </p>
        </div>
      </div>

      {/* Key Indigenous Fish Species */}
      <section className="space-y-6">
        <SectionHeader
          badge={language === 'bn' ? 'দেশীয় মাছের প্রজাতি' : 'Indigenous Species'}
          title={language === 'bn' ? 'হাওরের প্রধান দেশীয় মাছ' : 'Native Haor Fish Varieties'}
          subtitle={language === 'bn' ? 'বোয়াল, চিতল, পাবদা থেকে শুরু করে ঐতিহ্যবাহী নদীর দেশি মাছ।' : 'Premium freshwater species thriving in the Dingapota wetland basin.'}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FISHERIES_DATA.keySpecies.map((fish, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 inline-block">
                {fish.type}
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {language === 'bn' ? fish.nameBn : fish.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {fish.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Wholesale Fish Markets / Mokam */}
      <section className="space-y-6">
        <SectionHeader
          badge={language === 'bn' ? 'পাইকারি মোকাম' : 'Fish Markets'}
          title={language === 'bn' ? 'প্রধান তাজা মাছের আড়ৎ ও অবতরণ কেন্দ্র' : 'Major Fish Landing & Wholesale Centers'}
          subtitle={language === 'bn' ? 'মোহনগঞ্জ রেলস্টেশন আড়ৎ থেকে প্রতিদিন রাজধানী ঢাকায় মাছের চালান সরবরাহ।' : 'Wholesale auction markets supplying fresh haor catch to Dhaka and Mymensingh.'}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FISHERIES_DATA.majorFishMarkets.map((market, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {language === 'bn' ? market.nameBn : market.name}
              </h3>
              <div className="text-xs text-slate-500 font-semibold">
                📍 {language === 'bn' ? market.locationBn : market.location}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {language === 'bn' ? market.featuresBn : market.features}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Government Fisheries Programs */}
      <section className="bg-cyan-50/60 rounded-3xl p-6 sm:p-8 border border-cyan-200 space-y-6">
        <SectionHeader
          badge={language === 'bn' ? 'সরকারি প্রণোদনা' : 'Government Programs'}
          title={language === 'bn' ? 'মৎস্য অধিদপ্তরের কর্মসূচি ও জেলে সহায়তা' : 'Fisheries Department Initiatives'}
          subtitle={language === 'bn' ? 'জেলে নিবন্ধন, খাদ্য সহায়তা ও মা মাছ সংরক্ষণ প্রকল্প।' : 'Fishermen ID cards, food subsidies during bans, and sanctuary protection.'}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FISHERIES_DATA.governmentSchemes.map((scheme, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-cyan-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-slate-900">
                  {language === 'bn' ? scheme.titleBn : scheme.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {language === 'bn' ? scheme.descriptionBn : scheme.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {scheme.authority}
                </span>
                <a
                  href={scheme.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-cyan-700 hover:text-cyan-900"
                >
                  <span>{language === 'bn' ? 'অফিসিয়াল পোর্টাল' : 'Portal'}</span>
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
