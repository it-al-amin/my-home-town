import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Users, Landmark, FileText, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const DistrictDashboardStrip: React.FC = () => {
  const { language } = useLanguage();

  const metrics = [
    {
      count: language === 'bn' ? '১০' : '10',
      label: language === 'bn' ? 'উপজেলা' : 'Upazilas',
      href: '/upazilas',
      icon: MapPin,
    },
    {
      count: language === 'bn' ? '৫' : '5',
      label: language === 'bn' ? 'পৌরসভা' : 'Municipalities',
      href: '/services',
      icon: Building2,
    },
    {
      count: language === 'bn' ? '৮৬' : '86',
      label: language === 'bn' ? 'ইউনিয়ন' : 'Unions',
      href: '/upazilas',
      icon: Landmark,
    },
    {
      count: language === 'bn' ? '২২৮৪' : '2,284',
      label: language === 'bn' ? 'গ্রাম' : 'Villages',
      href: '/about',
      icon: FileText,
    },
    {
      count: language === 'bn' ? '৫' : '5',
      label: language === 'bn' ? 'সংসদীয় আসন' : 'Parliamentary Seats',
      href: '/politics',
      icon: Users,
    },
    {
      count: language === 'bn' ? '২৩.২৫' : '2.32M',
      label: language === 'bn' ? 'লাখ জনসংখ্যা (BBS)' : 'Population (BBS)',
      href: '/about',
      icon: Users,
    },
  ];

  return (
    <div className="w-full bg-slate-100/90 dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700 py-3 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {metrics.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className="group bg-white dark:bg-slate-900 hover:bg-emerald-50/70 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 rounded-xl px-3 py-2.5 flex items-center justify-between transition-all duration-200 shadow-2xs hover:shadow-sm"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-300 tracking-tight group-hover:scale-105 transition-transform">
                  {item.count}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-emerald-900 transition-colors">
                  {item.label}
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

