import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ExternalLink, ArrowRight, RotateCcw, Download, Eye, Layers } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { UPAZILAS_DATA } from '../../data/upazilas';
import { UNIONS_DATA } from '../../data/unions';
import type { Upazila } from '../../types';
import {
  projectDistrict,
  densityColor,
  densityInk,
  densityOf,
  DENSITY_COLORS,
  DENSITY_BREAKS,
  GOOGLE_MAPS_DISTRICT_URL,
  mapTheme,
} from './geo';
import { toBnDigits as toBn } from '../../lib/format';

const VIEW_W = 820;
const VIEW_H = 780;

interface DistrictVectorMapProps {
  selectedUpazilaId?: string;
  onSelectUpazila?: (upazila: Upazila | null) => void;
  className?: string;
  interactive?: boolean;
  showLabels?: boolean;
  showInfoCard?: boolean;
  theme?: 'dark' | 'light';
}

/**
 * Choropleth of Netrokona's 10 upazilas drawn from the real OpenStreetMap boundaries,
 * shaded by population density (people per km²).
 */
export const DistrictVectorMap: React.FC<DistrictVectorMapProps> = ({
  selectedUpazilaId,
  onSelectUpazila,
  className = '',
  interactive = true,
  showLabels = true,
  showInfoCard = true,
  theme,
}) => {
  const { language } = useLanguage();
  const { theme: siteTheme } = useTheme();
  const bn = language === 'bn';
  // Follows the site theme unless a caller forces one.
  const isDark = (theme ?? siteTheme) === 'dark';
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(selectedUpazilaId || 'netrokona-sadar');
  const [labelsVisible, setLabelsVisible] = useState(showLabels);

  const { upazilas } = useMemo(() => projectDistrict(VIEW_W, VIEW_H, 36), []);
  const byId = (id: string | null) => UPAZILAS_DATA.find((u) => u.id === id);
  const activeId = hoveredId || selectedId;
  const activeUpazila = byId(activeId) || UPAZILAS_DATA[0];

  const select = (id: string) => {
    if (!interactive) return;
    const next = selectedId === id ? null : id;
    setSelectedId(next);
    onSelectUpazila?.(byId(next) ?? null);
  };

  const reset = () => {
    setSelectedId(null);
    setHoveredId(null);
    onSelectUpazila?.(null);
  };

  const handleDownloadSvg = () => {
    const svg = document.getElementById('netrokona-vector-map-svg');
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: `netrokona-district-map-${language}.svg` });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const t = mapTheme(isDark);

  const densityLabel = (id: string) => {
    const d = Math.round(densityOf(id)).toLocaleString(bn ? 'bn-BD' : 'en-US');
    return bn ? `${d} জন/বর্গ কিমি` : `${d} /km²`;
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Toolbar */}
      <div className="w-full flex items-center justify-between gap-2 mb-3 px-1 flex-wrap">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${t.chip}`}>
          <Layers className="w-3.5 h-3.5 text-teal-500" />
          {bn ? 'উপজেলাভিত্তিক জনঘনত্ব মানচিত্র' : 'Population density by upazila'}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setLabelsVisible((v) => !v)}
            aria-pressed={labelsVisible}
            className={`px-2.5 py-1 text-xs rounded-md font-medium border flex items-center gap-1 transition-colors ${t.chip} ${t.chipHover}`}
            title={bn ? 'নাম দেখান/লুকান' : 'Toggle labels'}
          >
            <Eye className="w-3 h-3" />
            {bn ? 'নাম' : 'Labels'}
          </button>
          <button type="button" onClick={reset} className={`p-1.5 rounded-md border transition-colors ${t.chip} ${t.chipHover}`} title={bn ? 'রিসেট' : 'Reset'}>
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={handleDownloadSvg} className={`p-1.5 rounded-md border transition-colors ${t.chip} ${t.chipHover}`} title={bn ? 'এসভিজি ডাউনলোড' : 'Download SVG'}>
            <Download className="w-3.5 h-3.5" />
          </button>
          <a
            href={GOOGLE_MAPS_DISTRICT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-2.5 py-1 text-xs rounded-md font-medium border flex items-center gap-1 transition-colors ${t.chip} ${t.chipHover}`}
            title={bn ? 'গুগল ম্যাপে স্যাটেলাইট ভিউ' : 'Satellite view on Google Maps'}
          >
            <ExternalLink className="w-3 h-3" />
            Google Maps
          </a>
        </div>
      </div>

      {/* Map */}
      <div className="relative w-full">
        <svg
          id="netrokona-vector-map-svg"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full h-auto max-h-[620px]"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={bn ? 'নেত্রকোণা জেলার উপজেলা মানচিত্র' : 'Map of the upazilas of Netrokona District'}
        >
          <defs>
            <filter id="nk-district-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000" floodOpacity={isDark ? 0.45 : 0.15} />
            </filter>
          </defs>

          {/* Soft district silhouette underneath */}
          <g filter="url(#nk-district-shadow)">
            {upazilas.map((u) => (
              <path key={`s-${u.id}`} d={u.path} fill={densityColor(u.id)} stroke="none" />
            ))}
          </g>

          {/* Upazila polygons */}
          <g>
            {upazilas.map((u) => {
              const focal = u.id === selectedId || u.id === hoveredId;
              return (
                <path
                  key={u.id}
                  d={u.path}
                  fill={densityColor(u.id)}
                  fillOpacity={activeId && !focal ? 0.82 : 1}
                  stroke={t.border}
                  strokeWidth={1.4}
                  strokeLinejoin="round"
                  className={interactive ? 'cursor-pointer transition-[fill-opacity] duration-150' : ''}
                  tabIndex={interactive ? 0 : -1}
                  role={interactive ? 'button' : undefined}
                  aria-label={bn ? byId(u.id)?.nameBn : byId(u.id)?.name}
                  onMouseEnter={() => interactive && setHoveredId(u.id)}
                  onMouseLeave={() => interactive && setHoveredId(null)}
                  onFocus={() => interactive && setHoveredId(u.id)}
                  onBlur={() => interactive && setHoveredId(null)}
                  onClick={() => select(u.id)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), select(u.id))}
                />
              );
            })}
          </g>

          {/* Focus outline drawn on top so it is never hidden by a neighbour */}
          {upazilas
            .filter((u) => u.id === selectedId || u.id === hoveredId)
            .map((u) => (
              <path
                key={`o-${u.id}`}
                d={u.path}
                fill="none"
                stroke={u.id === selectedId ? '#f59e0b' : isDark ? '#f8fafc' : '#0f172a'}
                strokeWidth={u.id === selectedId ? 3.5 : 2.5}
                strokeLinejoin="round"
                pointerEvents="none"
              />
            ))}

          {/* Labels */}
          {labelsVisible && (
            <g pointerEvents="none">
              {upazilas.map((u) => {
                const up = byId(u.id);
                if (!up) return null;
                return (
                  <text
                    key={`l-${u.id}`}
                    x={u.centroid.x}
                    y={u.centroid.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={u.id === selectedId ? 17 : 15}
                    fontWeight={u.id === selectedId ? 800 : 700}
                    fill={densityInk(u.id)}
                    style={{ fontFamily: 'inherit', paintOrder: 'stroke' }}
                  >
                    {bn ? up.nameBn : up.name}
                  </text>
                );
              })}
            </g>
          )}

          {/* Neighbours */}
          <g fontSize="13" fontWeight="600" fill={t.annot} pointerEvents="none" style={{ fontFamily: 'inherit' }}>
            <text x={VIEW_W / 2} y={20} textAnchor="middle">
              ↑ {bn ? 'মেঘালয়, ভারত (গারো পাহাড়)' : 'Meghalaya, India (Garo Hills)'}
            </text>
            <text x={VIEW_W / 2} y={VIEW_H - 8} textAnchor="middle">
              ↓ {bn ? 'কিশোরগঞ্জ' : 'Kishoreganj'}
            </text>
            <text x={VIEW_W - 12} y={VIEW_H / 2} textAnchor="middle" transform={`rotate(90 ${VIEW_W - 12} ${VIEW_H / 2})`}>
              {bn ? 'সুনামগঞ্জ →' : 'Sunamganj →'}
            </text>
            <text x={12} y={VIEW_H / 2} textAnchor="middle" transform={`rotate(-90 12 ${VIEW_H / 2})`}>
              {bn ? '← ময়মনসিংহ' : '← Mymensingh'}
            </text>
          </g>

          {/* North arrow */}
          <g transform={`translate(${VIEW_W - 56}, 56)`} pointerEvents="none">
            <circle r="20" fill={isDark ? '#0f172a' : '#ffffff'} stroke={t.annot} strokeOpacity="0.5" />
            <path d="M0,-13 L6,6 L0,2 L-6,6 Z" fill={t.annot} />
            <text y="-24" textAnchor="middle" fontSize="11" fontWeight="700" fill={t.annot}>N</text>
          </g>
        </svg>

        {/* Hover tooltip */}
        {hoveredId && byId(hoveredId) && (
          <div className={`absolute top-2 left-2 pointer-events-none z-10 px-3 py-2 rounded-lg shadow-lg border text-xs ${t.card}`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: densityColor(hoveredId) }} />
              {bn ? byId(hoveredId)!.nameBn : byId(hoveredId)!.name}
            </div>
            <div className={`mt-0.5 ${t.muted}`}>
              {densityLabel(hoveredId)} · {bn ? `${toBn(byId(hoveredId)!.unionsCount)}টি ইউনিয়ন` : `${byId(hoveredId)!.unionsCount} unions`}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="w-full mt-2 px-1">
        <div className={`text-[11px] font-semibold mb-1 ${t.muted}`}>
          {bn ? 'জনঘনত্ব (জন প্রতি বর্গ কিমি)' : 'Population density (people per km²)'}
        </div>
        <div className="flex w-full max-w-md">
          {DENSITY_COLORS.map((c, i) => (
            <div key={c} className="flex-1">
              <div className="h-2.5" style={{ backgroundColor: c, borderRadius: i === 0 ? '4px 0 0 4px' : i === DENSITY_COLORS.length - 1 ? '0 4px 4px 0' : 0 }} />
              <div className={`text-[11px] mt-0.5 tabular-nums ${t.muted}`}>{bn ? toBn(DENSITY_BREAKS[i]) : DENSITY_BREAKS[i]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upazila chips */}
      <div className="w-full flex items-center justify-center flex-wrap gap-1.5 mt-3">
        {upazilas.map((u) => {
          const up = byId(u.id);
          if (!up) return null;
          const on = activeId === u.id;
          return (
            <button
              key={u.id}
              type="button"
              onClick={() => select(u.id)}
              onMouseEnter={() => interactive && setHoveredId(u.id)}
              onMouseLeave={() => interactive && setHoveredId(null)}
              aria-pressed={selectedId === u.id}
              className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-colors ${
                on ? 'border-amber-500 ring-1 ring-amber-500/40 ' + t.chip : `${t.chip} ${t.chipHover}`
              }`}
            >
              <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: densityColor(u.id) }} />
              {bn ? up.nameBn : up.name}
            </button>
          );
        })}
      </div>

      {/* Optional detail card */}
      {showInfoCard && activeUpazila && (
        <div className={`w-full mt-4 p-4 sm:p-5 rounded-2xl border shadow-lg ${t.card}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-500/20">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0"
                style={{ backgroundColor: densityColor(activeUpazila.id), color: densityInk(activeUpazila.id) }}
              >
                {(bn ? activeUpazila.nameBn : activeUpazila.name).charAt(0)}
              </div>
              <div>
                <h4 className="text-lg font-extrabold tracking-tight">{bn ? activeUpazila.nameBn : activeUpazila.name}</h4>
                <p className={`text-xs ${t.muted}`}>
                  {bn ? 'সদর দপ্তর:' : 'Headquarters:'} {bn ? activeUpazila.headquartersBn : activeUpazila.headquarters}
                </p>
              </div>
            </div>
            <Link
              to={`/upazilas/${activeUpazila.slug}`}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-700 hover:bg-teal-600 text-white transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              {bn ? 'উপজেলা তথ্য দেখুন' : 'View upazila'}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
            {[
              [bn ? 'জনসংখ্যা' : 'Population', activeUpazila.population.toLocaleString(bn ? 'bn-BD' : 'en-US')],
              [bn ? 'আয়তন' : 'Area', bn ? `${toBn(activeUpazila.areaKm2)} বর্গ কিমি` : `${activeUpazila.areaKm2} km²`],
              [bn ? 'জনঘনত্ব' : 'Density', densityLabel(activeUpazila.id)],
              [bn ? 'ইউনিয়ন' : 'Unions', bn ? `${toBn(activeUpazila.unionsCount)}টি` : activeUpazila.unionsCount],
            ].map(([label, value]) => (
              <div key={String(label)} className={`p-2.5 rounded-xl border ${t.tile}`}>
                <div className={`text-[11px] ${t.muted}`}>{label}</div>
                <div className={`text-sm font-bold mt-0.5 tabular-nums ${t.strong}`}>{value}</div>
              </div>
            ))}
          </div>

          {(UNIONS_DATA[activeUpazila.id] || []).length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-500/20">
              <div className={`text-xs font-bold flex items-center gap-1.5 mb-2 ${t.strong}`}>
                <MapPin className="w-3.5 h-3.5 text-teal-500" />
                {bn ? `ইউনিয়নসমূহ (${toBn(activeUpazila.unionsCount)}টি)` : `Unions (${activeUpazila.unionsCount})`}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {(UNIONS_DATA[activeUpazila.id] || []).map((union) => (
                  <a
                    key={union.id}
                    href={`https://www.google.com/maps/search/?api=1&query=${union.coordinates.lat},${union.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-between gap-1 transition-colors hover:border-teal-500 ${t.tile}`}
                  >
                    <span className="line-clamp-1">{bn ? union.nameBn : union.name}</span>
                    <ExternalLink className={`w-3 h-3 shrink-0 ${t.muted}`} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
