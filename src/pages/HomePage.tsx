import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Compass, MapPin, Building2, School, HeartPulse, 
  Fish, Wheat, Sparkles, PhoneCall, ArrowRight, ShieldCheck, 
  Map as MapIcon, Landmark, BookOpen, Clock, ChevronRight, 
  Bed, Utensils, Train, Bus, ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DISTRICT_DATA } from '../data/district';
import { UPAZILAS_DATA } from '../data/upazilas';
import { PLACES_DATA } from '../data/places';
import { PEOPLE_DATA } from '../data/people';
import { NEWS_DATA } from '../data/news';
import { PlaceCard } from '../components/cards/PlaceCard';
import { UpazilaCard } from '../components/cards/UpazilaCard';
import { PersonCard } from '../components/cards/PersonCard';
import { NewsCard } from '../components/cards/NewsCard';
import { LatestNewsSection } from '../components/feed/LatestNewsSection';
import { GovernmentNoticeList } from '../components/feed/GovernmentNoticeList';
import { SectionHeader } from '../components/common/SectionHeader';
import { DistrictDashboardStrip } from '../components/home/DistrictDashboardStrip';
import { DistrictMapShowcase } from '../components/home/DistrictMapShowcase';
import { ServiceSectorsGrid } from '../components/home/ServiceSectorsGrid';
import { DistrictAdminCard } from '../components/home/DistrictAdminCard';
import { FamousFoodSection } from '../components/home/FamousFoodSection';
import { HotelsSection } from '../components/home/HotelsSection';
import { TravelGuideSection } from '../components/home/TravelGuideSection';
import { EducationShowcase } from '../components/home/EducationShowcase';
import { BusinessAgroShowcase } from '../components/home/BusinessAgroShowcase';
import { DistrictSourcesPanel } from '../components/district/DistrictSourcesPanel';
import { FactsHighlights } from '../components/facts/FactsHighlights';
import { LivePanel } from '../components/live/LivePanel';
import { HERO_PHOTO } from '../data/aggregated/district';

