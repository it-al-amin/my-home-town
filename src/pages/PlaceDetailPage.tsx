import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Calendar, Compass, Sparkles, AlertCircle, 
  ArrowLeft, ExternalLink, Info, CheckCircle2, Image as ImageIcon,
  Send, X, ChevronLeft, ChevronRight, Maximize2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { UPAZILAS_DATA } from '../data/upazilas';
import { ResponsiveImage } from '../components/common/ResponsiveImage';

import { Breadcrumb } from '../components/common/Breadcrumb';
import { MapLink } from '../components/common/MapLink';
import { SourceBadge } from '../components/common/SourceBadge';
import { PlaceCard } from '../components/cards/PlaceCard';
import { SubmitPostModal } from '../components/common/SubmitPostModal';

export const PlaceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const { places } = useData();
  const [imgError, setImgError] = useState(false);
  const [activeLightboxImg, setActiveLightboxImg] = useState<string | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const place = places.find((p) => p.id === id || p.slug === id);

  if (!place) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          {language === 'bn' ? 'দর্শনীয় স্থান পাওয়া যায়নি' : 'Place Not Found'}
        </h2>
        <p className="text-slate-500 mt-2 mb-6">
          {language === 'bn' ? 'অনুরোধকৃত দর্শনীয় স্থানটি আমাদের তালিকায় নেই।' : 'The requested tourist place does not exist.'}
        </p>
        <Link
          to="/places"
          className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl font-bold text-sm"
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

  const otherPlaces = places.filter((p) => p.id !== place.id).slice(0, 3);
  const galleryImages = place.galleryImages && place.galleryImages.length > 0 
    ? place.galleryImages 
    : [place.image];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumb
        items={[
          { label: 'Tourist Places', labelBn: 'দর্শনীয় স্থান', href: '/places' },
          { label: place.name, labelBn: place.nameBn, href: `/places/${place.id}` },
        ]}
      />

      {/* Main Hero Media & Title Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="relative h-72 sm:h-96 w-full bg-slate-900">
          <ResponsiveImage
            src={place.image}
            alt={title}
            fallbackUrl={fallbackSvg}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-slate-900/90 text-slate-900 dark:text-emerald-400 backdrop-blur-md shadow-xs">
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
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <MapLink
                coordinates={place.coordinates}
                query={place.mapQuery}
                label={language === 'bn' ? 'গুগল ম্যাপে দিকনির্দেশনা দেখুন' : 'Directions on Google Maps'}
              />
              {upazila && (
                <Link
                  to={`/upazilas/${upazila.slug}`}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
                >
                  {language === 'bn' ? `${upazila.nameBn} উপজেলা` : `${upazila.name} Upazila`}
                </Link>
              )}
            </div>

            <SourceBadge source={place.source} sourceUrl={place.sourceUrl} lastVerified={place.lastVerified} />
          </div>

          {/* Detailed Description */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-600" />
              <span>{language === 'bn' ? 'স্থানের বিবরণ ও প্রাকৃতিক সৌন্দর্য' : 'About the Place'}</span>
            </h2>
            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {description}
            </p>
          </div>

          {/* Key Insights Grid: Why Visit, Best Time, Travel Tips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm sm:text-base">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{language === 'bn' ? 'কেন ভ্রমণ করবেন?' : 'Why Visit?'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {whyVisit}
              </p>
            </div>

            <div className="p-5 bg-blue-50/80 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900/40 space-y-2">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-sm sm:text-base">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{language === 'bn' ? 'ভ্রমণের সেরা সময়' : 'Best Time to Visit'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {bestTime}
              </p>
            </div>

            <div className="p-5 bg-amber-50/80 dark:bg-amber-950/30 rounded-2xl border border-amber-100 dark:border-amber-900/40 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-sm sm:text-base">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>{language === 'bn' ? 'ভ্রমণ টিপস ও সতর্কতা' : 'Travel Tips & Safety'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {travelTips}
              </p>
            </div>
          </div>

          {/* DYNAMIC VISITED SPOTS PHOTO GALLERY SECTION */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-emerald-600" />
                  <span>{language === 'bn' ? 'এই দর্শনীয় স্থানের ছবি ও ফটো গ্যালারি' : 'Photo Gallery & Visited Spot Views'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'bn'
                    ? 'দর্শনার্থীদের ক্যামেরায় বন্দি সৌন্দর্য। ছবিতে ক্লিক করে বড় করে দেখুন।'
                    : 'Moments captured by visitors. Click any image to view in full resolution.'}
                </p>
              </div>

              {/* Citizen Contribute CTA */}
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'আপনার ছবি বা আপডেট পাঠান' : 'Submit Your Photo/Report'}</span>
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
              {galleryImages.map((imgUrl, index) => (
                <div
                  key={index}
                  onClick={() => setActiveLightboxImg(imgUrl)}
                  className="group relative rounded-2xl overflow-hidden h-40 bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={imgUrl}
                    alt={`${title} photo ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Places */}
          {nearbyPlaces.length > 0 && (
            <div className="pt-4 space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>{language === 'bn' ? 'কাছাকাছি অন্যান্য দর্শনীয় স্থান:' : 'Nearby Attractions:'}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {nearbyPlaces.map((np, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700"
                  >
                    {np}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal for Full Screen Image View */}
      {activeLightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveLightboxImg(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={activeLightboxImg}
              alt="Full resolution"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setActiveLightboxImg(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}

      {/* Other Recommended Places */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          {language === 'bn' ? 'আরও দর্শনীয় পর্যটন স্থান' : 'More Places to Explore'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {otherPlaces.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      </section>

      {/* Community Submit Modal */}
      <SubmitPostModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        defaultCategory="tourism"
        defaultUpazilaId={place.upazilaId}
      />
    </div>
  );
};
