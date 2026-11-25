// Shared map geometry + styling for every Netrokona map on the site.
// Boundaries are the real OpenStreetMap upazila polygons, simplified by
// `node scraper/node/build_map_geometry.mjs` -> src/data/geo/upazila-boundaries.json.
import boundaries from '../../data/geo/upazila-boundaries.json';
import { UPAZILAS_DATA } from '../../data/upazilas';

type Ring = [number, number][]; // [lng, lat]
export const UPAZILA_RINGS = boundaries as unknown as Record<string, Ring[]>;

/** The exact Google Maps view of the district the site owner chose (satellite layer). */
export const GOOGLE_MAPS_DISTRICT_URL =
  'https://www.google.com/maps/place/Netrokona+District/@24.9723981,90.820359,323538m/data=!3m1!1e3!4m6!3m5!1s0x3756e23129c64bf9:0xfe2dd4b9f582cdd1!8m2!3d24.8103284!4d90.8656415!16zL20vMDcwMTN0';

/* ------------------------------------------------------------------ */
/* Choropleth: population density (people per km²), 5 classes, teal.  */
/* ------------------------------------------------------------------ */

// Sequential single-hue ramp: light = sparse, dark = dense. Readable on light and dark pages.
export const DENSITY_COLORS = ['#cdebe5', '#98d3c7', '#5bb3a4', '#2a8c7e', '#115e55'] as const;

export const densityOf = (id: string): number => {
  const u = UPAZILAS_DATA.find((x) => x.id === id);
  return u && u.areaKm2 ? u.population / u.areaKm2 : 0;
};

const densities = UPAZILAS_DATA.map((u) => u.population / u.areaKm2).sort((a, b) => a - b);
const dMin = densities[0];
const dMax = densities[densities.length - 1];

/** Equal-interval class breaks, rounded to tens for a clean legend. */
export const DENSITY_BREAKS: number[] = Array.from({ length: DENSITY_COLORS.length + 1 }, (_, i) =>
  Math.round((dMin + ((dMax - dMin) * i) / DENSITY_COLORS.length) / 10) * 10,
);

export const densityClass = (id: string): number => {
  const d = densityOf(id);
  const i = DENSITY_BREAKS.findIndex((b, k) => k > 0 && d <= b);
  return Math.max(0, Math.min(DENSITY_COLORS.length - 1, (i === -1 ? DENSITY_COLORS.length : i) - 1));
};

export const densityColor = (id: string) => DENSITY_COLORS[densityClass(id)];
/** Text colour that stays legible on top of the class colour. */
export const densityInk = (id: string) => (densityClass(id) >= 3 ? '#ffffff' : '#0f2e2a');

/* ------------------------------------------------------------------ */
/* SVG projection                                                      */
/* ------------------------------------------------------------------ */

export type Point = [number, number]; // [x, y] in SVG units
type Project = (p: [number, number]) => Point;

/**
 * Equirectangular projection with cos(lat) correction that fits `rings` into a
 * width x height box - accurate enough for a district (70 km) or an upazila.
 */
export function makeProjection(rings: Ring[], width: number, height: number, pad = 24): Project {
  const pts = rings.flat();
  const minLng = Math.min(...pts.map((p) => p[0]));
  const maxLng = Math.max(...pts.map((p) => p[0]));
  const minLat = Math.min(...pts.map((p) => p[1]));
  const maxLat = Math.max(...pts.map((p) => p[1]));
  const k = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
  const spanX = (maxLng - minLng) * k;
  const spanY = maxLat - minLat;
  const scale = Math.min((width - pad * 2) / spanX, (height - pad * 2) / spanY);
  const offX = (width - spanX * scale) / 2;
  const offY = (height - spanY * scale) / 2;
  return ([lng, lat]) => [offX + (lng - minLng) * k * scale, offY + (maxLat - lat) * scale];
}

