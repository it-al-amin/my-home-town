// Build a small, simplified copy of the real (OpenStreetMap) upazila boundaries for the frontend.
//   node scraper/node/build_map_geometry.mjs
// Input : scraper/config/upazila_boundaries.json  ({ upazilaId: GeoJSON Polygon|MultiPolygon })
// Output: src/data/geo/upazila-boundaries.json    ({ upazilaId: [[ [lng,lat], ... ], ...] }) rings only
import fs from 'node:fs';
import { simplifyRing, round } from './geometry.mjs';

const SRC = 'scraper/config/upazila_boundaries.json';
const OUT = 'src/data/geo/upazila-boundaries.json';
const TOLERANCE = 0.0015; // degrees (~150 m) - plenty for a district-scale map

const src = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const out = {};
for (const [id, geom] of Object.entries(src)) {
  const polys = geom.type === 'MultiPolygon' ? geom.coordinates : [geom.coordinates];
  // Outer rings only; drop slivers that vanish after simplification.
  out[id] = polys
    .map((poly) => simplifyRing(poly[0], TOLERANCE).map(([x, y]) => [round(x), round(y)]))
    .filter((ring) => ring.length >= 4);
}
fs.mkdirSync('src/data/geo', { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out));
const pts = Object.values(out).flat().reduce((n, r) => n + r.length, 0);
console.log(`wrote ${OUT}: ${Object.keys(out).length} upazilas, ${pts} points, ${fs.statSync(OUT).size} bytes`);
