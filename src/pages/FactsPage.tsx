import React from 'react';
import { BookOpen, Landmark, Feather, Music2, Flag, ScrollText, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { FactsTimeline, KeyPersonCard, KeyInfoCard, SourceLink } from '../components/facts/FactsParts';
import { KEY_TIMELINE, KEY_DISTRICT_FACTS, KEY_PEOPLE, KEY_FOLK, KEY_PLACES } from '../data/keyFacts';

const SECTIONS = [
  { id: 'history', icon: Landmark, bn: 'ইতিহাসের সময়রেখা', en: 'History timeline' },
  { id: 'glance', icon: BookOpen, bn: 'এক নজরে জেলা', en: 'District at a glance' },
  { id: 'writers', icon: Feather, bn: 'কবি ও সাহিত্যিক', en: 'Poets & writers' },
  { id: 'baul', icon: Music2, bn: 'বাউল ও লোকসংগীত', en: 'Baul & folk music' },
  { id: 'movement', icon: Flag, bn: 'আন্দোলনের অগ্রনায়ক', en: 'Leaders of movements' },
  { id: 'folk', icon: ScrollText, bn: 'লোকসাহিত্য', en: 'Folk literature' },
  { id: 'places', icon: MapPin, bn: 'ঐতিহাসিক ও দর্শনীয় স্থান', en: 'Historic places & landmarks' },
] as const;

export const FactsPage: React.FC = () => {
  const { language } = useLanguage();
  const bn = language === 'bn';
  const title = (id: (typeof SECTIONS)[number]['id']) => {
    const s = SECTIONS.find((x) => x.id === id)!;
    return (
      <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
        <s.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        {bn ? s.bn : s.en}
      </h2>
    );
  };
  const people = (group: 'writers' | 'baul' | 'movement') => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {KEY_PEOPLE.filter((p) => p.group === group).map((p) => (
        <KeyPersonCard key={p.id} person={p} />
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
      <Breadcrumb items={[{ label: 'History & notable people', labelBn: 'ইতিহাস ও গুণীজন' }]} />

      <header className="relative overflow-hidden rounded-3xl border border-emerald-100 dark:border-slate-800 bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-6 sm:p-10">
        <div aria-hidden="true" className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-emerald-200/50 dark:bg-emerald-900/20 blur-3xl" />
        <div className="relative max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {bn ? 'নেত্রকোণা: ইতিহাস, গুণীজন ও ঐতিহ্য' : 'Netrokona: history, people & heritage'}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {bn
              ? 'জেলার গুরুত্বপূর্ণ তারিখ, কবি-সাহিত্যিক, বাউল সাধক, আন্দোলনের অগ্রনায়ক, লোকসাহিত্য ও ঐতিহাসিক স্থান — প্রতিটি তথ্য বাংলাপিডিয়া, উইকিপিডিয়া বা জেলা তথ্য বাতায়নের সাথে মিলিয়ে দেওয়া।'
              : 'Key dates, poets and writers, baul mystics, leaders of movements, folk literature and historic places — each checked against Banglapedia, Wikipedia or the district portal.'}
          </p>
        </div>
      </header>

      {/* In-page navigation */}
      <nav aria-label={bn ? 'এই পাতায়' : 'On this page'} className="nk-chips flex flex-wrap gap-2 sticky top-16 sm:top-20 z-20 py-2 -my-2 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
          >
            <s.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            {bn ? s.bn : s.en}
          </a>
        ))}
      </nav>

      <section id="history" className="scroll-mt-36">
        {title('history')}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 sm:p-8">
          <FactsTimeline items={KEY_TIMELINE} />
        </div>
      </section>

      <section id="glance" className="scroll-mt-36">
        {title('glance')}
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {KEY_DISTRICT_FACTS.map((f) => (
            <div key={f.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3">
              <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400">{bn ? f.labelBn : f.labelEn}</dt>
              <dd className="mt-0.5 text-[15px] font-bold text-slate-900 dark:text-white">{bn ? f.valueBn : f.valueEn}</dd>
              <SourceLink source={f.source} />
            </div>
          ))}
        </dl>
      </section>

      <section id="writers" className="scroll-mt-36">
        {title('writers')}
        {people('writers')}
      </section>

      <section id="baul" className="scroll-mt-36">
        {title('baul')}
        {people('baul')}
      </section>

      <section id="movement" className="scroll-mt-36">
        {title('movement')}
        {people('movement')}
      </section>

      <section id="folk" className="scroll-mt-36">
        {title('folk')}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {KEY_FOLK.map((c) => (
            <KeyInfoCard key={c.id} card={c} />
          ))}
        </div>
      </section>

      <section id="places" className="scroll-mt-36">
        {title('places')}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {KEY_PLACES.map((c) => (
            <KeyInfoCard key={c.id} card={c} />
          ))}
        </div>
      </section>

      <p className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-4">
        {bn
          ? 'নির্ভরযোগ্য সূত্রে যাচাই করা যায়নি এমন তথ্য এখানে রাখা হয়নি। কোনো ভুল চোখে পড়লে “তথ্য দিন” পাতা থেকে জানান।'
          : 'Information that could not be verified against a reliable source is not included. Spotted an error? Tell us via the Contribute page.'}
      </p>
    </div>
  );
};
