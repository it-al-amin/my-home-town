import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, MapPin, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { UPAZILAS_DATA } from '../../data/upazilas';

import { AmarNetrokonaLogo } from './AmarNetrokonaLogo';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 mt-auto border-t border-slate-800">
      {/* Top Banner Disclaimer */}
      <div className="bg-emerald-950/80 border-b border-emerald-900/60 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {language === 'bn'
                ? 'এই পোর্টালের তথ্যসমূহ বিভিন্ন সরকারি ও নির্ভরযোগ্য পাবলিক রেকর্ড থেকে সংগৃহীত। জরুরি প্রয়োজনে সর্বদা সংশ্লিষ্ট কর্তৃপক্ষের সাথে যাচাই করুন।'
                : 'Information on this website is collected from public and official sources. Always verify important information with the relevant authority.'}
            </span>
          </div>
          <Link
            to="/sources"
            className="text-emerald-400 hover:text-emerald-300 underline font-semibold transition-colors shrink-0"
          >
            {language === 'bn' ? 'তথ্যসূত্র ও পদ্ধতি পড়ুন →' : 'Sources & Methodology →'}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Col 1: District Brand & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <AmarNetrokonaLogo />

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              {language === 'bn'
                ? 'পাহাড়, নদী, হাওর আর লোকসংস্কৃতির অনন্য জনপদ নেত্রকোণা। ১০টি উপজেলার পর্যটন, শিক্ষা, স্বাস্থ্য, নাগরিক সেবা এবং শতাব্দীর ইতিহাস নিয়ে একটি মুক্ত ডিজিটাল তথ্য উদ্যোগ।'
                : 'Netrokona is an extraordinary confluence of border hills, crystal rivers, expansive haors, and immortal folklore. A civic digital initiative documenting all 10 upazilas, public services, and cultural heritage.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md text-emerald-400 font-medium">
                {language === 'bn' ? '১০টি উপজেলা' : '10 Upazilas'}
              </span>
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md text-emerald-400 font-medium">
                {language === 'bn' ? '৫টি সংসদীয় আসন' : '5 Parliamentary Seats'}
              </span>
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md text-emerald-400 font-medium">
                {language === 'bn' ? '২৩.২ লক্ষ জনসংখ্যা' : '2.32M Population'}
              </span>
            </div>
          </div>

          {/* Col 2: 10 Upazilas */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'bn' ? '১০টি উপজেলা' : '10 Upazilas'}</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {UPAZILAS_DATA.map((upazila) => (
                <li key={upazila.id}>
                  <Link
                    to={`/upazilas/${upazila.slug}`}
                    className="hover:text-emerald-400 transition-colors block py-0.5"
                  >
                    {language === 'bn' ? upazila.nameBn : upazila.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Portal Sections */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {language === 'bn' ? 'গুরুত্বপূর্ণ বিভাগ' : 'Portal Sections'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/places" className="hover:text-emerald-400 transition-colors">
                  {t('places')}
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-emerald-400 transition-colors">
                  {t('map')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-emerald-400 transition-colors">
                  {t('services')}
                </Link>
              </li>
              <li>
                <Link to="/health" className="hover:text-emerald-400 transition-colors">
                  {t('health')}
                </Link>
              </li>
              <li>
                <Link to="/education" className="hover:text-emerald-400 transition-colors">
                  {t('education')}
                </Link>
              </li>
              <li>
                <Link to="/transport" className="hover:text-emerald-400 transition-colors">
                  {t('transport')}
                </Link>
              </li>
              <li>
                <Link to="/fisheries" className="hover:text-emerald-400 transition-colors">
                  {t('fisheries')}
                </Link>
              </li>
              <li>
                <Link to="/agriculture" className="hover:text-emerald-400 transition-colors">
                  {t('agriculture')}
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-emerald-400 transition-colors">
                  {t('history')}
                </Link>
              </li>
              <li>
                <Link to="/politics" className="hover:text-emerald-400 transition-colors">
                  {t('politics')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Government Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {language === 'bn' ? 'অফিসিয়াল সরকারি লিঙ্ক' : 'Official Portals'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="https://netrokona.gov.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 inline-flex items-center gap-1 transition-colors"
                >
                  <span>নেত্রকোণা জেলা বাতায়ন</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="http://www.parliament.gov.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 inline-flex items-center gap-1 transition-colors"
                >
                  <span>বাংলাদেশ জাতীয় সংসদ</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://bangladesh.gov.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 inline-flex items-center gap-1 transition-colors"
                >
                  <span>বাংলাদেশ জাতীয় তথ্য বাতায়ন</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://dghs.gov.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 inline-flex items-center gap-1 transition-colors"
                >
                  <span>স্বাস্থ্য অধিদপ্তর (DGHS)</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://eticket.railway.gov.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 inline-flex items-center gap-1 transition-colors"
                >
                  <span>বাংলাদেশ রেলওয়ে ই-টিকিট</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="http://ffwc.gov.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 inline-flex items-center gap-1 transition-colors"
                >
                  <span>বন্যা পূর্বাভাস কেন্দ্র (FFWC)</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/emergency"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950/80 border border-red-800 text-red-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <span>🚨 {language === 'bn' ? 'জরুরি হেল্পলাইন নম্বরসমূহ' : 'Emergency Hotlines'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} আমাদের নেত্রকোণা (Our Netrokona Portal).</span>
            <span className="hidden sm:inline">Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span className="hidden sm:inline">for the people of Netrokona.</span>
          </p>

          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-300 transition-colors">
              {t('about')}
            </Link>
            <Link to="/sources" className="hover:text-slate-300 transition-colors">
              {t('sources')}
            </Link>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>{t('backToTop')}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
