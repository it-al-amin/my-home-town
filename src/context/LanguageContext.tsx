import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const UI_TRANSLATIONS: Record<string, { bn: string; en: string }> = {
  // Navigation
  home: { bn: 'হোম', en: 'Home' },
  about: { bn: 'জেলা পরিচিতি', en: 'About District' },
  upazilas: { bn: 'উপজেলাসমূহ', en: 'Upazilas' },
  places: { bn: 'দর্শনীয় স্থান', en: 'Tourist Places' },
  map: { bn: 'জেলা মানচিত্র', en: 'District Map' },
  education: { bn: 'শিক্ষা প্রতিষ্ঠান', en: 'Education' },
  health: { bn: 'স্বাস্থ্য ও চিকিৎসা', en: 'Health Services' },
  services: { bn: 'নাগরিক সেবা', en: 'Citizen Services' },
  directory: { bn: 'ডিরেক্টরি ও যোগাযোগ', en: 'Directory & Search' },
  politics: { bn: 'সংসদীয় আসন', en: 'Parliamentary Seats' },
  people: { bn: 'গুণীজন ও স্মরণীয় ব্যক্তিত্ব', en: 'Notable Personalities' },
  culture: { bn: 'সংস্কৃতি ও সাহিত্য', en: 'Culture & Literature' },
  history: { bn: 'ইতিহাস ও ঐতিহ্য', en: 'History & Heritage' },
  news: { bn: 'সংবাদ ও নোটিশ', en: 'News & Notices' },
  transport: { bn: 'যোগাযোগ ও যাতায়াত', en: 'Transport' },
  fisheries: { bn: 'মৎস্য সম্পদ ও হাওর', en: 'Fisheries' },
  agriculture: { bn: 'কৃষি ও খাদ্য', en: 'Agriculture' },
  livestock: { bn: 'প্রাণিসম্পদ', en: 'Livestock' },
  emergency: { bn: 'জরুরি সেবা', en: 'Emergency' },
  sources: { bn: 'তথ্যসূত্র ও যাচাইকরণ', en: 'Sources & Methodology' },

  // General UI
  search: { bn: 'অনুসন্ধান করুন...', en: 'Search anything...' },
  viewDetails: { bn: 'বিস্তারিত দেখুন', en: 'View Details' },
  openInMaps: { bn: 'গুগল ম্যাপে দেখুন', en: 'Open in Google Maps' },
  source: { bn: 'উৎস', en: 'Source' },
  lastVerified: { bn: 'সর্বশেষ যাচাই', en: 'Last Verified' },
  verifiedGov: { bn: 'সরকারি তথ্যসূত্র সমর্থিত', en: 'Verified Public/Official Source' },
  officialGovLink: { bn: 'অফিসিয়াল সরকারি পোর্টাল লিঙ্ক', en: 'Official Government Portal Link' },
  backToTop: { bn: 'উপরে যান', en: 'Back to Top' },
  filterAll: { bn: 'সকল', en: 'All' },
  filterByUpazila: { bn: 'উপজেলা বাছাই করুন', en: 'Filter by Upazila' },
  filterByCategory: { bn: 'ক্যাটেগরি বাছাই করুন', en: 'Filter by Category' },
  noResults: { bn: 'কোনো ফলাফল পাওয়া যায়নি', en: 'No results found' },
  noResultsSub: { bn: 'অন্য কোনো শব্দ বা ফিল্টার দিয়ে চেষ্টা করুন।', en: 'Try adjusting your search terms or filters.' },
  emergencyHotlineNotice: { bn: 'জাতীয় জরুরি হটলাইনসমূহ ২৪ ঘণ্টা কার্যকর। মিথ্যা কল আইনত দণ্ডনীয়।', en: 'National emergency hotlines operate 24/7. False calls are punishable by law.' },
  readOriginal: { bn: 'মূল প্রতিবেদন পড়ুন', en: 'Read Original Source' },
  allUpazilas: { bn: 'সকল উপজেলা (১০টি)', en: 'All Upazilas (10)' },
  quickStatsTitle: { bn: 'এক নজরে নেত্রকোণা', en: 'Netrokona at a Glance' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('netrokona_portal_lang');
    return saved === 'en' ? 'en' : 'bn';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('netrokona_portal_lang', lang);
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    if (UI_TRANSLATIONS[key]) {
      return UI_TRANSLATIONS[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
