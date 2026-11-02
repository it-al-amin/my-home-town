import React from 'react';
import { Link } from 'react-router-dom';
import { School, GraduationCap, Award, BookOpen, ArrowRight, Building, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { EDUCATION_DATA } from '../../data/education';

export const EducationShowcase: React.FC = () => {
  const { language } = useLanguage();

  const featuredInstitutions = EDUCATION_DATA.slice(0, 4);

  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xs space-y-8 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-md border border-blue-200 dark:border-blue-800">
            {language === 'bn' ? 'শিক্ষা ও জ্ঞান চর্চা' : 'Education & Schooling'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
            {language === 'bn' ? 'নেত্রকোণার ঐতিহ্যবাহী বিদ্যাপীঠ ও শিক্ষাব্যবস্থা' : 'Historic Schools, Colleges & Universities'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {language === 'bn'
              ? '১৮৮২ সালের শতবর্ষী অঞ্জুম হাই স্কুল থেকে শুরু করে আধুনিক শেখ হাসিনা বিশ্ববিদ্যালয় ও সরকারি মেডিকেল কলেজ পর্যন্ত।'
              : 'From century-old colonial high schools to modern public university and medical colleges.'}
          </p>
        </div>

        <Link
          to="/education"
          className="inline-flex items-center gap-1.5 font-bold text-sm text-blue-700 dark:text-blue-400 hover:text-blue-800 shrink-0"
        >
          <span>{language === 'bn' ? 'সকল শিক্ষা প্রতিষ্ঠান দেখুন' : 'Explore All Institutions'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Featured Institutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredInstitutions.map((inst) => (
          <div
            key={inst.id}
            className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 hover:border-blue-400 dark:hover:border-blue-500 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                  {language === 'bn' ? inst.categoryLabel.bn : inst.categoryLabel.en}
                </span>
                {inst.established && (
                  <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                    Est. {inst.established}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {language === 'bn' ? inst.nameBn : inst.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {language === 'bn' ? inst.locationBn : inst.location}
                </p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                {language === 'bn' ? inst.descriptionBn : inst.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/60 mt-4 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">
                {inst.type === 'government' ? (language === 'bn' ? 'সরকারি প্রতিষ্ঠান' : 'Govt Institution') : (language === 'bn' ? 'ঐতিহাসিক প্রতিষ্ঠান' : 'Historic')}
              </span>
              <Link
                to="/education"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {language === 'bn' ? 'বিস্তারিত →' : 'Details →'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

