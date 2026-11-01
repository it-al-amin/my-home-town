import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, MapPin, Users, Compass, Waves, Mountain, 
  Calendar, Layers, ShieldCheck, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DISTRICT_DATA } from '../data/district';
import { UPAZILAS_DATA } from '../data/upazilas';
import { SectionHeader } from '../components/common/SectionHeader';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { MapLink } from '../components/common/MapLink';

export const AboutPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumb
        items={[
          { label: 'About District', labelBn: 'জেলা পরিচিতি', href: '/about' },
        ]}
      />

      {/* Page Title */}
      <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            {language === 'bn' ? 'ময়মনসিংহ বিভাগ' : 'Mymensingh Division'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {language === 'bn' ? 'নেত্রকোণা জেলা পরিচিতি' : 'About Netrokona District'}
          </h1>
          <p className="text-base sm:text-lg text-emerald-100 leading-relaxed">
            {language === 'bn' ? DISTRICT_DATA.motto.bn : DISTRICT_DATA.motto.en}
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <MapLink
              coordinates={DISTRICT_DATA.coordinates}
              label={language === 'bn' ? 'গুগল ম্যাপে জেলা সদর দেখুন' : 'View District HQ on Google Maps'}
            />
            <Link
              to="/upazilas"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
            >
              {language === 'bn' ? '১০টি উপজেলা দেখুন' : 'Explore 10 Upazilas'}
            </Link>
          </div>
        </div>
      </div>

      {/* Geographic Boundaries & Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <SectionHeader
            badge={language === 'bn' ? 'ভৌগোলিক অবস্থান' : 'Geography & Landscape'}
            title={language === 'bn' ? 'প্রাকৃতিক রূপরেখা ও সীমানা' : 'Landscape & Boundaries'}
            subtitle={language === 'bn' ? 'পাহাড় ও হাওরের অপূর্ব সঙ্গমস্থল' : 'The confluence of Himalayan foothills and deep haor wetlands'}
          />

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 text-sm sm:text-base">
            <p>
              {language === 'bn'
                ? 'নেত্রকোণা জেলা বাংলাদেশের উত্তর-পূর্বাঞ্চলে অবস্থিত এক অনন্য ভৌগোলিক ভূখণ্ড। এর উত্তরে ভারতের মেঘালয় রাজ্যের মনোরম গারো পাহাড়, দক্ষিণে কিশোরগঞ্জ জেলা, পূর্বে সুনামগঞ্জ জেলার সুবিশাল হাওরাঞ্চল এবং পশ্চিমে ঐতিহ্যবাহী ময়মনসিংহ জেলা।'
                : 'Netrokona District is an extraordinary geographical region in north-eastern Bangladesh. It is bounded on the north by the scenic Garo Hills of Meghalaya state (India), on the south by Kishoreganj District, on the east by the vast wetland haors of Sunamganj District, and on the west by Mymensingh District.'}
            </p>
            <p>
              {language === 'bn'
                ? 'জেলার উত্তর প্রান্ত দুর্গাপুর ও কলমাকান্দা পাহাড়ি ঢাল ও সাদা চিনামাটির খনি দ্বারা গঠিত, যার কোল ঘেঁষে প্রবাহিত হয় স্ফটিকস্বচ্ছ সোমেশ্বরী ও কংস নদী। অন্যদিকে দক্ষিণ ও পূর্বাঞ্চল (খালিয়াজুরী, মোহনগঞ্জ, মদন) দেশের বৃহত্তম মিঠাপানির হাওর অববাহিকার অংশ, যা বর্ষাকালে সুবিশাল জলধিতে এবং শীতকালে দিগন্তবিস্তৃত সোনালী বোরো ধানক্ষেতে পরিণত হয়।'
                : 'The northern strip in Durgapur and Kalmakanda consists of undulating hillocks rich in porcelain-grade white clay deposits, framed by the crystalline mountain waters of the Someshwari River. In contrast, the southern and eastern parts (Khaliajuri, Mohanganj, Madan) belong to the immense freshwater haor wetland basin, which turns into an inland sea during the monsoon and a golden Boro rice basket during winter.'}
            </p>
          </div>

          {/* Border Details Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {DISTRICT_DATA.borderDistricts.map((b, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                <span>{language === 'bn' ? b.bn : b.en}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Facts Sidebar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{language === 'bn' ? 'প্রশাসনিক সারসংক্ষেপ' : 'Administrative Summary'}</span>
          </h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{language === 'bn' ? 'জেলা প্রতিষ্ঠা' : 'Established'}</span>
              <strong className="text-slate-800">{DISTRICT_DATA.established} (১৭ জানুয়ারি)</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{language === 'bn' ? 'মোট আয়তন' : 'Total Area'}</span>
              <strong className="text-slate-800">{DISTRICT_DATA.areaKm2} sq km</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{language === 'bn' ? 'জনসংখ্যা (২০২২)' : 'Population (2022)'}</span>
              <strong className="text-slate-800">{DISTRICT_DATA.population.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{language === 'bn' ? 'জনঘনত্ব' : 'Density'}</span>
              <strong className="text-slate-800">{DISTRICT_DATA.populationDensity} / sq km</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{language === 'bn' ? 'উপজেলা' : 'Upazilas'}</span>
              <strong className="text-slate-800">{DISTRICT_DATA.upazilasCount}টি</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{language === 'bn' ? 'ইউনিয়ন' : 'Unions'}</span>
              <strong className="text-slate-800">{DISTRICT_DATA.unionsCount}টি</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{language === 'bn' ? 'সংসদীয় আসন' : 'Parliament Seats'}</span>
              <strong className="text-slate-800">{DISTRICT_DATA.parliamentSeatsCount}টি (১৫৭ - ১৬১)</strong>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">{language === 'bn' ? 'পোস্ট কোড' : 'Postal Code'}</span>
              <strong className="text-slate-800">{DISTRICT_DATA.postalCode}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Administrative Hierarchy Flow */}
      <section className="bg-emerald-50/60 rounded-3xl p-8 border border-emerald-100">
        <SectionHeader
          badge={language === 'bn' ? 'প্রশাসনিক ধাপ' : 'Governance Structure'}
          title={language === 'bn' ? 'প্রশাসনিক বিন্যাস (জেলা থেকে গ্রাম)' : 'Administrative Hierarchy'}
          subtitle={language === 'bn' ? 'জেলা প্রশাসক কার্যালয় থেকে তৃণমূল গ্রাম পর্যন্ত প্রশাসনিক স্তর।' : 'From District Commissioner to grassroot union and village level.'}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-emerald-200/80">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold mx-auto mb-2 text-sm">
              ১
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">{language === 'bn' ? 'নেত্রকোণা জেলা' : 'District Level'}</h4>
            <p className="text-xs text-slate-500">{language === 'bn' ? 'জেলা প্রশাসক (ডিসি) ও জেলা পরিষদ' : 'DC Office & Zila Parishad'}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-xs border border-emerald-200/80">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold mx-auto mb-2 text-sm">
              ২
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">{language === 'bn' ? '১০টি উপজেলা' : '10 Upazilas'}</h4>
            <p className="text-xs text-slate-500">{language === 'bn' ? 'ইউএনও ও উপজেলা পরিষদ' : 'UNO & Upazila Parishad'}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-xs border border-emerald-200/80">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold mx-auto mb-2 text-sm">
              ৩
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">{language === 'bn' ? '৮৬টি ইউনিয়ন ও ৫ পৌরসভা' : '86 Unions & 5 Municipalities'}</h4>
            <p className="text-xs text-slate-500">{language === 'bn' ? 'ইউনিয়ন পরিষদ ও মেয়র' : 'Union Parishad & Pourashava'}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-xs border border-emerald-200/80">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold mx-auto mb-2 text-sm">
              ৪
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">{language === 'bn' ? '২,২৮৪টি গ্রাম' : '2,284 Villages'}</h4>
            <p className="text-xs text-slate-500">{language === 'bn' ? 'তৃণমূল জনপদ ও পাড়া' : 'Grassroot communities'}</p>
          </div>
        </div>
      </section>

      {/* Major Rivers & Waterbodies */}
      <section className="space-y-6">
        <SectionHeader
          badge={language === 'bn' ? 'নদীমাতৃক নেত্রকোণা' : 'Riverine Network'}
          title={language === 'bn' ? 'প্রধান নদ-নদী ও হাওরাঞ্চল' : 'Major Rivers & Haors'}
          subtitle={language === 'bn' ? 'সোমেশ্বরী, কংস, ধনু ও মগড়া নদীর জলধারা এবং ডিংগাপোতা হাওর।' : 'Lifeline rivers sustaining agriculture, transport, and fisheries.'}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2 text-emerald-700">
              <Waves className="w-4 h-4" />
              <span>{language === 'bn' ? 'সোমেশ্বরী নদী' : 'Someshwari River'}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'bn'
                ? 'ভারতের মেঘালয় থেকে দুর্গাপুরে প্রবেশ করা খরস্রোতা নদী। এর স্ফটিকস্বচ্ছ পানি, নুড়িপাথর এবং সুসং পাহাড়ের মনোরম দৃশ্য দেশের অন্যতম পর্যটন আকর্ষণ।'
                : 'Entering Bangladesh through Durgapur from Meghalaya, the crystal river is famous for sandbars, pebbles, and breathtaking mountain vistas.'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2 text-emerald-700">
              <Waves className="w-4 h-4" />
              <span>{language === 'bn' ? 'কংস ও মগড়া নদী' : 'Kangsha & Mogra Rivers'}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'bn'
                ? 'কংস নদী পূর্বধলা ও সদরের বুক চিরে প্রবাহিত। আর মগড়া নদী নেত্রকোণা জেলা শহরের মধ্য দিয়ে বয়ে গেছে, যা শহরের প্রাণ হিসেবে পরিচিত।'
                : 'The Kangsha meanders across Purbadhala and Sadar, while the Mogra gracefully flows through the heart of Netrokona urban town.'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2 text-emerald-700">
              <Waves className="w-4 h-4" />
              <span>{language === 'bn' ? 'ডিংগাপোতা ও হাওর অববাহিকা' : 'Dingapota Haor Basin'}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'bn'
                ? 'মোহনগঞ্জ ও খালিয়াজুরীর সুবিশাল হাওর। বর্ষাকালে অন্তহীন জলরাশির সাগর এবং শীতকালে দেশের অন্যতম শীর্ষ বোরো ধান ও মিষ্টিপানির মাছের ভাণ্ডার।'
                : 'Expansive wetland haor turning into an inland water sea during monsoons, and a vital national food and fish granary during dry winter.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
