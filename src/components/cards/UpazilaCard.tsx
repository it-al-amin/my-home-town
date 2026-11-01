import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Maximize2, ArrowRight } from 'lucide-react';
import type { Upazila } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { MapLink } from '../common/MapLink';

interface UpazilaCardProps {
  upazila: Upazila;
}

export const UpazilaCard: React.FC<UpazilaCardProps> = ({ upazila }) => {
  const { language } = useLanguage();

  const title = language === 'bn' ? upazila.nameBn : upazila.name;
  const description = language === 'bn' ? upazila.descriptionBn : upazila.description;
  const hq = language === 'bn' ? upazila.headquartersBn : upazila.headquarters;
  const area = language === 'bn' ? `${upazila.areaKm2} বর্গ কিমি` : `${upazila.areaKm2} km²`;
  const population = language === 'bn' ? `${upazila.population.toLocaleString('bn-BD')} জন` : `${upazila.population.toLocaleString()} people`;
  const unions = language === 'bn' ? `${upazila.unionsCount}টি ইউনিয়ন` : `${upazila.unionsCount} Unions`;

  return (
    <div className="group bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-emerald-500/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        {/* Header with Title and HQ */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mb-1">
              {language === 'bn' ? 'উপজেলা' : 'Upazila'}
            </span>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              <Link to={`/upazilas/${upazila.slug}`}>
                {title}
              </Link>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs mb-3.5">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'bn' ? 'আয়তন' : 'Area'}</span>
            <strong className="text-slate-800 font-semibold">{area}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'bn' ? 'জনসংখ্যা' : 'Population'}</span>
            <strong className="text-slate-800 font-semibold">{population}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'bn' ? 'ইউনিয়ন' : 'Unions'}</span>
            <strong className="text-slate-800 font-semibold">{unions}</strong>
          </div>
        </div>

        <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
          {description}
        </p>

        {/* Highlights Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(language === 'bn' ? upazila.highlightsBn : upazila.highlights).slice(0, 3).map((h, i) => (
            <span
              key={i}
              className="text-[11px] font-medium bg-emerald-50/60 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-md"
            >
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          to={`/upazilas/${upazila.slug}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 group-hover:translate-x-0.5 transition-all"
        >
          <span>{language === 'bn' ? 'উপজেলা বিবরণ' : 'Explore Upazila'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <MapLink
          coordinates={upazila.coordinates}
          query={upazila.mapQuery}
          variant="badge"
          label={language === 'bn' ? 'ম্যাপ' : 'Map'}
        />
      </div>
    </div>
  );
};
