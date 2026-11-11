import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Search, Compass, School, Wheat, 
  ChevronDown, ExternalLink, Home, HeartPulse, 
  MapPin, Layers, Utensils, Bed, Fish, ShoppingBag, 
  BookOpen, Landmark
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { AmarNetrokonaLogo } from './AmarNetrokonaLogo';

export const Header: React.FC = () => {
  const { language, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click or route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/directory?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Modern navigation groups prioritizing: Unions, Tourism, Education, Business, Agriculture, Food & Hotels
  const navItems = [
    {
      id: 'upazilas',
      label: language === 'bn' ? 'উপজেলা ও ইউনিয়ন' : 'Upazilas & Unions',
      icon: MapPin,
      col1Title: language === 'bn' ? '১০টি উপজেলা' : '10 Upazilas',
      col1Items: [
        { label: language === 'bn' ? 'নেত্রকোণা সদর (১২ ইউনিয়ন)' : 'Netrokona Sadar (12 Unions)', href: '/upazilas/netrokona-sadar' },
        { label: language === 'bn' ? 'দুর্গাপুর (সাদামাটি ও পাহাড় - ৭ ইউনিয়ন)' : 'Durgapur (Hills - 7 Unions)', href: '/upazilas/durgapur' },
        { label: language === 'bn' ? 'কলমাকান্দা (লেংগুড়া ও পাহাড় - ৮ ইউনিয়ন)' : 'Kalmakanda (8 Unions)', href: '/upazilas/kalmakanda' },
        { label: language === 'bn' ? 'মোহনগঞ্জ (হাওরের রাজধানী - ৭ ইউনিয়ন)' : 'Mohanganj (7 Unions)', href: '/upazilas/mohanganj' },
        { label: language === 'bn' ? 'খালিয়াজুরী (গভীর হাওর - ৬ ইউনিয়ন)' : 'Khaliajuri (6 Unions)', href: '/upazilas/khaliajuri' },
      ],
      col2Title: language === 'bn' ? 'অন্যান্য উপজেলা ও মানচিত্র' : 'Other Upazilas & Maps',
      col2Items: [
        { label: language === 'bn' ? 'বারহাট্টা, আটপাড়া, মদন, কেন্দুয়া, পূর্বধলা' : 'Barhatta, Atpara, Madan, Kendua, Purbadhala', href: '/upazilas' },
        { label: language === 'bn' ? 'ইন্টারেক্টিভ ভেক্টর জেলা মানচিত্র' : 'Vector District Boundary Map', href: '/map' },
        { label: language === 'bn' ? '৮৬টি ইউনিয়নের জিপিএস তালিকা' : 'All 86 Unions with Coordinates', href: '/map' },
        { label: language === 'bn' ? 'স্যাটেলাইট ও ওপেনস্ট্রিটম্যাপ জিআইএস' : 'Satellite & GIS Map', href: '/map' },
      ],
    },
    {
      id: 'tourism',
      label: language === 'bn' ? 'দর্শনীয় স্থান' : 'Tourist Places',
      icon: Compass,
      col1Title: language === 'bn' ? 'প্রকৃতি ও পাহাড়' : 'Hills & Lakes',
      col1Items: [
        { label: language === 'bn' ? 'বিজয়পুর সাদামাটির পাহাড় ও নীল হ্রদ' : 'Bijoypur Ceramic Lake', href: '/places/birishiri-ceramic-hill' },
        { label: language === 'bn' ? 'স্ফটিকস্বচ্ছ সোমেশ্বরী নদী ও বালুচর' : 'Someshwari River & Sandbars', href: '/places/someshwari-river' },
        { label: language === 'bn' ? 'রানীখং পাহাড় ও শতবর্ষী চার্চ' : 'Rani Khong Hill & Church', href: '/places/rani-khong-church' },
        { label: language === 'bn' ? 'রংছাতির পাহাড় ও লেংগুড়া সীমান্ত' : 'Rangchhati Garo Hills', href: '/places' },
      ],
      col2Title: language === 'bn' ? 'হাওর ও প্রত্নতত্ত্ব' : 'Haors & Heritage',
      col2Items: [
        { label: language === 'bn' ? 'সুবিশাল ডিংগাপোতা হাওর' : 'Dingapota Haor Basin', href: '/places/dingapota-haor' },
        { label: language === 'bn' ? 'সুলতানী আমলের রোয়াইলবাড়ি প্রাচীন দুর্গ' : 'Roailbari Medieval Fort', href: '/places/roailbari-fort' },
        { label: language === 'bn' ? 'ক্ষুদ্র নৃগোষ্ঠীর কালচারাল একাডেমি' : 'Tribal Cultural Academy', href: '/places/tribal-cultural-academy' },
        { label: language === 'bn' ? 'সকল দর্শনীয় স্থানের তালিকা' : 'View All Tourist Places', href: '/places' },
      ],
    },
    {
      id: 'education',
      label: language === 'bn' ? 'শিক্ষা ও প্রতিষ্ঠান' : 'Education & Schools',
      icon: School,
      col1Title: language === 'bn' ? 'উচ্চশিক্ষা ও বিশেষায়িত প্রতিষ্ঠান' : 'Higher Education & Medical',
      col1Items: [
        { label: language === 'bn' ? 'শেখ হাসিনা বিশ্ববিদ্যালয়' : 'Sheikh Hasina University', href: '/education' },
        { label: language === 'bn' ? 'নেত্রকোণা মেডিকেল কলেজ' : 'Netrokona Medical College', href: '/education' },
        { label: language === 'bn' ? 'নেত্রকোণা সরকারি কলেজ' : 'Netrokona Govt. College', href: '/education' },
        { label: language === 'bn' ? 'নেত্রকোণা সরকারি মহিলা কলেজ' : 'Govt. Women College', href: '/education' },
        { label: language === 'bn' ? 'নেত্রকোণা পলিটেকনিক ইনস্টিটিউট' : 'Polytechnic Institute', href: '/education' },
      ],
      col2Title: language === 'bn' ? 'শতবর্ষী ও ঐতিহ্যবাহী বিদ্যালয়' : 'Centenary & Historic Schools',
      col2Items: [
        { label: language === 'bn' ? 'নেত্রকোণা সরকারি অঞ্জুম উচ্চ বিদ্যালয়' : 'Govt. Anjuman High School', href: '/education' },
        { label: language === 'bn' ? 'দত্ত উচ্চ বিদ্যালয় (ঐতিহাসিক)' : 'Datta High School', href: '/education' },
        { label: language === 'bn' ? 'চন্দ্রনাথ পাবলিক উচ্চ বিদ্যালয়' : 'Chandranath High School', href: '/education' },
        { label: language === 'bn' ? 'শহীদ স্মৃতি বিদ্যাপীঠ (হুমায়ূন আহমেদ)' : 'Shaheed Smriti Bidyapith (Kutubpur)', href: '/education' },
      ],
    },
    {
      id: 'business',
      label: language === 'bn' ? 'ব্যবসা ও কৃষি' : 'Business & Agro',
      icon: Wheat,
      col1Title: language === 'bn' ? 'বাণিজ্য ও মোকাম' : 'Commerce & Trade Hubs',
      col1Items: [
        { label: language === 'bn' ? 'শ্যামগঞ্জ প্রধান বাণিজ্যিক মোকাম' : 'Shyamganj Commercial Hub', href: '/transport#markets' },
        { label: language === 'bn' ? 'মোহনগঞ্জ তাজা মাছের পাইকারি আড়ৎ' : 'Mohanganj Fish Wholesale Market', href: '/fisheries' },
        { label: language === 'bn' ? 'ঐতিহ্যবাহী ছোট বাজার ও বড় বাজার' : 'Chhoto Bazar & Boro Bazar', href: '/transport#markets' },
        { label: language === 'bn' ? 'সাদামাটি (চীনামাটি) খনিজ শিল্প' : 'White Clay Mineral Industry', href: '/about' },
      ],
      col2Title: language === 'bn' ? 'কৃষি, ফসল ও মৎস্য' : 'Agro & Fisheries',
      col2Items: [
        { label: language === 'bn' ? 'বোরো ধানের শস্যভাণ্ডার ও ফসল' : 'Boro Rice Granary', href: '/agriculture' },
        { label: language === 'bn' ? 'হাওরের মিঠাপানির মৎস্য সম্পদ' : 'Freshwater Haor Fisheries', href: '/fisheries' },
        { label: language === 'bn' ? 'হাঁস পালন খামার ও প্রাণিসম্পদ' : 'Duck Farming & Livestock', href: '/livestock' },
        { label: language === 'bn' ? 'সকল গ্রামীণ হাট ও বাজার তালিকা' : 'Traditional Haat-Bazars', href: '/transport#markets' },
      ],
    },
    {
      id: 'food-hotels',
      label: language === 'bn' ? 'খাবার ও হোটেল' : 'Food & Hotels',
      icon: Utensils,
      col1Title: language === 'bn' ? 'ঐতিহ্যবাহী খাবার ও মিষ্টি' : 'Traditional Delicacies',
      col1Items: [
        { label: language === 'bn' ? 'গয়ানাথের বিখ্যাত বালিশ মিষ্টি' : 'Gayanath Balish Mishti', href: '/#food' },
        { label: language === 'bn' ? 'বিরিশিরির কালাই রুটি ও হাঁসের মাংস' : 'Garo Kalai Ruti & Duck Curry', href: '/#food' },
        { label: language === 'bn' ? 'মোহনগঞ্জ ও হাওরের তাজা মাছ' : 'Fresh Sweetwater Haor Fish', href: '/#food' },
        { label: language === 'bn' ? 'গারো পাহাড়ের খাঁটি প্রাকৃতিক মধু' : 'Forest Wild Hill Honey', href: '/#food' },
      ],
      col2Title: language === 'bn' ? 'হোটেল, রেস্ট হাউস ও যাতায়াত' : 'Hotels & Travel Routes',
      col2Items: [
        { label: language === 'bn' ? 'ওয়াইএমসিএ ও ওয়াইডব্লিউসিএ রেস্ট হাউস' : 'YMCA & YWCA Birishiri', href: '/#hotels' },
        { label: language === 'bn' ? 'কালচারাল একাডেমি ও স্বর্ণা গেস্ট হাউস' : 'Cultural Academy Rest House', href: '/#hotels' },
        { label: language === 'bn' ? 'ঢাকা ও ময়মনসিংহ থেকে যাতায়াত রুট' : 'Travel Guide from Dhaka/Mymensingh', href: '/#travel' },
        { label: language === 'bn' ? 'রেলওয়ে টিকিট ও বাস সময়সূচি' : 'Train & Bus Schedules', href: '/transport' },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200" ref={navContainerRef}>
      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-4">
          {/* Logo & Brand: Nature, Hill, Sun and Waves */}
          <Link to="/" className="focus:outline-hidden">
            <AmarNetrokonaLogo />
          </Link>

          {/* Center Navigation Links with Modern Mega Dropdown */}
          <nav className="hidden xl:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                location.pathname === '/'
                  ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {language === 'bn' ? 'হোম' : 'Home'}
            </Link>

            {navItems.map((item) => {
              const isOpen = activeDropdown === item.id;
              return (
                <div key={item.id} className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(isOpen ? null : item.id)}
                    onMouseEnter={() => setActiveDropdown(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                      isOpen
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-300 shadow-2xs'
                        : 'text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
                  </button>

                  {/* Mega Menu Card */}
                  {isOpen && (
                    <div
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="absolute left-0 top-full pt-2 w-[540px] z-50 animate-in fade-in zoom-in-95 duration-150"
                    >
                      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 grid grid-cols-2 gap-5">
                        {/* Col 1 */}
                        <div className="space-y-2 border-r border-slate-100 dark:border-slate-800 pr-4">
                          <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 pb-1 border-b border-slate-100 dark:border-slate-800">
                            {item.col1Title}
                          </h4>
                          <div className="space-y-1 pt-1">
                            {item.col1Items.map((sub, i) => (
                              <Link
                                key={i}
                                to={sub.href}
                                onClick={() => setActiveDropdown(null)}
                                className="block px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                              >
                                • {sub.label}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Col 2 */}
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 pb-1 border-b border-slate-100 dark:border-slate-800">
                            {item.col2Title}
                          </h4>
                          <div className="space-y-1 pt-1">
                            {item.col2Items.map((sub, i) => (
                              <Link
                                key={i}
                                to={sub.href}
                                onClick={() => setActiveDropdown(null)}
                                className="block px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                              >
                                • {sub.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* "≡ আরও" (More Menu for History, Culture & Directory) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'more' ? null : 'more')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeDropdown === 'more'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{language === 'bn' ? '≡ আরও' : '≡ More'}</span>
              </button>

              {activeDropdown === 'more' && (
                <div
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute right-0 top-full pt-2 w-60 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 space-y-1">
                    <Link
                      to="/history"
                      onClick={() => setActiveDropdown(null)}
                      className="block px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg"
                    >
                      {language === 'bn' ? 'ইতিহাস ও মুক্তিযুদ্ধ' : 'History & Heritage'}
                    </Link>
                    <Link
                      to="/culture"
                      onClick={() => setActiveDropdown(null)}
                      className="block px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg"
                    >
                      {language === 'bn' ? 'লোকসংস্কৃতি ও সাহিত্য' : 'Culture & Folklore'}
                    </Link>
                    <Link
                      to="/people"
                      onClick={() => setActiveDropdown(null)}
                      className="block px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg"
                    >
                      {language === 'bn' ? 'নেত্রকোণার গুণীজন' : 'Notable People'}
                    </Link>
                    <Link
                      to="/directory"
                      onClick={() => setActiveDropdown(null)}
                      className="block px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg"
                    >
                      {language === 'bn' ? 'সার্বজনীন ডিরেক্টরি' : 'Global Directory'}
                    </Link>
                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <Link
                        to="/services"
                        onClick={() => setActiveDropdown(null)}
                        className="block px-3 py-1.5 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300"
                      >
                        {language === 'bn' ? 'নাগরিক সেবা ও তথ্য বাতায়ন' : 'Public Services'}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Header Actions: Search, Language Switcher, Theme Switcher (☀️/🌙) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              to="/directory"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title={language === 'bn' ? 'অনুসন্ধান করুন' : 'Search Directory'}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Dark/Light Full Theme Switcher (like amar-gaibandha ☀️/🌙) */}
            <ThemeToggle />

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl max-h-[82vh] overflow-y-auto">
          {/* Mobile Search */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'bn' ? 'উপজেলা, পর্যটন, খাবার বা স্কুল খুঁজুন...' : 'Search portal...'}
                className="w-full py-2.5 pl-3.5 pr-20 text-xs font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="absolute right-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
              >
                {language === 'bn' ? 'খুঁজুন' : 'Search'}
              </button>
            </form>
          </div>

          <div className="px-4 py-3 space-y-3">
            <Link
              to="/"
              className="block px-3 py-2 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-xl"
            >
              {language === 'bn' ? 'হোম' : 'Home'}
            </Link>

            {navItems.map((group) => (
              <div key={group.id} className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <group.icon className="w-4 h-4" />
                  <span>{group.label}</span>
                </div>
                <div className="space-y-0.5 pl-3">
                  {group.col1Items.map((sub, i) => (
                    <Link
                      key={i}
                      to={sub.href}
                      className="block px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg"
                    >
                      • {sub.label}
                    </Link>
                  ))}
                  {group.col2Items.map((sub, i) => (
                    <Link
                      key={i}
                      to={sub.href}
                      className="block px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg"
                    >
                      • {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <Link
                to="/history"
                className="block px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                {language === 'bn' ? 'ইতিহাস ও মুক্তিযুদ্ধ' : 'History & 1971'}
              </Link>
              <Link
                to="/services"
                className="block px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400"
              >
                {language === 'bn' ? 'নাগরিক সেবা ও তথ্য বাতায়ন' : 'Citizen Services'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
