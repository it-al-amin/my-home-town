import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Search, PhoneCall, Map, Compass, BookOpen, 
  Building2, Fish, ShieldAlert, ChevronDown, Landmark, Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Header: React.FC = () => {
  const { language, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const navGroups = [
    {
      id: 'explore',
      label: language === 'bn' ? 'অন্বেষণ ও স্থান' : 'Explore',
      icon: Compass,
      items: [
        { label: language === 'bn' ? '১০টি উপজেলা' : '10 Upazilas', href: '/upazilas' },
        { label: language === 'bn' ? 'দর্শনীয় পর্যটন স্থান' : 'Tourist Places', href: '/places' },
        { label: language === 'bn' ? 'ইন্টারেক্টিভ মানচিত্র' : 'Interactive Map', href: '/map' },
        { label: language === 'bn' ? 'ইতিহাস ও ঐতিহ্য' : 'History & Heritage', href: '/history' },
        { label: language === 'bn' ? 'সংস্কৃতি ও সাহিত্য' : 'Culture & Folklore', href: '/culture' },
      ],
    },
    {
      id: 'services',
      label: language === 'bn' ? 'সেবা ও নাগরিক জীবন' : 'Services & Living',
      icon: Building2,
      items: [
        { label: language === 'bn' ? 'সকল সরকারি নাগরিক সেবা' : 'Citizen Services', href: '/services' },
        { label: language === 'bn' ? 'হাসপাতাল ও স্বাস্থ্যসেবা' : 'Hospitals & Health', href: '/health' },
        { label: language === 'bn' ? 'শিক্ষা ও প্রতিষ্ঠান' : 'Schools & Colleges', href: '/education' },
        { label: language === 'bn' ? 'যোগাযোগ ও যাতায়াত' : 'Transport & Trains', href: '/transport' },
        { label: language === 'bn' ? 'ঐতিহ্যবাহী হাট-বাজার' : 'Traditional Bazars', href: '/transport#markets' },
      ],
    },
    {
      id: 'agro',
      label: language === 'bn' ? 'কৃষি ও হাওর সম্পদ' : 'Agro & Economy',
      icon: Fish,
      items: [
        { label: language === 'bn' ? 'মৎস্য সম্পদ ও হাওর' : 'Fisheries & Haor', href: '/fisheries' },
        { label: language === 'bn' ? 'কৃষি ও বোরো ফসল' : 'Agriculture & Crops', href: '/agriculture' },
        { label: language === 'bn' ? 'হাঁস পালন ও প্রাণিসম্পদ' : 'Livestock & Ducks', href: '/livestock' },
      ],
    },
    {
      id: 'community',
      label: language === 'bn' ? 'সমাজ ও নেতৃত্ব' : 'People & Updates',
      icon: Landmark,
      items: [
        { label: language === 'bn' ? 'গুণীজন ও স্মরণীয় ব্যক্তিত্ব' : 'Notable People', href: '/people' },
        { label: language === 'bn' ? 'সংসদীয় আসন (৫টি)' : 'Parliamentary Seats', href: '/politics' },
        { label: language === 'bn' ? 'সংবাদ ও জরুরি নোটিশ' : 'News & Notices', href: '/news' },
        { label: language === 'bn' ? 'জরুরি যোগাযোগ তালিকা' : 'Emergency Contacts', href: '/emergency' },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Utility & Emergency Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{language === 'bn' ? 'জরুরি হেল্পলাইন:' : 'Emergency Hotlines:'}</span>
            </span>
            <span className="text-slate-400">
              জাতীয়: <strong className="text-white hover:text-emerald-400 transition-colors">999</strong> (জরুরি) | <strong className="text-white hover:text-emerald-400 transition-colors">333</strong> (সেবা) | <strong className="text-white hover:text-emerald-400 transition-colors">16263</strong> (স্বাস্থ্য)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/emergency"
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <PhoneCall className="w-3 h-3" />
              <span>{language === 'bn' ? 'জরুরি তালিকা' : 'Emergency Directory'}</span>
            </Link>
            <span className="text-slate-700">|</span>
            <Link
              to="/sources"
              className="hover:text-white transition-colors"
            >
              {language === 'bn' ? 'তথ্যসূত্র নীতি' : 'Sources & Data'}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Branding */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-hidden">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 p-0.5 shadow-md group-hover:shadow-emerald-200 group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-emerald-700 rounded-[10px] flex items-center justify-center text-white font-bold text-xl">
                নে
              </div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-1.5 leading-none">
                <span>{language === 'bn' ? 'আমাদের নেত্রকোণা' : 'Our Netrokona'}</span>
                <span className="text-xs font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  PORTAL
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight mt-0.5">
                {language === 'bn' ? 'প্রকৃতি, ইতিহাস, মানুষ ও নাগরিক সেবা' : 'Digital District Information Portal'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === '/'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              {t('home')}
            </Link>

            {navGroups.map((group) => {
              const isOpen = activeDropdown === group.id;
              return (
                <div
                  key={group.id}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(group.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(isOpen ? null : group.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      isOpen ? 'text-emerald-700 bg-emerald-50' : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{group.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute left-0 top-full pt-1.5 w-60 z-50">
                      <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              to="/directory"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === '/directory'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              {t('directory')}
            </Link>
          </nav>

          {/* Right Header Actions: Search, Language Switcher & Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/directory"
              className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
              title={language === 'bn' ? 'অনুসন্ধান করুন' : 'Search Directory'}
              aria-label="Search directory"
            >
              <Search className="w-5 h-5" />
            </Link>

            <LanguageSwitcher />

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-hidden"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl max-h-[82vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-4">
            <Link
              to="/"
              className="block px-3 py-2.5 text-base font-bold text-slate-800 hover:bg-emerald-50 rounded-lg"
            >
              {t('home')}
            </Link>

            {navGroups.map((group) => (
              <div key={group.id} className="space-y-1 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  <group.icon className="w-4 h-4 text-emerald-600" />
                  <span>{group.label}</span>
                </div>
                <div className="space-y-0.5 pl-4">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                to="/directory"
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-emerald-800 bg-emerald-50 rounded-lg"
              >
                <Search className="w-4 h-4 text-emerald-700" />
                <span>{language === 'bn' ? 'সার্বজনীন ডিরেক্টরি ও অনুসন্ধান' : 'Directory & Global Search'}</span>
              </Link>
              <Link
                to="/emergency"
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-red-700 bg-red-50 rounded-lg"
              >
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>{language === 'bn' ? 'জরুরি পুলিশ, ফায়ার ও স্বাস্থ্য সেবা' : 'Emergency Hotlines & Police'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
