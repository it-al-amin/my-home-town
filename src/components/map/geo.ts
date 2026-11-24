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

const allPoints = Object.values(UPAZILA_RINGS).flat(2);
const lngs = allPoints.map((p) => p[0]);
const lats = allPoints.map((p) => p[1]);
export const BOUNDS = {
  minLng: Math.min(...lngs),
  maxLng: Math.max(...lngs),
  minLat: Math.min(...lats),
  maxLat: Math.max(...lats),
};
// Equirectangular with cos(lat) correction - accurate enough for a 70 km wide district.
const K = Math.cos((((BOUNDS.minLat + BOUNDS.maxLat) / 2) * Math.PI) / 180);

export interface ProjectedUpazila {
  id: string;
  path: string;
  centroid: { x: number; y: number };
}

export function projectDistrict(width: number, height: number, pad = 24) {
  const spanX = (BOUNDS.maxLng - BOUNDS.minLng) * K;
  const spanY = BOUNDS.maxLat - BOUNDS.minLat;
  const scale = Math.min((width - pad * 2) / spanX, (height - pad * 2) / spanY);
  const offX = (width - spanX * scale) / 2;
  const offY = (height - spanY * scale) / 2;
  const project = ([lng, lat]: [number, number]): [number, number] => [
    offX + (lng - BOUNDS.minLng) * K * scale,
    offY + (BOUNDS.maxLat - lat) * scale,
  ];

  const upazilas: ProjectedUpazila[] = Object.entries(UPAZILA_RINGS).map(([id, rings]) => {
    let path = '';
    // Area-weighted centroid of the largest ring (shoelace formula).
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
    return { id, path, centroid: { x: best.x, y: best.y } };
  });

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
