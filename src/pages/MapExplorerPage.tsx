import React from 'react';
import { MapPin, Compass, Layers, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LeafletDistrictMap } from '../components/map/LeafletDistrictMap';
import { Breadcrumb } from '../components/common/Breadcrumb';

export const MapExplorerPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: 'Interactive Map', labelBn: 'জেলা মানচিত্র', href: '/map' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-teal-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
            {language === 'bn' ? 'ইন্টারেক্টিভ ওপেনস্ট্রিটম্যাপ' : 'Interactive OpenStreetMap'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {language === 'bn' ? 'নেত্রকোণা জেলা মানচিত্র অন্বেষণ' : 'Explore Netrokona on Map'}
          </h1>
          <p className="text-sm sm:text-base text-teal-100">
            {language === 'bn'
              ? '১০টি উপজেলা সদর, শীর্ষ পর্যটন স্থান এবং সরকারি হাসপাতালের ভৌগোলিক অবস্থান সরাসরি জুম করে দেখুন।'
              : 'Interactive GIS overview of upazila centers, nature spots, and medical hubs. Click markers for details and direct Google Maps directions.'}
          </p>
        </div>
      </div>

      {/* Map Element */}
      <div className="space-y-3">
        <LeafletDistrictMap height="650px" />
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
          <Info className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {language === 'bn'
              ? 'টিপস: যেকোনো মার্কারের ওপর ক্লিক করলে নাম ও গুগল ম্যাপে দিকনির্দেশনা দেখার বাটন আসবে। মানচিত্রটি মাউস স্ক্রল বা জুম বাটনের মাধ্যমে টেনে দেখা যায়।'
              : 'Tips: Click any marker to reveal detailed popup with direct directions. Use zoom buttons or pinch to navigate across upazilas.'}
          </span>
        </div>
      </div>
    </div>
  );
};
