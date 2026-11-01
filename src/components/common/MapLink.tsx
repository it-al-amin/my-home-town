import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import type { Coordinates } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface MapLinkProps {
  query?: string;
  coordinates?: Coordinates;
  label?: string;
  className?: string;
  variant?: 'button' | 'badge' | 'link';
}

export const MapLink: React.FC<MapLinkProps> = ({
  query,
  coordinates,
  label,
  className = '',
  variant = 'button',
}) => {
  const { language } = useLanguage();

  let mapsUrl = 'https://www.google.com/maps/search/?api=1';
  if (coordinates) {
    mapsUrl += `&query=${coordinates.lat},${coordinates.lng}`;
  } else if (query) {
    mapsUrl += `&query=${encodeURIComponent(query)}`;
  } else {
    mapsUrl += `&query=${encodeURIComponent('Netrokona District Bangladesh')}`;
  }

  const defaultLabel = language === 'bn' ? 'গুগল ম্যাপে দেখুন' : 'Open in Google Maps';
  const text = label || defaultLabel;

  if (variant === 'link') {
    return (
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-medium text-sm underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-500 transition-colors ${className}`}
        title={defaultLabel}
      >
        <MapPin className="w-4 h-4 shrink-0" />
        <span>{text}</span>
        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
      </a>
    );
  }

  if (variant === 'badge') {
    return (
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors ${className}`}
        title={defaultLabel}
      >
        <MapPin className="w-3.5 h-3.5" />
        <span>{text}</span>
      </a>
    );
  }

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs hover:shadow-sm transition-all duration-200 group ${className}`}
      title={defaultLabel}
    >
      <MapPin className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
      <span>{text}</span>
      <ExternalLink className="w-3.5 h-3.5 text-emerald-500 opacity-70 group-hover:opacity-100" />
    </a>
  );
};
