import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Wheat, HeartPulse, GraduationCap, CloudRain, 
  Landmark, Bus, ShieldCheck, Banknote, ChevronRight, ExternalLink 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ServiceSectorsGrid: React.FC = () => {
  const { language } = useLanguage();

  const sectors = [
    {
      id: 'agriculture',
      title: language === 'bn' ? 'কৃষি' : 'Agriculture',
      icon: Wheat,
      color: 'text-emerald-700 dark:text-emerald-300',
      items: [
        { label: language === 'bn' ? 'নেত্রকোণার কৃষি রূপরেখা' : 'Agricultural Overview', href: '/agriculture' },
        { label: language === 'bn' ? 'বোরো ধান ও ফসল তথ্য' : 'Boro Rice & Crop Production', href: '/agriculture' },
        { label: language === 'bn' ? 'কৃষি বিপণন ও সার বিতরণ' : 'Agri-Marketing & Fertilizers', href: '/agriculture' },
        { label: language === 'bn' ? 'কৃষি তথ্য বাতায়ন (ais.gov.bd)' : 'AIS Agri-Portal', href: 'https://ais.gov.bd', external: true },
      ],
    },
    {
      id: 'health',
      title: language === 'bn' ? 'স্বাস্থ্য ও পরিবার কল্যাণ' : 'Health & Welfare',
      icon: HeartPulse,
      color: 'text-rose-700 dark:text-rose-300',
      items: [
        { label: language === 'bn' ? '২৫০ শয্যা সদর হাসপাতাল' : '250-bed Sadar Hospital', href: '/health' },
        { label: language === 'bn' ? 'সকল উপজেলা স্বাস্থ্য কমপ্লেক্স' : 'Upazila Health Complexes', href: '/health' },
        { label: language === 'bn' ? 'জরুরি অ্যাম্বুলেন্স ও ব্লাড ব্যাংক' : 'Ambulance & Blood Bank', href: '/health' },
        { label: language === 'bn' ? 'স্বাস্থ্য বাতায়ন (১৬২৬৩)' : 'Health Helpline (16263)', href: 'https://dghs.gov.bd', external: true },
      ],
    },
    {
      id: 'education',
      title: language === 'bn' ? 'শিক্ষা ও প্রতিষ্ঠান' : 'Education & Institutions',
      icon: GraduationCap,
      color: 'text-blue-700 dark:text-blue-300',
      items: [
        { label: language === 'bn' ? 'বিশ্ববিদ্যালয় ও মেডিকেল কলেজ' : 'University & Medical College', href: '/education' },
        { label: language === 'bn' ? 'ঐতিহ্যবাহী সরকারি কলেজ ও স্কুল' : 'Government Colleges & Schools', href: '/education' },
        { label: language === 'bn' ? 'কারিগরি ও পলিটেকনিক ইনস্টিটিউট' : 'Polytechnic Institutes', href: '/education' },
        { label: language === 'bn' ? 'বোর্ড পরীক্ষার ফলাফল (educationboard)' : 'Education Board Results', href: 'http://www.educationboardresults.gov.bd', external: true },
      ],
    },
    {
      id: 'land',
      title: language === 'bn' ? 'ভূমি ও রাজস্ব সেবা' : 'Land & Revenue Services',
      icon: Landmark,
      color: 'text-amber-700 dark:text-amber-300',
      items: [
        { label: language === 'bn' ? 'অনলাইন ই-নামজারি আবেদন' : 'Online E-Mutation', href: 'https://mutation.land.gov.bd', external: true },
        { label: language === 'bn' ? 'ডিজিটাল খতিয়ান ও পর্চা সংগ্রহ' : 'Digital Khatian / Porcha', href: 'https://eporcha.gov.bd', external: true },
        { label: language === 'bn' ? 'ভূমি উন্নয়ন কর প্রদান (ldtax)' : 'Land Development Tax', href: 'https://ldtax.gov.bd', external: true },
        { label: language === 'bn' ? 'ভূমি সেবা নির্দেশিকা ও সিটিজেন চার্টার' : 'Land Citizen Charter', href: '/services' },
      ],
    },
    {
      id: 'disaster',
      title: language === 'bn' ? 'দুর্যোগ ব্যবস্থাপনা ও আবহাওয়া' : 'Disaster & Meteorology',
      icon: CloudRain,
      color: 'text-cyan-700 dark:text-cyan-300',
      items: [
        { label: language === 'bn' ? 'নেত্রকোণা ও হাওর আবহাওয়া পূর্বাভাস' : 'Weather & Haor Forecast', href: 'http://live4.bmd.gov.bd', external: true },
        { label: language === 'bn' ? 'বন্যা পূর্বাভাস ও সতর্কীকরণ কেন্দ্র' : 'Flood Warning Bulletin', href: 'http://ffwc.gov.bd', external: true },
        { label: language === 'bn' ? 'প্রাকৃতিক দুর্যোগে জরুরি টেলিফোন' : 'Emergency Hotlines for Disasters', href: '/emergency' },
        { label: language === 'bn' ? 'দুর্যোগ ব্যবস্থাপনা অধিদপ্তর' : 'Disaster Management Portal', href: 'http://www.ddm.gov.bd', external: true },
      ],
    },
    {
      id: 'transport',
      title: language === 'bn' ? 'যোগাযোগ ও যাতায়াত' : 'Transport & Logistics',
      icon: Bus,
      color: 'text-purple-700 dark:text-purple-300',
      items: [
        { label: language === 'bn' ? 'হাওর ও মোহনগঞ্জ আন্তঃনগর ট্রেন' : 'Mohanganj Express Trains', href: '/transport' },
        { label: language === 'bn' ? 'বাংলাদেশ রেলওয়ে ই-টিকিট' : 'Bangladesh Railway E-Ticket', href: 'https://eticket.railway.gov.bd', external: true },
        { label: language === 'bn' ? 'বিআরটিএ ড্রাইভিং লাইসেন্স (bsp)' : 'BRTA Driving License', href: 'https://bsp.brta.gov.bd', external: true },
        { label: language === 'bn' ? 'নেত্রকোণা বাস রুট ও ঐতিহ্যবাহী বাজার' : 'Bus Routes & Traditional Bazars', href: '/transport' },
      ],
    },
    {
      id: 'administration',
      title: language === 'bn' ? 'প্রশাসন ও নিরাপত্তা' : 'Administration & Security',
      icon: ShieldCheck,
      color: 'text-slate-800 dark:text-slate-100',
      items: [
        { label: language === 'bn' ? 'জেলা প্রশাসকের কার্যালয় ও বার্তা' : 'DC Office & Message', href: '/about' },
        { label: language === 'bn' ? 'জেলা পুলিশ ও থানা কন্ট্রোল রুম' : 'District Police & Thanas', href: '/emergency' },
        { label: language === 'bn' ? 'জাতীয় জরুরি হেল্পলাইন (৯৯৯)' : 'National Emergency 999', href: '/emergency' },
        { label: language === 'bn' ? 'পাসপোর্ট অনলাইন আবেদন (epassport)' : 'E-Passport Application', href: 'https://epassport.gov.bd', external: true },
      ],
    },
    {
      id: 'social',
      title: language === 'bn' ? 'সামাজিক নিরাপত্তা ও পেনশন' : 'Social Security & Grants',
      icon: Banknote,
      color: 'text-teal-700 dark:text-teal-300',
      items: [
        { label: language === 'bn' ? 'সর্বজনীন পেনশন স্কিম (upension)' : 'Universal Pension Scheme', href: 'https://upension.gov.bd', external: true },
        { label: language === 'bn' ? 'ডিজিটাল জন্ম ও মৃত্যু নিবন্ধন (BDRIS)' : 'BDRIS Digital Birth Registry', href: 'https://bdris.gov.bd', external: true },
        { label: language === 'bn' ? 'জাতীয় পরিচয়পত্র এনআইডি পোর্টাল' : 'NID Wing Portal', href: 'https://nidw.gov.bd', external: true },
        { label: language === 'bn' ? 'সমাজসেবা অধিদপ্তর ভাতা পোর্টাল' : 'Social Welfare Allowances', href: 'http://dss.gov.bd', external: true },
      ],
    },
  ];

  return (
    <section className="space-y-6">
      {/* Official Section Header matching bangladesh.gov.bd */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
            {language === 'bn' ? 'জাতীয় তথ্য বাতায়ন ডিরেক্টরি' : 'National Portal Directory'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1.5">
            {language === 'bn' ? 'প্রয়োজনীয় তথ্য ও সেবাখাত' : 'Essential Info & Service Sectors'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'bn'
              ? 'বাংলাদেশ সরকারের কেন্দ্রীয় পোর্টাল ও জেলা পর্যায়ের সকল সেবা এক নজরে।'
              : 'Direct access to official departmental gateways, citizen charters, and registries.'}
          </p>
        </div>

        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 font-bold text-sm text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 shrink-0"
        >
          <span>{language === 'bn' ? 'সকল সেবা চার্টার দেখুন' : 'View Citizen Charter'}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid of Service Sector Cards styled like bangladesh.gov.bd */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {sectors.map((sector) => {
          const Icon = sector.icon;
          return (
            <div
              key={sector.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              {/* Header Bar with subtle slate background */}
              <div className="bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${sector.color}`} />
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {sector.title}
                  </h3>
                </div>
              </div>

              {/* Items List */}
              <div className="p-3 divide-y divide-slate-100 dark:divide-slate-800 flex-1">
                {sector.items.map((item, idx) => (
                  item.external ? (
                    <a
                      key={idx}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-emerald-700 transition-colors"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform line-clamp-1">
                        • {item.label}
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 shrink-0 ml-1.5" />
                    </a>
                  ) : (
                    <Link
                      key={idx}
                      to={item.href}
                      className="group flex items-center justify-between py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-emerald-700 transition-colors"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform line-clamp-1">
                        • {item.label}
                      </span>
                      <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 shrink-0 ml-1.5" />
                    </Link>
                  )
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

