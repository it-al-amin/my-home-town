// Build simplified union (ADM4) boundaries for every Netrokona upazila.
//   node scraper/node/build_union_geometry.mjs <geoBoundaries-BGD-ADM4_simplified.geojson>
// Source : geoBoundaries gbOpen BGD ADM4 (Bangladesh Bureau of Statistics / OCHA ROAP, CC BY 3.0 IGO)
//          https://www.geoboundaries.org/api/current/gbOpen/BGD/ADM4/
// Output : src/data/geo/union-boundaries.json  ({ upazilaId: [{ name, rings: [[ [lng,lat], ... ]] }] })
// A union belongs to the upazila whose OpenStreetMap outline contains its centre.
import fs from 'node:fs';
import { simplifyRing, round } from './geometry.mjs';

const [, , SRC] = process.argv;
if (!SRC) throw new Error('usage: node scraper/node/build_union_geometry.mjs <ADM4 geojson>');
const OUT = 'src/data/geo/union-boundaries.json';
const TOLERANCE = 0.0004; // degrees (~40 m) - unions are drawn on their own at upazila scale

const upazilas = JSON.parse(fs.readFileSync('src/data/geo/upazila-boundaries.json', 'utf8'));
const inRing = ([x, y], r) => {
  let c = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i]; const [xj, yj] = r[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

const out = {};
for (const f of JSON.parse(fs.readFileSync(SRC, 'utf8')).features) {
  const polys = f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : [f.geometry.coordinates];
  const outer = polys.reduce((a, p) => (p[0].length > a.length ? p[0] : a), []);
  const centre = outer.reduce((a, [x, y]) => [a[0] + x / outer.length, a[1] + y / outer.length], [0, 0]);
  const upazilaId = Object.keys(upazilas).find((id) => upazilas[id].some((r) => inRing(centre, r)));
  if (!upazilaId) continue;
  const rings = polys
    .map((p) => simplifyRing(p[0], TOLERANCE).map(([x, y]) => [round(x), round(y)]))
    .filter((r) => r.length >= 4);
  (out[upazilaId] ||= []).push({ name: f.properties.shapeName, rings });
}
for (const list of Object.values(out)) list.sort((a, b) => a.name.localeCompare(b.name));

fs.writeFileSync(OUT, JSON.stringify(out));
const n = Object.values(out).reduce((a, l) => a + l.length, 0);
console.log(`wrote ${OUT}: ${n} unions in ${Object.keys(out).length} upazilas, ${fs.statSync(OUT).size} bytes`);
