import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Wheat, Fish, Coins, ArrowRight, Truck, Store, Layers } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const BusinessAgroShowcase: React.FC = () => {
  const { language } = useLanguage();

  const businessPillars = [
    {
      title: language === 'bn' ? 'শ্যামগঞ্জ প্রধান বাণিজ্যিক মোকাম' : 'Shyamganj Commercial Hub',
      subtitle: language === 'bn' ? 'পূর্বধলা উপজেলা' : 'Purbadhala Upazila',
      desc: language === 'bn' ? 'বৃহত্তর ময়মনসিংহ ও নেত্রকোণা অঞ্চলের অন্যতম প্রাচীন ও বৃহত্তম শস্য, ধান, পাট ও তেলবীজের বাণিজ্যিক মোকাম।' : 'Century-old major grain, jute, and mustard trading wholesale hub with railway connectivity.',
      icon: Store,
      color: 'from-amber-600 to-orange-700',
      link: '/transport#markets',
    },
    {
      title: language === 'bn' ? 'মোহনগঞ্জ মাছের পাইকারি আড়ৎ' : 'Mohanganj Haor Fish Market',
      subtitle: language === 'bn' ? 'মোহনগঞ্জ ও হাওর অববাহিকা' : 'Mohanganj & Haor Basin',
      desc: language === 'bn' ? 'প্রাকৃতিক হাওরের তাজা বোয়াল, রুই, চিতল, পাবদা ও মহাশোল মাছের অন্যতম বড় পাইকারি বাজার যা প্রতিদিন ঢাকায় সরবরাহ হয়।' : 'Major fresh wild fish auction market supplying capital Dhaka and regional cities daily.',
      icon: Fish,
      color: 'from-cyan-600 to-blue-700',
      link: '/fisheries',
    },
    {
      title: language === 'bn' ? 'বোরো ধানের সোনালী শস্যভাণ্ডার' : 'Boro Rice Granary',
      subtitle: language === 'bn' ? 'খালিয়াজুরী, মদন ও হাওরাঞ্চল' : 'Khaliajuri & Madan Haors',
      desc: language === 'bn' ? 'শীতকালে দিগন্তবিস্তৃত হাওর শুকিয়ে পরিণত হয় দেশের শীর্ষ ধান উৎপাদন অঞ্চলে। প্রতি বছর লাখ লাখ টন খাদ্যশস্য জাতীয় অর্থনীতিতে যোগ হয়।' : 'Top Boro paddy producing wetland basin feeding the nation with bumper winter rice harvests.',
      icon: Wheat,
      color: 'from-emerald-600 to-teal-700',
      link: '/agriculture',
    },
    {
      title: language === 'bn' ? 'হাওরের হাঁস পালন ও ডিম বাণিজ্য' : 'Haor Duck Farming & Eggs',
      subtitle: language === 'bn' ? 'খালিয়াজুরী ও মোহনগঞ্জ' : 'Khaliajuri & Mohanganj',
      desc: language === 'bn' ? 'হাওরের প্রাকৃতিক শামুক ও জলজ খাদ্য খেয়ে লাখ লাখ দেশি হাঁস পালন হয়, যা স্থানীয় গ্রামীণ অর্থনীতির অন্যতম চালিকাশক্তি।' : 'Extensive commercial duck farms feeding on natural wetlands snails, supplying millions of eggs.',
      icon: Coins,
      color: 'from-purple-600 to-indigo-700',
      link: '/livestock',
    },
  ];

  return (
    <section className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 space-y-8 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-md border border-emerald-300 dark:border-emerald-800">
            {language === 'bn' ? 'অর্থনীতি, ব্যবসা ও কৃষি' : 'Commerce & Agriculture'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
            {language === 'bn' ? 'বাণিজ্যিক মোকাম, কৃষি ও হাওর অর্থনীতি' : 'Commercial Hubs, Agriculture & Haor Economy'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {language === 'bn'
              ? 'শ্যামগঞ্জের ঐতিহ্যবাহী শস্য বাণিজ্য থেকে শুরু করে মোহনগঞ্জের তাজা মাছের মোকাম এবং বোরো ধানের শস্যভাণ্ডার।'
              : 'From historic grain mokams at Shyamganj to massive freshwater fish trade and Boro rice harvests.'}
          </p>
        </div>

        <Link
          to="/agriculture"
          className="inline-flex items-center gap-1.5 font-bold text-sm text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 shrink-0"
        >
          <span>{language === 'bn' ? 'কৃষি ও মৎস্য তথ্য দেখুন' : 'Explore Agro & Markets'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid of Business Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {businessPillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <Link
              key={idx}
              to={pillar.link}
              className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block">
                    {pillar.subtitle}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mt-0.5 line-clamp-1">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 mt-4 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

