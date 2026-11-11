import React, { useState } from 'react';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { UPAZILAS_DATA } from '../data/upazilas';
import { UpazilaCard } from '../components/cards/UpazilaCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { Breadcrumb } from '../components/common/Breadcrumb';

export const UpazilasPage: React.FC = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'area' | 'population'>('name');

  const filteredUpazilas = UPAZILAS_DATA.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.nameBn.includes(term) ||
      u.headquarters.toLowerCase().includes(term) ||
      u.headquartersBn.includes(term) ||
      u.highlights.some((h) => h.toLowerCase().includes(term)) ||
      u.highlightsBn.some((h) => h.includes(term))
    );
  }).sort((a, b) => {
    if (sortBy === 'area') return b.areaKm2 - a.areaKm2;
    if (sortBy === 'population') return b.population - a.population;
    return language === 'bn' ? a.nameBn.localeCompare(b.nameBn) : a.name.localeCompare(b.name);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Upazilas', labelBn: 'উপজেলাসমূহ', href: '/upazilas' },
        ]}
      />

      <div className="bg-gradient-to-br from-emerald-900 to-teal-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            {language === 'bn' ? 'প্রশাসনিক ইউনিট' : 'Administrative Units'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {language === 'bn' ? 'নেত্রকোণার ১০টি উপজেলা' : '10 Upazilas of Netrokona'}
          </h1>
          <p className="text-sm sm:text-base text-emerald-100">
            {language === 'bn'
              ? 'জেলার প্রতিটি উপজেলার ভৌগোলিক রূপরেখা, জনসংখ্যা, ইউনিয়ন, নদ-নদী এবং জরুরি যোগাযোগের সম্পূর্ণ তথ্য।'
              : 'Detailed demographic, geographical, and contact directory for every upazila in Netrokona District.'}
          </p>
        </div>
      </div>

      {/* Search & Sort Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'bn' ? 'উপজেলার নাম দিয়ে খুঁজুন...' : 'Search upazilas by name...'}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সাজান:' : 'Sort by:'}</span>
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
          >
            <option value="name">{language === 'bn' ? 'নাম অনুযায়ী' : 'By Name'}</option>
            <option value="population">{language === 'bn' ? 'সর্বোচ্চ জনসংখ্যা' : 'By Population'}</option>
            <option value="area">{language === 'bn' ? 'সর্বোচ্চ আয়তন' : 'By Area'}</option>
          </select>
        </div>
      </div>

      {/* Upazilas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUpazilas.map((upazila) => (
          <UpazilaCard key={upazila.id} upazila={upazila} />
        ))}
      </div>

      {filteredUpazilas.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {language === 'bn' ? 'কোনো উপজেলা পাওয়া যায়নি' : 'No Upazila Found'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'bn' ? 'বানান চেক করে আবার চেষ্টা করুন।' : 'Try checking spelling or reset search terms.'}
          </p>
        </div>
      )}
    </div>
  );
};
