import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Compass, MapPin, Building2, School, HeartPulse, 
  Fish, Wheat, Sparkles, PhoneCall, ArrowRight, ShieldCheck, 
  Map as MapIcon, Landmark, BookOpen, Clock, ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DISTRICT_DATA } from '../data/district';
import { UPAZILAS_DATA } from '../data/upazilas';
import { PLACES_DATA } from '../data/places';
import { SERVICES_DATA } from '../data/services';
import { PEOPLE_DATA } from '../data/people';
import { NEWS_DATA } from '../data/news';
import { PlaceCard } from '../components/cards/PlaceCard';
import { UpazilaCard } from '../components/cards/UpazilaCard';
import { ServiceCard } from '../components/cards/ServiceCard';
import { PersonCard } from '../components/cards/PersonCard';
import { NewsCard } from '../components/cards/NewsCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { LeafletDistrictMap } from '../components/map/LeafletDistrictMap';

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
  const featuredServices = SERVICES_DATA.slice(0, 3);
  const featuredPeople = PEOPLE_DATA.slice(0, 4);
  const latestNews = NEWS_DATA.slice(0, 3);

  const explorationCards = [
    {
      title: language === 'bn' ? '১০টি উপজেলা' : '10 Upazilas',
      desc: language === 'bn' ? 'সকল উপজেলার প্রশাসনিক ও ভৌগোলিক তথ্য' : 'Administrative, demographic & regional data',
      icon: MapPin,
      href: '/upazilas',
      color: 'from-emerald-500 to-teal-700',
    },
    {
      title: language === 'bn' ? 'দর্শনীয় স্থান' : 'Tourist Places',
      desc: language === 'bn' ? 'সাদামাটির পাহাড়, সোমেশ্বরী নদী ও ডিংগাপোতা হাওর' : 'Ceramic hills, Someshwari river & haors',
      icon: Compass,
      href: '/places',
      color: 'from-blue-500 to-indigo-700',
    },
    {
      title: language === 'bn' ? 'ইন্টারেক্টিভ ম্যাপ' : 'Interactive Map',
      desc: language === 'bn' ? 'উপজেলা, পর্যটন ও হাসপাতালের ভৌগোলিক অবস্থান' : 'Explore locations, borders & routes on map',
      icon: MapIcon,
      href: '/map',
      color: 'from-cyan-500 to-blue-700',
    },
    {
      title: language === 'bn' ? 'নাগরিক সেবা' : 'Citizen Services',
      desc: language === 'bn' ? 'ই-নামজারি, জন্মনিবন্ধন, পাসপোর্ট ও ভূমিসেবা' : 'E-Mutation, NID, Passports & Civil services',
      icon: Building2,
      href: '/services',
      color: 'from-violet-500 to-purple-700',
    },
    {
      title: language === 'bn' ? 'স্বাস্থ্য ও হাসপাতাল' : 'Health & Hospitals',
      desc: language === 'bn' ? '২৫০ শয্যা সদর হাসপাতাল ও উপজেলা স্বাস্থ্য কমপ্লেক্স' : '250-bed Sadar Hospital & all health complexes',
      icon: HeartPulse,
      href: '/health',
      color: 'from-rose-500 to-red-700',
    },
    {
      title: language === 'bn' ? 'শিক্ষা প্রতিষ্ঠান' : 'Schools & Colleges',
      desc: language === 'bn' ? 'বিশ্ববিদ্যালয়, মেডিকেল কলেজ ও ঐতিহ্যবাহী বিদ্যালয়' : 'University, Medical College & century-old schools',
      icon: School,
      href: '/education',
      color: 'from-amber-500 to-orange-700',
    },
    {
      title: language === 'bn' ? 'হাওর ও মৎস্য সম্পদ' : 'Fisheries & Haor',
      desc: language === 'bn' ? 'মিঠাপানির মাছের ভাণ্ডার ও মোহনগঞ্জ মোকাম' : 'Freshwater fisheries & Mohanaganj fish mokams',
      icon: Fish,
      href: '/fisheries',
      color: 'from-sky-500 to-teal-700',
    },
    {
      title: language === 'bn' ? 'ইতিহাস ও সংস্কৃতি' : 'History & Folklore',
      desc: language === 'bn' ? 'মৈমনসিংহ গীতিকা, বাউল গান ও মুক্তিযুদ্ধের গৌরব' : 'Maimansingha Gitika, Baul songs & 1971 glory',
      icon: Landmark,
      href: '/history',
      color: 'from-stone-600 to-slate-800',
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white overflow-hidden py-16 sm:py-24 lg:py-28">
        {/* Subtle decorative background patterns */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* National & Division Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'bn' ? 'ময়মনসিংহ বিভাগ | বাংলাদেশ' : 'Mymensingh Division | Bangladesh'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {language === 'bn' ? 'আমাদের নেত্রকোণা' : 'Our Netrokona'}
            </h1>

            {/* Subtitle / Motto */}
            <p className="text-xl sm:text-2xl font-medium text-emerald-200">
              {language === 'bn' ? DISTRICT_DATA.motto.bn : DISTRICT_DATA.motto.en}
            </p>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {language === 'bn'
                ? 'মেঘালয় পাহাড়ের পাদদেশ থেকে শুরু করে দিগন্তজোড়া ডিংগাপোতা হাওর—১০টি উপজেলার পর্যটন, নাগরিক সেবা, শিক্ষা, স্বাস্থ্য, কৃষি ও শতাব্দীর লোকসংস্কৃতির সম্পূর্ণ ডিজিটাল তথ্য পোর্টাল।'
                : 'From the foot of Meghalaya hills to boundless Dingapota Haor—explore comprehensive digital records across all 10 upazilas, public services, institutions, and rich heritage.'}
            </p>

            {/* Fast Global Search Box */}
            <form onSubmit={handleSearchSubmit} className="pt-2 max-w-2xl mx-auto">
              <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden border border-emerald-500/40 bg-white/10 backdrop-blur-md focus-within:bg-white focus-within:text-slate-900 focus-within:border-emerald-500 transition-all duration-200">
                <Search className="w-5 h-5 ml-4 text-emerald-300 shrink-0 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'bn' ? 'উপজেলা, পর্যটন স্থান, হাসপাতাল, সেবা বা শিক্ষা প্রতিষ্ঠান খুঁজুন...' : 'Search upazilas, tourist spots, hospitals, services...'}
                  className="w-full py-4 pl-3 pr-28 sm:pr-32 text-sm sm:text-base text-white focus:text-slate-900 bg-transparent placeholder-slate-300 focus:placeholder-slate-400 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                >
                  {language === 'bn' ? 'অনুসন্ধান' : 'Search'}
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 mt-2.5 text-xs text-slate-400 flex-wrap">
                <span>{language === 'bn' ? 'জনপ্রিয় অনুসন্ধান:' : 'Popular searches:'}</span>
                <button type="button" onClick={() => navigate('/places/birishiri-ceramic-hill')} className="hover:text-emerald-300 underline">বিরিশিরি</button>
                <span>•</span>
                <button type="button" onClick={() => navigate('/upazilas/durgapur')} className="hover:text-emerald-300 underline">দুর্গাপুর</button>
                <span>•</span>
                <button type="button" onClick={() => navigate('/places/dingapota-haor')} className="hover:text-emerald-300 underline">ডিংগাপোতা হাওর</button>
                <span>•</span>
                <button type="button" onClick={() => navigate('/health')} className="hover:text-emerald-300 underline">সদর হাসপাতাল</button>
                <span>•</span>
                <button type="button" onClick={() => navigate('/services')} className="hover:text-emerald-300 underline">ই-নামজারি</button>
              </div>
            </form>

            {/* Quick Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-sm font-bold">
              <Link
                to="/upazilas"
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:shadow-emerald-900/40 transition-all flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>{language === 'bn' ? '১০টি উপজেলা দেখুন' : 'Explore Upazilas'}</span>
              </Link>
              <Link
                to="/places"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>{language === 'bn' ? 'দর্শনীয় পর্যটন স্থান' : 'Tourist Places'}</span>
              </Link>
              <Link
                to="/services"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>{language === 'bn' ? 'নাগরিক সেবা' : 'Gov Services'}</span>
              </Link>
              <Link
                to="/emergency"
                className="px-5 py-3 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white shadow-md transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{language === 'bn' ? 'জরুরি সেবা' : 'Emergency'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Statistics Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 lg:p-8">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              {t('quickStatsTitle')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6 text-center divide-x-0 sm:divide-x divide-slate-100">
            {DISTRICT_DATA.quickStats.map((stat, idx) => (
              <div key={idx} className="space-y-1 p-2">
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {language === 'bn' ? stat.valueBn : stat.value}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {language === 'bn' ? stat.label.bn : stat.label.en}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Netrokona Category Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={language === 'bn' ? 'ডিজিটাল পোর্টাল' : 'Digital Hub'}
          title={language === 'bn' ? 'নেত্রকোণা অন্বেষণ করুন' : 'Explore Netrokona Portal'}
          subtitle={language === 'bn' ? 'প্রয়োজনীয় সেবা, ভ্রমণ, শিক্ষা, স্বাস্থ্য ও সাংস্কৃতিক সম্পদ সহজে খুঁজে নিন।' : 'Quick access to administrative info, tourism, public services, and heritage.'}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {explorationCards.map((card, idx) => (
            <Link
              key={idx}
              to={card.href}
              className="group bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-emerald-500/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-1.5 flex items-center justify-between">
                  <span>{card.title}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Tourist Places */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <SectionHeader
            badge={language === 'bn' ? 'প্রাকৃতিক ও ঐতিহাসিক আকর্ষণ' : 'Tourism Highlights'}
            title={language === 'bn' ? 'শীর্ষ দর্শনীয় স্থান' : 'Featured Tourist Places'}
            subtitle={language === 'bn' ? 'বিরিশিরির নীল পানির হ্রদ থেকে শুরু করে সুবিশাল ডিংগাপোতা হাওর পর্যন্ত।' : 'From turquoise ceramic lake to boundless haor waters.'}
            className="mb-0"
          />
          <Link
            to="/places"
            className="inline-flex items-center gap-1.5 font-bold text-sm text-emerald-700 hover:text-emerald-800 shrink-0 self-start sm:self-auto"
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

      {/* Interactive Map Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <SectionHeader
            badge={language === 'bn' ? 'ভৌগোলিক অবস্থান' : 'Geographic Map'}
            title={language === 'bn' ? 'মানচিত্রে নেত্রকোণা' : 'Explore on District Map'}
            subtitle={language === 'bn' ? '১০টি উপজেলা, পর্যটন কেন্দ্র ও জরুরি হাসপাতালের অবস্থান ইন্টারেক্টিভ মানচিত্রে দেখুন।' : 'Navigate upazila centers, tourist spots, and emergency facilities.'}
            className="mb-0"
          />
          <Link
            to="/map"
            className="inline-flex items-center gap-1.5 font-bold text-sm text-emerald-700 hover:text-emerald-800 shrink-0 self-start sm:self-auto"
          >
            <span>{language === 'bn' ? 'পূর্ণাঙ্গ মানচিত্র খুলুন' : 'Open Fullscreen Map'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <LeafletDistrictMap height="480px" />
      </section>

      {/* 10 Upazilas Section */}
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
            className="inline-flex items-center gap-1.5 font-bold text-sm text-emerald-700 hover:text-emerald-800 shrink-0 self-start sm:self-auto"
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

      {/* Citizen Services Preview */}
      <section className="bg-slate-100 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <SectionHeader
              badge={language === 'bn' ? 'নাগরিক সেবা ও তথ্য' : 'Citizen Charter'}
              title={language === 'bn' ? 'গুরুত্বপূর্ণ সরকারি নাগরিক সেবা' : 'Key Official Citizen Services'}
              subtitle={language === 'bn' ? 'ভূমি মিউটেশন, জন্ম নিবন্ধন, ই-পাসপোর্টসহ সরকারি পোর্টালে সরাসরি সেবা গ্রহণ করুন।' : 'Direct access to verified official government portals and guidelines.'}
              className="mb-0"
            />
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 font-bold text-sm text-emerald-700 hover:text-emerald-800 shrink-0 self-start sm:self-auto"
            >
              <span>{language === 'bn' ? 'সকল নাগরিক সেবা' : 'View all services'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Notable Personalities Preview */}
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
            className="inline-flex items-center gap-1.5 font-bold text-sm text-emerald-700 hover:text-emerald-800 shrink-0 self-start sm:self-auto"
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

      {/* Latest District Updates & Notices */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <SectionHeader
            badge={language === 'bn' ? 'সরকারি নোটিশ ও আবহাওয়া' : 'Notices & Updates'}
            title={language === 'bn' ? 'সর্বশেষ জেলা তথ্য ও নোটিশ' : 'Latest District Notices & News'}
            subtitle={language === 'bn' ? 'হাওর বন্যা পূর্বাভাস, কৃষি পরামর্শ এবং পরিবেশ ও শিক্ষা বিষয়ক সর্বশেষ তথ্য।' : 'Haor hydrology updates, agricultural alerts, and official bulletins.'}
            className="mb-0"
          />
          <Link
            to="/news"
            className="inline-flex items-center gap-1.5 font-bold text-sm text-emerald-700 hover:text-emerald-800 shrink-0 self-start sm:self-auto"
          >
            <span>{language === 'bn' ? 'সকল নোটিশ ও সংবাদ' : 'View all updates'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </section>

      {/* Emergency Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-900 via-rose-900 to-slate-900 rounded-3xl p-8 lg:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-200 bg-red-800/60 px-3 py-1 rounded-full uppercase tracking-wider">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? '২৪ ঘণ্টা জরুরি সেবা' : '24/7 Emergency Support'}</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {language === 'bn' ? 'জরুরি প্রয়োজনে পুলিশ, ফায়ার সার্ভিস বা অ্যাম্বুলেন্স খুঁজছেন?' : 'Need urgent police, fire service, or ambulance assistance?'}
            </h3>
            <p className="text-sm text-red-100 max-w-xl">
              {language === 'bn'
                ? 'জাতীয় জরুরি সেবা ৯৯৯ ছাড়াও জেলার সকল থানা, ফায়ার স্টেশন এবং সদর হাসপাতালের যাচাইকৃত জরুরি নম্বরসমূহ এক ক্লিকে পান।'
                : 'Access 24/7 National Emergency 999 as well as direct verified duty numbers for district police stations, fire stations, and Sadar hospital.'}
            </p>
          </div>

          <Link
            to="/emergency"
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-red-50 text-red-900 font-extrabold text-sm sm:text-base shadow-lg transition-all shrink-0 flex items-center gap-2"
          >
            <span>{language === 'bn' ? 'জরুরি নম্বর তালিকা দেখুন' : 'View Emergency Directory'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
