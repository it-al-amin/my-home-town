import React, { useState } from 'react';
import { Building2, Search, ShieldCheck, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SERVICES_DATA } from '../data/services';
import { ServiceCard } from '../components/cards/ServiceCard';
import { Breadcrumb } from '../components/common/Breadcrumb';

export const ServicesPage: React.FC = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const departments = [
    { id: 'all', label: language === 'bn' ? 'সকল সরকারি সেবা' : 'All Services' },
    { id: 'land', label: language === 'bn' ? 'ভূমি ও নামজারি' : 'Land & Mutation' },
    { id: 'civil_registration', label: language === 'bn' ? 'জন্ম ও মৃত্যু নিবন্ধন' : 'Birth & Death' },
    { id: 'administration', label: language === 'bn' ? 'জাতীয় পরিচয়পত্র (এনআইডি)' : 'NID & Election' },
    { id: 'passport', label: language === 'bn' ? 'ই-পাসপোর্ট সেবা' : 'E-Passport' },
    { id: 'police', label: language === 'bn' ? 'পুলিশ ও অনলাইন জিডি' : 'Police & GD' },
    { id: 'agriculture', label: language === 'bn' ? 'কৃষি ও খাদ্য' : 'Agriculture' },
    { id: 'fisheries', label: language === 'bn' ? 'মৎস্য সম্পদ' : 'Fisheries' },
    { id: 'livestock', label: language === 'bn' ? 'প্রাণিসম্পদ' : 'Livestock' },
    { id: 'disaster', label: language === 'bn' ? 'বন্যা ও দুর্যোগ' : 'Disaster Management' },
  ];

  const filteredServices = SERVICES_DATA.filter((service) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      service.title.toLowerCase().includes(term) ||
      service.titleBn.includes(term) ||
      service.description.toLowerCase().includes(term) ||
      service.descriptionBn.includes(term);

    const matchesDept = selectedDept === 'all' || service.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Citizen Services', labelBn: 'নাগরিক সেবা', href: '/services' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-violet-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-400/30">
            {language === 'bn' ? 'ডিজিটাল বাংলাদেশ নাগরিক সেবা' : 'Citizen Charters & Portals'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {language === 'bn' ? 'নেত্রকোণা নাগরিক সেবা ও সরকারি পোর্টাল' : 'Citizen Services & Portals'}
          </h1>
          <p className="text-sm sm:text-base text-violet-100">
            {language === 'bn'
              ? 'ভূমি মিউটেশন, অনলাইন জন্ম ও মৃত্যু নিবন্ধন, জাতীয় পরিচয়পত্র, ই-পাসপোর্ট এবং অনলাইন পুলিশ জিডি সরাসরি সরকারি ওয়েবসাইট থেকে গ্রহণ করুন।'
              : 'Direct links and verified step-by-step procedures to official government citizen service portals.'}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'bn' ? 'সেবার নাম দিয়ে অনুসন্ধান করুন...' : 'Search services...'}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white focus:outline-hidden focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Department Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {departments.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedDept(d.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedDept === d.id
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};
