// Build a small, simplified copy of the real (OpenStreetMap) upazila boundaries for the frontend.
//   node scraper/node/build_map_geometry.mjs
// Input : scraper/config/upazila_boundaries.json  ({ upazilaId: GeoJSON Polygon|MultiPolygon })
// Output: src/data/geo/upazila-boundaries.json    ({ upazilaId: [[ [lng,lat], ... ], ...] }) rings only
import fs from 'node:fs';

const SRC = 'scraper/config/upazila_boundaries.json';
const OUT = 'src/data/geo/upazila-boundaries.json';
const TOLERANCE = 0.0015; // degrees (~150 m) - plenty for a district-scale map

// Douglas-Peucker on planar lon/lat (fine at this scale).
function simplify(points, tol) {
  if (points.length < 4) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = points[a]; const [bx, by] = points[b];
    const dx = bx - ax; const dy = by - ay; const len = Math.hypot(dx, dy) || 1e-12;
    let maxD = 0; let idx = -1;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = points[i];
      const d = Math.abs(dy * px - dx * py + bx * ay - by * ax) / len;
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > tol && idx > 0) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return points.filter((_, i) => keep[i]);
}

// A closed ring has first == last point, so its first chord has zero length; split it in two halves.
function simplifyRing(ring) {
  const mid = Math.floor(ring.length / 2);
  const a = simplify(ring.slice(0, mid + 1), TOLERANCE);
  const b = simplify(ring.slice(mid), TOLERANCE);
  return [...a, ...b.slice(1)];
}

const round = (n) => Math.round(n * 1e5) / 1e5;
const src = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const out = {};
for (const [id, geom] of Object.entries(src)) {
  const polys = geom.type === 'MultiPolygon' ? geom.coordinates : [geom.coordinates];
  // Outer rings only; drop slivers that vanish after simplification.
  out[id] = polys
    .map((poly) => simplifyRing(poly[0]).map(([x, y]) => [round(x), round(y)]))
    .filter((ring) => ring.length >= 4);
}
fs.mkdirSync('src/data/geo', { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out));
const pts = Object.values(out).flat().reduce((n, r) => n + r.length, 0);
console.log(`wrote ${OUT}: ${Object.keys(out).length} upazilas, ${pts} points, ${fs.statSync(OUT).size} bytes`);
