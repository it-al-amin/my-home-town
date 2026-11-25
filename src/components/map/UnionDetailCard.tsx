import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Home, Landmark, Hospital } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { PLACES_DATA } from '../../data/places';
import { HEALTH_DATA } from '../../data/health';
import type { Upazila, UnionInfo } from '../../types';
import { formatNumber, digits } from '../../lib/format';
import { mapTheme, pointInRings } from './geo';

/** Everything known about one union: census figures, a written summary, villages and what lies inside it. */
export const UnionDetailCard: React.FC<{ union: UnionInfo; upazila: Upazila }> = ({ union, upazila }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const bn = language === 'bn';
  const t = mapTheme(theme === 'dark');
  const n = (v: number) => formatNumber(v, bn);
  const c = union.census;
  const inside = (p: { lat: number; lng: number }) => pointInRings([p.lng, p.lat], union.rings);
  const places = PLACES_DATA.filter((p) => p.upazilaId === upazila.id && inside(p.coordinates));
  const health = HEALTH_DATA.filter((h) => h.upazilaId === upazila.id && h.coordinates && inside(h.coordinates));
  const name = bn ? union.nameBn : union.name;
  const upazilaName = bn ? upazila.nameBn : upazila.name;
  const isTown = union.kind === 'paurashava';

  const summary = (() => {
    if (isTown) {
      return bn
        ? `${name} হলো ${upazilaName} উপজেলার শহর এলাকা, উপজেলা সদর দপ্তর ও প্রধান বাজার এখানে অবস্থিত।`
        : `${name} is the urban area of ${upazilaName} upazila, home to the upazila headquarters and its main bazaar.`;
    }
    const base = bn ? `${name} ${upazilaName} উপজেলার একটি ইউনিয়ন পরিষদ।` : `${name} is a union parishad of ${upazilaName} upazila.`;
    const census = c
      ? bn
        ? ` আয়তন প্রায় ${n(c.areaKm2)} বর্গ কিমি; ২০১১ সালের আদমশুমারি অনুযায়ী জনসংখ্যা ${n(c.population)} জন (পুরুষ ${n(c.male)}, নারী ${n(c.female)}) এবং সাক্ষরতার হার ${n(c.literacyPct)}%।`
        : ` It covers about ${n(c.areaKm2)} km²; the 2011 census counted ${n(c.population)} people (${n(c.male)} male, ${n(c.female)} female) with a literacy rate of ${c.literacyPct}%.`
      : '';
    const footprint = union.settlementCount
      ? bn
        ? ` এলজিইডি মানচিত্রে এখানে ${n(union.settlementCount)}টি বসতি এলাকা চিহ্নিত আছে।`
        : ` LGED maps ${n(union.settlementCount)} settlement areas here.`
      : '';
    const sights = places.length
      ? bn
        ? ` দর্শনীয় স্থান: ${places.map((p) => p.nameBn).join(', ')}।`
        : ` Sights: ${places.map((p) => p.name).join(', ')}.`
      : '';
    return base + census + footprint + sights;
  })();

  const stats: [string, string][] = c
    ? [
        [bn ? 'আয়তন' : 'Area', bn ? `${n(c.areaKm2)} বর্গ কিমি` : `${c.areaKm2} km²`],
        [bn ? 'জনসংখ্যা (২০১১)' : 'Population (2011)', n(c.population)],
        [bn ? 'জনঘনত্ব' : 'Density', `${n(Math.round(c.population / c.areaKm2))} ${bn ? '/বর্গ কিমি' : '/km²'}`],
        [bn ? 'সাক্ষরতা' : 'Literacy', `${n(c.literacyPct)}%`],
        [bn ? 'পুরুষ / নারী' : 'Male / female', `${n(c.male)} / ${n(c.female)}`],
        [bn ? 'বসতি এলাকা' : 'Settlement areas', n(union.settlementCount)],
      ]
    : [[bn ? 'বসতি এলাকা' : 'Settlement areas', n(union.settlementCount)]];

  return (
    <article className={`p-5 sm:p-6 rounded-3xl border shadow-sm space-y-4 ${t.card}`}>
      <header className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            {isTown ? (bn ? 'পৌরসভা' : 'Municipality') : bn ? 'ইউনিয়ন পরিষদ' : 'Union Parishad'}
            {c && ` · ${bn ? 'জিও কোড' : 'GO code'} ${digits(c.goCode, bn)}`}
          </span>
          <h3 className="text-2xl font-extrabold tracking-tight">{name}</h3>
          <p className={`text-xs ${t.muted}`}>{bn ? `${upazila.nameBn} উপজেলা, নেত্রকোণা` : `${upazila.name} upazila, Netrokona`}</p>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${union.coordinates.lat},${union.coordinates.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`shrink-0 px-2.5 py-1 text-xs rounded-md font-medium border flex items-center gap-1 ${t.chip} ${t.chipHover}`}
        >
          <ExternalLink className="w-3 h-3" />
          Google Maps
        </a>
      </header>

      <p className="text-sm leading-relaxed">{summary}</p>

      <div className="grid grid-cols-2 gap-2">
        {stats.map(([label, value]) => (
          <div key={label} className={`p-2.5 rounded-xl border ${t.tile}`}>
            <div className={`text-[11px] ${t.muted}`}>{label}</div>
            <div className={`text-sm font-bold mt-0.5 tabular-nums ${t.strong}`}>{value}</div>
          </div>
        ))}
      </div>

      <section>
        <h4 className={`text-xs font-bold flex items-center gap-1.5 mb-2 ${t.strong}`}>
          <Home className="w-3.5 h-3.5 text-teal-500" />
          {bn ? `গ্রাম ও পাড়া (${n(union.villages.length)}টি নামসহ)` : `Villages & paras (${union.villages.length} named)`}
        </h4>
        {union.villages.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {union.villages.map((v) => (
              <span key={v.nameBn} className={`px-2 py-0.5 rounded-md border text-xs ${t.tile}`}>{bn ? v.nameBn : v.name}</span>
            ))}
          </div>
        ) : null}
        <p className={`mt-2 text-[11px] ${t.muted}`}>
          {bn
            ? 'গ্রামের নাম ওপেনস্ট্রিটম্যাপ থেকে নেওয়া এবং এখনো অসম্পূর্ণ। আপনার গ্রামের নাম যোগ করতে "তথ্য দিন" পাতায় জানান।'
            : 'Village names come from OpenStreetMap and are still incomplete. Tell us yours on the Contribute page.'}{' '}
          <Link to="/contribute" className="underline font-semibold">{bn ? 'তথ্য দিন' : 'Contribute'}</Link>
        </p>
      </section>

      {(places.length > 0 || health.length > 0) && (
        <section className="space-y-1.5">
          {places.map((p) => (
            <Link key={p.id} to={`/places/${p.slug}`} className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-semibold hover:border-orange-500 ${t.tile}`}>
              <Landmark className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              {bn ? p.nameBn : p.name}
            </Link>
          ))}
          {health.map((h) => (
            <div key={h.id} className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-semibold ${t.tile}`}>
              <Hospital className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              {bn ? h.nameBn : h.name}
            </div>
          ))}
        </section>
      )}

      {c && (
        <p className={`text-[11px] ${t.muted}`}>
          {bn ? 'জনসংখ্যা: বাংলাদেশ আদমশুমারি ২০১১ (বাংলাপিডিয়া)।' : 'Population: Bangladesh Census 2011 (Banglapedia).'}
        </p>
      )}
    </article>
  );
};
