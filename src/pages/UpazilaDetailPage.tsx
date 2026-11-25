import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, ShieldAlert, Waves, ShoppingBag, Landmark, History } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { UPAZILAS_DATA } from '../data/upazilas';
import { PLACES_DATA } from '../data/places';
import { UNION_AREAS } from '../data/unions';
import { UPAZILA_HISTORY, UPAZILA_HISTORY_NOTES, UPAZILA_HISTORY_SOURCE } from '../data/historyNarrative';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { MapLink } from '../components/common/MapLink';
import { SourceBadge } from '../components/common/SourceBadge';
import { SectionHeader } from '../components/common/SectionHeader';
import { UpazilaVectorMap } from '../components/map/UpazilaVectorMap';
import { PlaceCard } from '../components/cards/PlaceCard';
import { formatNumber, digits } from '../lib/format';

const card = 'bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs';

export const UpazilaDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const bn = language === 'bn';
  const upazila = UPAZILAS_DATA.find((u) => u.slug === slug || u.id === slug);

  if (!upazila) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{bn ? 'উপজেলা পাওয়া যায়নি' : 'Upazila Not Found'}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">
          {bn ? 'অনুরোধকৃত উপজেলার তথ্য আমাদের ডেটাবেজে নেই।' : 'The requested upazila does not exist in our database.'}
        </p>
        <Link to="/upazilas" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm">
          {bn ? 'সকল উপজেলায় ফিরে যান' : 'Back to Upazilas'}
        </Link>
      </div>
    );
  }

  const n = (v: number) => formatNumber(v, bn);
  const title = bn ? upazila.nameBn : upazila.name;
  const hq = bn ? upazila.headquartersBn : upazila.headquarters;
  const areas = UNION_AREAS[upazila.id] ?? [];
  const unionCount = areas.filter((a) => a.kind === 'union').length;
  const hasMunicipality = areas.some((a) => a.kind === 'paurashava');
  const places = PLACES_DATA.filter((p) => p.upazilaId === upazila.id);
  const history = UPAZILA_HISTORY[upazila.id];
  const note = UPAZILA_HISTORY_NOTES[upazila.id];

  const stats: [string, string][] = [
    [bn ? 'মোট আয়তন' : 'Total area', bn ? `${n(upazila.areaKm2)} বর্গ কিমি` : `${upazila.areaKm2} sq km`],
    [bn ? 'জনসংখ্যা (২০২২)' : 'Population (2022)', bn ? `${n(upazila.population)} জন` : n(upazila.population)],
    [bn ? 'ইউনিয়ন পরিষদ' : 'Unions', `${n(unionCount)}${bn ? 'টি' : ''}${hasMunicipality ? (bn ? ' + পৌরসভা' : ' + municipality') : ''}`],
    [bn ? 'গ্রাম' : 'Villages', bn ? `${n(upazila.villagesCount)}টি` : n(upazila.villagesCount)],
  ];

  const lists: { icon: typeof Waves; title: string; items: string[]; tone: string }[] = [
    {
      icon: Waves,
      title: bn ? 'প্রবাহিত নদ-নদী ও জলরাশি' : 'Rivers & waterbodies',
      items: bn ? upazila.riversBn : upazila.rivers,
      tone: 'bg-cyan-50 dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-800 text-cyan-900 dark:text-cyan-300',
    },
    {
      icon: ShoppingBag,
      title: bn ? 'ঐতিহ্যবাহী প্রধান হাট ও বাজার' : 'Major markets & bazars',
      items: bn ? upazila.majorMarketsBn : upazila.majorMarkets,
      tone: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300',
    },
  ];

  const contacts: [string | undefined, string][] = [
    [upazila.emergencyContacts?.police, bn ? 'থানা ডিউটি অফিসার' : 'Police thana'],
    [upazila.emergencyContacts?.fireService, bn ? 'ফায়ার সার্ভিস স্টেশন' : 'Fire service'],
    [upazila.emergencyContacts?.healthComplex, bn ? 'উপজেলা স্বাস্থ্য কমপ্লেক্স' : 'Health complex'],
    [upazila.emergencyContacts?.uno, bn ? 'উপজেলা নির্বাহী অফিসার (ইউএনও)' : 'UNO office'],
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumb
        items={[
          { label: 'Upazilas', labelBn: 'উপজেলাসমূহ', href: '/upazilas' },
          { label: upazila.name, labelBn: upazila.nameBn, href: `/upazilas/${upazila.slug}` },
        ]}
      />

      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              {bn ? 'নেত্রকোণা জেলা' : 'Netrokona District'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-slate-200">{bn ? `সদর দপ্তর: ${hq}` : `HQ: ${hq}`}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">{title}</h1>
          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed max-w-2xl">{bn ? upazila.descriptionBn : upazila.description}</p>
          <div className="pt-2 flex flex-wrap gap-3">
            <MapLink coordinates={upazila.coordinates} query={upazila.mapQuery} label={bn ? 'গুগল ম্যাপে উপজেলা দেখুন' : 'View on Google Maps'} />
            {upazila.sourceUrl && (
              <a
                href={upazila.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              >
                <span>{bn ? 'অফিসিয়াল উপজেলা বাতায়ন' : 'Official Upazila Portal'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(([label, value]) => (
          <div key={label} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">{label}</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{value}</div>
          </div>
        ))}
      </div>

      {/* History */}
      <section id="history" className={`scroll-mt-24 ${card} space-y-6`}>
        <SectionHeader
          badge={bn ? 'উপজেলার ইতিহাস' : 'History'}
          title={bn ? `${title}-এর ইতিহাস` : `History of ${title}`}
          subtitle={note ? (bn ? note.bn : note.en) : undefined}
        />
        {history && (
          <div className="grid lg:grid-cols-3 gap-6">
            <ol className="lg:col-span-2 relative border-l-2 border-emerald-200 dark:border-emerald-800 ml-2 space-y-5">
              {history.timeline.map((e) => (
                <li key={e.year + e.text.en} className="pl-5 relative">
                  <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white dark:ring-slate-900" />
                  <div className="text-sm font-black text-emerald-700 dark:text-emerald-400 tabular-nums">{digits(e.year, bn)}</div>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{bn ? e.text.bn : e.text.en}</p>
                </li>
              ))}
            </ol>
            <aside className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 space-y-2 self-start">
              <h3 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <Landmark className="w-4 h-4" />
                {bn ? 'প্রত্নতত্ত্ব ও ঐতিহ্য' : 'Heritage sites'}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{bn ? history.heritage.bn : history.heritage.en}</p>
            </aside>
          </div>
        )}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>
            {bn ? 'তথ্যসূত্র: ' : 'Source: '}
            <a href={UPAZILA_HISTORY_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline">
              {bn ? UPAZILA_HISTORY_SOURCE.labelBn : UPAZILA_HISTORY_SOURCE.label}
            </a>
          </span>
          <Link to="/history" className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300 hover:underline">
            <History className="w-3.5 h-3.5" />
            {bn ? 'জেলার পূর্ণ ইতিহাস' : 'Full district history'}
          </Link>
        </div>
      </section>

      {/* Unions: one vector map with details + village map */}
      <section id="unions" className="scroll-mt-24 space-y-6">
        <SectionHeader
          badge={bn ? 'ইউনিয়ন মানচিত্র' : 'Union map'}
          title={bn ? `${title}-র ইউনিয়নসমূহ` : `Unions of ${title}`}
          subtitle={bn ? 'যেকোনো ইউনিয়নে ক্লিক করুন: বিস্তারিত তথ্য, গ্রামের নাম ও বসতির মানচিত্র দেখা যাবে।' : 'Click any union for its details, village names and a settlement map.'}
        />
        <UpazilaVectorMap upazila={upazila} />
      </section>

      {/* Rivers & markets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lists.map(({ icon: Icon, title: heading, items, tone }) => (
          <div key={heading} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Icon className="w-5 h-5 text-emerald-600" />
              <span>{heading}</span>
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {items.map((item) => (
                <span key={item} className={`px-3 py-1.5 border rounded-xl text-xs sm:text-sm font-semibold ${tone}`}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Emergency contacts */}
      {contacts.some(([phone]) => phone) && (
        <section className="bg-rose-50/70 dark:bg-rose-900/30 rounded-3xl p-6 sm:p-8 border border-rose-200 dark:border-rose-800 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {bn ? `${title} উপজেলা জরুরি যোগাযোগ নম্বরসমূহ` : `${title} emergency & duty contacts`}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
            {contacts.map(([phone, label]) =>
              phone ? (
                <div key={label} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-rose-200 dark:border-rose-800 shadow-xs">
                  <span className="text-slate-500 dark:text-slate-400 block text-xs font-semibold">{label}</span>
                  <a href={`tel:${phone}`} className="text-base font-bold text-rose-700 dark:text-rose-300 hover:underline">{phone}</a>
                </div>
              ) : null,
            )}
          </div>
        </section>
      )}

      {/* Tourist places */}
      {places.length > 0 && (
        <section className="space-y-6">
          <SectionHeader
            badge={bn ? 'পর্যটন আকর্ষণ' : 'Tourism'}
            title={bn ? `${title}-র দর্শনীয় পর্যটন স্থানসমূহ` : `Tourist attractions in ${title}`}
            subtitle={bn ? 'এই উপজেলার প্রাকৃতিক সৌন্দর্য ও ঐতিহাসিক নিদর্শনসমূহ।' : 'Natural landscape and historical sites located here.'}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </section>
      )}

      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-2 text-xs">
        <SourceBadge source={upazila.source} sourceUrl={upazila.sourceUrl} lastVerified={upazila.lastVerified} />
        <Link to="/upazilas" className="text-emerald-700 dark:text-emerald-300 font-bold hover:underline">
          {bn ? '← সকল উপজেলায় ফিরে যান' : '← Back to all upazilas'}
        </Link>
      </div>
    </div>
  );
};