export const HomePage: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/directory?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const featuredPlaces = PLACES_DATA.filter((p) => p.featured).slice(0, 4);
  const featuredUpazilas = UPAZILAS_DATA.slice(0, 6);
  const featuredPeople = PEOPLE_DATA.slice(0, 4);
  const latestNews = NEWS_DATA.slice(0, 3);

  return (
    <div className="space-y-12 lg:space-y-16 pb-16">
      {/* 1. Hero: full-width real photo (Someshwari River, Durgapur) with a light fade for legible text */}
      <section className="relative isolate overflow-hidden bg-white dark:bg-slate-950">
        <img
          src={HERO_PHOTO?.url ?? featuredPlaces[0]?.image}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 -z-20 w-full h-full object-cover object-[70%_60%] lg:object-[center_62%]"
        />
        {/* Light veil: top-to-bottom on phones, left-to-right on desktop */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-white/90 to-white/20 lg:bg-gradient-to-r lg:from-white lg:via-white/85 lg:via-45% lg:to-white/0 dark:from-slate-950 dark:via-slate-950/90 dark:to-slate-950/30 lg:dark:from-slate-950 lg:dark:via-slate-950/85 lg:dark:to-slate-950/10"
        />
        {/* Brand colour wash + soft blend into the page below */}
        <div aria-hidden="true" className="absolute -z-10 -top-24 -left-24 w-[30rem] h-[30rem] rounded-full bg-emerald-200/40 dark:bg-emerald-900/20 blur-3xl" />
        <div aria-hidden="true" className="absolute -z-10 inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 lg:pt-24 pb-64 sm:pb-52 lg:pb-28 min-h-[560px] lg:min-h-[620px] flex flex-col justify-center">
          <div className="max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-800 text-[11px] sm:text-xs font-bold tracking-wide text-emerald-800 dark:text-emerald-300 shadow-xs backdrop-blur">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {language === 'bn' ? 'নেত্রকোণা জেলা • ময়মনসিংহ বিভাগ' : 'Netrokona District • Mymensingh Division'}
            </span>

            <h1 className="text-[2.15rem] leading-[1.15] sm:text-5xl lg:text-[3.6rem] font-black tracking-tight text-slate-900 dark:text-white">
              {language === 'bn' ? 'গারো পাহাড় আর হাওরের' : 'The land between'}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-600 to-sky-600 dark:from-emerald-300 dark:via-teal-200 dark:to-sky-300 pb-1">
                {language === 'bn' ? 'নীল জলে গড়া জনপদ' : 'hills & haor waters'}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-xl leading-relaxed">
              {language === 'bn'
                ? 'উপজেলা, ইউনিয়ন, পর্যটন, শিক্ষা, ব্যবসা, ঐতিহ্যবাহী খাবার ও যাতায়াতের নির্ভরযোগ্য তথ্য — এক জায়গায়।'
                : 'Reliable information on upazilas, unions, tourism, education, business, traditional food and travel — in one place.'}
            </p>

            <form onSubmit={handleSearchSubmit} className="max-w-xl" role="search">
              <label htmlFor="hero-search" className="sr-only">{language === 'bn' ? 'অনুসন্ধান' : 'Search'}</label>
              <div className="relative flex items-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-900/10 focus-within:ring-4 focus-within:ring-emerald-500/20 focus-within:border-emerald-400 transition">
                <Search className="absolute left-4 w-5 h-5 text-slate-400" aria-hidden="true" />
                <input
                  id="hero-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'bn' ? 'স্থান, স্কুল, খাবার বা উপজেলা খুঁজুন…' : 'Search places, schools, food or upazilas…'}
                  className="w-full min-w-0 py-3.5 sm:py-4 pl-12 pr-28 text-sm sm:text-base text-slate-900 dark:text-slate-100 bg-transparent placeholder-slate-400 font-medium focus:outline-hidden"
                />
                <button type="submit" className="absolute right-1.5 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-sm">
                  {language === 'bn' ? 'খুঁজুন' : 'Search'}
                </button>
              </div>
            </form>

            <div className="flex items-center gap-2 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto sm:flex-wrap pb-1 [scrollbar-width:none]">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 shrink-0">{language === 'bn' ? 'জনপ্রিয়:' : 'Popular:'}</span>
              {[
                { to: '/places/birishiri-ceramic-hill', bn: 'বিজয়পুর সাদামাটি', en: 'Bijoypur white clay' },
                { to: '/places/someshwari-river', bn: 'সোমেশ্বরী নদী', en: 'Someshwari River' },
                { to: '/places/dingapota-haor', bn: 'ডিংগাপোতা হাওর', en: 'Dingapota Haor' },
                { to: '/#food', bn: 'বালিশ মিষ্টি', en: 'Balish mishti' },
                { to: '/gallery', bn: 'ফটো গ্যালারি', en: 'Photo gallery' },
              ].map((k) => (
                <Link
                  key={k.to}
                  to={k.to}
                  className="shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold bg-white/85 dark:bg-slate-800/85 backdrop-blur border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                >
                  {language === 'bn' ? k.bn : k.en}
                </Link>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                to="/places"
                className="inline-flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 hover:from-emerald-900 hover:via-emerald-800 hover:to-teal-800 text-white text-sm font-bold shadow-lg shadow-emerald-900/25 ring-1 ring-inset ring-white/10 transition-all hover:-translate-y-px dark:from-emerald-600 dark:via-emerald-600 dark:to-teal-600"
              >
                <Compass className="w-4 h-4" />
                {language === 'bn' ? 'দর্শনীয় স্থান দেখুন' : 'Explore tourist places'}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/map"
                className="inline-flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 text-sm font-bold transition-colors"
              >
                <MapIcon className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                {language === 'bn' ? '১০টি উপজেলা ও মানচিত্র' : '10 upazilas & map'}
              </Link>
            </div>
          </div>
        </div>

        {/* Photo caption (glass) */}
        {HERO_PHOTO && (
          <div className="absolute right-4 sm:right-6 lg:right-8 bottom-[4.5rem] sm:bottom-24 max-w-[16rem] sm:max-w-xs rounded-2xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border border-white/70 dark:border-slate-700 px-4 py-3 shadow-lg">
            <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              {language === 'bn' ? 'সোমেশ্বরী নদী, দুর্গাপুর' : 'Someshwari River, Durgapur'}
            </p>
            <a
              href={HERO_PHOTO.creditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-0.5 text-[11px] text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 truncate"
            >
              {language === 'bn' ? 'ছবি' : 'Photo'}: {HERO_PHOTO.credit} · {HERO_PHOTO.licence}
            </a>
          </div>
        )}

        {/* Quick navigation strip */}
        <nav aria-label={language === 'bn' ? 'দ্রুত লিংক' : 'Quick links'} className="absolute inset-x-0 bottom-0 border-t border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-1 sm:gap-2 overflow-x-auto [scrollbar-width:none]">
            {[
              { to: '/places', icon: Compass, bn: 'দর্শনীয় স্থান', en: 'Tourist spots' },
              { to: '/#food', icon: Utensils, bn: 'খাবার', en: 'Food' },
              { to: '/#hotels', icon: Bed, bn: 'হোটেল', en: 'Hotels' },
              { to: '/education', icon: School, bn: 'শিক্ষা', en: 'Education' },
              { to: '/health', icon: HeartPulse, bn: 'স্বাস্থ্য', en: 'Health' },
              { to: '/transport', icon: Bus, bn: 'যাতায়াত', en: 'Transport' },
              { to: '/gallery', icon: Sparkles, bn: 'ফটো গ্যালারি', en: 'Gallery' },
              { to: '/emergency', icon: PhoneCall, bn: 'জরুরি নম্বর', en: 'Emergency' },
            ].map((q) => (
              <Link
                key={q.to}
                to={q.to}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
              >
                <q.icon className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                {language === 'bn' ? q.bn : q.en}
              </Link>
            ))}
          </div>
        </nav>
      </section>

      {/* Live: clock, weather, air quality, prayer times and today's dates */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Live">
        <LivePanel />
      </section>

      {/* History & notable people: verified key facts about the district */}
      <FactsHighlights />

      {/* 2. Official Administrative Dashboard Strip */}
      <DistrictDashboardStrip />

      {/* Reviewed, auto-collected updates (render nothing until records are approved) */}
      <LatestNewsSection variant="compact" />
      <GovernmentNoticeList className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* 3. District Map Showcase (with 10 Seamless Upazilas & 86 Unions Explorer) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DistrictMapShowcase />
      </div>

      {/* 4. Top Tourist Destinations & Nature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <SectionHeader
            badge={language === 'bn' ? 'প্রাকৃতিক সৌন্দর্য ও পরিবেশ' : 'Natural Beauty & Tourism'}
            title={language === 'bn' ? 'নেত্রকোণার শীর্ষ দর্শনীয় পর্যটন স্থান' : 'Top Tourist Attractions in Netrokona'}
            subtitle={language === 'bn' ? 'বিজয়পুরের নীল পানির হ্রদ, স্বচ্ছ সোমেশ্বরী নদী, প্রাচীন রোয়াইলবাড়ি দুর্গ ও সুবিশাল ডিংগাপোতা হাওর।' : 'Explore ceramic lakes, pristine mountain rivers, medieval citadel, and boundless haor expanses.'}
            className="mb-0"
          />
          <Link
            to="/places"
            className="inline-flex items-center gap-1.5 font-bold text-sm text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 shrink-0 self-start sm:self-auto"
          >
            <span>{language === 'bn' ? 'সকল দর্শনীয় স্থান দেখুন' : 'View all places'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="nk-rail grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </section>

      {/* District profile compiled from netrokona.gov.bd, Bengali Wikipedia & Banglapedia */}
      <DistrictSourcesPanel />

      {/* 5. Famous Food, Balish Mishti & Traditional Delicacies (#food anchor) */}
      <div id="food" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <FamousFoodSection />
      </div>

      {/* 6. Hotels, Rest Houses & Resorts (#hotels anchor) */}
      <div id="hotels" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <HotelsSection />
      </div>

      {/* 7. How to Go Travel Guide from Dhaka & Mymensingh (#travel anchor) */}
      <div id="travel" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <TravelGuideSection />
      </div>

      {/* 8. Education & Schooling Showcase (#education anchor) */}
      <div id="education" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <EducationShowcase />
      </div>

      {/* 9. Commercial Trade Hubs, Agriculture & Haor Economy (#business anchor) */}
      <div id="business" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <BusinessAgroShowcase />
      </div>

      {/* 10. Upazilas Grid Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <SectionHeader
            badge={language === 'bn' ? 'প্রশাসনিক কাঠামো' : 'Administrative Units'}
            title={language === 'bn' ? 'নেত্রকোণার ১০টি উপজেলা' : 'All 10 Upazilas of Netrokona'}
            subtitle={language === 'bn' ? 'প্রতিটি উপজেলার ভৌগোলিক রূপরেখা, জনসংখ্যা, ইউনিয়ন এবং যোগাযোগের পূর্ণ বিবরণ।' : 'Demographics, headquarters, unions, and highlights of each upazila.'}
            className="mb-0"
          />
          <Link
            to="/upazilas"
            className="inline-flex items-center gap-1.5 font-bold text-sm text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 shrink-0 self-start sm:self-auto"
          >
            <span>{language === 'bn' ? 'সকল ১০টি উপজেলা দেখুন' : 'View all 10 upazilas'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="nk-rail grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredUpazilas.map((upazila) => (
            <UpazilaCard key={upazila.id} upazila={upazila} />
          ))}
        </div>
      </section>

      {/* 11. Notable Personalities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <SectionHeader
            badge={language === 'bn' ? 'গৌরব ও মনীষা' : 'Eminent Personalities'}
            title={language === 'bn' ? 'নেত্রকোণার গুণীজন' : 'Notable Personalities of Netrokona'}
            subtitle={language === 'bn' ? 'কবি নির্মলেন্দু গুণ, হেলাল হাফিজ থেকে শুরু করে বিপ্লবী কমরেড মণি সিংহ ও সাধক বাউল জালাল উদ্দিন খাঁ।' : 'Renowned poets, freedom fighters, philosophers, and folk legends.'}
            className="mb-0"
          />
          <Link
            to="/people"
            className="inline-flex items-center gap-1.5 font-bold text-sm text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 shrink-0 self-start sm:self-auto"
          >
            <span>{language === 'bn' ? 'সকল ব্যক্তিত্বের তালিকা' : 'View all personalities'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="nk-rail grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPeople.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      </section>

      {/* 12. Public Services & Citizen Charter (Subtle & Secondary, placed cleanly at bottom) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-slate-100 dark:bg-slate-900/60 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {language === 'bn' ? 'নাগরিক সেবা ও তথ্যবাতায়ন' : 'Citizen Charter & Links'}
              </span>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">
                {language === 'bn' ? 'প্রয়োজনীয় সরকারি সেবা ও জেলা নেতৃত্ব' : 'Public Services & District Leadership'}
              </h3>
            </div>
            <Link
              to="/services"
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>{language === 'bn' ? 'সকল নাগরিক সেবা ও লিংক →' : 'All Citizen Services →'}</span>
            </Link>
          </div>

          <ServiceSectorsGrid />
          <DistrictAdminCard />
        </div>
      </div>
    </div>
  );
};
