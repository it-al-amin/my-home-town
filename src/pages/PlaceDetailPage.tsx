import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Calendar, Compass, Sparkles, AlertCircle, 
  ArrowLeft, ExternalLink, Info, CheckCircle2 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PLACES_DATA } from '../data/places';
import { UPAZILAS_DATA } from '../data/upazilas';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { MapLink } from '../components/common/MapLink';
import { SourceBadge } from '../components/common/SourceBadge';
import { PlaceCard } from '../components/cards/PlaceCard';

export const PlaceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [imgError, setImgError] = useState(false);

  const place = PLACES_DATA.find((p) => p.id === id || p.slug === id);

  if (!place) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">
          {language === 'bn' ? 'দর্শনীয় স্থান পাওয়া যায়নি' : 'Place Not Found'}
        </h2>
        <p className="text-slate-500 mt-2 mb-6">
          {language === 'bn' ? 'অনুরোধকৃত দর্শনীয় স্থানটি আমাদের তালিকায় নেই।' : 'The requested tourist place does not exist.'}
        </p>
        <Link
          to="/places"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm"
        >
          {language === 'bn' ? 'সকল দর্শনীয় স্থানে ফিরে যান' : 'Back to Tourist Places'}
        </Link>
      </div>
    );
  }

  const title = language === 'bn' ? place.nameBn : place.name;
  const description = language === 'bn' ? place.descriptionBn : place.description;
  const whyVisit = language === 'bn' ? place.whyVisitBn : place.whyVisit;
  const bestTime = language === 'bn' ? place.bestTimeToVisitBn : place.bestTimeToVisit;
  const travelTips = language === 'bn' ? place.travelTipsBn : place.travelTips;
  const locationText = language === 'bn' ? place.locationBn : place.location;
  const categoryLabel = language === 'bn' ? place.categoryLabel.bn : place.categoryLabel.en;
  const nearbyPlaces = language === 'bn' ? place.nearbyPlacesBn : place.nearbyPlaces;

  const upazila = UPAZILAS_DATA.find((u) => u.id === place.upazilaId);

  const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600"><rect width="1200" height="600" fill="%23047857"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="42" fill="%23ffffff">${encodeURIComponent(place.nameBn)}</text></svg>`;

  const otherPlaces = PLACES_DATA.filter((p) => p.id !== place.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumb
        items={[
          { label: 'Tourist Places', labelBn: 'দর্শনীয় স্থান', href: '/places' },
          { label: place.name, labelBn: place.nameBn, href: `/places/${place.id}` },
        ]}
      />

      {/* Main Hero Media & Title Section */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
        <div className="relative h-72 sm:h-96 w-full bg-slate-900">
          <img
            src={imgError ? fallbackSvg : place.image}
            alt={title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 backdrop-blur-md shadow-xs">
              {categoryLabel}
            </span>
            {place.imageCredit && (
              <span className="text-[11px] text-white/80 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-md">
                📷 {place.imageCredit}
              </span>
            )}
          </div>

          {/* Title & Info on image bottom */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-300">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{locationText}</span>
              {upazila && (
                <>
                  <span>•</span>
                  <Link to={`/upazilas/${upazila.slug}`} className="hover:underline text-white font-semibold">
                    {language === 'bn' ? upazila.nameBn : upazila.name}
                  </Link>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              {title}
            </h1>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <MapLink
                coordinates={place.coordinates}
                query={place.mapQuery}
                label={language === 'bn' ? 'গুগল ম্যাপে দিকনির্দেশনা দেখুন' : 'Directions on Google Maps'}
              />
              {upazila && (
                <Link
                  to={`/upazilas/${upazila.slug}`}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                >
                  {language === 'bn' ? `${upazila.nameBn} উপজেলা` : `${upazila.name} Upazila`}
                </Link>
              )}
            </div>

            <SourceBadge source={place.source} sourceUrl={place.sourceUrl} lastVerified={place.lastVerified} />
          </div>

          {/* Detailed Description */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-600" />
              <span>{language === 'bn' ? 'স্থানের বিবরণ ও ইতিহাস' : 'About the Place'}</span>
            </h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {description}
            </p>
          </div>

          {/* Key Insights Grid: Why Visit, Best Time, Travel Tips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 bg-emerald-50/80 rounded-2xl border border-emerald-100 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm sm:text-base">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{language === 'bn' ? 'কেন ভ্রমণ করবেন?' : 'Why Visit?'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {whyVisit}
              </p>
            </div>

            <div className="p-5 bg-blue-50/80 rounded-2xl border border-blue-100 space-y-2">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-sm sm:text-base">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{language === 'bn' ? 'ভ্রমণের সেরা সময়' : 'Best Time to Visit'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {bestTime}
              </p>
            </div>

            <div className="p-5 bg-amber-50/80 rounded-2xl border border-amber-100 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm sm:text-base">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>{language === 'bn' ? 'ভ্রমণ টিপস ও সতর্কতা' : 'Travel Tips & Safety'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {travelTips}
              </p>
            </div>
          </div>

          {/* Nearby Places */}
          {nearbyPlaces.length > 0 && (
            <div className="pt-4 space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>{language === 'bn' ? 'কাছাকাছি অন্যান্য দর্শনীয় স্থান:' : 'Nearby Attractions:'}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {nearbyPlaces.map((np, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200"
                  >
                    {np}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Other Recommended Places */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-900">
          {language === 'bn' ? 'আরও দর্শনীয় পর্যটন স্থান' : 'More Places to Explore'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {otherPlaces.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      </section>
    </div>
  );
};
