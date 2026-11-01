import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, ShieldAlert, AlertTriangle, Ambulance, Flame, HeartPulse, Building2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { EMERGENCY_DATA } from '../data/emergency';
import { UPAZILAS_DATA } from '../data/upazilas';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SectionHeader } from '../components/common/SectionHeader';
import { SourceBadge } from '../components/common/SourceBadge';

export const EmergencyPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumb
        items={[
          { label: 'Emergency Services', labelBn: 'জরুরি সেবা', href: '/emergency' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-red-950 via-rose-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/30 text-red-200 border border-red-400/40">
            {language === 'bn' ? '২৪ ঘণ্টা জরুরি হটলাইন ডিরেক্টরি' : '24/7 Emergency Directory'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {language === 'bn' ? 'নেত্রকোণা জেলা জরুরি সেবা ও হেল্পলাইন' : 'Emergency Hotlines & Relief Services'}
          </h1>
          <p className="text-sm sm:text-base text-red-100 leading-relaxed max-w-2xl">
            {language === 'bn'
              ? 'পুলিশ কন্ট্রোল রুম, ফায়ার সার্ভিস স্টেশন, হাসপাতাল জরুরি বিভাগ এবং জাতীয় টোল-ফ্রি হেল্পলাইন নম্বর।'
              : 'Direct verified contact numbers for district police control, fire stations, hospitals, and national emergency lines.'}
          </p>
        </div>
      </div>

      {/* Critical Legal Warning Callout */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-900 space-y-1">
          <div className="font-bold">
            {language === 'bn' ? 'জরুরি সেবা ব্যবহারে সতর্কতা:' : 'Important Public Notice:'}
          </div>
          <p>
            {language === 'bn'
              ? 'জাতীয় জরুরি হটলাইনসমূহ (৯৯৯, ৩৩৩, ১৬২৬৩) ২৪ ঘণ্টা কার্যকর। মিথ্যা তথ্য বা ভুয়া কল প্রদান আইনত দণ্ডনীয় অপরাধ। প্রকৃত প্রয়োজনে তাৎক্ষণিক সেবা গ্রহণ করুন।'
              : 'National emergency hotlines operate 24/7. False distress calls are strictly punishable by law. Please utilize these verified resources responsibly for genuine public assistance.'}
          </p>
        </div>
      </div>

      {/* National Emergency Services Grid */}
      <section className="space-y-6">
        <SectionHeader
          badge={language === 'bn' ? 'জাতীয় হটলাইন' : 'National Hotlines'}
          title={language === 'bn' ? 'সারাদেশব্যাপী টোল-ফ্রি জাতীয় জরুরি সেবা' : 'National Toll-Free Emergency Hotlines'}
          subtitle={language === 'bn' ? 'যেকোনো মোবাইল বা ল্যান্ডফোন থেকে কোনো চার্জ ছাড়াই সরাসরি কল করা যায়।' : 'Toll-free emergency numbers accessible 24/7 from any phone in Bangladesh.'}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EMERGENCY_DATA.filter((e) => e.category === 'national' || e.category === 'hospital').map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200 inline-block">
                  {language === 'bn' ? item.categoryLabel.bn : item.categoryLabel.en}
                </span>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {language === 'bn' ? item.titleBn : item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'bn' ? item.noteBn : item.note}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <a
                  href={`tel:${item.number}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xl bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-red-200 transition-all"
                >
                  <PhoneCall className="w-5 h-5" />
                  <span>{item.number}</span>
                </a>
                <span className="block text-center text-[11px] text-slate-400 mt-1 font-medium">
                  {item.availableHours}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* District Police, Fire Service & Hospital Contacts */}
      <section className="space-y-6">
        <SectionHeader
          badge={language === 'bn' ? 'নেত্রকোণা জেলা ও উপজেলা' : 'District & Upazila Stations'}
          title={language === 'bn' ? 'নেত্রকোণা জেলা পুলিশ, ফায়ার স্টেশন ও হাসপাতাল' : 'District Police, Fire Stations & Hospital ER'}
          subtitle={language === 'bn' ? 'সংশ্লিষ্ট দপ্তরসমূহের যাচাইকৃত সরাসরি টেলিফোন নম্বর।' : 'Direct verified telephone numbers for emergency duty officers.'}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EMERGENCY_DATA.filter((e) => e.category !== 'national' && e.category !== 'hospital').map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                    {language === 'bn' ? item.categoryLabel.bn : item.categoryLabel.en}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">
                    {item.availableHours}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {language === 'bn' ? item.titleBn : item.title}
                </h3>

                {item.address && (
                  <div className="text-xs text-slate-500">
                    📍 {language === 'bn' ? item.addressBn : item.address}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <a
                  href={`tel:${item.number}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>{item.number}</span>
                </a>
                <SourceBadge source={item.source} sourceUrl={item.sourceUrl} lastVerified={item.lastVerified} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upazila Emergency Quick Table */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xl font-bold text-slate-900">
          {language === 'bn' ? '১০টি উপজেলার জরুরি যোগাযোগ তালিকা' : '10 Upazilas Emergency Quick Directory'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500">
          {language === 'bn' ? 'থানা পুলিশ, ফায়ার স্টেশন, স্বাস্থ্য কমপ্লেক্স এবং উপজেলা নির্বাহী কর্মকর্তা (ইউএনও)-র ডিউটি নম্বর।' : 'Thana police, fire station, health complex, and UNO duty lines across all upazilas.'}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{language === 'bn' ? 'উপজেলা' : 'Upazila'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'থানা পুলিশ' : 'Police Thana'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'ফায়ার সার্ভিস' : 'Fire Service'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'স্বাস্থ্য কমপ্লেক্স' : 'Health Complex'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'ইউএনও অফিস' : 'UNO Office'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {UPAZILAS_DATA.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <Link to={`/upazilas/${u.slug}`} className="text-emerald-700 hover:underline">
                      {language === 'bn' ? u.nameBn : u.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    {u.emergencyContacts?.police ? (
                      <a href={`tel:${u.emergencyContacts.police}`} className="text-emerald-700 font-semibold hover:underline">
                        {u.emergencyContacts.police}
                      </a>
                    ) : '—'}
                  </td>
                  <td className="py-3 px-4">
                    {u.emergencyContacts?.fireService ? (
                      <a href={`tel:${u.emergencyContacts.fireService}`} className="text-emerald-700 font-semibold hover:underline">
                        {u.emergencyContacts.fireService}
                      </a>
                    ) : '—'}
                  </td>
                  <td className="py-3 px-4">
                    {u.emergencyContacts?.healthComplex ? (
                      <a href={`tel:${u.emergencyContacts.healthComplex}`} className="text-emerald-700 font-semibold hover:underline">
                        {u.emergencyContacts.healthComplex}
                      </a>
                    ) : '—'}
                  </td>
                  <td className="py-3 px-4">
                    {u.emergencyContacts?.uno ? (
                      <a href={`tel:${u.emergencyContacts.uno}`} className="text-emerald-700 font-semibold hover:underline">
                        {u.emergencyContacts.uno}
                      </a>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
