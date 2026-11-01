import React from 'react';
import { ExternalLink, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';
import type { CitizenService } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { SourceBadge } from '../common/SourceBadge';

interface ServiceCardProps {
  service: CitizenService;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { language } = useLanguage();

  const title = language === 'bn' ? service.titleBn : service.title;
  const description = language === 'bn' ? service.descriptionBn : service.description;
  const office = language === 'bn' ? service.responsibleOfficeBn : service.responsibleOffice;
  const department = language === 'bn' ? service.departmentLabel.bn : service.departmentLabel.en;
  const steps = language === 'bn' ? service.procedureStepsBn : service.procedureSteps;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-emerald-500/50 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {department}
          </span>
          {service.isOfficialGovService && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'bn' ? 'অফিসিয়াল সরকারি সেবা' : 'Official Gov Service'}</span>
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
          {title}
        </h3>

        <div className="text-xs text-slate-500 mb-3 font-medium">
          <strong>{language === 'bn' ? 'দায়িত্বপ্রাপ্ত দপ্তর:' : 'Responsible Office:'}</strong> {office}
        </div>

        <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
          {description}
        </p>

        {/* Steps Preview if available */}
        {steps && steps.length > 0 && (
          <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'bn' ? 'আবেদন ধাপসমূহ:' : 'Application Steps:'}</span>
            </div>
            <ol className="list-decimal pl-4 space-y-0.5 text-slate-600">
              {steps.slice(0, 2).map((s, idx) => (
                <li key={idx} className="line-clamp-1">{s}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 space-y-2.5">
        <a
          href={service.officialPortalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:shadow-md transition-all duration-200"
        >
          <span>{language === 'bn' ? 'অফিসিয়াল সরকারি পোর্টালে যান' : 'Access Official Government Portal'}</span>
          <ExternalLink className="w-4 h-4" />
        </a>

        <SourceBadge source={service.source} sourceUrl={service.sourceUrl} lastVerified={service.lastVerified} />
      </div>
    </div>
  );
};