/** Width/height ratio of `rings` once projected, to size an SVG without empty bands. */
export function aspectOf(rings: Ring[]): number {
  const pts = rings.flat();
  const lats = pts.map((p) => p[1]);
  const lngs = pts.map((p) => p[0]);
  const k = Math.cos((((Math.min(...lats) + Math.max(...lats)) / 2) * Math.PI) / 180);
  return ((Math.max(...lngs) - Math.min(...lngs)) * k) / (Math.max(...lats) - Math.min(...lats));
}

/** SVG path for a set of rings, plus the area-weighted centroid of the largest one. */
export function projectRings(rings: Ring[], project: Project): { path: string; centroid: { x: number; y: number } } {
  let path = '';
  let best = { a: 0, x: 0, y: 0 };
  for (const ring of rings) {
    const pts = ring.map(project);
    path += 'M' + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L') + 'Z';
    let a = 0, cx = 0, cy = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[i + 1];
      const f = x0 * y1 - x1 * y0;
      a += f; cx += (x0 + x1) * f; cy += (y0 + y1) * f;
    }
    if (Math.abs(a) > Math.abs(best.a)) best = { a, x: cx / (3 * a), y: cy / (3 * a) };
  }
  return { path, centroid: { x: best.x, y: best.y } };
}

/** Ray-casting point-in-polygon test for a [lng, lat] point. */
export function pointInRings([x, y]: [number, number], rings: Ring[]): boolean {
  return rings.some((r) => {
    let inside = false;
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const [xi, yi] = r[i];
      const [xj, yj] = r[j];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  });
}

export interface ProjectedUpazila {
  id: string;
  path: string;
  centroid: { x: number; y: number };
}

export function projectDistrict(width: number, height: number, pad = 24) {
  const project = makeProjection(Object.values(UPAZILA_RINGS).flat(), width, height, pad);
  const upazilas: ProjectedUpazila[] = Object.entries(UPAZILA_RINGS).map(([id, rings]) => ({
    id,
    ...projectRings(rings, project),
  }));
  return { upazilas, project };
}

/* ------------------------------------------------------------------ */
/* Leaflet basemaps                                                    */
/* ------------------------------------------------------------------ */

export type BasemapId = 'map' | 'satellite';

export const BASEMAPS = {
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community',
  },
} as const;

/** Marker palette shared by the Leaflet maps (matches the site accent colours). */
export const MARKER_COLORS = {
  upazila: '#0f766e', // teal-700
  place: '#c2410c', // orange-700
  health: '#be123c', // rose-700
  union: '#0369a1', // sky-700
} as const;

/** GeoJSON FeatureCollection of the upazila polygons, for Leaflet. */
export function upazilaFeatureCollection() {
  return {
    type: 'FeatureCollection' as const,
    features: Object.entries(UPAZILA_RINGS).map(([id, rings]) => ({
      type: 'Feature' as const,
      properties: { id },
      geometry: { type: 'MultiPolygon' as const, coordinates: rings.map((r) => [r]) },
    })),
  };
}

/* ------------------------------------------------------------------ */
/* Dashboard theme tokens shared by the SVG maps                       */
/* ------------------------------------------------------------------ */

export type MapTheme = ReturnType<typeof mapTheme>;

export function mapTheme(isDark: boolean) {
  return isDark
    ? {
        chip: 'bg-slate-800/80 text-slate-300 border-slate-700',
        chipHover: 'hover:bg-slate-700',
        muted: 'text-slate-400',
        strong: 'text-white',
        card: 'bg-slate-900/90 border-slate-800 text-white',
        tile: 'bg-slate-800/60 border-slate-700/60',
        border: '#0b1220',
        halo: '#0b1220',
        annot: '#94a3b8',
      }
    : {
        chip: 'bg-white text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
        chipHover: 'hover:bg-slate-50 dark:hover:bg-slate-700',
        muted: 'text-slate-500 dark:text-slate-400',
        strong: 'text-slate-900 dark:text-white',
        card: 'bg-white border-slate-200 text-slate-900 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100',
        tile: 'bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700',
        border: '#ffffff',
        halo: '#ffffff',
        annot: '#64748b',
      };
}
