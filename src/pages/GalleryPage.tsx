import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Images, Landmark, Globe2, X, ChevronLeft, ChevronRight, ExternalLink, MapPin, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import {
  GOV_SPOTS,
  GOV_SPOTS_SOURCE,
  GOV_ALBUMS,
  GOV_GALLERY,
  COMMONS_PHOTOS,
  WIKIPEDIA,
  GOV_CREDIT_BN,
  GOV_CREDIT_EN,
  formatSourceDate,
} from '../data/aggregated/district';
import type { CreditedPhoto } from '../types/district';

type TabId = 'spots' | 'albums' | 'commons';

interface Group {
  id: string;
  title: string;
  subtitle?: string;
  sourceUrl: string;
  placeId?: string;
  photos: CreditedPhoto[];
}

const toBn = (v: number | string) => String(v).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);

export const GalleryPage: React.FC = () => {
  const { language } = useLanguage();
  const bn = language === 'bn';
  const [tab, setTab] = useState<TabId>('spots');
  const [viewer, setViewer] = useState<{ photos: CreditedPhoto[]; index: number } | null>(null);

  const govCredit = bn ? GOV_CREDIT_BN : GOV_CREDIT_EN;

  const spotGroups: Group[] = useMemo(
    () =>
      GOV_SPOTS.filter((s) => s.images.length).map((s) => ({
        id: s.govId,
        title: s.titleBn,
        subtitle: s.locationBn,
        sourceUrl: s.sourceUrl,
        placeId: s.placeId,
        photos: s.images.map((url) => ({ url, alt: s.titleBn, credit: govCredit, creditUrl: s.sourceUrl, origin: 'gov' as const })),
      })),
    [govCredit],
  );

  const albumGroups: Group[] = useMemo(
    () =>
      GOV_ALBUMS.map((a) => ({
        id: a.id,
        title: a.titleBn,
        subtitle: a.uploaded ? formatSourceDate(`${a.uploaded}-01`, language).replace(/^\S+\s/, '') : undefined,
        sourceUrl: a.sourceUrl,
        photos: a.images.map((url) => ({ url, alt: a.titleBn, credit: govCredit, creditUrl: a.sourceUrl, origin: 'gov' as const })),
      })),
    [govCredit, language],
  );

  const tabs: { id: TabId; icon: typeof Images; label: string; count: number }[] = [
    { id: 'spots', icon: MapPin, label: bn ? 'দর্শনীয় স্থান' : 'Tourist spots', count: spotGroups.length },
    { id: 'albums', icon: Landmark, label: bn ? 'জেলা প্রশাসনের কার্যক্রম' : 'District administration', count: albumGroups.length },
    { id: 'commons', icon: Globe2, label: bn ? 'উইকিমিডিয়া কমন্স' : 'Wikimedia Commons', count: COMMONS_PHOTOS.length },
  ];

  const open = (photos: CreditedPhoto[], index: number) => setViewer({ photos, index });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb items={[{ label: bn ? 'ফটো গ্যালারি' : 'Photo gallery' }]} />

      <header className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
          {bn ? 'আসল ছবি · সরকারি ও মুক্ত উৎস' : 'Real photos · official & open sources'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          {bn ? 'নেত্রকোণার ফটো গ্যালারি' : 'Netrokona photo gallery'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
          {bn
            ? 'নেত্রকোণা জেলা তথ্য বাতায়নে প্রকাশিত দর্শনীয় স্থান ও জেলা প্রশাসনের কার্যক্রমের ছবি, এবং উইকিমিডিয়া কমন্সের মুক্ত লাইসেন্সের ছবি। প্রতিটি ছবির সাথে মূল উৎসের লিংক দেওয়া আছে।'
            : "Photos of tourist spots and district-administration activities published on the Netrokona District Portal, plus openly-licensed photos from Wikimedia Commons. Every photo links back to its source."}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" />
          {bn ? 'সর্বশেষ সংগ্রহ:' : 'Last collected:'} {formatSourceDate(GOV_GALLERY.fetchedAt ?? GOV_SPOTS_SOURCE.fetchedAt, language)}
        </p>
      </header>

      {/* Tabs */}
      <div role="tablist" aria-label={bn ? 'গ্যালারির ধরন' : 'Gallery type'} className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              tab === t.id
                ? 'border-teal-600 text-teal-700 dark:text-teal-300'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
            <span className="text-xs px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 tabular-nums">{bn ? toBn(t.count) : t.count}</span>
          </button>
        ))}
      </div>

      {tab !== 'commons' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(tab === 'spots' ? spotGroups : albumGroups).map((g) => (
            <article key={g.id} className="group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
              <button type="button" onClick={() => open(g.photos, 0)} className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden" aria-label={bn ? `${g.title} — ছবি দেখুন` : `View photos: ${g.title}`}>
                <img src={g.photos[0].url} alt={g.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {g.photos.length > 1 && (
                  <span className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/65 text-white text-xs font-semibold flex items-center gap-1">
                    <Images className="w-3.5 h-3.5" /> {bn ? toBn(g.photos.length) : g.photos.length}
                  </span>
                )}
              </button>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <h2 lang="bn" className="font-bold text-slate-900 dark:text-white leading-snug line-clamp-3">{g.title}</h2>
                {g.subtitle && <p lang="bn" className="text-xs text-slate-500 dark:text-slate-400">{g.subtitle}</p>}
                <div className="mt-auto pt-2 flex items-center justify-between gap-2 text-xs">
                  {g.placeId ? (
                    <Link to={`/places/${g.placeId}`} className="font-semibold text-teal-700 dark:text-teal-400 hover:underline">
                      {bn ? 'স্থানের বিস্তারিত →' : 'Place details →'}
                    </Link>
                  ) : (
                    <span />
                  )}
                  <a href={g.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300">
                    {bn ? 'মূল উৎস' : 'Source'} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === 'commons' && (
        <>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
            {COMMONS_PHOTOS.map((p, i) => (
              <figure key={p.url} className="break-inside-avoid rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <button type="button" onClick={() => open(COMMONS_PHOTOS, i)} className="block w-full" aria-label={bn ? 'বড় করে দেখুন' : 'View larger'}>
                  <img src={p.url} alt={p.alt} loading="lazy" className="w-full h-auto" />
                </button>
                <figcaption className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{p.alt.split('\n')[0].slice(0, 90)}</span>
                  <br />
                  © <a href={p.creditUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{p.credit}</a> · {p.licence}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {bn ? 'ছবিগুলো বাংলা উইকিপিডিয়ার ' : 'Photos used in the Bengali Wikipedia article '}
            <a href={WIKIPEDIA.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">{WIKIPEDIA.title}</a>
            {bn ? ' নিবন্ধে ব্যবহৃত, উইকিমিডিয়া কমন্স থেকে সংগৃহীত।' : ', collected from Wikimedia Commons.'}
          </p>
        </>
      )}

      {viewer && <Lightbox photos={viewer.photos} start={viewer.index} onClose={() => setViewer(null)} />}
    </div>
  );
};

/* ------------------------------ Lightbox ------------------------------ */

const Lightbox: React.FC<{ photos: CreditedPhoto[]; start: number; onClose: () => void }> = ({ photos, start, onClose }) => {
  const { language } = useLanguage();
  const bn = language === 'bn';
  const [i, setI] = useState(start);
  const prev = useCallback(() => setI((n) => (n - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setI((n) => (n + 1) % photos.length), [photos.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose, prev, next]);

  const p = photos[i];
  return (
    <div role="dialog" aria-modal="true" aria-label={p.alt} className="fixed inset-0 z-[1000] bg-black/90 flex flex-col" onClick={onClose}>
      <div className="flex items-center justify-between px-4 py-3 text-white/90 text-sm" onClick={(e) => e.stopPropagation()}>
        <span className="tabular-nums">{bn ? `${toBn(i + 1)} / ${toBn(photos.length)}` : `${i + 1} / ${photos.length}`}</span>
        <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-white/10" aria-label={bn ? 'বন্ধ করুন' : 'Close'}>
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="relative flex-1 flex items-center justify-center px-2 sm:px-16 min-h-0">
        <img src={p.url} alt={p.alt} className="max-h-full max-w-full object-contain rounded-md" onClick={(e) => e.stopPropagation()} />
        {photos.length > 1 && (
          <>
            <button type="button" onClick={(e) => (e.stopPropagation(), prev())} className="absolute left-2 sm:left-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white" aria-label={bn ? 'আগের ছবি' : 'Previous photo'}>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button type="button" onClick={(e) => (e.stopPropagation(), next())} className="absolute right-2 sm:right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white" aria-label={bn ? 'পরের ছবি' : 'Next photo'}>
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
      <div className="px-4 py-3 text-center text-white/80 text-xs sm:text-sm" onClick={(e) => e.stopPropagation()}>
        <p lang="bn" className="font-semibold text-white line-clamp-2">{p.alt.split('\n')[0]}</p>
        <p className="mt-1">
          {bn ? 'ছবি:' : 'Photo:'}{' '}
          <a href={p.creditUrl} target="_blank" rel="noopener noreferrer" className="underline">{p.credit}</a>
          {p.licence ? ` · ${p.licence}` : ''}
        </p>
      </div>
    </div>
  );
};
