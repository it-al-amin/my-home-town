import React, { useMemo, useState } from 'react';
import { Layers, Eye, RotateCcw, Download, MapPin, Hospital, Landmark } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { UNION_AREAS, UNION_BOUNDARY_SOURCE } from '../../data/unions';
import { PLACES_DATA } from '../../data/places';
import { HEALTH_DATA } from '../../data/health';
import type { Upazila, UnionInfo } from '../../types';
import { formatNumber, toBnDigits } from '../../lib/format';
import { aspectOf, makeProjection, projectRings, mapTheme, DENSITY_COLORS, MARKER_COLORS } from './geo';
import { UnionDetailCard } from './UnionDetailCard';
import { UnionVillageMap } from './UnionVillageMap';

const VIEW_W = 820;

/* Union density classes are shared across the whole district so colours compare between upazilas. */
const densityOfUnion = (u: UnionInfo) => (u.census ? u.census.population / u.census.areaKm2 : 0);
const ALL_DENSITIES = Object.values(UNION_AREAS).flat().filter((u) => u.census).map(densityOfUnion).sort((a, b) => a - b);
/** Quantile breaks (5 classes) - union densities are skewed, equal intervals would leave most in one class. */
const UNION_BREAKS = [0.2, 0.4, 0.6, 0.8].map((q) => ALL_DENSITIES[Math.floor(q * (ALL_DENSITIES.length - 1))]);
const unionClass = (u: UnionInfo) => {
  const d = densityOfUnion(u);
  const i = UNION_BREAKS.findIndex((b) => d <= b);
  return i === -1 ? UNION_BREAKS.length : i;
};
const NO_AREAS: UnionInfo[] = [];
const MUNICIPALITY_FILL = '#fcd34d'; // amber-300: urban area, outside the density scale

