import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, AlertCircle, ArrowRight, Map as MapIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { HISTORY_TIMELINE_DATA } from '../data/history';
import { UPAZILAS_DATA } from '../data/upazilas';
import { HISTORY_INTRO, HISTORY_SECTIONS, HISTORY_SOURCE_NOTE, UPAZILA_HISTORY_NOTES } from '../data/historyNarrative';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SectionHeader } from '../components/common/SectionHeader';
import { SourceBadge } from '../components/common/SourceBadge';

export const HistoryPage: React.FC = () => {
  const { language } = useLanguage();
  const bn = language === 'bn';
  const totalArea = UPAZILAS_DATA.reduce((a, u) => a + u.areaKm2, 0);
  const totalUnions = UPAZILAS_DATA.reduce((a, u) => a + u.unionsList.length, 0);
  const fmt = (n: number) => (bn ? n.toLocaleString('bn-BD') : n.toLocaleString());

  const tocItems = [
    ...HISTORY_SECTIONS.map((s) => ({ id: s.id, label: bn ? s.title.bn : s.title.en })),
    { id: 'timeline', label: bn ? 'সময়রেখা' : 'Timeline' },
    { id: 'upazila-history', label: bn ? 'উপজেলার ইতিহাস' : 'Upazila History' },
  ];

  const keyFacts: [string, string][] = [
    [bn ? 'জেলা হয়' : 'District since', bn ? '১৭ জানুয়ারি ১৯৮৪' : '17 Jan 1984'],
    [bn ? 'উপজেলা' : 'Upazilas', fmt(UPAZILAS_DATA.length)],
    [bn ? 'ইউনিয়ন' : 'Unions', fmt(totalUnions)],
    [bn ? 'আয়তন (বর্গ কিমি)' : 'Area (sq km)', fmt(Math.round(totalArea))],
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumb
        items={[
          { label: 'History & Timeline', labelBn: 'ইতিহাস ও সময়রেখা', href: '/history' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-slate-900 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            {bn ? 'ঐতিহাসিক ধারাবাহিকতা' : 'Historical Chronicle'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {bn ? 'নেত্রকোণা জেলার ইতিহাস' : 'History of Netrokona District'}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
            {bn
              ? 'প্রাচীন কামরূপ রাজ্য থেকে সুসং রাজ্যের পত্তন, টঙ্ক কৃষক আন্দোলন, মহান মুক্তিযুদ্ধ এবং ১৯৮৪ সালের পূর্ণাঙ্গ জেলা গঠন।'
              : 'From ancient Kamarupa and the Susang Kingdom through the Tonk Movement and the 1971 Liberation War to district status in 1984.'}
          </p>
        </div>
      </div>

      {/* Intro + key facts */}
      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 space-y-4">
          <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{bn ? HISTORY_INTRO.bn : HISTORY_INTRO.en}</p>
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-900 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{bn ? HISTORY_SOURCE_NOTE.bn : HISTORY_SOURCE_NOTE.en}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
            <span className="rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {bn ? 'প্রকাশিত সূত্র-ভিত্তিক তথ্য' : 'Published-source facts'}
            </span>
            <span className="rounded-full bg-amber-50 dark:bg-amber-900/30 px-3 py-1 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {bn ? 'লোকশ্রুতি/মতভেদ আলাদাভাবে চিহ্নিত' : 'Tradition/disputed details labelled'}
            </span>
          </div>
        </div>
        <dl className="bg-emerald-50 dark:bg-emerald-900/30 rounded-3xl p-6 border border-emerald-200 dark:border-emerald-800 grid grid-cols-2 gap-4 content-start">
          {keyFacts.map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">{k}</dt>
              <dd className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Table of contents */}
      <nav aria-label="Contents" className="flex flex-wrap gap-2">
        {tocItems.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}`}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 text-slate-700 dark:text-slate-200 hover:text-emerald-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {t.label}
          </a>
        ))}
      </nav>

      {/* Narrative sections */}
      <div className="space-y-6">
        {HISTORY_SECTIONS.map((sec) => (
          <section key={sec.id} id={sec.id} className="scroll-mt-24 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{bn ? sec.title.bn : sec.title.en}</h2>
              {sec.uncertain && (
                <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  {bn ? 'লোকশ্রুতি / যাচাইাধীন' : 'Folk account / unverified'}
                </span>
              )}
            </div>
            {sec.paragraphs.map((p, i) => (
              <p key={i} className="text-slate-600 dark:text-slate-300 leading-relaxed">{bn ? p.bn : p.en}</p>
            ))}
          </section>
        ))}
      </div>

      {/* Vertical Interactive Timeline */}
      <h2 id="timeline" className="scroll-mt-24 text-2xl font-bold text-slate-900 dark:text-slate-100">
        {bn ? 'সময়রেখা' : 'Timeline'}
      </h2>
      <div className="relative border-l-2 border-emerald-600/40 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-10">
        {HISTORY_TIMELINE_DATA.map((event) => (
          <div key={event.id} className="relative group">
            {/* Timeline Circle Bullet */}
            <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-4 border-emerald-600 group-hover:bg-emerald-600 group-hover:scale-125 transition-all shadow-sm" />

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700/90 hover:border-emerald-500/50 shadow-xs hover:shadow-xl transition-all duration-300 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {bn ? event.periodLabel.bn : event.periodLabel.en}
                </span>

                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{bn ? event.yearDisplayBn : event.yearDisplay}</span>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {bn ? event.titleBn : event.title}
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                {bn ? event.descriptionBn : event.description}
              </p>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                <strong className="text-emerald-800 dark:text-emerald-300 font-bold">
                  {bn ? 'ঐতিহাসিক তাৎপর্য: ' : 'Significance: '}
                </strong>
                {bn ? event.significanceBn : event.significance}
              </div>

              <div className="pt-2">
                <SourceBadge source={event.source} sourceUrl={event.sourceUrl} lastVerified={event.lastVerified} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upazila history & union mapping */}
      <section id="upazila-history" className="scroll-mt-24 space-y-6">
        <SectionHeader
          badge={bn ? 'উপজেলা ও ইউনিয়ন' : 'Upazilas & Unions'}
          title={bn ? 'উপজেলাভিত্তিক ইতিহাস' : 'History by Upazila'}
          subtitle={
            bn
              ? `${fmt(UPAZILAS_DATA.length)}টি উপজেলা ও ${fmt(totalUnions)}টি ইউনিয়নের ইতিহাস ও মানচিত্র।`
              : `History and union maps of ${UPAZILAS_DATA.length} upazilas and ${totalUnions} unions.`
          }
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {UPAZILAS_DATA.map((u, i) => (
            <Link
              key={u.id}
              to={`/history/${u.slug}`}
              className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/60 hover:shadow-lg transition-all flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white text-sm font-bold flex items-center justify-center">
                  {bn ? fmt(i + 1) : String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">{bn ? u.nameBn : u.name}</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{UPAZILA_HISTORY_NOTES[u.id]?.[bn ? 'bn' : 'en']}</p>
              <div className="mt-auto flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>
                  {fmt(u.areaKm2)} {bn ? 'বর্গ কিমি' : 'sq km'} · {fmt(u.unionsList.length)} {bn ? 'ইউনিয়ন' : 'unions'}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300 shrink-0">
                  {bn ? 'ইতিহাস পড়ুন' : 'Read history'}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Upazila -> Union mapping table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="text-left p-4 font-bold text-slate-900 dark:text-slate-100">
              <span className="inline-flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-emerald-600" />
                {bn ? 'উপজেলা–ইউনিয়ন তালিকা' : 'Upazila → Union mapping'}
              </span>
            </caption>
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs uppercase">
              <tr>
                <th className="text-left p-3">{bn ? 'উপজেলা' : 'Upazila'}</th>
                <th className="text-right p-3">{bn ? 'আয়তন' : 'Area'}</th>
                <th className="text-right p-3">{bn ? 'ইউনিয়ন' : 'Unions'}</th>
                <th className="text-left p-3">{bn ? 'ইউনিয়নসমূহ' : 'Union names'}</th>
              </tr>
            </thead>
            <tbody>
              {UPAZILAS_DATA.map((u) => (
                <tr key={u.id} className="border-t border-slate-100 dark:border-slate-800 align-top">
                  <td className="p-3 font-semibold">
                    <Link className="text-emerald-700 dark:text-emerald-300 hover:underline" to={`/history/${u.slug}`}>
                      {bn ? u.nameBn : u.name}
                    </Link>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">{fmt(u.areaKm2)}</td>
                  <td className="p-3 text-right">{fmt(u.unionsList.length)}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{(bn ? u.unionsListBn : u.unionsList).join(', ')}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-200 dark:border-slate-700 font-bold bg-slate-50 dark:bg-slate-900">
                <td className="p-3">{bn ? 'মোট' : 'Total'}</td>
                <td className="p-3 text-right">{fmt(Math.round(totalArea))}</td>
                <td className="p-3 text-right">{fmt(totalUnions)}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
