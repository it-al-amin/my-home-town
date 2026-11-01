import React from 'react';
import { ShieldCheck, ExternalLink, BookCheck, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SOURCES_DATA } from '../data/sources';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SectionHeader } from '../components/common/SectionHeader';

export const SourcesPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumb
        items={[
          { label: 'Sources & Methodology', labelBn: 'তথ্যসূত্র ও যাচাইকরণ নীতি', href: '/sources' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            {language === 'bn' ? 'স্বচ্ছতা ও সত্যতা নীতি' : 'Data Integrity & Policy'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {language === 'bn' ? 'তথ্যসূত্র, গবেষণা ও যাচাইকরণ পদ্ধতি' : 'Sources, Methodology & Verification Policy'}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
            {language === 'bn'
              ? 'এই পোর্টালে উপস্থাপিত প্রতিটি তথ্য সরকারি গেজেট, বাংলাদেশ পরিসংখ্যান ব্যুরো (বিবিএস), জাতীয় সংসদ সচিবালয় ও উন্মুক্ত নির্ভরযোগ্য পাবলিক রেকর্ড থেকে সংগৃহীত।'
              : 'Every data point on this portal is drawn exclusively from verified official portals, the Bangladesh Bureau of Statistics (BBS), and peer-reviewed reference works.'}
          </p>
        </div>
      </div>

      {/* Core Verification Principles */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <SectionHeader
          badge={language === 'bn' ? 'মূল নীতিমালা' : 'Editorial Guidelines'}
          title={language === 'bn' ? 'আমাদের তথ্য যাচাইকরণ নীতি' : 'Our Verification Standards'}
          subtitle={language === 'bn' ? 'কোনো মনগড়া বা যাচাইহীন তথ্য এই ওয়েবসাইটে প্রকাশ করা হয় না।' : 'Zero fabrication of people, institutions, statistics, or political designations.'}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-100 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm sm:text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{language === 'bn' ? '১. শতভাগ নির্ভরযোগ্যতা' : '1. Official Records Only'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {language === 'bn'
                ? 'উপজেলার আয়তন, জনসংখ্যা ও ইউনিয়নের সংখ্যা বাংলাদেশ পরিসংখ্যান ব্যুরো (BBS) ২০২২ জনশুমারি এবং জেলা প্রশাসনের রেকর্ড অনুযায়ী নিশ্চিত করা হয়েছে।'
                : 'Area metrics, census numbers, and administrative boundaries are calibrated with official BBS 2022 Census gazettes.'}
            </p>
          </div>

          <div className="p-5 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-2">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm sm:text-base">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>{language === 'bn' ? '২. রাজনৈতিক নিরপেক্ষতা' : '2. Political Neutrality'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {language === 'bn'
                ? 'সংসদীয় আসন ও প্রতিনিধিত্বের ক্ষেত্রে কোনো রাজনৈতিক পক্ষপাত ব্যতিরেকে জাতীয় সংসদ সচিবালয়ের অফিসিয়াল রেকর্ড ও ২০২৪ সালের ৬ আগস্টের সংসদ বিলুপ্তির সাংবিধানিক ঘোষণা অনুসরণ করা হয়েছে।'
                : 'Parliamentary representation is documented factually with zero partisan bias, strictly citing the official gazette dissolution of the 12th parliament.'}
            </p>
          </div>

          <div className="p-5 bg-amber-50/70 rounded-2xl border border-amber-100 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm sm:text-base">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span>{language === 'bn' ? '৩. সরাসরি সরকারি লিঙ্ক' : '3. Direct Portal Access'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {language === 'bn'
                ? 'নাগরিক সেবাসমূহ আমাদের ওয়েবসাইটে দাবি না করে সরাসরি মূল সরকারি পোর্টালে (যেমন—mutation.land.gov.bd, bdris.gov.bd) লিঙ্ক করা হয়েছে।'
                : 'All citizen services link directly to their authoritative Bangladesh Government portals rather than simulating internal processing.'}
            </p>
          </div>
        </div>
      </section>

      {/* Sourced Authorities Directory */}
      <section className="space-y-6">
        <SectionHeader
          badge={language === 'bn' ? 'তথ্য উৎস তালিকা' : 'Official Sources'}
          title={language === 'bn' ? 'অনুমোদিত সরকারি ও নির্ভরযোগ্য উৎসসমূহ' : 'Primary Authoritative Portals'}
          subtitle={language === 'bn' ? 'প্রতিটি তথ্যের স্বচ্ছ উৎস ও পাবলিক ওয়েবসাইটের তালিকা।' : 'Direct references cited throughout this portal.'}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SOURCES_DATA.map((src, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {src.domain}
                  </span>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-500 hover:text-emerald-700 font-medium inline-flex items-center gap-1"
                  >
                    <span>{language === 'bn' ? 'ওয়েবসাইটে যান' : 'Visit Portal'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {language === 'bn' ? src.nameBn : src.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {language === 'bn' ? src.descriptionBn : src.description}
                </p>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {src.dataCategories.map((c, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