export const UpazilaVectorMap: React.FC<{ upazila: Upazila }> = ({ upazila }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const bn = language === 'bn';
  const isDark = theme === 'dark';
  const t = mapTheme(isDark);

  const areas = UNION_AREAS[upazila.id] ?? NO_AREAS;
  const unions = areas.filter((a) => a.kind === 'union');
  const [selectedId, setSelectedId] = useState<string | null>(unions[0]?.id ?? null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [showPoints, setShowPoints] = useState(true);

  const viewH = useMemo(() => Math.round(Math.min(900, Math.max(460, VIEW_W / aspectOf(areas.flatMap((a) => a.rings))))), [areas]);
  const projected = useMemo(() => {
    const project = makeProjection(areas.flatMap((a) => a.rings), VIEW_W, viewH, 28);
    return { project, shapes: areas.map((a) => ({ area: a, ...projectRings(a.rings, project) })) };
  }, [areas, viewH]);

  const places = PLACES_DATA.filter((p) => p.upazilaId === upazila.id);
  const health = HEALTH_DATA.filter((h) => h.upazilaId === upazila.id && h.coordinates);
  const selected = areas.find((a) => a.id === selectedId) ?? null;
  const hovered = areas.find((a) => a.id === hoveredId) ?? null;
  const nameOf = (a: UnionInfo) => (bn ? a.nameBn : a.name);
  const fillOf = (a: UnionInfo) => (a.kind === 'paurashava' ? MUNICIPALITY_FILL : DENSITY_COLORS[unionClass(a)]);
  const inkOf = (a: UnionInfo) => (a.kind === 'union' && unionClass(a) >= 3 ? '#ffffff' : '#0f2e2a');
  const select = (id: string) => setSelectedId((cur) => (cur === id ? null : id));

  const downloadSvg = () => {
    const svg = document.getElementById('upazila-vector-map-svg');
    if (!svg) return;
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `${upazila.slug}-unions-${language}.svg` });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const chipBtn = `px-2.5 py-1 text-xs rounded-md font-medium border flex items-center gap-1 transition-colors ${t.chip} ${t.chipHover}`;
  const legendBreaks = [0, ...UNION_BREAKS].map((b) => Math.round(b / 10) * 10);

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-5 gap-6 items-start">
        {/* Map */}
        <div className={`lg:col-span-3 p-4 sm:p-5 rounded-3xl border shadow-sm ${t.card}`}>
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${t.chip}`}>
              <Layers className="w-3.5 h-3.5 text-teal-500" />
              {bn ? `${upazila.nameBn}: ইউনিয়নভিত্তিক জনঘনত্ব` : `${upazila.name}: population density by union`}
            </span>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={() => setShowLabels((v) => !v)} aria-pressed={showLabels} className={chipBtn}>
                <Eye className="w-3 h-3" />
                {bn ? 'নাম' : 'Labels'}
              </button>
              <button type="button" onClick={() => setShowPoints((v) => !v)} aria-pressed={showPoints} className={chipBtn}>
                <MapPin className="w-3 h-3" />
                {bn ? 'স্থান' : 'Places'}
              </button>
              <button type="button" onClick={() => setSelectedId(null)} className={`p-1.5 rounded-md border transition-colors ${t.chip} ${t.chipHover}`} title={bn ? 'রিসেট' : 'Reset'}>
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={downloadSvg} className={`p-1.5 rounded-md border transition-colors ${t.chip} ${t.chipHover}`} title={bn ? 'এসভিজি ডাউনলোড' : 'Download SVG'}>
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <svg
              id="upazila-vector-map-svg"
              viewBox={`0 0 ${VIEW_W} ${viewH}`}
              className="w-full h-auto max-h-[640px] select-none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label={bn ? `${upazila.nameBn} উপজেলার ইউনিয়ন মানচিত্র` : `Union map of ${upazila.name} upazila`}
            >
              <defs>
                <filter id="nk-upazila-shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity={isDark ? 0.45 : 0.15} />
                </filter>
              </defs>

              {/* Outer edge: every union stroked thick underneath, so only the upazila border shows */}
              <g filter="url(#nk-upazila-shadow)">
                {projected.shapes.map((s) => (
                  <path key={`e-${s.area.id}`} d={s.path} fill={fillOf(s.area)} stroke={isDark ? '#5eead4' : '#0f766e'} strokeWidth={5} strokeLinejoin="round" />
                ))}
              </g>

              {projected.shapes.map((s) => {
                const focal = s.area.id === selectedId || s.area.id === hoveredId;
                return (
                  <path
                    key={s.area.id}
                    d={s.path}
                    fill={fillOf(s.area)}
                    fillOpacity={(selectedId || hoveredId) && !focal ? 0.8 : 1}
                    stroke={t.border}
                    strokeWidth={1.4}
                    strokeLinejoin="round"
                    className="cursor-pointer transition-[fill-opacity] duration-150"
                    tabIndex={0}
                    role="button"
                    aria-label={nameOf(s.area)}
                    aria-pressed={s.area.id === selectedId}
                    onMouseEnter={() => setHoveredId(s.area.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onFocus={() => setHoveredId(s.area.id)}
                    onBlur={() => setHoveredId(null)}
                    onClick={() => select(s.area.id)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), select(s.area.id))}
                  />
                );
              })}

              {projected.shapes
                .filter((s) => s.area.id === selectedId || s.area.id === hoveredId)
                .map((s) => (
                  <path
                    key={`o-${s.area.id}`}
                    d={s.path}
                    fill="none"
                    stroke={s.area.id === selectedId ? '#f59e0b' : isDark ? '#f8fafc' : '#0f172a'}
                    strokeWidth={s.area.id === selectedId ? 3.5 : 2.5}
                    strokeLinejoin="round"
                    pointerEvents="none"
                  />
                ))}

              {showPoints && (
                <g pointerEvents="none">
                  {health.map((h) => {
                    const [x, y] = projected.project([h.coordinates!.lng, h.coordinates!.lat]);
                    return <rect key={h.id} x={x - 5} y={y - 5} width={10} height={10} rx={2} fill={MARKER_COLORS.health} stroke="#fff" strokeWidth={1.5} />;
                  })}
                  {places.map((p) => {
                    const [x, y] = projected.project([p.coordinates.lng, p.coordinates.lat]);
                    return <circle key={p.id} cx={x} cy={y} r={6} fill={MARKER_COLORS.place} stroke="#fff" strokeWidth={2} />;
                  })}
                </g>
              )}

              {showLabels && (
                <g pointerEvents="none">
                  {projected.shapes.map((s) => (
                    <text
                      key={`l-${s.area.id}`}
                      x={s.centroid.x}
                      y={s.centroid.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={s.area.id === selectedId ? 15 : 13}
                      fontWeight={s.area.id === selectedId ? 800 : 700}
                      fill={inkOf(s.area)}
                      style={{ fontFamily: 'inherit' }}
                    >
                      {nameOf(s.area)}
                    </text>
                  ))}
                </g>
              )}

              <g transform={`translate(${VIEW_W - 40}, 40)`} pointerEvents="none">
                <circle r="18" fill={isDark ? '#0f172a' : '#ffffff'} stroke={t.annot} strokeOpacity="0.5" />
                <path d="M0,-12 L5,5 L0,2 L-5,5 Z" fill={t.annot} />
                <text y="-22" textAnchor="middle" fontSize="11" fontWeight="700" fill={t.annot}>N</text>
              </g>
            </svg>

            {hovered && (
              <div className={`absolute top-2 left-2 pointer-events-none z-10 px-3 py-2 rounded-lg shadow-lg border text-xs ${t.card}`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: fillOf(hovered) }} />
                  {nameOf(hovered)}
                </div>
                <div className={`mt-0.5 ${t.muted}`}>
                  {hovered.kind === 'paurashava'
                    ? bn ? 'পৌরসভা' : 'Municipality'
                    : hovered.census
                      ? `${formatNumber(hovered.census.population, bn)} ${bn ? 'জন' : 'people'} · ${formatNumber(Math.round(densityOfUnion(hovered)), bn)} ${bn ? 'জন/বর্গ কিমি' : '/km²'}`
                      : bn ? 'ইউনিয়ন' : 'Union'}
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap items-end gap-x-6 gap-y-2">
            <div>
              <div className={`text-[11px] font-semibold mb-1 ${t.muted}`}>{bn ? 'জনঘনত্ব (জন/বর্গ কিমি, ২০১১)' : 'Density (people/km², 2011)'}</div>
              <div className="flex w-64">
                {DENSITY_COLORS.map((c, i) => (
                  <div key={c} className="flex-1">
                    <div className="h-2.5" style={{ backgroundColor: c, borderRadius: i === 0 ? '4px 0 0 4px' : i === DENSITY_COLORS.length - 1 ? '0 4px 4px 0' : 0 }} />
                    <div className={`text-[11px] mt-0.5 tabular-nums ${t.muted}`}>{bn ? toBnDigits(legendBreaks[i]) : legendBreaks[i]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={`flex items-center gap-3 text-[11px] ${t.muted}`}>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: MUNICIPALITY_FILL }} />{bn ? 'পৌরসভা' : 'Municipality'}</span>
              <span className="flex items-center gap-1"><Landmark className="w-3 h-3" style={{ color: MARKER_COLORS.place }} />{bn ? 'দর্শনীয় স্থান' : 'Tourist spot'}</span>
              <span className="flex items-center gap-1"><Hospital className="w-3 h-3" style={{ color: MARKER_COLORS.health }} />{bn ? 'হাসপাতাল' : 'Hospital'}</span>
            </div>
          </div>
          <p className={`mt-2 text-[11px] ${t.muted}`}>
            {bn ? 'সীমানা: ' : 'Boundaries: '}
            <a href={UNION_BOUNDARY_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline">
              {bn ? UNION_BOUNDARY_SOURCE.labelBn : UNION_BOUNDARY_SOURCE.label}
            </a>
          </p>
        </div>

        {/* Union details */}
        <div className="lg:col-span-2 lg:sticky lg:top-24">
          {selected ? (
            <UnionDetailCard union={selected} upazila={upazila} />
          ) : (
            <div className={`p-6 rounded-3xl border text-sm ${t.card} ${t.muted}`}>
              {bn ? 'মানচিত্রে বা নিচের তালিকায় একটি ইউনিয়নে ক্লিক করে বিস্তারিত দেখুন।' : 'Click a union on the map or in the list below to see its details.'}
            </div>
          )}
        </div>
      </div>

      {/* Union list */}
      <div className="flex flex-wrap gap-1.5">
        {areas.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => select(a.id)}
            onMouseEnter={() => setHoveredId(a.id)}
            onMouseLeave={() => setHoveredId(null)}
            aria-pressed={selectedId === a.id}
            className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-colors ${t.chip} ${
              selectedId === a.id ? 'border-amber-500 ring-1 ring-amber-500/40' : t.chipHover
            }`}
          >
            <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: fillOf(a) }} />
            {nameOf(a)}
          </button>
        ))}
      </div>

      {selected && <UnionVillageMap key={selected.id} union={selected} />}
    </div>
  );
};
