import React, { useMemo, useState } from 'react';
import { ExternalLink, GraduationCap, Globe, MapPin, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { FEED_UPAZILA_LABELS } from '../../data/aggregated';
import directory from '../../data/aggregated/institutions/institutions.json';

interface Photo { url: string; pageUrl: string | null; credit: string; license: string; source: string }
interface Inst {
  id: string; name: string; nameBn: string; category: string; upazilaId: string | null;
  coordinates: { lat: number; lng: number }; website: string | null; phone: string | null;
  photo: Photo | null; sourceName: string; sourceUrl: string;
}

const ALL = (directory as unknown as { institutions: Inst[] }).institutions ?? [];
const CAT: Record<string, { bn: string; en: string }> = {
  university: { bn: 'বিশ্ববিদ্যালয়', en: 'University' },
  college: { bn: 'কলেজ', en: 'College' },
  school: { bn: 'বিদ্যালয়', en: 'School' },
  primary: { bn: 'প্রাথমিক', en: 'Primary' },
  madrasa: { bn: 'মাদ্রাসা', en: 'Madrasa' },
  technical: { bn: 'কারিগরি', en: 'Technical' },
};

/** Upazila-wise institution directory built from OpenStreetMap (partial, unofficial) with openly
 *  licensed photos only. Additive: the verified static list above it is unchanged. */
export const InstitutionDirectory: React.FC = () => {
  const { language } = useLanguage();
  const [upazila, setUpazila] = useState('all');
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const [shown, setShown] = useState(12);
  const bn = language === 'bn';

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    ALL.forEach((i) => { const k = i.upazilaId ?? 'none'; c[k] = (c[k] ?? 0) + 1; });
    return c;
  }, []);

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return ALL.filter((i) =>
      (upazila === 'all' || i.upazilaId === upazila) &&
      (cat === 'all' || i.category === cat) &&
      (!n || `${i.name} ${i.nameBn}`.toLowerCase().includes(n)));
  }, [upazila, cat, q]);

  if (ALL.length === 0) return null;
  const reset = (fn: (v: string) => void) => (v: string) => { fn(v); setShown(12); };
  const sel = 'px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100';

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-amber-600" />
          {bn ? 'উপজেলাভিত্তিক শিক্ষা প্রতিষ্ঠান (সংগৃহীত তালিকা)' : 'Institutions by Upazila (collected directory)'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {bn
            ? `ওপেনস্ট্রিটম্যাপ থেকে সংগৃহীত ${ALL.length}টি প্রতিষ্ঠান। এটি আংশিক ও অনানুষ্ঠানিক তালিকা; সরকারি পূর্ণ তালিকার জন্য উপরের রেজিস্ট্রি দেখুন। ছবি কেবল উন্মুক্ত লাইসেন্সের (উইকিমিডিয়া কমন্স)।`
            : `${ALL.length} institutions collected from OpenStreetMap. This list is partial and unofficial; use the official registries above for the complete list. Photos are only openly licensed ones (Wikimedia Commons).`}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-2">
        <label className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => reset(setQ)(e.target.value)} className={`${sel} w-full pl-9`}
            placeholder={bn ? 'প্রতিষ্ঠান খুঁজুন…' : 'Search institutions…'} />
        </label>
        <select value={upazila} onChange={(e) => reset(setUpazila)(e.target.value)} className={sel} aria-label="Upazila">
          <option value="all">{bn ? `সব উপজেলা (${ALL.length})` : `All upazilas (${ALL.length})`}</option>
          {Object.entries(FEED_UPAZILA_LABELS).map(([id, l]) => (
            <option key={id} value={id}>{l[language]} ({counts[id] ?? 0})</option>
          ))}
        </select>
        <select value={cat} onChange={(e) => reset(setCat)(e.target.value)} className={sel} aria-label="Category">
          <option value="all">{bn ? 'সব ধরন' : 'All types'}</option>
          {Object.entries(CAT).map(([id, l]) => <option key={id} value={id}>{l[language]}</option>)}
        </select>
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {bn ? 'এই ফিল্টারে কোনো প্রতিষ্ঠান পাওয়া যায়নি।' : 'No institutions found for this filter.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.slice(0, shown).map((i) => (
            <article key={i.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
              {i.photo ? (
                <figure>
                  <img src={i.photo.url} alt={bn ? i.nameBn : i.name} loading="lazy" referrerPolicy="no-referrer"
                    className="w-full h-40 object-cover" />
                  <figcaption className="px-3 py-1 text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {bn ? 'ছবি: ' : 'Photo: '}
                    <a href={i.photo.pageUrl ?? i.photo.url} target="_blank" rel="noopener noreferrer" className="underline">
                      {i.photo.credit}
                    </a> · {i.photo.license} · {i.photo.source}
                  </figcaption>
                </figure>
              ) : (
                <div className="h-24 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400" aria-hidden>
                  <GraduationCap className="w-8 h-8" />
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    {CAT[i.category]?.[language] ?? i.category}
                  </span>
                  {i.upazilaId && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{FEED_UPAZILA_LABELS[i.upazilaId]?.[language]}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">{bn ? i.nameBn : i.name}</h3>
                <div className="mt-auto pt-2 flex items-center justify-between gap-2 text-xs">
                  <a href={i.sourceUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:underline">
                    <ExternalLink className="w-3 h-3" />{bn ? 'ম্যাপে দেখুন' : 'View on map'}
                  </a>
                  {i.website && (
                    <a href={i.website} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-teal-700 dark:text-teal-400 hover:underline">
                      <Globe className="w-3 h-3" />{bn ? 'ওয়েবসাইট' : 'Website'}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {list.length > shown && (
        <div className="text-center">
          <button type="button" onClick={() => setShown(shown + 12)}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer">
            {bn ? 'আরও দেখুন' : 'Show more'} ({list.length - shown})
          </button>
        </div>
      )}
      <p className="text-[11px] text-slate-400">
        {bn ? 'তথ্যসূত্র: ' : 'Data: '}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">© OpenStreetMap contributors (ODbL)</a>
      </p>
    </section>
  );
};
