// Crawl Wikimedia Commons category trees for Netrokona and attach openly-licensed photos to a location
// (upazila / union / place) taken from the category path. Only CC / public-domain files are kept.
import fs from 'node:fs';
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = { 'User-Agent': 'NetrokonaPortalBot/1.0 (community info aggregator)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function api(params) {
  const body = new URLSearchParams({ format: 'json', ...params });
  for (let i = 0; i < 6; i++) {
    try { const r = await fetch(API, { method: 'POST', body, headers: UA }); if (r.ok) return await r.json(); console.log('http', r.status); if (r.status === 429) await sleep(15000 * (i + 1)); } catch (e) { console.log(e.message); }
    await sleep(2000 * (i + 1));
  }
  throw new Error('commons failed ' + JSON.stringify(params));
}
async function members(cat) {
  const out = []; let cont = {};
  do {
    const j = await api({ action: 'query', list: 'categorymembers', cmtitle: cat, cmlimit: '500', cmtype: 'file|subcat', ...cont });
    out.push(...(j.query?.categorymembers ?? [])); cont = j.continue ?? null;
  } while (cont);
  return out;
}
const UPAZILAS = {
  'netrokona-sadar': ['Netrokona', 'Netrokona Sadar'], durgapur: ['Durgapur Upazila, Netrokona'], kalmakanda: ['Kalmakanda Upazila'],
  purbadhala: ['Purbadhala Upazila'], kendua: ['Kendua Upazila'], barhatta: ['Barhatta Upazila'], atpara: ['Atpara Upazila'],
  madan: ['Madan Upazila'], mohanganj: ['Mohanganj Upazila', 'Mohanganj'], khaliajuri: ['Khaliajuri Upazila', 'Khaliajuri'],
};
const SKIP = /\.svg$|map|geocode|locator|flag|logo|emblem|coat of arms|\.pdf$|\.ogg|\.webm|\.tif/i;
const seenCats = new Set();
const files = new Map(); // title -> {upazilaId, path}
async function walk(cat, upazilaId, path, depth) {
  if (seenCats.has(cat) || depth > 3) return;
  seenCats.add(cat);
  let m; try { m = await members(cat); } catch { return; }
  for (const x of m) {
    if (x.ns === 6 && !SKIP.test(x.title) && !files.has(x.title)) files.set(x.title, { upazilaId, path });
    else if (x.ns === 14 && !/Maps? of|Flags?|Mauza|Mahallah|Politicians|People/i.test(x.title)) {
      await walk(x.title, upazilaId, [...path, x.title.replace('Category:', '')], depth + 1);
    }
  }
}
for (const [id, cats] of Object.entries(UPAZILAS)) for (const c of cats) await walk('Category:' + c, id, [c], 0);
console.log('files found', files.size);

const OPEN = /^(CC[ -]|Public domain|PD|GFDL)/i;
const strip = (s) => (s ?? '').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim();
const titles = [...files.keys()]; const photos = [];
for (let i = 0; i < titles.length; i += 20) {
  const j = await api({ action: 'query', prop: 'imageinfo', iiprop: 'url|extmetadata|size', iiurlwidth: '960', titles: titles.slice(i, i + 20).join('|') });
  for (const p of Object.values(j.query?.pages ?? {})) {
    const ii = p.imageinfo?.[0]; if (!ii) continue;
    const md = ii.extmetadata ?? {}; const lic = strip(md.LicenseShortName?.value);
    if (!OPEN.test(lic) || ii.width < 500) continue;
    const meta = files.get(p.title);
    photos.push({
      title: p.title.replace(/^File:/, '').replace(/\.[a-z]+$/i, '').replace(/_/g, ' '), url: ii.thumburl || ii.url,
      pageUrl: ii.descriptionurl, credit: strip(md.Artist?.value).slice(0, 80) || 'Wikimedia Commons contributor', license: lic,
      description: strip(md.ImageDescription?.value).slice(0, 200), upazilaId: meta.upazilaId, path: meta.path,
    });
  }
  await sleep(2500);
}
fs.writeFileSync(process.argv[2], JSON.stringify(photos, null, 1));
const by = {}; photos.forEach((p) => (by[p.upazilaId] = (by[p.upazilaId] ?? 0) + 1));
console.log('open-licensed photos', photos.length, by);
