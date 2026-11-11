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
      {/* 1. Amar Gaibandha-Style Hero Section with Scenic Background Image & Poetic Title */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex flex-col justify-between text-white overflow-hidden bg-slate-950">
        {/* Full-bleed scenic photographic background (Birishiri Turquoise Ceramic Lake & Someshwari River) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.65) 55%, rgba(15, 23, 42, 0.78) 100%), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85')`,
          }}
        />

        {/* Ambient Overlay for crystal clear readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 pointer-events-none" />

        {/* Main Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-12 w-full">
          <div className="max-w-3xl space-y-5">
            {/* Red accent line with district and division */}
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-[2px] bg-red-500 inline-block" />
              <span className="text-xs sm:text-sm font-bold tracking-wider text-amber-300 uppercase">
                {language === 'bn' ? 'নেত্রকোণা জেলা • ময়মনসিংহ বিভাগ' : 'Netrokona District • Mymensingh Division'}
              </span>
            </div>

            {/* Poetic Large Headline (Matches Amar Gaibandha style) */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.12]">
              {language === 'bn' ? (
                <>
                  গারো পাহাড় আর হাওরের<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">
                    নীল জলে গড়া জনপদ
                  </span>
                </>
              ) : (
                <>
                  The Land Forged Between<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">
                    Hills & Haor Waters
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-slate-200 font-medium max-w-2xl leading-relaxed">
              {language === 'bn'
                ? 'উপজেলা, ইউনিয়ন, গ্রাম, পর্যটন, শিক্ষা, ব্যবসা, ঐতিহ্যবাহী খাবার ও যাতায়াতের তথ্য এক জায়গায়।'
                : 'Upazilas, unions, villages, tourism, schooling, business, traditional cuisine and travel directory.'}
            </p>

            {/* Cream-colored Search Box with Coral Action Button */}
            <form onSubmit={handleSearchSubmit} className="pt-2 max-w-2xl">
              <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden bg-[#faf6ea] border border-amber-200/80 focus-within:ring-3 focus-within:ring-amber-500/30 transition-all duration-200">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'bn' ? 'দর্শনীয় স্থান, স্কুল, কলেজ, বালিশ মিষ্টি বা উপজেলা খুঁজুন...' : 'Search tourist spots, schools, colleges, food, or upazilas...'}
                  className="w-full py-4 pl-4 pr-32 text-sm sm:text-base text-slate-900 dark:text-slate-100 bg-transparent placeholder-slate-500 font-medium focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#ea580c] hover:bg-orange-600 text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Search className="w-4 h-4" />
                  <span>{language === 'bn' ? 'খুঁজুন' : 'Search'}</span>
                </button>
              </div>

              {/* Quick Keyword Buttons */}
              <div className="flex items-center gap-2 mt-2.5 text-xs text-slate-300 flex-wrap">
                <span>{language === 'bn' ? 'জনপ্রিয়:' : 'Popular:'}</span>
                <button type="button" onClick={() => navigate('/places/birishiri-ceramic-hill')} className="hover:text-amber-300 underline cursor-pointer">বিরিশিরি সাদামাটি</button>
                <span>•</span>
                <button type="button" onClick={() => navigate('/places/dingapota-haor')} className="hover:text-amber-300 underline cursor-pointer">ডিংগাপোতা হাওর</button>
                <span>•</span>
                <a href="#food" className="hover:text-amber-300 underline cursor-pointer">বালিশ মিষ্টি</a>
                <span>•</span>
                <a href="#hotels" className="hover:text-amber-300 underline cursor-pointer">বিরিশিরি হোটেল</a>
                <span>•</span>
                <a href="#education" className="hover:text-amber-300 underline cursor-pointer">মেডিকেল ও বিশ্ববিদ্যালয়</a>
                <span>•</span>
                <a href="#travel" className="hover:text-amber-300 underline cursor-pointer">কীভাবে যাবেন</a>
              </div>
            </form>

            {/* Action Buttons Below Search (Matches Amar Gaibandha style) */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <Link
                to="/places"
                className="px-5 py-3 rounded-xl border border-white/40 hover:border-white text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm text-sm font-bold transition-all flex items-center gap-2"
              >
                <span>{language === 'bn' ? 'দর্শনীয় স্থান ও হোটেল দেখুন →' : 'Explore Places & Hotels →'}</span>
              </Link>
              <Link
                to="/upazilas"
                className="px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-slate-200 border border-slate-700 text-sm font-semibold transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>{language === 'bn' ? '১০টি উপজেলা ও মানচিত্র' : '10 Upazilas & Map'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Photo Credit & Quick Category Navigation Strip */}
        <div className="relative z-10 w-full border-t border-white/10 bg-black/40 backdrop-blur-md py-3 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            {/* Quick Navigation Pills with External Style Arrows */}
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto w-full sm:w-auto py-1">
              <Link to="/places" className="flex items-center gap-1 text-slate-200 hover:text-amber-300 transition-colors font-medium shrink-0">
                <span>🏔️ {language === 'bn' ? 'দর্শনীয় স্থান ও হ্রদ' : 'Tourist Spots'}</span>
                <span className="text-[10px]">↗</span>
              </Link>
              <span className="text-white/20">|</span>
              <a href="#food" className="flex items-center gap-1 text-slate-200 hover:text-amber-300 transition-colors font-medium shrink-0">
                <span>🍮 {language === 'bn' ? 'বালিশ মিষ্টি ও খাবার' : 'Famous Food'}</span>
                <span className="text-[10px]">↗</span>
              </a>
              <span className="text-white/20">|</span>
              <a href="#hotels" className="flex items-center gap-1 text-slate-200 hover:text-amber-300 transition-colors font-medium shrink-0">
                <span>🏨 {language === 'bn' ? 'হোটেল ও রিসোর্ট' : 'Hotels & Resorts'}</span>
                <span className="text-[10px]">↗</span>
              </a>
              <span className="text-white/20">|</span>
              <a href="#education" className="flex items-center gap-1 text-slate-200 hover:text-amber-300 transition-colors font-medium shrink-0">
                <span>🎓 {language === 'bn' ? 'শিক্ষা ও স্কুল' : 'Schools & Colleges'}</span>
                <span className="text-[10px]">↗</span>
              </a>
              <span className="text-white/20">|</span>
              <a href="#business" className="flex items-center gap-1 text-slate-200 hover:text-amber-300 transition-colors font-medium shrink-0">
                <span>🌾 {language === 'bn' ? 'ব্যবসা ও কৃষি' : 'Business & Agro'}</span>
                <span className="text-[10px]">↗</span>
              </a>
              <span className="text-white/20">|</span>
              <a href="#travel" className="flex items-center gap-1 text-slate-200 hover:text-amber-300 transition-colors font-medium shrink-0">
                <span>🚌 {language === 'bn' ? 'যাতায়াত গাইড' : 'How to Go'}</span>
                <span className="text-[10px]">↗</span>
              </a>
              <span className="text-white/20">|</span>
              <Link to="/map" className="flex items-center gap-1 text-slate-200 hover:text-amber-300 transition-colors font-medium shrink-0">
                <span>🗺️ {language === 'bn' ? 'ভেক্টর মানচিত্র' : 'Vector Map'}</span>
                <span className="text-[10px]">↗</span>
              </Link>
            </div>

            {/* Image Attribution */}
            <div className="text-[11px] text-slate-400 shrink-0 self-end sm:self-auto">
              {language === 'bn' ? 'ছবি: বিরিশিরি সাদামাটি হ্রদ ও সোমেশ্বরী নদী • উইকিমিডিয়া' : 'Photo: Birishiri Lake & Someshwari • Wikimedia Commons'}
            </div>
          </div>
        </div>
      </section>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </section>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
