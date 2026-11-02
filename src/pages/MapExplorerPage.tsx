import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Compass, Layers, Info, ExternalLink, ArrowRight, 
  BarChart3, Globe, Sparkles, Download, CheckCircle2 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DistrictVectorMap } from '../components/map/DistrictVectorMap';
import { LeafletDistrictMap } from '../components/map/LeafletDistrictMap';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { UPAZILAS_DATA } from '../data/upazilas';
import { UNIONS_DATA } from '../data/unions';
import { DISTRICT_DATA } from '../data/district';
import type { Upazila } from '../types';

export const MapExplorerPage: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'vector' | 'gis' | 'stats'>('vector');
  const [selectedUpazila, setSelectedUpazila] = useState<Upazila | null>(
    UPAZILAS_DATA.find((u) => u.id === 'netrokona-sadar') || UPAZILAS_DATA[0]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'District Map System', labelBn: 'জেলা মানচিত্র সিস্টেম', href: '/map' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#0c3b2e] via-[#10302b] to-[#0f2438] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-emerald-900/50">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'bn' ? 'আধুনিক জেলা মানচিত্র ব্যবস্থা' : 'Interactive Geographic System'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {language === 'bn' ? 'নেত্রকোণা জেলা মানচিত্র অন্বেষণ' : 'Explore Netrokona District Map'}
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
            {language === 'bn'
              ? '১০টি উপজেলার প্রশাসনিক সীমানা, নদী-নালা, পর্যটন স্পট এবং জরুরি হাসপাতালের অবস্থান ইন্টারেক্টিভ ভেক্টর ও স্যাটেলাইট মানচিত্রে ঘুরে দেখুন।'
              : 'Interactive vector choropleth and OpenStreetMap GIS. Navigate upazila boundaries, tourist destinations, and emergency hospitals.'}
          </p>
        </div>
      </div>

      {/* Map Mode Selector Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('vector')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'vector'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>{language === 'bn' ? 'ইন্টারেক্টিভ ভেক্টর মানচিত্র' : 'Vector District Map'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gis')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'gis'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4 text-blue-600" />
            <span>{language === 'bn' ? 'স্যাটেলাইট ও জিআইএস ম্যাপ' : 'Satellite & GIS Map'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <span>{language === 'bn' ? 'পরিসংখ্যান তুলনা' : 'Demographic Matrix'}</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          {language === 'bn' ? '১০টি উপজেলা • ৮৬টি ইউনিয়ন • ৫টি সংসদীয় আসন' : '10 Upazilas • 86 Unions • 5 Seats'}
        </div>
      </div>

      {/* Tab 1: Interactive Vector Map (Modeled after amar-gaibandha.vercel.app) */}
      {activeTab === 'vector' && (
        <div className="space-y-6">
          <div className="bg-[#121622] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Interactive Vector Map with 10 Upazilas */}
              <div className="lg:col-span-8 flex flex-col items-center">
                <DistrictVectorMap
                  selectedUpazilaId={selectedUpazila?.id}
                  onSelectUpazila={(u) => setSelectedUpazila(u)}
                  showInfoCard={false}
                  showLabels={true}
                  theme="dark"
                  className="w-full"
                />
              </div>

              {/* Right Column: Dynamic Upazila Details Panel */}
              <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 text-white space-y-4 backdrop-blur-md shadow-xl sticky top-28">
                {selectedUpazila ? (
                  <>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
                          {language === 'bn' ? 'উপজেলা প্রোফাইল' : 'Upazila Profile'}
                        </span>
                        <h2 className="text-2xl font-black text-white mt-0.5">
                          {language === 'bn' ? selectedUpazila.nameBn : selectedUpazila.name}
                        </h2>
                      </div>
                      <Link
                        to={`/upazilas/${selectedUpazila.slug}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <span>{language === 'bn' ? 'সম্পূর্ণ তথ্য' : 'Details'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {language === 'bn' ? selectedUpazila.descriptionBn : selectedUpazila.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-800">
                      <div className="bg-slate-800/80 p-2.5 rounded-xl">
                        <div className="text-[11px] text-slate-400">{language === 'bn' ? 'সদর দপ্তর' : 'Headquarters'}</div>
                        <div className="text-xs font-bold text-slate-200 mt-0.5 truncate">
                          {language === 'bn' ? selectedUpazila.headquartersBn : selectedUpazila.headquarters}
                        </div>
                      </div>
                      <div className="bg-slate-800/80 p-2.5 rounded-xl">
                        <div className="text-[11px] text-slate-400">{language === 'bn' ? 'মোট জনসংখ্যা' : 'Population'}</div>
                        <div className="text-xs font-bold text-slate-200 mt-0.5">
                          {language === 'bn' ? `${selectedUpazila.population.toLocaleString('bn-BD')} জন` : selectedUpazila.population.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-slate-800/80 p-2.5 rounded-xl">
                        <div className="text-[11px] text-slate-400">{language === 'bn' ? 'মোট আয়তন' : 'Area'}</div>
                        <div className="text-xs font-bold text-slate-200 mt-0.5">
                          {language === 'bn' ? `${selectedUpazila.areaKm2} বর্গ কিমি` : `${selectedUpazila.areaKm2} sq km`}
                        </div>
                      </div>
                      <div className="bg-slate-800/80 p-2.5 rounded-xl">
                        <div className="text-[11px] text-slate-400">{language === 'bn' ? 'ইউনিয়ন সংখ্যা' : 'Unions'}</div>
                        <div className="text-xs font-bold text-slate-200 mt-0.5">
                          {language === 'bn' ? `${selectedUpazila.unionsCount}টি ইউনিয়ন` : `${selectedUpazila.unionsCount} Unions`}
                        </div>
                      </div>
                    </div>

                    {/* Rivers & Haors */}
                    {selectedUpazila.rivers && selectedUpazila.rivers.length > 0 && (
                      <div className="pt-2 text-xs text-slate-400">
                        <strong className="text-slate-300">{language === 'bn' ? 'প্রধান নদ-নদী:' : 'Rivers:'} </strong>
                        {(language === 'bn' ? selectedUpazila.riversBn : selectedUpazila.rivers).join(', ')}
                      </div>
                    )}

                    {/* Quick Highlights */}
                    <div className="space-y-1.5 pt-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {language === 'bn' ? 'প্রধান বৈশিষ্ট্য ও আকর্ষণ' : 'Highlights'}
                      </div>
                      <div className="space-y-1">
                        {(language === 'bn' ? selectedUpazila.highlightsBn : selectedUpazila.highlights).slice(0, 3).map((hl, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* All Mapped Unions for this Upazila */}
                    <div className="pt-2 border-t border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <strong className="text-slate-300">
                          {language === 'bn' ? `ইউনিয়নসমূহ (${selectedUpazila.unionsCount}টি)` : `Unions (${selectedUpazila.unionsCount})`}
                        </strong>
                        <span className="text-[10px] text-teal-400 font-mono">GPS Coordinates</span>
                      </div>
                      <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto pr-1">
                        {(UNIONS_DATA[selectedUpazila.id] || []).map((u) => (
                          <a
                            key={u.id}
                            href={`https://www.google.com/maps/search/?api=1&query=${u.coordinates.lat},${u.coordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                            title={`Lat: ${u.coordinates.lat}, Lng: ${u.coordinates.lng}`}
                          >
                            • {language === 'bn' ? u.nameBn : u.name}
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Direct Links */}
                    <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${selectedUpazila.coordinates.lat},${selectedUpazila.coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 rounded-xl text-center text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <Compass className="w-3.5 h-3.5 text-teal-400" />
                        <span>Google Maps ↗</span>
                      </a>
                      <Link
                        to={`/upazilas/${selectedUpazila.slug}`}
                        className="flex-1 py-2 rounded-xl text-center text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white transition-colors"
                      >
                        {language === 'bn' ? 'উপজেলা পেজ' : 'Upazila Page'}
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-sm">
                    {language === 'bn' ? 'মানচিত্রের যেকোনো উপজেলায় ক্লিক করুন' : 'Click any upazila on the vector map'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Explanation of Borders */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <strong className="text-emerald-900 block font-bold mb-1">↑ উত্তর সীমানা (North)</strong>
              <p className="text-emerald-800">ভারতের মেঘালয় রাজ্যের গারো পাহাড় (দুর্গাপুর ও কলমাকান্দা সংলগ্ন)</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <strong className="text-blue-900 block font-bold mb-1">→ পূর্ব সীমানা (East)</strong>
              <p className="text-blue-800">সুনামগঞ্জ জেলা (বিশাল হাওরাঞ্চল, বাউলাই ও সুরমা অববাহিকা)</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <strong className="text-amber-900 block font-bold mb-1">↓ দক্ষিণ সীমানা (South)</strong>
              <p className="text-amber-800">কিশোরগঞ্জ জেলা (তাড়াইল, ইটনা ও হাওরবেষ্টিত নিম্নভূমি)</p>
            </div>
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-100">
              <strong className="text-teal-900 block font-bold mb-1">← পশ্চিম সীমানা (West)</strong>
              <p className="text-teal-800">ময়মনসিংহ জেলা (ধোবাউড়া, গৌরীপুর ও ঈশ্বরগঞ্জ উপজেলা)</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Leaflet OpenStreetMap GIS */}
      {activeTab === 'gis' && (
        <div className="space-y-4">
          <LeafletDistrictMap height="680px" />
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3.5 rounded-xl border border-slate-200">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {language === 'bn'
                ? 'টিপস: উপরের ফিল্টার বাটন দিয়ে শুধুমাত্র উপজেলা, পর্যটন স্থান বা হাসপাতাল নির্বাচন করতে পারেন। মার্কারের উপর ক্লিক করলে গুগল ম্যাপে দিকনির্দেশনা আসবে।'
                : 'Tips: Toggle map layers to filter between upazila centers, tourist highlights, and emergency hospitals. Click markers for direct routes.'}
            </span>
          </div>
        </div>
      )}

      {/* Tab 3: Comparative Upazila Demographic Matrix (BBS 2022 Census) */}
      {activeTab === 'stats' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {language === 'bn' ? '১০টি উপজেলার পরিসংখ্যান ও প্রশাসনিক তুলনা' : 'All 10 Upazilas Demographic Comparison'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn' ? 'বাংলাদেশ পরিসংখ্যান ব্যুরো (BBS) ২০২২ জনশুমারি অনুযায়ী।' : 'Source: Bangladesh Bureau of Statistics (BBS) 2022 Census & District Administration.'}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700 divide-y divide-slate-200">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">{language === 'bn' ? 'উপজেলার নাম' : 'Upazila'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'সদর দপ্তর' : 'HQ'}</th>
                  <th className="py-3 px-4 text-right">{language === 'bn' ? 'আয়তন (বর্গ কিমি)' : 'Area (km²)'}</th>
                  <th className="py-3 px-4 text-right">{language === 'bn' ? 'জনসংখ্যা (BBS)' : 'Population'}</th>
                  <th className="py-3 px-4 text-center">{language === 'bn' ? 'ইউনিয়ন' : 'Unions'}</th>
                  <th className="py-3 px-4 text-center">{language === 'bn' ? 'গ্রাম সংখ্যা' : 'Villages'}</th>
                  <th className="py-3 px-4 text-center">{language === 'bn' ? 'অ্যাকশন' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {UPAZILAS_DATA.map((upazila) => (
                  <tr key={upazila.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <Link to={`/upazilas/${upazila.slug}`} className="hover:text-emerald-700 transition-colors">
                        {language === 'bn' ? upazila.nameBn : upazila.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {language === 'bn' ? upazila.headquartersBn : upazila.headquarters}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium">
                      {upazila.areaKm2}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {language === 'bn' ? upazila.population.toLocaleString('bn-BD') : upazila.population.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold">
                        {upazila.unionsCount}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      {upazila.villagesCount}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        to={`/upazilas/${upazila.slug}`}
                        className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                      >
                        {language === 'bn' ? 'বিস্তারিত' : 'View'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
