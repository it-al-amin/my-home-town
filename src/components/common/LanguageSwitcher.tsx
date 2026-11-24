import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Languages } from 'lucide-react';

/**
 * Phones: one compact button that toggles বাংলা ⇄ English (saves header space).
 * Tablet and up: a two-option segmented control.
 */
export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  const option = (lang: 'bn' | 'en', label: string, aria: string) => (
    <button
      type="button"
      onClick={() => setLanguage(lang)}
      aria-pressed={language === lang}
      aria-label={aria}
      lang={lang}
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
        language === lang
          ? 'bg-emerald-700 text-white shadow-sm'
          : 'text-slate-600 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-300'
      }`}
    >
      {lang === 'en' && <Languages className="w-3.5 h-3.5" aria-hidden="true" />}
      {label}
    </button>
  );

  return (
    <>
      {/* Compact toggle (phones) */}
      <button
        type="button"
        onClick={toggleLanguage}
        lang={language === 'bn' ? 'en' : 'bn'}
        aria-label={language === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
        className={`sm:hidden xl:inline-flex 2xl:hidden inline-flex items-center gap-1 h-9 px-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold ${className}`}
      >
        <Languages className="w-4 h-4" aria-hidden="true" />
        {language === 'bn' ? 'EN' : 'বাং'}
      </button>

      {/* Segmented control (tablet / desktop) */}
      <div
        role="group"
        aria-label="Language / ভাষা"
        className={`hidden sm:inline-flex xl:hidden 2xl:inline-flex items-center rounded-full bg-white dark:bg-slate-800 p-1 border border-emerald-200 dark:border-emerald-800 ${className}`}
      >
        {option('bn', 'বাংলা', 'বাংলা ভাষা নির্বাচন করুন')}
        {option('en', 'English', 'Switch to English')}
      </div>
    </>
  );
};
