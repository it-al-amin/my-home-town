import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Pencil, Phone, Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api, mediaUrl } from '../../lib/api';
import { CMS_TYPE_LABELS } from '../../types/cms';
import type { CmsContentType, Paged, PublicContent } from '../../types/cms';
import { FEED_UPAZILA_LABELS } from '../../data/aggregated';

interface Props {
  type: CmsContentType;
  title: string;
  titleBn: string;
  limit?: number;
}

/** Published, active, admin-approved community/admin content from the CMS API for one content type.
 *  Additive: renders nothing while loading, when there is none, or if the API is unreachable, so existing pages never break. */
export const CmsContentSection: React.FC<Props> = ({ type, title, titleBn, limit = 6 }) => {
  const { language } = useLanguage();
  const bn = language === 'bn';
  const [items, setItems] = useState<PublicContent[]>([]);

  useEffect(() => {
    let alive = true;
    api<Paged<PublicContent>>(`/api/public/content?type=${type}&pageSize=${limit}`)
      .then((r) => { if (alive) setItems(r.items); })
      .catch(() => { if (alive) setItems([]); });
    return () => { alive = false; };
  }, [type, limit]);

  if (items.length === 0) return null;
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{bn ? titleBn : title}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{bn ? 'প্রশাসক যাচাইকৃত ও অনুমোদিত তথ্য।' : 'Reviewed and approved by an administrator.'}</p>
        </div>
        <Link to={`/contribute?type=${type}`} className="text-sm font-bold text-teal-700 dark:text-teal-400 inline-flex items-center gap-1 hover:underline">
          <Plus className="w-4 h-4" />{bn ? 'তথ্য যোগ করুন' : 'Add information'}
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((c) => {
          const cover = c.images[0];
          const name = (bn ? c.titleBn || c.titleEn : c.titleEn || c.titleBn) ?? '';
          const summary = (bn ? c.summaryBn || c.summaryEn : c.summaryEn || c.summaryBn) ?? '';
          const address = (bn ? c.addressBn || c.addressEn : c.addressEn || c.addressBn) ?? '';
          return (
            <article key={c.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
              {cover && (
                <figure>
                  <img src={mediaUrl(cover.url)} alt={(bn ? cover.altBn || cover.altEn : cover.altEn || cover.altBn) ?? name} loading="lazy" className="w-full h-40 object-cover" />
                  {cover.credit && <figcaption className="px-3 py-1 text-[10px] text-slate-500 dark:text-slate-400 truncate">{bn ? 'ছবি: ' : 'Photo: '}{cover.credit}</figcaption>}
                </figure>
              )}
              <div className="p-4 flex-1 flex flex-col gap-2">
                <span className="self-start px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">{CMS_TYPE_LABELS[c.type][language]}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">{name}</h3>
                {summary && <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{summary}</p>}
                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mt-1">
                  {c.upazilaId && <p className="flex items-center gap-1"><MapPin className="w-3 h-3" />{FEED_UPAZILA_LABELS[c.upazilaId]?.[language]}{address && ` · ${address}`}</p>}
                  {c.phone && <p className="flex items-center gap-1"><Phone className="w-3 h-3" />{c.phone}</p>}
                </div>
                <div className="mt-auto pt-2 flex items-center justify-between text-xs">
                  {c.sourceUrl ? <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 dark:text-emerald-400 hover:underline">{c.sourceName || (bn ? 'সূত্র' : 'Source')}</a> : <span />}
                  <Link to={`/contribute?correct=${encodeURIComponent(c.slug)}`} className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:underline"><Pencil className="w-3 h-3" />{bn ? 'সংশোধনের প্রস্তাব' : 'Suggest correction'}</Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
