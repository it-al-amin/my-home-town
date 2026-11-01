import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Languages } from 'lucide-react';

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`inline-flex items-center rounded-full bg-emerald-950/20 p-1 border border-emerald-500/30 backdrop-blur-sm ${className}`}>
      <button
        type="button"
        onClick={() => setLanguage('bn')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
          language === 'bn'
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700'
        }`}
        title="বাংলা ভাষা নির্বাচন করুন"
        aria-label="Switch to Bangla"
      >
        <span>বাংলা</span>
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
          language === 'en'
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700'
        }`}
        title="Switch to English"
        aria-label="Switch to English"
      >
        <Languages className="w-3.5 h-3.5" />
        <span>English</span>
      </button>
    </div>
  );
};
