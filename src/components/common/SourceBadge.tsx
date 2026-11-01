import React from 'react';
import { CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SourceBadgeProps {
  source?: string;
  sourceUrl?: string;
  lastVerified?: string;
  needsVerification?: boolean;
  className?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({
  source,
  sourceUrl,
  lastVerified,
  needsVerification,
  className = '',
}) => {
  const { language } = useLanguage();

  if (needsVerification) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 ${className}`}>
        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>{language === 'bn' ? 'তথ্য যাচাইকরণ প্রয়োজন' : 'Information needs verification'}</span>
      </div>
    );
  }

  if (!source && !lastVerified) {
    return null;
  }

  return (
    <div className={`inline-flex flex-wrap items-center gap-2 text-xs text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-md border border-slate-200 ${className}`}>
      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>{language === 'bn' ? 'যাচাইকৃত উৎস:' : 'Source:'}</span>
      </span>

      {source && (
        sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:text-emerald-900 underline decoration-emerald-300 font-medium inline-flex items-center gap-1"
          >
            <span>{source}</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>
        ) : (
          <span className="text-slate-700 font-medium">{source}</span>
        )
      )}

      {lastVerified && (
        <span className="text-slate-400 pl-1 border-l border-slate-300">
          {language === 'bn' ? `যাচাই: ${lastVerified}` : `Verified: ${lastVerified}`}
        </span>
      )}
    </div>
  );
};
