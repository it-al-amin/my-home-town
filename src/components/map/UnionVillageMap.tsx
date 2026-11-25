import React, { useEffect, useMemo, useState } from 'react';
import { Home, ZoomIn, ZoomOut } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { PLACES_DATA } from '../../data/places';
import type { UnionInfo } from '../../types';
import { formatNumber } from '../../lib/format';
import { aspectOf, makeProjection, projectRings, mapTheme, pointInRings, MARKER_COLORS } from './geo';

type Ring = [number, number][];
// One file per upazila ({ unionSourceName: rings[] }), fetched only when a union of it is opened.
const SETTLEMENT_FILES = import.meta.glob<{ default: Record<string, Ring[]> }>('../../data/geo/settlements/*.json');
const loadSettlements = async (upazilaId: string): Promise<Record<string, Ring[]>> => {
  const load = SETTLEMENT_FILES[`../../data/geo/settlements/${upazilaId}.json`];
  return load ? (await load()).default : {};
};

const VIEW_W = 820;

/** Close-up of one union: its boundary, every LGED settlement footprint and the named villages. */
export const UnionVillageMap: React.FC<{ union: UnionInfo }> = ({ union }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const bn = language === 'bn';
  const isDark = theme === 'dark';
  const t = mapTheme(isDark);
  const [loaded, setLoaded] = useState<{ upazilaId: string; data: Record<string, Ring[]> } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    loadSettlements(union.upazilaId).then((data) => live && setLoaded({ upazilaId: union.upazilaId, data }));
    return () => {
      live = false;
    };
  }, [union.upazilaId]);

  const settlements = useMemo(
    () => (loaded?.upazilaId === union.upazilaId ? loaded.data[union.sourceName] ?? [] : null),
    [loaded, union.upazilaId, union.sourceName],
  );
  const viewH = Math.round(Math.min(760, Math.max(420, VIEW_W / aspectOf(union.rings))));
  const { project, outline } = useMemo(() => {
    const p = makeProjection(union.rings, VIEW_W, viewH, 30);
    return { project: p, outline: projectRings(union.rings, p).path };
  }, [union.rings, viewH]);
  const footprintPath = useMemo(() => (settlements ?? []).map((r) => projectRings([r], project).path).join(''), [settlements, project]);
  const places = PLACES_DATA.filter((p) => p.upazilaId === union.upazilaId && pointInRings([p.coordinates.lng, p.coordinates.lat], union.rings));

  // Zoom keeps the centre fixed by shrinking the viewBox around it.
  const w = VIEW_W / zoom;
  const h = viewH / zoom;
  const viewBox = `${(VIEW_W - w) / 2} ${(viewH - h) / 2} ${w} ${h}`;
  const label = 13 / zoom;
  const name = bn ? union.nameBn : union.name;
  const settlementFill = isDark ? '#a3e635' : '#4d7c0f'; // lime: built-up land, distinct from the teal density ramp

  return (
    <section className={`p-4 sm:p-5 rounded-3xl border shadow-sm ${t.card}`}>
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <h3 className="text-base font-extrabold flex items-center gap-2">
          <Home className="w-4 h-4 text-lime-600" />
          {bn ? `${name}: গ্রাম ও বসতির মানচিত্র` : `${name}: villages & settlements`}
        </h3>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => setZoom((z) => Math.min(4, z * 1.5))} className={`p-1.5 rounded-md border ${t.chip} ${t.chipHover}`} title={bn ? 'জুম ইন' : 'Zoom in'}>
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => setZoom((z) => Math.max(1, z / 1.5))} className={`p-1.5 rounded-md border ${t.chip} ${t.chipHover}`} title={bn ? 'জুম আউট' : 'Zoom out'}>
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={viewBox} className="w-full h-auto max-h-[620px]" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={bn ? `${name} ইউনিয়নের গ্রাম মানচিত্র` : `Village map of ${name}`}>
          <path d={outline} fill={isDark ? '#0f2e2a' : '#ecfdf5'} stroke={isDark ? '#5eead4' : '#0f766e'} strokeWidth={2.5 / zoom} strokeLinejoin="round" />
          {settlements === null ? (
            <text x={VIEW_W / 2} y={viewH / 2} textAnchor="middle" fontSize={14} fill={t.annot}>{bn ? 'লোড হচ্ছে…' : 'Loading…'}</text>
          ) : (
            <path d={footprintPath} fill={settlementFill} fillOpacity={0.55} stroke={settlementFill} strokeWidth={0.6 / zoom} />
          )}

          {places.map((p) => {
            const [x, y] = project([p.coordinates.lng, p.coordinates.lat]);
            return <circle key={p.id} cx={x} cy={y} r={7 / zoom} fill={MARKER_COLORS.place} stroke="#fff" strokeWidth={2 / zoom} />;
          })}

          {union.villages.map((v) => {
            const [x, y] = project([v.coordinates.lng, v.coordinates.lat]);
            const on = hovered === v.nameBn;
            return (
              <g key={v.nameBn} onMouseEnter={() => setHovered(v.nameBn)} onMouseLeave={() => setHovered(null)}>
                <circle cx={x} cy={y} r={(on ? 6 : 4.5) / zoom} fill={isDark ? '#f8fafc' : '#0f172a'} stroke={isDark ? '#0f172a' : '#fff'} strokeWidth={1.5 / zoom} />
                <text
                  x={x + 8 / zoom}
                  y={y}
                  dominantBaseline="middle"
                  fontSize={label}
                  fontWeight={700}
                  fill={isDark ? '#f8fafc' : '#0f172a'}
                  stroke={isDark ? '#0f172a' : '#ffffff'}
                  strokeWidth={3 / zoom}
                  style={{ paintOrder: 'stroke', fontFamily: 'inherit' }}
                >
                  {bn ? v.nameBn : v.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className={`mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] ${t.muted}`}>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: settlementFill, opacity: 0.7 }} />{bn ? `বসতি এলাকা (${formatNumber(union.settlementCount, bn)}টি)` : `Settlement areas (${union.settlementCount})`}</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-slate-100" />{bn ? 'নামসহ গ্রাম/পাড়া' : 'Named village / para'}</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: MARKER_COLORS.place }} />{bn ? 'দর্শনীয় স্থান' : 'Tourist spot'}</span>
      </div>
      <p className={`mt-1 text-[11px] ${t.muted}`}>
        {bn
          ? 'বসতির সীমানা: এলজিইডি (HDX "Bangladesh - Settlements")। গ্রামের নাম: © OpenStreetMap contributors (ODbL)।'
          : 'Settlement footprints: LGED (HDX "Bangladesh - Settlements"). Village names: © OpenStreetMap contributors (ODbL).'}
      </p>
    </section>
  );
};
