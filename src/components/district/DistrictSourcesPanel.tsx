import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Landmark, Library, ExternalLink, RefreshCw, CheckCircle2, AlertTriangle, Images } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  WIKIPEDIA,
  BANGLAPEDIA,
  GOV_SPOTS,
  GOV_ALBUMS,
  GOV_PORTAL_URL,
  DISTRICT_SOURCE_STATUS,
  formatSourceDate,
} from '../../data/aggregated/district';

const toBn = (v: number | string) => String(v).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);
const fmt = (n: number | undefined, bn: boolean) => (n == null ? '—' : n.toLocaleString(bn ? 'bn-BD' : 'en-US'));

const INCOME_BN: Record<string, string> = {
  Agriculture: 'কৃষি',
  commerce: 'ব্যবসা-বাণিজ্য',
  service: 'চাকরি',
  'non-agricultural labourer': 'অকৃষি শ্রমিক',
  'transport and communication': 'পরিবহন ও যোগাযোগ',
  construction: 'নির্মাণ',
  industry: 'শিল্প',
  'religious service': 'ধর্মীয় সেবা',
  'rent and remittance': 'ভাড়া ও প্রবাসী আয়',
  others: 'অন্যান্য',
};
const RIVER_BN: Record<string, string> = {
  Dhanu: 'ধনু', Dhalai: 'ধলাই', Ghorautra: 'ঘোড়াউত্রা', piyain: 'পিয়াইন', Gunai: 'গুনাই', Someshwari: 'সোমেশ্বরী',
};
const UPAZILA_BN: Record<string, string> = {
  Atpara: 'আটপাড়া', Kalmakanda: 'কলমাকান্দা', Kendua: 'কেন্দুয়া', Khaliajuri: 'খালিয়াজুরী', Durgapur: 'দুর্গাপুর',
  'Netrokona Sadar': 'নেত্রকোণা সদর', Purbadhala: 'পূর্বধলা', Barhatta: 'বারহাট্টা', Madan: 'মদন', Mohanganj: 'মোহনগঞ্জ',
};
const SOURCE_LABEL: Record<string, { bn: string; en: string; url: string }> = {
  gov: { bn: 'জেলা তথ্য বাতায়ন – দর্শনীয় স্থান', en: 'District portal – tourist spots', url: `${GOV_PORTAL_URL}/pages/tourist-spot` },
  gallery: { bn: 'জেলা তথ্য বাতায়ন – ফটোগ্যালারি', en: 'District portal – photo gallery', url: `${GOV_PORTAL_URL}/pages/photo-galleries` },
  wiki: { bn: 'বাংলা উইকিপিডিয়া', en: 'Bengali Wikipedia', url: WIKIPEDIA.sourceUrl },
  banglapedia: { bn: 'বাংলাপিডিয়া', en: 'Banglapedia', url: BANGLAPEDIA.sourceUrl },
};

interface Props {
  /** "full" adds the upazila census table (About page). */
  variant?: 'home' | 'full';
  className?: string;
}

