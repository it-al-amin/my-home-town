import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Users, Maximize2, Waves, ShoppingBag, Phone, 
  ExternalLink, Compass, ShieldAlert, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { UPAZILAS_DATA } from '../data/upazilas';
import { PLACES_DATA } from '../data/places';
import { HEALTH_DATA } from '../data/health';
import { UNIONS_DATA } from '../data/unions';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { MapLink } from '../components/common/MapLink';
import { SourceBadge } from '../components/common/SourceBadge';
import { SectionHeader } from '../components/common/SectionHeader';
import { UpazilaUnionMap } from '../components/map/UpazilaUnionMap';
import { PlaceCard } from '../components/cards/PlaceCard';

export const UpazilaDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();

  const upazila = UPAZILAS_DATA.find((u) => u.slug === slug || u.id === slug);

  if (!upazila) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {language === 'bn' ? 'উপজেলা পাওয়া যায়নি' : 'Upazila Not Found'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">
          {language === 'bn' ? 'অনুরোধকৃত উপজেলার তথ্য আমাদের ডেটাবেজে নেই।' : 'The requested upazila does not exist in our database.'}
        </p>
        <Link
          to="/upazilas"
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm"
        >
          {language === 'bn' ? 'সকল উপজেলায় ফিরে যান' : 'Back to Upazilas'}
        </Link>
      </div>
    );
  }

  const title = language === 'bn' ? upazila.nameBn : upazila.name;
  const description = language === 'bn' ? upazila.descriptionBn : upazila.description;
  const hq = language === 'bn' ? upazila.headquartersBn : upazila.headquarters;
  const area = language === 'bn' ? `${upazila.areaKm2} বর্গ কিমি` : `${upazila.areaKm2} sq km`;
  const population = language === 'bn' ? `${upazila.population.toLocaleString('bn-BD')} জন` : `${upazila.population.toLocaleString()} people`;
  const unions = language === 'bn' ? upazila.unionsListBn : upazila.unionsList;
  const upazilaUnions = UNIONS_DATA[upazila.id] || [];
  const rivers = language === 'bn' ? upazila.riversBn : upazila.rivers;
  const markets = language === 'bn' ? upazila.majorMarketsBn : upazila.majorMarkets;

  // Filter tourist places in this upazila
  const upazilaPlaces = PLACES_DATA.filter((p) => p.upazilaId === upazila.id);
  const upazilaHealth = HEALTH_DATA.filter((h) => h.upazilaId === upazila.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumb
        items={[
          { label: 'Upazilas', labelBn: 'উপজেলাসমূহ', href: '/upazilas' },
          { label: upazila.name, labelBn: upazila.nameBn, href: `/upazilas/${upazila.slug}` },
        ]}
      />

      {/* Upazila Header Banner */}
      <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              {language === 'bn' ? 'নেত্রকোণা জেলা' : 'Netrokona District'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-slate-200">
              {language === 'bn' ? `সদর দপ্তর: ${hq}` : `HQ: ${hq}`}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed max-w-2xl">
            {description}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <MapLink
              coordinates={upazila.coordinates}
              query={upazila.mapQuery}
              label={language === 'bn' ? 'গুগল ম্যাপে উপজেলা দেখুন' : 'View on Google Maps'}
            />
            {upazila.sourceUrl && (
              <a
                href={upazila.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              >
                <span>{language === 'bn' ? 'অফিসিয়াল উপজেলা বাতায়ন' : 'Official Upazila Portal'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            {language === 'bn' ? 'মোট আয়তন' : 'Total Area'}
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{area}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            {language === 'bn' ? 'জনসংখ্যা (২০২২)' : 'Population (2022)'}
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{population}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            {language === 'bn' ? 'ইউনিয়ন পরিষদ' : 'Unions Count'}
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {language === 'bn' ? `${upazila.unionsCount}টি ইউনিয়ন` : `${upazila.unionsCount} Unions`}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            {language === 'bn' ? 'গ্রাম সংখ্যা' : 'Villages Count'}
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {language === 'bn' ? `${upazila.villagesCount}টি গ্রাম` : `${upazila.villagesCount} Villages`}
          </div>
        </div>
      </div>

      {/* Unions & Administrative Structure */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <SectionHeader
          badge={language === 'bn' ? 'ইউনিয়ন পরিষদ' : 'Unions'}
          title={language === 'bn' ? `${title}-র অন্তর্ভুক্ত সকল ইউনিয়ন` : `Unions under ${title}`}
          subtitle={language === 'bn' ? 'ইউনিয়নভিত্তিক প্রশাসনিক বিভাজন ও তৃণমূল স্থানীয় সরকার ব্যবস্থা।' : 'Grassroot administrative units and union parishads.'}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {unions.map((unionName, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50/70 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 hover:border-emerald-300 rounded-xl transition-colors flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {idx + 1}
              </div>
              <span className="line-clamp-1">{unionName}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-400 italic">
          {language === 'bn'
            ? '* গ্রাম-পর্যায়ের তথ্য জেলা প্রশাসনের রেকর্ড অনুযায়ী ক্রমান্বয়ে হালনাগাদ করা হচ্ছে।'
            : '* Detailed village-level data is being progressively catalogued from official public administration gazettes.'}
        </p>
      </section>
        {/* Union & Places Map */}
        <div className="my-8 w-full">
          <UpazilaUnionMap upazila={upazila} height="500px" />
        </div>

      {/* Rivers & Markets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rivers */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Waves className="w-5 h-5 text-emerald-600" />
            <span>{language === 'bn' ? 'প্রবাহিত নদ-নদী ও জলরাশি' : 'Rivers & Waterbodies'}</span>
          </h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {rivers.map((r, i) => (
              <span key={i} className="px-3 py-1.5 bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 text-cyan-900 dark:text-cyan-300 rounded-xl text-xs sm:text-sm font-semibold">
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* Markets */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <span>{language === 'bn' ? 'ঐতিহ্যবাহী প্রধান হাট ও বাজার' : 'Major Markets & Bazars'}</span>
          </h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {markets.map((m, i) => (
              <span key={i} className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 rounded-xl text-xs sm:text-sm font-semibold">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Contacts for Upazila */}
      {upazila.emergencyContacts && (
        <section className="bg-rose-50/70 dark:bg-rose-900/30 rounded-3xl p-6 sm:p-8 border border-rose-200 dark:border-rose-800 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {language === 'bn' ? `${title} উপজেলা জরুরি যোগাযোগ নম্বরসমূহ` : `${title} Emergency & Duty Contacts`}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
            {upazila.emergencyContacts.police && (
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-rose-200 dark:border-rose-800 shadow-xs">
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-semibold">{language === 'bn' ? 'থানা ডিউটি অফিসার' : 'Police Thana'}</span>
                <a href={`tel:${upazila.emergencyContacts.police}`} className="text-base font-bold text-rose-700 dark:text-rose-300 hover:underline">
                  {upazila.emergencyContacts.police}
                </a>
              </div>
            )}
            {upazila.emergencyContacts.fireService && (
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-rose-200 dark:border-rose-800 shadow-xs">
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-semibold">{language === 'bn' ? 'ফায়ার সার্ভিস স্টেশন' : 'Fire Service'}</span>
                <a href={`tel:${upazila.emergencyContacts.fireService}`} className="text-base font-bold text-rose-700 dark:text-rose-300 hover:underline">
                  {upazila.emergencyContacts.fireService}
                </a>
              </div>
            )}
            {upazila.emergencyContacts.healthComplex && (
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-rose-200 dark:border-rose-800 shadow-xs">
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-semibold">{language === 'bn' ? 'উপজেলা স্বাস্থ্য কমপ্লেক্স' : 'Health Complex'}</span>
                <a href={`tel:${upazila.emergencyContacts.healthComplex}`} className="text-base font-bold text-rose-700 dark:text-rose-300 hover:underline">
                  {upazila.emergencyContacts.healthComplex}
                </a>
              </div>
            )}
            {upazila.emergencyContacts.uno && (
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-rose-200 dark:border-rose-800 shadow-xs">
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-semibold">{language === 'bn' ? 'উপজেলা নির্বাহী অফিসার (ইউএনও)' : 'UNO Office'}</span>
                <a href={`tel:${upazila.emergencyContacts.uno}`} className="text-base font-bold text-rose-700 dark:text-rose-300 hover:underline">
                  {upazila.emergencyContacts.uno}
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Tourist Places in this Upazila */}
      {upazilaPlaces.length > 0 && (
        <section className="space-y-6">
          <SectionHeader
            badge={language === 'bn' ? 'পর্যটন আকর্ষণ' : 'Tourism'}
            title={language === 'bn' ? `${title}-র দর্শনীয় পর্যটন স্থানসমূহ` : `Tourist Attractions in ${title}`}
            subtitle={language === 'bn' ? 'এই উপজেলার প্রাকৃতিক সৌন্দর্য ও ঐতিহাসিক নিদর্শনসমূহ।' : 'Natural landscape and historical sites located here.'}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upazilaPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </section>
      )}

      {/* Embedded Map Focused on this Upazila with Union Mapping */}
      <section className="space-y-4">
        <SectionHeader
          badge={language === 'bn' ? 'ইউনিয়ন ও ভৌগোলিক মানচিত্র' : 'Union & Location Map'}
          title={language === 'bn' ? `মানচিত্রে ${title} উপজেলা ও সকল ইউনিয়ন` : `${title} Upazila & Unions Map`}
          subtitle={language === 'bn' ? 'উপজেলা সদর, সকল ইউনিয়ন পরিষদ ও দর্শনীয় স্থানের সুনির্দিষ্ট জিপিএস অবস্থান।' : 'Interactive map plotting all union parishad centers, tourist spots, and healthcare.'}
        />
        <UpazilaUnionMap upazila={upazila} height="500px" />
      </section>
        {/* Union & Places Map */}
        <div className="my-8 w-full">
          <UpazilaUnionMap upazila={upazila} height="500px" />
        </div>

      {/* Data Verification Footer */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-2 text-xs">
        <SourceBadge
          source={upazila.source}
          sourceUrl={upazila.sourceUrl}
          lastVerified={upazila.lastVerified}
        />
        <Link to="/upazilas" className="text-emerald-700 dark:text-emerald-300 font-bold hover:underline">
          {language === 'bn' ? '← সকল উপজেলায় ফিরে যান' : '← Back to all upazilas'}
        </Link>
      </div>
    </div>
  );
};
