import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Landmark, Users } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { FactsTimeline, KeyPersonCard } from './FactsParts';
import { KEY_TIMELINE, KEY_PEOPLE } from '../../data/keyFacts';

// Home-page summary: key dates on the left, notable people on the right.
const TIMELINE_IDS = ['subdivision', 'tonk', 'seven-martyrs', 'district', 'balish-gi'];
const PEOPLE_IDS = ['humayun', 'goon', 'helal', 'ukil', 'jalal', 'moni'];

export const FactsHighlights: React.FC = () => {
  const { language } = useLanguage();
  const bn = language === 'bn';
  const timeline = TIMELINE_IDS.map((id) => KEY_TIMELINE.find((t) => t.id === id)!).filter(Boolean);
  const people = PEOPLE_IDS.map((id) => KEY_PEOPLE.find((p) => p.id === id)!).filter(Boolean);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="facts-highlights-heading">
      <div className="rounded-3xl border border-amber-100 dark:border-slate-800 bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-5 sm:p-8 lg:p-10 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-7">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-amber-700 dark:text-amber-400">
              <span className="w-6 h-0.5 bg-amber-500" />
              {bn ? 'ইতিহাস ও গুণীজন' : 'History & notable people'}
            </span>
            <h2 id="facts-highlights-heading" className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {bn ? 'নেত্রকোণাকে জানুন' : 'Get to know Netrokona'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              {bn
                ? 'জেলার গুরুত্বপূর্ণ তারিখ, টংক আন্দোলন, কবি-সাহিত্যিক ও বাউল সাধকদের কথা।'
                : 'Key dates, the Tonk movement, and the district’s poets, writers and baul mystics.'}
            </p>
          </div>
          <Link
            to="/facts"
            className="shrink-0 inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 hover:from-emerald-900 hover:via-emerald-800 hover:to-teal-800 text-white text-sm font-bold shadow-md shadow-emerald-900/20 ring-1 ring-inset ring-white/10 transition-all"
          >
            {bn ? 'সব তথ্য দেখুন' : 'See everything'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">
              <Landmark className="w-4 h-4 text-emerald-600" />
              {bn ? 'গুরুত্বপূর্ণ তারিখ' : 'Key dates'}
            </h3>
            <FactsTimeline items={timeline} compact />
          </div>
          <div className="lg:col-span-7 min-w-0">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">
              <Users className="w-4 h-4 text-emerald-600" />
              {bn ? 'গুণীজন' : 'Notable people'}
            </h3>
            <div className="nk-rail grid grid-cols-1 md:grid-cols-2 gap-3">
              {people.map((p) => (
                <KeyPersonCard key={p.id} person={p} compact />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
