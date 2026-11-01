import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Eye, Sparkles } from 'lucide-react';
import type { TouristPlace } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { MapLink } from '../common/MapLink';

interface PlaceCardProps {
  place: TouristPlace;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const { language } = useLanguage();
  const [imgError, setImgError] = useState(false);

  const title = language === 'bn' ? place.nameBn : place.name;
  const description = language === 'bn' ? place.descriptionBn : place.description;
  const locationText = language === 'bn' ? place.locationBn : place.location;
  const categoryLabel = language === 'bn' ? place.categoryLabel.bn : place.categoryLabel.en;

  // Fallback gradient if external image fails
  const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23047857"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="28" fill="%23ffffff">${encodeURIComponent(place.nameBn)}</text></svg>`;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-emerald-500/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container with zoom effect */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-800">
        <img
          src={imgError ? fallbackSvg : place.image}
          alt={title}
          onError={() => setImgError(true)}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-800 backdrop-blur-md shadow-xs">
            {categoryLabel}
          </span>
          {place.featured && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
              <Sparkles className="w-3 h-3" />
              <span>{language === 'bn' ? 'শীর্ষ আকর্ষণ' : 'Top Spot'}</span>
            </span>
          )}
        </div>

        {/* Location tag on bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
          <div className="flex items-center gap-1 text-xs text-white/90 font-medium drop-shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="line-clamp-1">{locationText}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 mb-2">
            <Link to={`/places/${place.id}`}>
              {title}
            </Link>
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <Link
            to={`/places/${place.id}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 group-hover:translate-x-0.5 transition-all"
          >
            <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'Explore Spot'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <MapLink
            coordinates={place.coordinates}
            query={place.mapQuery}
            variant="badge"
            label={language === 'bn' ? 'ম্যাপ' : 'Map'}
          />
        </div>
      </div>
    </div>
  );
};
