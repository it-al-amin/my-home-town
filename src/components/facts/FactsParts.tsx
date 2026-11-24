import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, MapPin, ArrowRight, BookOpen } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { TimelineItem, KeyPerson, InfoCard, Source } from '../../data/keyFacts';
import { WIKI_PROFILES, type WikiProfile } from '../../data/aggregated/district';

/** Small reference link (used where no scraped article text is shown). */
export const SourceLink: React.FC<{ source: Source; className?: string }> = ({ source, className = '' }) => (
  <a
    href={source.url}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center gap-1 py-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 ${className}`}
  >
    <BookOpen className="w-3 h-3" aria-hidden="true" />
    {source.label}
    <ExternalLink className="w-3 h-3" aria-hidden="true" />
  </a>
);

/** Article introduction scraped from Bengali Wikipedia, collapsible, with the required attribution. */
export const WikiIntro: React.FC<{ profile: WikiProfile; lines?: 3 | 4 | 5 }> = ({ profile, lines = 4 }) => {
  const { language } = useLanguage();
  const bn = language === 'bn';
  const [open, setOpen] = useState(false);
  const long = profile.extract.length > 260;
  const clamp = { 3: 'line-clamp-3', 4: 'line-clamp-4', 5: 'line-clamp-5' }[lines];
  return (
    <div className="space-y-1.5">
      <p lang="bn" className={`text-[13px] sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-line ${open ? '' : clamp}`}>
        {profile.extract}
      </p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {long && (
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
            {open ? (bn ? 'সংক্ষিপ্ত করুন' : 'Show less') : bn ? 'আরও পড়ুন' : 'Read more'}
          </button>
        )}
        <a
          href={profile.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300"
        >
          {bn ? 'উইকিপিডিয়ায় পুরো নিবন্ধ' : 'Full article on Wikipedia'}
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
};

const PhotoCredit: React.FC<{ image: NonNullable<WikiProfile['image']> }> = ({ image }) => (
  <a href={image.pageUrl} target="_blank" rel="noopener noreferrer" className="block text-[10px] leading-tight text-slate-400 hover:text-emerald-700 truncate">
    © {image.author} · {image.licence}
  </a>
);

/** Vertical timeline of key dates. */
export const FactsTimeline: React.FC<{ items: TimelineItem[]; compact?: boolean }> = ({ items, compact = false }) => {
  const { language } = useLanguage();
  const bn = language === 'bn';
  return (
    <ol className="relative border-s-2 border-emerald-200 dark:border-emerald-900 ms-3 space-y-5">
      {items.map((it) => (
        <li key={it.id} className="ms-6">
          <span className="absolute -start-[9px] mt-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-emerald-600" aria-hidden="true" />
          <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-700 text-white tabular-nums">{bn ? it.yearBn : it.yearEn}</span>
          <h3 className="mt-1.5 text-base font-bold text-slate-900 dark:text-white leading-snug">{bn ? it.titleBn : it.titleEn}</h3>
          {!compact && <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{bn ? it.textBn : it.textEn}</p>}
          {!compact && <SourceLink source={it.source} />}
        </li>
      ))}
    </ol>
  );
};

/** Profile card for a poet, baul or historical figure, enriched with the scraped Wikipedia intro and photo. */
export const KeyPersonCard: React.FC<{ person: KeyPerson; compact?: boolean }> = ({ person, compact = false }) => {
  const { language } = useLanguage();
  const bn = language === 'bn';
  const profile = WIKI_PROFILES[person.id];
  const highlights = bn ? person.highlightsBn : person.highlightsEn;
  const initial = (bn ? person.nameBn : person.nameEn).replace(/^(কমরেড|Comrade)\s+/, '').charAt(0);
  const name = bn ? person.nameBn : person.nameEn;

  return (
    <article className="h-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-5 flex flex-col gap-3 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition">
      <div className="flex items-start gap-3">
        {profile?.image ? (
          <div className="shrink-0 w-14">
            <img src={profile.image.url} alt={name} loading="lazy" className="w-14 h-14 rounded-xl object-cover object-top ring-1 ring-black/5 bg-slate-100" />
          </div>
        ) : (
          <span className="w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-xl font-black flex items-center justify-center" aria-hidden="true">
            {initial}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">{name}</h3>
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">{bn ? person.roleBn : person.roleEn}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1">
            <MapPin className="w-3 h-3 mt-0.5 shrink-0" aria-hidden="true" />
            <span>{bn ? person.bornBn : person.bornEn}</span>
          </p>
        </div>
      </div>

      {highlights.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {(compact ? highlights.slice(0, 1) : highlights).map((h) => (
            <li key={h} className="px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-[12px] font-medium text-amber-900 dark:text-amber-200">
              {h}
            </li>
          ))}
        </ul>
      )}

      {!compact && profile && <WikiIntro profile={profile} />}
      {!compact && !profile && <SourceLink source={person.source} className="mt-auto self-start" />}
      {!compact && profile?.image && <div className="mt-auto pt-1"><PhotoCredit image={profile.image} /></div>}
    </article>
  );
};

/** Short information card (folk literature, places), enriched with Wikipedia text/photo when available. */
export const KeyInfoCard: React.FC<{ card: InfoCard }> = ({ card }) => {
  const { language } = useLanguage();
  const bn = language === 'bn';
  const profile = WIKI_PROFILES[card.id];
  return (
    <article className="h-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden flex flex-col shadow-xs">
      {profile?.image && (
        <figure>
          <img src={profile.image.url} alt={bn ? card.titleBn : card.titleEn} loading="lazy" className="w-full h-44 object-cover bg-slate-100" />
          <figcaption className="px-4 pt-1"><PhotoCredit image={profile.image} /></figcaption>
        </figure>
      )}
      <div className="p-4 sm:p-5 flex flex-col gap-2 flex-1">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{bn ? card.titleBn : card.titleEn}</h3>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{bn ? card.textBn : card.textEn}</p>
        {profile && <WikiIntro profile={profile} lines={3} />}
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          {!profile ? <SourceLink source={card.source} /> : <span />}
          {card.placeId && (
            <Link to={`/places/${card.placeId}`} className="inline-flex items-center gap-1 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
              {bn ? 'বিস্তারিত' : 'Details'} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};
