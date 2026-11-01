import React from 'react';
import { User, Award, MapPin, ExternalLink } from 'lucide-react';
import type { NotablePerson } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { SourceBadge } from '../common/SourceBadge';

interface PersonCardProps {
  person: NotablePerson;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person }) => {
  const { language } = useLanguage();

  const name = language === 'bn' ? person.nameBn : person.name;
  const bio = language === 'bn' ? person.bioBn : person.bio;
  const birthPlace = language === 'bn' ? person.birthPlaceBn : person.birthPlace;
  const categoryLabel = language === 'bn' ? person.categoryLabel.bn : person.categoryLabel.en;
  const contributions = language === 'bn' ? person.keyContributionsBn : person.keyContributions;

  const yearsDisplay = person.birthYear
    ? `${person.birthYear} – ${person.deathYear || (language === 'bn' ? 'বর্তমান' : 'Present')}`
    : null;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-emerald-500/50 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-lg shrink-0">
              {person.nameBn.slice(0, 1)}
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md inline-block mb-0.5">
                {categoryLabel}
              </span>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {name}
              </h3>
            </div>
          </div>
        </div>

        {yearsDisplay && (
          <div className="text-xs font-semibold text-slate-500 mb-2 font-mono">
            {yearsDisplay}
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span><strong>{language === 'bn' ? 'জন্মস্থান:' : 'Birthplace:'}</strong> {birthPlace}</span>
        </div>

        <p className="text-slate-600 text-xs sm:text-sm line-clamp-4 leading-relaxed mb-4">
          {bio}
        </p>

        {contributions && contributions.length > 0 && (
          <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'bn' ? 'প্রধান অবদান ও স্বীকৃতি:' : 'Key Highlights:'}</span>
            </div>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
              {contributions.slice(0, 2).map((c, idx) => (
                <li key={idx} className="line-clamp-1">{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100">
        <SourceBadge source={person.source} sourceUrl={person.sourceUrl} lastVerified={person.lastVerified} />
      </div>
    </div>
  );
};
