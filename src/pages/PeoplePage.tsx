import React, { useState } from 'react';
import { User, Award, Search, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PEOPLE_DATA } from '../data/people';
import { PersonCard } from '../components/cards/PersonCard';
import { Breadcrumb } from '../components/common/Breadcrumb';

export const PeoplePage: React.FC = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: language === 'bn' ? 'সকল ব্যক্তিত্ব' : 'All Personalities' },
    { id: 'poet', label: language === 'bn' ? 'কবি ও সাহিত্যিক' : 'Poets & Writers' },
    { id: 'historic', label: language === 'bn' ? 'ঐতিহাসিক ও বিপ্লবী' : 'Historic & Revolutionaries' },
    { id: 'freedom_fighter', label: language === 'bn' ? 'বীর মুক্তিযোদ্ধা ও শহীদ' : 'Freedom Fighters' },
    { id: 'artist', label: language === 'bn' ? 'শিল্পী ও সঙ্গীতজ্ঞ' : 'Artists & Musicians' },
  ];

  const filteredPeople = PEOPLE_DATA.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(term) ||
      p.nameBn.includes(term) ||
      p.birthPlace.toLowerCase().includes(term) ||
      p.birthPlaceBn.includes(term) ||
      p.bio.toLowerCase().includes(term) ||
      p.bioBn.includes(term);

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Notable People', labelBn: 'গুণীজন ও স্মরণীয় ব্যক্তিত্ব', href: '/people' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-stone-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
            {language === 'bn' ? 'ইতিহাস ও মনীষা' : 'Eminent Personalities'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {language === 'bn' ? 'নেত্রকোণার গুণীজন ও স্মরণীয় ব্যক্তিত্ব' : 'Notable People of Netrokona'}
          </h1>
          <p className="text-sm sm:text-base text-slate-200">
            {language === 'bn'
              ? 'বাংলা সাহিত্যের অমর কবি নির্মলেন্দু গুণ ও হেলাল হাফিজ, বিপ্লবী কমরেড মণি সিংহ, হাজং মাতা রাশি মনি এবং বাউল সাধক জালাল উদ্দিন খাঁ।'
              : 'Honoring celebrated poets, peasant movement heroes, freedom fighters, and folk musical legends.'}
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'bn' ? 'ব্যক্তিত্বের নাম বা কীর্তি দিয়ে খুঁজুন...' : 'Search by name, contributions...'}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-500 transition-colors"
          />
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
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPeople.map((person) => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>
    </div>
  );
};
