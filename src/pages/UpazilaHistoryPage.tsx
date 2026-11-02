import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Waves, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { UPAZILAS_DATA } from '../data/upazilas';
import { UNIONS_DATA } from '../data/unions';
import { UPAZILA_HISTORY_NOTES } from '../data/historyNarrative';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SourceBadge } from '../components/common/SourceBadge';
import { UpazilaUnionMap } from '../components/map/UpazilaUnionMap';

export const UpazilaHistoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const bn = language === 'bn';
  const upazila = UPAZILAS_DATA.find((u) => u.slug === slug || u.id === slug);

  if (!upazila) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">{bn ? 'উপজেলা পাওয়া যায়নি' : 'Upazila Not Found'}</h2>
        <Link to="/history" className="inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm">
          {bn ? 'ইতিহাস পাতায় ফিরুন' : 'Back to History'}
        </Link>
      </div>
    );
  }

  const idx = UPAZILAS_DATA.indexOf(upazila);
  const prev = UPAZILAS_DATA[idx - 1];
  const next = UPAZILAS_DATA[idx + 1];
  const note = UPAZILA_HISTORY_NOTES[upazila.id];
  const unions = UNIONS_DATA[upazila.id] || [];
  const fmt = (n: number) => (bn ? n.toLocaleString('bn-BD') : n.toLocaleString());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumb
        items={[
          { label: 'History', labelBn: 'ইতিহাস', href: '/history' },
          { label: upazila.name, labelBn: upazila.nameBn },
        ]}
      />

      <header className="bg-gradient-to-br from-stone-900 via-slate-900 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
          {bn ? 'উপজেলার ইতিহাস' : 'Upazila History'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold">{bn ? `${upazila.nameBn}-এর ইতিহাস` : `History of ${upazila.name}`}</h1>
        <p className="text-slate-200 text-sm sm:text-base">
          {fmt(upazila.areaKm2)} {bn ? 'বর্গ কিমি' : 'sq km'} · {fmt(unions.length)} {bn ? 'ইউনিয়ন' : 'unions'} · {bn ? upazila.headquartersBn : upazila.headquarters}
        </p>
      </header>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{bn ? 'ঐতিহাসিক পটভূমি' : 'Historical Background'}</h2>
          {note && <p className="text-slate-700 leading-relaxed">{bn ? note.bn : note.en}</p>}
          <p className="text-slate-600 leading-relaxed">{bn ? upazila.descriptionBn : upazila.description}</p>
          <SourceBadge source={upazila.source} sourceUrl={upazila.sourceUrl} lastVerified={upazila.lastVerified} />
        </div>
        <aside className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200 space-y-4 text-sm">
          <div>
            <h3 className="font-bold text-emerald-900 flex items-center gap-1.5"><Waves className="w-4 h-4" />{bn ? 'নদী' : 'Rivers'}</h3>
            <p className="text-slate-700">{(bn ? upazila.riversBn : upazila.rivers).join(', ')}</p>
          </div>
          <div>
            <h3 className="font-bold text-emerald-900 flex items-center gap-1.5"><ShoppingBag className="w-4 h-4" />{bn ? 'প্রধান বাজার' : 'Major markets'}</h3>
            <p className="text-slate-700">{(bn ? upazila.majorMarketsBn : upazila.majorMarkets).join(', ')}</p>
          </div>
          <Link to={`/upazilas/${upazila.slug}`} className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 hover:underline">
            <MapPin className="w-4 h-4" />{bn ? 'উপজেলার পূর্ণ তথ্য' : 'Full upazila profile'}
          </Link>
        </aside>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">{bn ? `ইউনিয়ন মানচিত্র (${fmt(unions.length)}টি)` : `Union Map (${unions.length})`}</h2>
        <p className="text-xs text-slate-500">
          {bn ? 'দ্রষ্টব্য: ইউনিয়নের অবস্থান আনুমানিক, জিপিএস জরিপভিত্তিক নয়।' : 'Note: union positions are approximate placements, not surveyed GPS points.'}
        </p>
        <UpazilaUnionMap upazila={upazila} height="500px" />
      </section>

      <nav className="flex justify-between gap-4 text-sm font-semibold">
        {prev ? <Link to={`/history/${prev.slug}`} className="inline-flex items-center gap-1.5 text-emerald-700 hover:underline"><ArrowLeft className="w-4 h-4" />{bn ? prev.nameBn : prev.name}</Link> : <span />}
        {next ? <Link to={`/history/${next.slug}`} className="text-emerald-700 hover:underline">{bn ? next.nameBn : next.name} →</Link> : <span />}
      </nav>
    </div>
  );
};
