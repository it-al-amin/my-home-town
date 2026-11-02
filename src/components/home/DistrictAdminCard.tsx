import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin, Award, FileCheck, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const DistrictAdminCard: React.FC = () => {
  const { language } = useLanguage();

  const officials = [
    {
      title: language === 'bn' ? 'জেলা প্রশাসক ও জেলা ম্যাজিস্ট্রেট' : 'Deputy Commissioner & District Magistrate',
      office: language === 'bn' ? 'জেলা প্রশাসকের কার্যালয়, নেত্রকোণা' : 'Office of the Deputy Commissioner, Netrokona',
      address: language === 'bn' ? 'কালেক্টরেট ভবন, নেত্রকোণা সদর' : 'Collectorate Building, Netrokona Sadar',
      email: 'dcnetrokona@mopa.gov.bd',
      phone: '01713-333001',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      avatarBg: 'bg-emerald-700',
      roleIcon: ShieldCheck,
    },
    {
      title: language === 'bn' ? 'পুলিশ সুপার (এসপি)' : 'Superintendent of Police (SP)',
      office: language === 'bn' ? 'পুলিশ সুপারের কার্যালয়, নেত্রকোণা' : 'Office of the Superintendent of Police',
      address: language === 'bn' ? 'পুলিশ লাইন রোড, নেত্রকোণা' : 'Police Lines Road, Netrokona',
      email: 'spnetrokona@police.gov.bd',
      phone: '01320-103000',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      avatarBg: 'bg-blue-800',
      roleIcon: ShieldCheck,
    },
    {
      title: language === 'bn' ? 'সিভিল সার্জন' : 'Civil Surgeon',
      office: language === 'bn' ? 'সিভিল সার্জন কার্যালয়, নেত্রকোণা' : 'Office of the Civil Surgeon, Netrokona',
      address: language === 'bn' ? 'হাসপাতাল রোড, নেত্রকোণা সদর' : 'Hospital Road, Netrokona Sadar',
      email: 'csnetrokona@dghs.gov.bd',
      phone: '01730-324850',
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
      avatarBg: 'bg-rose-700',
      roleIcon: Award,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            {language === 'bn' ? 'জেলা প্রশাসন ও আইনশৃঙ্খলা' : 'District Administration & Governance'}
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            {language === 'bn' ? 'নেত্রকোণা জেলা নেতৃত্ব বাতায়ন' : 'Executive Administrative Leadership'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'জনবান্ধব প্রশাসন ও সুশাসন নিশ্চিতকরণে সার্বক্ষণিক নাগরিক সেবা।'
              : 'Direct official contacts of key district administrators and grievance redressal.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/directory"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5"
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>{language === 'bn' ? 'সকল কর্মকর্তা ডিরেক্টরি' : 'Full Directory'}</span>
          </Link>
          <a
            href="https://grs.gov.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors flex items-center gap-1.5"
          >
            <span>{language === 'bn' ? 'জিআরএস অভিযোগ' : 'GRS Grievance'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Leadership Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6">
        {officials.map((official, idx) => {
          const Icon = official.roleIcon;
          return (
            <div
              key={idx}
              className="bg-slate-50/70 rounded-xl p-5 border border-slate-200/80 hover:border-emerald-300 transition-all space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl ${official.avatarBg} text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${official.badgeColor}`}>
                      {language === 'bn' ? 'প্রশাসনিক শীর্ষ পদ' : 'Executive Post'}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-0.5 line-clamp-1">
                      {official.title}
                    </h4>
                  </div>
                </div>

                <div className="text-xs text-slate-600 font-medium pl-1">
                  <p className="font-semibold text-slate-800">{official.office}</p>
                  <p className="text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>{official.address}</span>
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 text-xs space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1 text-[11px] font-sans text-slate-500 font-medium">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>{language === 'bn' ? 'ফোন:' : 'Phone:'}</span>
                  </span>
                  <a href={`tel:${official.phone}`} className="font-bold text-slate-800 hover:text-emerald-700">
                    {official.phone}
                  </a>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1 text-[11px] font-sans text-slate-500 font-medium">
                    <Mail className="w-3 h-3 text-emerald-600" />
                    <span>{language === 'bn' ? 'ইমেইল:' : 'Email:'}</span>
                  </span>
                  <a href={`mailto:${official.email}`} className="font-sans text-[11px] text-emerald-700 hover:underline truncate max-w-[140px]">
                    {official.email}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

