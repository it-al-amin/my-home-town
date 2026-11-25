// Per-union details for the upazila pages:
//   node scraper/node/build_union_details.mjs [bgd_phy_settlements_lged.shp]
// - Census 2011 figures (GO code, area, population, literacy) from each upazila's Banglapedia union table
// - Named villages / hamlets / neighbourhoods from OpenStreetMap (ODbL), placed in a union by its boundary
// - Optional: LGED settlement footprints (HDX "Bangladesh - Settlements"), simplified, one file per upazila
// Needs src/data/geo/union-boundaries.json (build_union_geometry.mjs) first.
// Output: src/data/aggregated/district/union-details.json, src/data/geo/settlements/<upazilaId>.json
import fs from 'node:fs';
import { overpass, AREA } from './overpass.mjs';
import { simplifyRing, round } from './geometry.mjs';

const UA = 'NetrokonaPortalBot/1.0 (community info aggregator)';
const [, , SHP] = process.argv;
const unions = JSON.parse(fs.readFileSync('src/data/geo/union-boundaries.json', 'utf8'));

const BANGLAPEDIA = {
  'netrokona-sadar': 'Netrokona_Sadar_Upazila',
  durgapur: 'Durgapur_Upazila_(Netrokona_District)',
  kalmakanda: 'Kalmakanda_Upazila',
  mohanganj: 'Mohanganj_Upazila',
  khaliajuri: 'Khaliajuri_Upazila',
  kendua: 'Kendua_Upazila',
  madan: 'Madan_Upazila',
  barhatta: 'Barhatta_Upazila',
  atpara: 'Atpara_Upazila',
  purbadhala: 'Purbadhala_Upazila',
};

const norm = (s) => s.toLowerCase().replace(/paurashava|union/g, '').replace(/[^a-z]/g, '');
/** Loose name match: BBS and Banglapedia spell many unions differently (Birisiri / Birishiri). */
const sameName = (a, b) => {
  const x = norm(a); const y = norm(b);
  return x === y || x.startsWith(y) || y.startsWith(x) || x.slice(0, 5) === y.slice(0, 5);
};

