import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, Filter, MapPin, Compass, Building2, School, 
  HeartPulse, User, Newspaper, ShoppingBag, ArrowRight 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { UPAZILAS_DATA } from '../data/upazilas';
import { PLACES_DATA } from '../data/places';
import { EDUCATION_DATA } from '../data/education';
import { HEALTH_DATA } from '../data/health';
import { SERVICES_DATA } from '../data/services';
import { PEOPLE_DATA } from '../data/people';
import { NEWS_DATA } from '../data/news';
import { MARKETS_DATA } from '../data/markets';
import { Breadcrumb } from '../components/common/Breadcrumb';

interface SearchItem {
  id: string;
  type: 'upazila' | 'place' | 'education' | 'health' | 'service' | 'person' | 'news' | 'market';
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  upazilaId?: string;
  url: string;
  badge: { bn: string; en: string };
  icon: any;
}

export const DirectoryPage: React.FC = () => {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('all');

  // Build unified search index
  const unifiedItems: SearchItem[] = useMemo(() => {
    const list: SearchItem[] = [];

    // 1. Upazilas
    UPAZILAS_DATA.forEach((u) => {
      list.push({
        id: `u-${u.id}`,
        type: 'upazila',
        title: u.name,
        titleBn: u.nameBn,
        description: u.description,
        descriptionBn: u.descriptionBn,
        upazilaId: u.id,
        url: `/upazilas/${u.slug}`,
        badge: { bn: 'উপজেলা', en: 'Upazila' },
        icon: MapPin,
      });
    });

    // 2. Tourist Places
    PLACES_DATA.forEach((p) => {
      list.push({
        id: `p-${p.id}`,
        type: 'place',
        title: p.name,
        titleBn: p.nameBn,
        description: p.description,
        descriptionBn: p.descriptionBn,
        upazilaId: p.upazilaId,
        url: `/places/${p.id}`,
        badge: { bn: 'দর্শনীয় স্থান', en: 'Tourist Place' },
        icon: Compass,
      });
    });

    // 3. Education
    EDUCATION_DATA.forEach((e) => {
      list.push({
        id: `e-${e.id}`,
        type: 'education',
        title: e.name,
        titleBn: e.nameBn,
        description: e.description,
        descriptionBn: e.descriptionBn,
        upazilaId: e.upazilaId,
        url: `/education`,
        badge: { bn: e.categoryLabel.bn, en: e.categoryLabel.en },
        icon: School,
      });
    });

    // 4. Health
    HEALTH_DATA.forEach((h) => {
      list.push({
        id: `h-${h.id}`,
        type: 'health',
        title: h.name,
        titleBn: h.nameBn,
        description: `${h.addressBn} | সেবা: ${h.servicesAvailableBn.join(', ')}`,
        descriptionBn: `${h.addressBn} | সেবা: ${h.servicesAvailableBn.join(', ')}`,
        upazilaId: h.upazilaId,
        url: `/health`,
        badge: { bn: h.categoryLabel.bn, en: h.categoryLabel.en },
        icon: HeartPulse,
      });
    });

    // 5. Citizen Services
    SERVICES_DATA.forEach((s) => {
      list.push({
        id: `s-${s.id}`,
        type: 'service',
        title: s.title,
        titleBn: s.titleBn,
        description: s.description,
        descriptionBn: s.descriptionBn,
        url: `/services`,
        badge: { bn: 'নাগরিক সেবা', en: 'Gov Service' },
        icon: Building2,
      });
    });

    // 6. People
    PEOPLE_DATA.forEach((person) => {
      list.push({
        id: `pe-${person.id}`,
        type: 'person',
        title: person.name,
        titleBn: person.nameBn,
        description: person.bio,
        descriptionBn: person.bioBn,
        upazilaId: person.upazilaId,
        url: `/people`,
        badge: { bn: person.categoryLabel.bn, en: person.categoryLabel.en },
        icon: User,
      });
    });

    // 7. News & Notices
    NEWS_DATA.forEach((n) => {
      list.push({
        id: `n-${n.id}`,
        type: 'news',
        title: n.title,
        titleBn: n.titleBn,
        description: n.summary,
        descriptionBn: n.summaryBn,
        upazilaId: n.upazilaId,
        url: `/news`,
        badge: { bn: 'সংবাদ/নোটিশ', en: 'Notice/News' },
        icon: Newspaper,
      });
    });

    // 8. Markets
    MARKETS_DATA.forEach((m) => {
      list.push({
        id: `m-${m.id}`,
        type: 'market',
        title: m.name,
        titleBn: m.nameBn,
        description: `${m.locationBn} - হাটের দিন: ${m.haatDaysBn}`,
        descriptionBn: `${m.locationBn} - হাটের দিন: ${m.haatDaysBn}`,
        upazilaId: m.upazilaId,
        url: `/transport#markets`,
        badge: { bn: 'ঐতিহ্যবাহী হাট', en: 'Bazar / Haat' },
        icon: ShoppingBag,
      });
    });

    return list;
  }, []);

  // Filter items
  const filteredResults = useMemo(() => {
    return unifiedItems.filter((item) => {
      const q = searchQuery.toLowerCase().trim();

      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.titleBn.includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.descriptionBn.includes(q);

      const matchesCategory =
        selectedCategory === 'all' || item.type === selectedCategory;

      const matchesUpazila =
        selectedUpazila === 'all' || !item.upazilaId || item.upazilaId === selectedUpazila;

      return matchesQuery && matchesCategory && matchesUpazila;
    });
  }, [unifiedItems, searchQuery, selectedCategory, selectedUpazila]);

  const categories = [
    { id: 'all', label: language === 'bn' ? 'সকল বিভাগ' : 'All Categories' },
    { id: 'upazila', label: language === 'bn' ? 'উপজেলা' : 'Upazilas' },
    { id: 'place', label: language === 'bn' ? 'দর্শনীয় স্থান' : 'Tourist Places' },
    { id: 'education', label: language === 'bn' ? 'শিক্ষা প্রতিষ্ঠান' : 'Education' },
    { id: 'health', label: language === 'bn' ? 'স্বাস্থ্য ও হাসপাতাল' : 'Health' },
    { id: 'service', label: language === 'bn' ? 'নাগরিক সেবা' : 'Services' },
    { id: 'person', label: language === 'bn' ? 'গুণীজন' : 'People' },
    { id: 'market', label: language === 'bn' ? 'ঐতিহ্যবাহী হাট-বাজার' : 'Markets' },
    { id: 'news', label: language === 'bn' ? 'সংবাদ ও নোটিশ' : 'Notices' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Directory & Search', labelBn: 'সার্বজনীন ডিরেক্টরি ও অনুসন্ধান', href: '/directory' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            {language === 'bn' ? 'সার্বজনীন সার্চ ইঞ্জিন' : 'Universal Search Index'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {language === 'bn' ? 'নেত্রকোণা সার্বজনীন ডিরেক্টরি' : 'Netrokona Universal Directory'}
          </h1>
          <p className="text-sm sm:text-base text-slate-200">
            {language === 'bn'
              ? 'বাংলা ও ইংরেজিতে যেকোনো স্থান, সেবা, প্রতিষ্ঠান, হাসপাতাল, ব্যক্তি বা হাট-বাজার এক নিমিষে খুঁজুন।'
              : 'Search instantaneously across places, services, schools, hospitals, personalities, and bazars in Bangla and English.'}
          </p>
        </div>
      </div>

      {/* Search Input and Filters Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Main Search Input */}
          <div className="relative sm:col-span-2">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchParams(e.target.value ? { q: e.target.value } : {});
              }}
              placeholder={language === 'bn' ? 'উদাহরণ: দুর্গাপুর, বিরিশিরি, হাসপাতাল, পাসপোর্ট, নির্মলেন্দু গুণ...' : 'e.g. Durgapur, Birishiri, Hospital, Passport, Nirmalendu Goon...'}
              className="w-full pl-10 pr-4 py-3 text-sm sm:text-base bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Upazila Filter */}
          <div>
            <select
              value={selectedUpazila}
              onChange={(e) => setSelectedUpazila(e.target.value)}
              className="w-full py-3 px-3 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden focus:border-emerald-500"
            >
              <option value="all">{language === 'bn' ? 'সকল উপজেলা (১০টি)' : 'All Upazilas (10)'}</option>
              {UPAZILAS_DATA.map((u) => (
                <option key={u.id} value={u.id}>
                  {language === 'bn' ? u.nameBn : u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100 text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 font-medium">
        <span>
          {language === 'bn'
            ? `মোট ${filteredResults.length}টি ফলাফল পাওয়া গেছে`
            : `Found ${filteredResults.length} matching results`}
        </span>
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSearchParams({});
            }}
            className="text-emerald-700 hover:underline font-semibold"
          >
            {language === 'bn' ? 'অনুসন্ধান মুছুন' : 'Clear search'}
          </button>
        )}
      </div>

      {/* Search Results List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResults.map((item) => {
          const title = language === 'bn' ? item.titleBn : item.title;
          const desc = language === 'bn' ? item.descriptionBn : item.description;
          const badgeText = language === 'bn' ? item.badge.bn : item.badge.en;
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              to={item.url}
              className="group bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-emerald-500/50 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-800 transition-colors">
                    {badgeText}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                  {title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {filteredResults.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">
            {language === 'bn' ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No Results Found'}
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {language === 'bn'
              ? `"${searchQuery}" এর সাথে সম্পর্কিত কোনো তথ্য খুঁজে পাওয়া যায়নি। বানান সংশোধন বা ফিল্টার রিসেট করে চেষ্টা করুন।`
              : `No matches found for "${searchQuery}". Please check your search query or reset filters.`}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedUpazila('all');
              setSearchParams({});
            }}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            {language === 'bn' ? 'সকল ফিল্টার রিসেট করুন' : 'Reset Search'}
          </button>
        </div>
      )}
    </div>
  );
};
