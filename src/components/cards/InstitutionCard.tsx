import React from 'react';
import { School, GraduationCap, MapPin, Globe, Phone, ExternalLink, Calendar } from 'lucide-react';
import type { EducationInstitution } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { SourceBadge } from '../common/SourceBadge';

interface InstitutionCardProps {
  institution: EducationInstitution;
}

export const InstitutionCard: React.FC<InstitutionCardProps> = ({ institution }) => {
  const { language } = useLanguage();

  const title = language === 'bn' ? institution.nameBn : institution.name;
  const description = language === 'bn' ? institution.descriptionBn : institution.description;
  const location = language === 'bn' ? institution.locationBn : institution.location;
  const categoryLabel = language === 'bn' ? institution.categoryLabel.bn : institution.categoryLabel.en;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-700/90 hover:border-emerald-500/50 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {categoryLabel}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              {institution.type === 'government' ? (language === 'bn' ? 'সরকারি' : 'Government') : (language === 'bn' ? 'বেসরকারি' : 'Non-Govt')}
            </span>
          </div>

          {institution.established && (
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium shrink-0">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'bn' ? `স্থাপিত: ${institution.established}` : `Est: ${institution.established}`}</span>
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 leading-snug">
          {title}
        </h3>

        {institution.eiin && (
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-2">
            EIIN: <span className="font-semibold text-slate-700 dark:text-slate-200">{institution.eiin}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mb-3">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{location}</span>
        </div>

        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
          {description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          {institution.website ? (
            <a
              href={institution.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'অফিসিয়াল ওয়েবসাইট' : 'Official Portal'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-slate-400 text-[11px]">{language === 'bn' ? 'তথ্য যাচাইকৃত' : 'Public Registry Verified'}</span>
          )}

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${institution.name} Netrokona`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 dark:text-slate-400 hover:text-emerald-700 font-medium inline-flex items-center gap-1"
          >
            <span>{language === 'bn' ? 'ম্যাপে খুঁজুন ↗' : 'Find on Map ↗'}</span>
          </a>
        </div>

        <SourceBadge source={institution.source} sourceUrl={institution.sourceUrl} lastVerified={institution.lastVerified} />
      </div>
    </div>
  );
};
