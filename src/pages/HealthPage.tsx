import React, { useState } from 'react';
import { HeartPulse, PhoneCall, MapPin, ShieldAlert, CheckCircle2, Bed, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { HEALTH_DATA } from '../data/health';
import { UPAZILAS_DATA } from '../data/upazilas';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SourceBadge } from '../components/common/SourceBadge';
import { RecentUpdates } from '../components/feed/RecentUpdates';
import { FEED_UPDATES } from '../data/aggregated';

export const HealthPage: React.FC = () => {
  const { language } = useLanguage();
  const [selectedUpazila, setSelectedUpazila] = useState<string>('all');

  const filteredHospitals = HEALTH_DATA.filter((h) => {
    return selectedUpazila === 'all' || h.upazilaId === selectedUpazila;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Health Services', labelBn: 'স্বাস্থ্য ও চিকিৎসা', href: '/health' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-rose-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
            {language === 'bn' ? 'চিকিৎসা ও হাসপাতাল' : 'Healthcare Directory'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {language === 'bn' ? 'নেত্রকোণা জেলা স্বাস্থ্য ও চিকিৎসা সেবা' : 'Healthcare Services in Netrokona'}
          </h1>
          <p className="text-sm sm:text-base text-rose-100">
            {language === 'bn'
              ? '২৫০ শয্যা বিশিষ্ট আধুনিক জেলা সদর হাসপাতাল, ১০টি উপজেলা স্বাস্থ্য কমপ্লেক্স এবং জরুরি স্বাস্থ্য হটলাইন।'
              : '250-bed Modern District Hospital, all 10 Upazila Health Complexes, and round-the-clock emergency assistance.'}
          </p>
        </div>
      </div>

      {/* 24/7 Emergency Health Hotlines Strip */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-xl shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'bn' ? '২৪ ঘণ্টা জরুরি স্বাস্থ্য সেবা ও পরামর্শ' : '24/7 Emergency Health Hotlines'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {language === 'bn' ? 'জাতীয় জরুরি: ৯৯৯ | স্বাস্থ্য বাতায়ন (ফ্রি চিকিৎসা পরামর্শ): ১৬২৬৩' : 'National 999 | Shastho Batayon 16263'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="tel:16263"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-colors"
          >
            📞 16263 {language === 'bn' ? 'কল করুন' : 'Call Doctor'}
          </a>
          <a
            href="tel:999"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-colors"
          >
            🚨 999 {language === 'bn' ? 'অ্যাম্বুলেন্স' : 'Ambulance'}
          </a>
        </div>
      </div>

      {/* Upazila Filter */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <span className="text-xs font-bold text-slate-700 uppercase">
          {language === 'bn' ? 'উপজেলা অনুযায়ী হাসপাতাল খুঁজুন:' : 'Filter by Upazila:'}
        </span>
        <select
          value={selectedUpazila}
          onChange={(e) => setSelectedUpazila(e.target.value)}
          className="text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden focus:border-rose-500"
        >
          <option value="all">{language === 'bn' ? 'সকল উপজেলা' : 'All Upazilas'}</option>
          {UPAZILAS_DATA.map((u) => (
            <option key={u.id} value={u.id}>
              {language === 'bn' ? u.nameBn : u.name}
            </option>
          ))}
        </select>
      </div>

      {/* Health Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHospitals.map((hospital) => {
          const title = language === 'bn' ? hospital.nameBn : hospital.name;
          const address = language === 'bn' ? hospital.addressBn : hospital.address;
          const categoryLabel = language === 'bn' ? hospital.categoryLabel.bn : hospital.categoryLabel.en;
          const services = language === 'bn' ? hospital.servicesAvailableBn : hospital.servicesAvailable;

          return (
            <div
              key={hospital.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                    {categoryLabel}
                  </span>
                  {hospital.isEmergency24h && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>{language === 'bn' ? '২৪ ঘণ্টা জরুরি বিভাগ' : '24/7 Emergency'}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  {title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>{address}</span>
                </div>

                {hospital.beds && (
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Bed className="w-3.5 h-3.5 text-slate-500" />
                    <span>{language === 'bn' ? `${hospital.beds} শয্যা বিশিষ্ট` : `${hospital.beds} Beds Hospital`}</span>
                  </div>
                )}

                {/* Available Services */}
                <div className="space-y-1.5 pt-2">
                  <div className="text-xs font-bold text-slate-700">
                    {language === 'bn' ? 'উপলব্ধ চিকিৎসাসেবাসমূহ:' : 'Available Facilities:'}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {services.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-slate-50 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact and Map Links */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                  {hospital.phone ? (
                    <a
                      href={`tel:${hospital.phone}`}
                      className="font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1"
                    >
                      <span>📞 {hospital.phone}</span>
                    </a>
                  ) : (
                    <span className="text-slate-400">{language === 'bn' ? 'জরুরি বিভাগ কার্যকর' : 'ER Operational'}</span>
                  )}

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hospital.name} Netrokona`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-slate-600 hover:text-rose-700"
                  >
                    {language === 'bn' ? 'গুগল ম্যাপে খুঁজুন ↗' : 'Find on Google Maps ↗'}
                  </a>
                </div>

                <SourceBadge source={hospital.source} sourceUrl={hospital.sourceUrl} lastVerified={hospital.lastVerified} />
              </div>
            </div>
          );
        })}
      </div>

      <RecentUpdates items={FEED_UPDATES.health} title="Health Updates & Announcements" titleBn="স্বাস্থ্য সংক্রান্ত সাম্প্রতিক খবর ও ঘোষণা" />
    </div>
  );
};
