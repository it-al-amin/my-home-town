import React, { useState } from 'react';
import { Search, Compass, Filter, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PLACES_DATA } from '../data/places';
import { UPAZILAS_DATA } from '../data/upazilas';
import { PlaceCard } from '../components/cards/PlaceCard';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { PLACE_HISTORY } from '../data/placeHistory';

export const PlacesPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('all');

  const categories = [
    { id: 'all', label: language === 'bn' ? 'সকল ক্যাটেগরি' : 'All Categories' },
    { id: 'hills', label: language === 'bn' ? 'পাহাড় ও হ্রদ' : 'Hills & Lakes' },
    { id: 'rivers', label: language === 'bn' ? 'নদী ও বালুচর' : 'Rivers' },
    { id: 'haor', label: language === 'bn' ? 'হাওর ও জলরাশি' : 'Haor & Wetlands' },
    { id: 'historical', label: language === 'bn' ? 'ঐতিহাসিক ও মুক্তিযুদ্ধ' : 'Historical & War' },
    { id: 'religious', label: language === 'bn' ? 'ধর্মীয় ও আধ্যাত্মিক' : 'Religious' },
    { id: 'cultural', label: language === 'bn' ? 'সাংস্কৃতিক ও ঐতিহ্যবাহী' : 'Cultural' },
  ];

  const filteredPlaces = PLACES_DATA.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.nameBn.includes(searchTerm) ||
      place.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.locationBn.includes(searchTerm) ||
      place.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.descriptionBn.includes(searchTerm) ||
      PLACE_HISTORY[place.id]?.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      PLACE_HISTORY[place.id]?.bn.includes(searchTerm);

    const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
    const matchesUpazila = selectedUpazila === 'all' || place.upazilaId === selectedUpazila;

    return matchesSearch && matchesCategory && matchesUpazila;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Tourist Places', labelBn: 'দর্শনীয় স্থান', href: '/places' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            {language === 'bn' ? 'প্রকৃতি ও পর্যটন' : 'Nature & Tourism'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {language === 'bn' ? 'নেত্রকোণার দর্শনীয় পর্যটন স্থান' : 'Tourist Places in Netrokona'}
          </h1>
          <p className="text-sm sm:text-base text-blue-100">
            {language === 'bn'
              ? 'বিজয়পুরের সাদামাটি পাহাড়, সোমেশ্বরী নদীর স্ফটিক জল, শতবর্ষী ক্যাথলিক মিশন থেকে শুরু করে দিগন্তজোড়া ডিংগাপোতা হাওর।'
              : 'Discover white clay hills, turquoise lakes, crystalline rivers, historic forts, and serene water horizons.'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'bn' ? 'স্থানের নাম বা বিবরণ খুঁজুন...' : 'Search places by name...'}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-blue-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Upazila Dropdown */}
          <div>
            <select
              value={selectedUpazila}
              onChange={(e) => setSelectedUpazila(e.target.value)}
              className="w-full text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-blue-500"
            >
              <option value="all">{language === 'bn' ? 'সকল উপজেলা (১০টি)' : 'All Upazilas (10)'}</option>
              {UPAZILAS_DATA.map((u) => (
                <option key={u.id} value={u.id}>
                  {language === 'bn' ? u.nameBn : u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Category Chips for quick click */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'ক্যাটেগরি:' : 'Filter:'}</span>
          </span>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Places Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPlaces.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>

      {filteredPlaces.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
          <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {language === 'bn' ? 'কোনো দর্শনীয় স্থান পাওয়া যায়নি' : 'No Places Found'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'bn' ? 'ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।' : 'Try resetting your category or search filter.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedUpazila('all');
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            {language === 'bn' ? 'সকল ফিল্টার রিসেট করুন' : 'Reset All Filters'}
          </button>
        </div>
      )}
    </div>
  );
};
