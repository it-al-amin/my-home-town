import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface BreadcrumbItem {
  label: string;
  labelBn?: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  const { language } = useLanguage();

  return (
    <nav aria-label="Breadcrumb" className={`py-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 ${className}`}>
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-emerald-700 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const label = language === 'bn' && item.labelBn ? item.labelBn : item.label;

          return (
            <li key={index} className="inline-flex items-center gap-1.5 sm:gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {isLast || !item.href ? (
                <span className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-1" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-slate-500 dark:text-slate-400 hover:text-emerald-700 transition-colors line-clamp-1"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
