import React from 'react';
import { Filter } from 'lucide-react';

interface FilterChipsProps {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  /** Tailwind classes for the selected chip (each page keeps its accent colour) */
  activeClass?: string;
  /** Optional caption before the chips, shown with a filter icon */
  caption?: string;
  className?: string;
}

/** Row of pill buttons for picking one category. */
export const FilterChips: React.FC<FilterChipsProps> = ({
  options,
  value,
  onChange,
  activeClass = 'bg-teal-700 text-white shadow-xs',
  caption,
  className = '',
}) => (
  <div className={`nk-chips flex items-center gap-1.5 flex-wrap text-xs ${className}`}>
    {caption !== undefined && (
      <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
        <Filter className="w-3.5 h-3.5" />
        {caption && <span>{caption}</span>}
      </span>
    )}
    {options.map((o) => (
      <button
        key={o.id}
        type="button"
        onClick={() => onChange(o.id)}
        aria-pressed={value === o.id}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          value === o.id ? activeClass : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);
