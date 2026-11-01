import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, MapPin, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const NotFoundPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black text-3xl mx-auto shadow-sm">
        404
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
        {language === 'bn' ? 'পৃষ্ঠাটি খুঁজে পাওয়া যায়নি' : 'Page Not Found'}
      </h1>

      <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
        {language === 'bn'
          ? 'আপনি যে পৃষ্ঠাটি খুঁজছেন তা মুছে ফেলা হয়েছে, নাম পরিবর্তন করা হয়েছে অথবা সাময়িকভাবে অনুপলব্ধ রয়েছে।'
          : 'The page you are looking for might have been moved, deleted, or does not exist.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
        >
          <Home className="w-4 h-4" />
          <span>{language === 'bn' ? 'হোম পেজে ফিরুন' : 'Back to Home'}</span>
        </Link>
        <Link
          to="/upazilas"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xs transition-all"
        >
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>{language === 'bn' ? 'উপজেলা তালিকা' : 'Upazilas'}</span>
        </Link>
        <Link
          to="/places"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xs transition-all"
        >
          <Compass className="w-4 h-4 text-blue-600" />
          <span>{language === 'bn' ? 'দর্শনীয় স্থান' : 'Tourist Places'}</span>
        </Link>
        <Link
          to="/directory"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xs transition-all"
        >
          <Search className="w-4 h-4 text-slate-500" />
          <span>{language === 'bn' ? 'অনুসন্ধান' : 'Search Directory'}</span>
        </Link>
      </div>
    </div>
  );
};