export const DistrictSourcesPanel: React.FC<Props> = ({ variant = 'home', className = '' }) => {
  const { language } = useLanguage();
  const bn = language === 'bn';
  const bp = BANGLAPEDIA;
  const year = bn ? toBn(bp.censusYear) : bp.censusYear;

  const facts: { label: string; value: string }[] = [
    { label: bn ? 'আয়তন' : 'Area', value: bn ? `${toBn(bp.areaKm2)} বর্গ কিমি` : `${bp.areaKm2} km²` },
    { label: bn ? `জনসংখ্যা (${year})` : `Population (${year})`, value: fmt(bp.population.total, bn) },
    { label: bn ? 'জনঘনত্ব' : 'Density', value: bn ? `${fmt(bp.population.densityPerKm2, bn)}/বর্গ কিমি` : `${fmt(bp.population.densityPerKm2, bn)}/km²` },
    { label: bn ? `সাক্ষরতা (${year})` : `Literacy (${year})`, value: bp.literacy.averagePct != null ? `${bn ? toBn(bp.literacy.averagePct) : bp.literacy.averagePct}%` : '—' },
    { label: bn ? 'মৌজা / গ্রাম' : 'Mouzas / villages', value: bp.administration ? `${fmt(bp.administration.mouzas, bn)} / ${fmt(bp.administration.villages, bn)}` : '—' },
    { label: bn ? 'মহকুমা → জেলা' : 'Sub-division → district', value: bn ? `${toBn(bp.subdivisionFormed ?? '')} → ${toBn(bp.districtFormed ?? '')}` : `${bp.subdivisionFormed} → ${bp.districtFormed}` },
    { label: bn ? 'কলেজ / মাধ্যমিক বিদ্যালয়' : 'Colleges / secondary schools', value: `${fmt(bp.institutions.college, bn)} / ${fmt(bp.institutions.secondarySchool, bn)}` },
    { label: bn ? 'প্রাথমিক বিদ্যালয় / মাদ্রাসা' : 'Primary schools / madrasas', value: `${fmt(bp.institutions.primarySchool, bn)} / ${fmt(bp.institutions.madrasa, bn)}` },
  ];
  const income = Object.entries(bp.incomeSharePct ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const card = 'rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6';
  const eyebrow = 'flex items-center gap-2 text-xs font-bold uppercase tracking-wider';

  return (
    <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`} aria-labelledby="district-sources-heading">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            {bn ? 'নির্ভরযোগ্য উৎস থেকে সংকলিত' : 'Compiled from reliable sources'}
          </span>
          <h2 id="district-sources-heading" className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
            {bn ? 'এক নজরে নেত্রকোণা জেলা' : 'Netrokona District at a glance'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {bn
              ? 'জেলা তথ্য বাতায়ন, বাংলা উইকিপিডিয়া ও বাংলাপিডিয়া থেকে স্বয়ংক্রিয়ভাবে সংগ্রহ করা তথ্য — প্রতিদিন হালনাগাদ হয়।'
              : 'Collected automatically from the district portal, Bengali Wikipedia and Banglapedia, and refreshed daily.'}
          </p>
        </div>
        <Link to="/gallery" className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 dark:text-teal-400 hover:underline shrink-0">
          <Images className="w-4 h-4" />
          {bn ? `ফটো গ্যালারি (${toBn(GOV_ALBUMS.length + GOV_SPOTS.length)}টি অ্যালবাম)` : `Photo gallery (${GOV_ALBUMS.length + GOV_SPOTS.length} albums)`}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Wikipedia intro */}
        <article className={`${card} lg:col-span-2 flex flex-col`}>
          <div className={`${eyebrow} text-slate-500 dark:text-slate-400`}>
            <BookOpen className="w-4 h-4 text-teal-600" />
            {bn ? 'বাংলা উইকিপিডিয়া' : 'Bengali Wikipedia'}
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-2">{WIKIPEDIA.title}</h3>
          <p lang="bn" className="text-[15px] leading-7 text-slate-700 dark:text-slate-300 mt-2 whitespace-pre-line line-clamp-6 sm:line-clamp-[12]">
            {WIKIPEDIA.introBn}
          </p>
          <div className="mt-auto pt-4 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
            <a href={WIKIPEDIA.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-teal-700 dark:text-teal-400 hover:underline">
              {bn ? 'পুরো নিবন্ধ পড়ুন' : 'Read the full article'} <ExternalLink className="w-3 h-3" />
            </a>
            <span>{bn ? 'লাইসেন্স' : 'Licence'}: {WIKIPEDIA.licence}</span>
            {WIKIPEDIA.lastEdited && <span>{bn ? 'সর্বশেষ সম্পাদনা' : 'Last edited'}: {formatSourceDate(WIKIPEDIA.lastEdited, language)}</span>}
          </div>
        </article>

        {/* Banglapedia facts */}
        <article className={`${card} lg:col-span-3`}>
          <div className={`${eyebrow} text-slate-500 dark:text-slate-400`}>
            <Library className="w-4 h-4 text-teal-600" />
            {bn ? `বাংলাপিডিয়া · আদমশুমারি ${year}` : `Banglapedia · Census ${year}`}
          </div>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
            {facts.map((f) => (
              <div key={f.label} className="rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/60 p-3">
                <dt className="text-[11px] text-slate-500 dark:text-slate-400">{f.label}</dt>
                <dd className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">{bn ? 'প্রধান নদী' : 'Main rivers'}</h4>
              <div className="flex flex-wrap gap-1.5">
                {bp.mainRivers.map((r) => (
                  <span key={r} className="px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-800 border border-sky-100 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900">
                    {bn ? RIVER_BN[r] ?? r : r.charAt(0).toUpperCase() + r.slice(1)}
                  </span>
                ))}
              </div>
              {bp.indigenousCommunities.length > 0 && (
                <>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-4 mb-2">{bn ? 'ক্ষুদ্র নৃগোষ্ঠী' : 'Indigenous communities'}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {bn ? 'গারো, হাজং, হদি ও বানাই' : bp.indigenousCommunities.join(', ')}
                  </p>
                </>
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">{bn ? 'প্রধান আয়ের উৎস (পরিবারের %)' : 'Main sources of income (% of households)'}</h4>
              <table className="w-full text-sm">
                <tbody>
                  {income.map(([k, v]) => (
                    <tr key={k} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <td className="py-1.5 text-slate-600 dark:text-slate-300">{bn ? INCOME_BN[k] ?? k : k.charAt(0).toUpperCase() + k.slice(1)}</td>
                      <td className="py-1.5 text-right font-semibold tabular-nums text-slate-900 dark:text-white">{bn ? toBn(v) : v}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
            <a href={bp.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-teal-700 dark:text-teal-400 hover:underline">
              {bn ? 'বাংলাপিডিয়ায় বিস্তারিত' : 'Full entry on Banglapedia'} <ExternalLink className="w-3 h-3" />
            </a>
            <span>{bn ? 'শুধু তথ্য-উপাত্ত নেওয়া হয়েছে; মূল লেখা বাংলাপিডিয়ার স্বত্বাধীন।' : 'Facts only; the article text is © Banglapedia.'}</span>
          </div>
        </article>
      </div>

      {variant === 'full' && bp.upazilas.length > 0 && (
        <div className={`${card} mt-5 overflow-x-auto`}>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-3">
            {bn ? `উপজেলাভিত্তিক পরিসংখ্যান (আদমশুমারি ${year}, বাংলাপিডিয়া)` : `Upazila statistics (Census ${year}, Banglapedia)`}
          </h3>
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                {(bn
                  ? ['উপজেলা', 'আয়তন (বর্গ কিমি)', 'ইউনিয়ন', 'মৌজা', 'গ্রাম', 'জনসংখ্যা', 'জনঘনত্ব', 'সাক্ষরতা %']
                  : ['Upazila', 'Area (km²)', 'Unions', 'Mouzas', 'Villages', 'Population', 'Density', 'Literacy %']
                ).map((h, i) => (
                  <th key={h} className={`py-2 font-semibold ${i ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...bp.upazilas].sort((a, b) => b.population - a.population).map((u) => (
                <tr key={u.name} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <td className="py-2 font-semibold text-slate-900 dark:text-white">{bn ? UPAZILA_BN[u.name] ?? u.name : u.name}</td>
                  {[u.areaKm2, u.unions, u.mouzas, u.villages, u.population, u.densityPerKm2, u.literacyPct].map((v, i) => (
                    <td key={i} className="py-2 text-right tabular-nums text-slate-700 dark:text-slate-300">{fmt(v, bn)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Source freshness */}
      <div className="mt-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200 mb-2">
          <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
          {bn ? 'তথ্যসূত্র ও সর্বশেষ হালনাগাদ' : 'Sources & last update'}
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {Object.entries(SOURCE_LABEL).map(([key, s]) => {
            const st = DISTRICT_SOURCE_STATUS.sources?.[key];
            return (
              <li key={key} className="flex items-start gap-1.5">
                {st?.ok === false ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" aria-label={bn ? 'সর্বশেষ চেষ্টা ব্যর্থ' : 'Last attempt failed'} />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                )}
                <span>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
                    {bn ? s.bn : s.en}
                  </a>
                  <br />
                  {st?.lastSuccess ? formatSourceDate(st.lastSuccess, language) : '—'}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-2 flex items-center gap-1.5">
          <Landmark className="w-3.5 h-3.5" />
          {bn
            ? 'সরকারি ছবি ও বিবরণ: নেত্রকোণা জেলা প্রশাসন (netrokona.gov.bd)। উইকিমিডিয়া ছবি তাদের নিজ নিজ মুক্ত লাইসেন্সে ব্যবহৃত।'
            : 'Government photos and descriptions: Netrokona District Administration (netrokona.gov.bd). Wikimedia photos are used under their open licences.'}
        </p>
      </div>
    </section>
  );
};
