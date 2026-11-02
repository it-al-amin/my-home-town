import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AmarNetrokonaLogo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const { language } = useLanguage();

  return (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      {/* Modern Nature Emblem: Garo Hills, Rising Sun, and Someshwari / Haor Waves */}
      <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 p-0.5 shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0 border border-slate-700/60 dark:border-slate-700">
        <div className="w-full h-full rounded-[14px] bg-[#111827] flex items-center justify-center relative overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-8 h-8 sm:w-9 sm:h-9">
            {/* Glowing Golden Sun */}
            <circle cx="50" cy="36" r="16" fill="#f59e0b" className="animate-pulse" />
            
            {/* Lush Garo Mountains Profile */}
            <path
              d="M 12 70 L 38 42 L 56 60 L 74 38 L 92 70 Z"
              fill="#10b981"
              opacity="0.85"
            />
            
            {/* Someshwari & Haor Azure Water Waves */}
            <path
              d="M 10 74 Q 30 66, 50 74 T 90 74 L 90 84 Q 70 76, 50 84 T 10 84 Z"
              fill="#06b6d4"
            />
            <path
              d="M 10 84 Q 30 78, 50 84 T 90 84 L 90 92 L 10 92 Z"
              fill="#0284c7"
            />
          </svg>
        </div>
      </div>

      {/* Typography: "আমার নেত্রকোণা" and "NETROKONA DISTRICT" */}
      <div>
        <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {language === 'bn' ? 'আমার নেত্রকোণা' : 'Amar Netrokona'}
        </div>
        <p className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mt-0.5">
          {language === 'bn' ? 'পাহাড়, হাওর ও ঐতিহ্যের জনপদ' : 'GAIBANDHA STYLE • NETROKONA'}
        </p>
      </div>
    </div>
  );
};

