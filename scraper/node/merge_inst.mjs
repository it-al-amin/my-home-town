import fs from 'node:fs';
const [,, instFile, outFile] = process.argv;
const raw = JSON.parse(fs.readFileSync(instFile, 'utf8')).elements;
const bounds = JSON.parse(fs.readFileSync('../config/upazila_boundaries.json', 'utf8'));
const ring = (pt, r) => { let c = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const [xi, yi] = r[i], [xj, yj] = r[j]; if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c; } return c; };
const inPoly = (pt, polys) => polys.some((p) => ring(pt, p[0]) && !p.slice(1).some((h) => ring(pt, h)));
const polysOf = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates);
const upazilaOf = (lon, lat) => Object.entries(bounds).find(([, g]) => inPoly([lon, lat], polysOf(g)))?.[0] ?? null;
const BN = /[ঀ-৿]/;
const stats = { total: raw.length, outside: 0, keys: {} };
const out = [];
for (const el of raw) {
  const t = el.tags ?? {}; const c = el.center ?? (el.lat ? { lat: el.lat, lon: el.lon } : null);
  const nm = t.name || t['name:bn'] || t['name:en']; if (!c || !nm) continue;
  const up = upazilaOf(c.lon, c.lat); if (!up) { stats.outside++; continue; }
  Object.keys(t).forEach((k) => { if (/addr|union|is_in|ward|village/.test(k)) stats.keys[k] = (stats.keys[k] ?? 0) + 1; });
  out.push({ el, t, c, up, nm });
}
console.log(stats, 'inside', out.length);
fs.writeFileSync(outFile, JSON.stringify(out));
const by = {}; out.forEach((o) => (by[o.up] = (by[o.up] ?? 0) + 1)); console.log(by);
