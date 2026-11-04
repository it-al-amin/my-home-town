import React, { useState } from 'react';
import { Search, School, ExternalLink, Database } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { EDUCATION_DATA } from '../data/education';
import { UPAZILAS_DATA } from '../data/upazilas';
import { InstitutionCard } from '../components/cards/InstitutionCard';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { EDUCATION_REGISTRIES, EDUCATION_UPAZILA_COVERAGE } from '../data/educationRegistries';

export const EducationPage: React.FC = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const categories = [
    { id: 'all', label: language === 'bn' ? 'সকল প্রতিষ্ঠান' : 'All Categories' },
    { id: 'university', label: language === 'bn' ? 'বিশ্ববিদ্যালয়' : 'Universities' },
    { id: 'college', label: language === 'bn' ? 'কলেজ ও মেডিকেল' : 'Colleges & Medical' },
    { id: 'school', label: language === 'bn' ? 'উচ্চ বিদ্যালয়' : 'High Schools' },
    { id: 'primary', label: language === 'bn' ? 'প্রাথমিক বিদ্যালয়' : 'Primary Schools' },
    { id: 'technical', label: language === 'bn' ? 'কারিগরী ও পলিটেকনিক' : 'Technical & Polytechnic' },
  ];

  const filteredInstitutions = EDUCATION_DATA.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(term) ||
      item.nameBn.includes(term) ||
      item.location.toLowerCase().includes(term) ||
      item.locationBn.includes(term) ||
      (item.eiin && item.eiin.includes(term));

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesUpazila = selectedUpazila === 'all' || item.upazilaId === selectedUpazila;
    const matchesType = selectedType === 'all' || item.type === selectedType;

    return matchesSearch && matchesCategory && matchesUpazila && matchesType;
  });

  const upazilaCounts = EDUCATION_UPAZILA_COVERAGE.map((upazila) => ({
    ...upazila,
    count: EDUCATION_DATA.filter((institution) => institution.upazilaId === upazila.id).length,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Education', labelBn: 'শিক্ষা প্রতিষ্ঠান', href: '/education' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
            {language === 'bn' ? 'শিক্ষা ও মানবসম্পদ' : 'Education Directory'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {language === 'bn' ? 'নেত্রকোণার শিক্ষা প্রতিষ্ঠানসমূহ' : 'Educational Institutions in Netrokona'}
          </h1>
          <p className="text-sm sm:text-base text-amber-100">
            {language === 'bn'
              ? 'শেখ হাসিনা বিশ্ববিদ্যালয়, মেডিকেল কলেজ, শতবর্ষী আঞ্জুমান সরকারি উচ্চ বিদ্যালয় এবং ঐতিহ্যবাহী সরকারি কলেজসমূহ।'
              : 'Public university, medical college, technical polytechnics, and centennial secondary schools.'}
          </p>
        </div>
      </div>

      {/* Official registry links */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {language === 'bn' ? 'সরকারি রেজিস্ট্রি ও পূর্ণ তালিকা' : 'Official registries and complete lists'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {language === 'bn'
                ? 'নিচের সরকারি পোর্টালগুলোতে উপজেলা নির্বাচন করে সর্বশেষ প্রতিষ্ঠান তালিকা যাচাই করুন।'
                : 'Use the official portals below to verify the latest institution list by upazila.'}
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Database className="w-4 h-4" />
            {language === 'bn' ? '১০ উপজেলা কভারেজ' : '10 upazilas covered'}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EDUCATION_REGISTRIES.map((registry) => (
            <a
              key={registry.id}
              href={registry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl border border-slate-200 p-4 hover:border-emerald-400 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
                  {registry.authority[language]}
                </span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900 mt-3">{registry.label[language]}</h3>
              <p className="text-xs leading-relaxed text-slate-500 mt-1">{registry.description[language]}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="font-extrabold text-slate-900">
            {language === 'bn' ? 'উপজেলা-ভিত্তিক ক্যাটালগ কভারেজ' : 'Upazila-wise catalogue coverage'}
          </h2>
          <span className="text-[11px] text-slate-500">
            {language === 'bn' ? 'ক্যাটালগে যাচাইকৃত রেকর্ড' : 'Verified catalogue records'}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {upazilaCounts.map((upazila) => (
            <button
              key={upazila.id}
              type="button"
              onClick={() => setSelectedUpazila(upazila.id)}
              className={`text-left rounded-xl border px-3 py-2 transition-colors ${
                selectedUpazila === upazila.id
                  ? 'bg-amber-50 border-amber-400'
                  : 'bg-white border-slate-200 hover:border-amber-300'
              }`}
            >
              <span className="block text-xs font-semibold text-slate-700 truncate">
                {language === 'bn' ? upazila.nameBn : upazila.name}
              </span>
              <span className="block text-[11px] text-slate-500 mt-1">
                {upazila.count} {language === 'bn' ? 'টি রেকর্ড' : upazila.count === 1 ? 'record' : 'records'}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'bn' ? 'প্রতিষ্ঠানের নাম বা EIIN দিয়ে খুঁজুন...' : 'Search by name or EIIN...'}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>
              {language === 'bn'
                ? `এই পেজে যাচাইকৃতভাবে তালিকাভুক্ত ${filteredInstitutions.length}টি প্রতিষ্ঠান`
                : `${filteredInstitutions.length} verified institutions listed on this page`}
            </span>
            <span className="text-xs">
              {language === 'bn' ? 'পূর্ণ সরকারি রেজিস্ট্রির লিঙ্ক উপরে দেওয়া আছে' : 'Complete government registries are linked above'}
            </span>
          </div>

          {/* Upazila */}
          <div>
            <select
              value={selectedUpazila}
              onChange={(e) => setSelectedUpazila(e.target.value)}
              className="w-full text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden focus:border-amber-500"
            >
              <option value="all">{language === 'bn' ? 'সকল উপজেলা' : 'All Upazilas'}</option>
              {UPAZILAS_DATA.map((u) => (
                <option key={u.id} value={u.id}>
                  {language === 'bn' ? u.nameBn : u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type (Govt / Non-Govt) */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden focus:border-amber-500"
            >
              <option value="all">{language === 'bn' ? 'সকল ধরন (সরকারি/বেসরকারি)' : 'All Types'}</option>
              <option value="government">{language === 'bn' ? 'সরকারি প্রতিষ্ঠান' : 'Government'}</option>
              <option value="non-government">{language === 'bn' ? 'বেসরকারি/এমপিওভুক্ত' : 'Non-Government'}</option>
            </select>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100 text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstitutions.map((inst) => (
          <InstitutionCard key={inst.id} institution={inst} />
        ))}
      </div>

      {filteredInstitutions.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <School className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">
            {language === 'bn' ? 'কোনো শিক্ষা প্রতিষ্ঠান পাওয়া যায়নি' : 'No Institution Found'}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {language === 'bn' ? 'অনুসন্ধান বা ফিল্টার রিসেট করে আবার চেষ্টা করুন।' : 'Try resetting your search filters.'}
          </p>
        </div>
      )}
    </div>
  );
};