const inRing = ([x, y], r) => {
  let c = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i]; const [xj, yj] = r[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const findUnion = (pt) => {
  for (const [upazilaId, list] of Object.entries(unions)) {
    for (const u of list) if (u.rings.some((r) => inRing(pt, r))) return { upazilaId, name: u.name };
  }
  return null;
};

const details = {};
const entry = (upazilaId, name) => ((details[upazilaId] ||= {})[name] ||= { villages: [] });

// 1. Banglapedia census table: "<Union name> <GO code> <area acre> <male> <female> <literacy %>"
for (const [upazilaId, page] of Object.entries(BANGLAPEDIA)) {
  const res = await fetch(`https://en.banglapedia.org/index.php/${page}`, { headers: { 'User-Agent': UA } });
  const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/\s+/g, ' ');
  const head = text.indexOf('Name of union and GO code');
  const start = text.indexOf('Male Female', head) + 'Male Female'.length;
  const table = text.slice(start, start + 2500);
  const rows = [...table.matchAll(/([A-Z][A-Za-z.' ]*?[a-z]) (\d{1,3}) (\d{3,6}) (\d{3,6}) (\d{3,6}) (\d{1,2}(?:\.\d+)?)/g)];
  let matched = 0;
  for (const [, name, go, acre, male, female, lit] of rows) {
    const u = unions[upazilaId]?.find((x) => !/Paurashava/.test(x.name) && sameName(x.name, name));
    if (!u) { console.warn(`  ${upazilaId}: no boundary for Banglapedia union "${name}"`); continue; }
    Object.assign(entry(upazilaId, u.name), {
      goCode: +go, areaAcre: +acre, male: +male, female: +female, literacyPct: +lit,
    });
    matched++;
  }
  console.log(`${upazilaId}: ${matched} union census rows`);
  await new Promise((r) => setTimeout(r, 1500));
}

// 2. OpenStreetMap named places.
const osm = await overpass(AREA + 'node(area.a)["place"~"^(village|hamlet|suburb|neighbourhood|town)$"]["name"];out body;');
let placed = 0;
for (const e of osm.elements) {
  const hit = findUnion([e.lon, e.lat]);
  if (!hit) continue;
  const en = e.tags['name:en'] || (/^[\x00-\x7F]+$/.test(e.tags.name) ? e.tags.name : '');
  const bn = e.tags['name:bn'] || (/[ঀ-৿]/.test(e.tags.name) ? e.tags.name : '');
  entry(hit.upazilaId, hit.name).villages.push({ en: en || bn, bn: bn || en, place: e.tags.place, lat: round(e.lat), lng: round(e.lon) });
  placed++;
}
console.log(`OSM: ${placed} named places inside unions`);

// 3. LGED settlement footprints (optional - 220 MB shapefile).
if (SHP) {
  const dbf = fs.readFileSync(SHP.replace(/\.shp$/i, '.dbf'));
  const shp = fs.readFileSync(SHP);
  const nRec = dbf.readUInt32LE(4); const hLen = dbf.readUInt16LE(8); const rLen = dbf.readUInt16LE(10);
  // PathName field: offset of the field after TYPE(9) and NEW_ID(10), +1 for the deletion flag.
  const pathOff = 1 + 9 + 10; const pathLen = 250;
  const byUpazila = {};
  let pos = 100; let kept = 0;
  for (let i = 0; i < nRec && pos < shp.length; i++) {
    const contentLen = shp.readInt32BE(pos + 4) * 2;
    const rec = pos + 8; pos = rec + contentLen;
    const pathName = dbf.toString('latin1', hLen + i * rLen + pathOff, hLen + i * rLen + pathOff + pathLen);
    if (!/\\Netrokona\\/i.test(pathName)) continue;
    if (shp.readInt32LE(rec) !== 5) continue; // polygon
    const nParts = shp.readInt32LE(rec + 36); const nPts = shp.readInt32LE(rec + 40);
    const ptsAt = rec + 44 + nParts * 4;
    const end = nParts > 1 ? shp.readInt32LE(rec + 48) : nPts; // outer ring only
    const ring = [];
    for (let p = 0; p < end; p++) ring.push([shp.readDoubleLE(ptsAt + p * 16), shp.readDoubleLE(ptsAt + p * 16 + 8)]);
    const c = ring.reduce((a, [x, y]) => [a[0] + x / ring.length, a[1] + y / ring.length], [0, 0]);
    const hit = findUnion(c);
    if (!hit) continue;
    const simple = simplifyRing(ring, 0.00025).map(([x, y]) => [round(x), round(y)]);
    if (simple.length < 4) continue;
    (byUpazila[hit.upazilaId] ||= {})[hit.name] ||= [];
    byUpazila[hit.upazilaId][hit.name].push(simple);
    entry(hit.upazilaId, hit.name).settlements = (entry(hit.upazilaId, hit.name).settlements || 0) + 1;
    kept++;
  }
  fs.mkdirSync('src/data/geo/settlements', { recursive: true });
  for (const [id, data] of Object.entries(byUpazila)) {
    const f = `src/data/geo/settlements/${id}.json`;
    fs.writeFileSync(f, JSON.stringify(data));
    console.log(`  ${f}: ${(fs.statSync(f).size / 1024).toFixed(0)} KB`);
  }
  console.log(`LGED: ${kept} settlement footprints`);
}

for (const list of Object.values(details)) for (const d of Object.values(list)) d.villages.sort((a, b) => a.en.localeCompare(b.en));
const OUT = 'src/data/aggregated/district/union-details.json';
fs.writeFileSync(OUT, JSON.stringify({ fetchedAt: new Date().toISOString(), census: 2011, unions: details }, null, 1));
console.log(`wrote ${OUT}`);
