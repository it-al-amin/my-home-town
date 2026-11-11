import React from 'react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  titleBn?: string;
  subtitle?: string;
  subtitleBn?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  align = 'left',
  className = '',
}) => {
  const alignmentClasses = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col mb-8 ${alignmentClasses} ${className}`}>
      {badge && (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider mb-2.5">
          {badge}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
        {title}
      </h2>
      <div className="w-16 h-1 bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full mt-2.5 mb-3" />
      {subtitle && (
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
