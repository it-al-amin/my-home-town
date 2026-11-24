// District-profile scraper: official + encyclopaedic sources for Netrokona.
//
//   node scraper/node/district_sources.mjs            # all sources
//   node scraper/node/district_sources.mjs gov wiki   # only some (gov | gallery | wiki | banglapedia)
//
// Writes src/data/aggregated/district/*.json, which the React app imports at build time.
//
// Sources
//   gov          netrokona.gov.bd  /pages/tourist-spot (+ each detail page): name, location, how to get there,
//                description and the REAL photos the district administration publishes.
//   gallery      netrokona.gov.bd  /pages/photo-galleries: latest albums of district-administration activity.
//   wiki         bn.wikipedia.org  "নেত্রকোণা জেলা": intro text (CC BY-SA) + openly-licensed Wikimedia Commons
//                photos used on the article, with author + licence for attribution.
//   banglapedia  en.banglapedia.org "Netrokona District": FACTS only (census table, rivers, institution counts,
//                income mix...). Banglapedia prose is "All rights reserved", so no paragraphs are copied.
//
// Rules: one polite request at a time (1.5 s gap), own User-Agent, no login/captcha bypass, TLS verification on.
// A source that fails (network, markup change, sanity check) keeps its previous JSON untouched and the error is
// recorded in status.json - the live site never loses data because of one bad run.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// netrokona.gov.bd serves its leaf certificate WITHOUT the Sectigo "DV R36" intermediate, so strict TLS
// clients fail with UNABLE_TO_VERIFY_LEAF_SIGNATURE. We do NOT disable verification: the public intermediate
// is shipped in scraper/config/certs and added to Node's trust chain (it must be set before Node starts).
const EXTRA_CA = 'scraper/config/certs/sectigo-dv-r36.pem';
if (!process.env.NODE_EXTRA_CA_CERTS && fs.existsSync(EXTRA_CA)) {
  const r = spawnSync(process.execPath, process.argv.slice(1), {
    stdio: 'inherit',
    env: { ...process.env, NODE_EXTRA_CA_CERTS: path.resolve(EXTRA_CA) },
  });
  process.exit(r.status ?? 1);
}

const OUT_DIR = 'src/data/aggregated/district';
const CONFIG = JSON.parse(fs.readFileSync('scraper/config/district_sources.json', 'utf8'));
const UA = 'NetrokonaPortalBot/1.0 (community information portal; respects robots.txt)';
const GOV = 'https://netrokona.gov.bd';
const DELAY_MS = 1500;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let lastRequest = 0;
async function get(url, { json = false } = {}) {
  const wait = lastRequest + DELAY_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastRequest = Date.now();
  for (let attempt = 1; attempt <= 4; attempt++) {
    let wait = 3000 * attempt;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'bn,en;q=0.8' }, signal: AbortSignal.timeout(30000) });
      if (res.status === 429 || res.status >= 500) {
        // Honour Retry-After (seconds) when rate-limited; otherwise back off 15 s, 30 s, 45 s…
        const ra = Number(res.headers.get('retry-after'));
        wait = res.status === 429 ? (Number.isFinite(ra) && ra > 0 ? ra * 1000 : 15000 * attempt) : wait;
        throw new Error(`HTTP ${res.status}`);
      }
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return json ? await res.json() : await res.text();
    } catch (e) {
      if (attempt === 4) throw e;
      await sleep(Math.min(wait, 120000));
    }
  }
}

/* ----------------------------- helpers ----------------------------- */

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };
const decode = (s) =>
  s.replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : +e.slice(1));
    return ENTITIES[e.toLowerCase()] ?? m;
  });
const stripTags = (s) => s.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n\n').replace(/<[^>]+>/g, '');
const clean = (s) =>
  stripTags(decode(decode(s ?? ''))) // gov.bd double-escapes its rich text
    .normalize('NFC') // য় / ড় / ঢ় have two Unicode spellings; NFC makes comparisons reliable
    .replace(/[ \t ]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
const absolute = (href) => (href.startsWith('http') ? href : GOV + encodeURI(decodeURI(href)));
const uniq = (arr) => [...new Set(arr)];
/** The main content widget of a gov.bd page (menus and the feedback form are excluded). */
function contentRegion(html) {
  const start = html.indexOf('class="widget title-with-image-content-widget');
  const from = start === -1 ? 0 : start;
  const end = html.indexOf('শেয়ার করতে ক্লিক করুন', from);
  return html.slice(from, end === -1 ? undefined : end);
}
const OBJECT_STORAGE = /https:\/\/objectstorage\.[^"'\s)]+?\.(?:jpe?g|png|webp)/gi;
const toNumber = (s) => Number(String(s).replace(/,/g, '').trim());

/**
 * gov.bd occasionally serves broken uploads (e.g. a 457-byte "jpg"). Keep only real images: HEAD request,
 * image/* content type and at least MIN_IMAGE_BYTES. Object storage is a separate host, so a short gap is enough.
 */
const MIN_IMAGE_BYTES = 3000;
const imageCache = new Map();
async function isRealImage(url) {
  if (imageCache.has(url)) return imageCache.get(url);
  let ok = false;
  try {
    await sleep(250);
    const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(20000) });
    const type = res.headers.get('content-type') ?? '';
    const size = Number(res.headers.get('content-length') ?? 0);
    ok = res.ok && type.startsWith('image/') && size >= MIN_IMAGE_BYTES;
  } catch {
    ok = false;
  }
  imageCache.set(url, ok);
  return ok;
}
async function realImages(urls) {
  const out = [];
  for (const u of urls) if (await isRealImage(u)) out.push(u);
  return out;
}

function writeJson(name, data) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, name), JSON.stringify(data, null, 2) + '\n');
}
function readJson(name, fallback) {
  try {
    return JSON.parse(fs.readFileSync(path.join(OUT_DIR, name), 'utf8'));
  } catch {
    return fallback;
  }
}
function assert(cond, msg) {
  if (!cond) throw new Error('sanity check failed: ' + msg);
}

/* ------------------- 1. netrokona.gov.bd tourist spots ------------------- */

async function scrapeGovTouristSpots() {
  const listUrl = `${GOV}/pages/tourist-spot`;
  const html = await get(listUrl);
  const rows = html.split('<tr class="table-tr">').slice(1).filter((r) => r.includes('data-column="title"'));
  const spots = [];
  for (const row of rows) {
    const cell = (col) => clean((row.match(new RegExp(`data-column="${col}">([\\s\\S]*?)</td>`)) || [])[1]);
    const title = cell('title');
    const href = (row.match(/href="(\/pages\/tourist-spot\/[^"]+)"/) || [])[1];
    if (!title || !href) continue;
    const listImages = uniq(row.match(OBJECT_STORAGE) ?? []);

    // Detail page: full description + any extra images.
    let description = '';
    let images = listImages;
    try {
      const detail = await get(absolute(href));
      const main = contentRegion(detail);
      const blocks = [...main.matchAll(/<rt-renderer[^>]*>([\s\S]*?)<\/rt-renderer>/g)].map((m) => clean(m[1]));
      description = blocks.sort((a, b) => b.length - a.length)[0] ?? '';
      images = uniq([...listImages, ...(main.match(OBJECT_STORAGE) ?? [])]);
    } catch (e) {
      console.warn('  detail failed:', title, e.message);
    }

    const transportation = cell('transportation');
    const contact = cell('contact');
    spots.push({
      govId: href.split('-').pop(),
      titleBn: title,
      locationBn: cell('location'),
      transportationBn: transportation,
      contact: contact && contact !== '0' ? contact : undefined,
      descriptionBn: description.length > transportation.length ? description : '',
      images: await realImages(images),
      sourceUrl: absolute(href),
      placeId: matchPlace(title),
    });
  }
  assert(spots.length >= 3, `only ${spots.length} tourist spots parsed`);
  return { sourceUrl: listUrl, spots };
}

function matchPlace(titleBn) {
  for (const [placeId, patterns] of Object.entries(CONFIG.placeMatch)) {
    if (patterns.some((p) => titleBn.includes(p.normalize('NFC')))) return placeId;
  }
  return undefined;
}

/* ------------------- 2. netrokona.gov.bd photo gallery ------------------- */

async function scrapeGovGallery() {
  const albums = [];
  const seen = new Set();
  for (let page = 1; page <= CONFIG.gallery.pages; page++) {
    const listUrl = `${GOV}/pages/photo-galleries${page > 1 ? `?page=${page}` : ''}`;
    const html = await get(listUrl);
    const cards = html.split('list-card-body').slice(1);
    for (const card of cards) {
      const href = (card.match(/href="(\/pages\/photo-galleries\/[^"]+)"/) || [])[1];
      const titleBn = clean((card.match(/<p class="list-card-title">([\s\S]*?)<\/p>/) || [])[1]);
      const cover = (card.match(OBJECT_STORAGE) || [])[0];
      if (!href || !titleBn || seen.has(href)) continue;
      seen.add(href);
      let images = cover ? [cover] : [];
      try {
        const detail = await get(absolute(href));
        // Album pages hold only that album's photos (site chrome uses /site-assets images).
        images = uniq([...images, ...(detail.match(OBJECT_STORAGE) ?? [])]);
      } catch (e) {
        console.warn('  album failed:', titleBn.slice(0, 40), e.message);
      }
      images = (await realImages(images)).slice(0, CONFIG.gallery.maxImagesPerAlbum);
      if (!images.length) continue;
      // Upload path carries year/month: .../office-netrokona/2026/6/<uuid>.jpg
      const ym = images[0].match(/office-netrokona\/(\d{4})\/(\d{1,2})\//);
      albums.push({
        id: href.split('-').pop(),
        titleBn,
        uploaded: ym ? `${ym[1]}-${ym[2].padStart(2, '0')}` : undefined,
        images,
        sourceUrl: absolute(href),
      });
    }
  }
  assert(albums.length >= 3, `only ${albums.length} gallery albums parsed`);
  return { sourceUrl: `${GOV}/pages/photo-galleries`, albums };
}

/* ------------------- 3. Bengali Wikipedia + Commons ------------------- */

const OPEN_LICENCE = /^(CC[ -]|Public domain|PD|GFDL|CC0)/i;
const SKIP_FILE = /\.svg$|map|locator|geocode|logo|icon|flag|emblem/i;

async function commonsInfo(titles) {
  const out = [];
  for (let i = 0; i < titles.length; i += 25) {
    const q = new URLSearchParams({
      action: 'query', format: 'json', prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiurlwidth: '1600',
      titles: titles.slice(i, i + 25).join('|'), origin: '*',
    });
    const j = await get(`https://commons.wikimedia.org/w/api.php?${q}`, { json: true });
    for (const p of Object.values(j.query?.pages ?? {})) {
      const ii = p.imageinfo?.[0];
      if (!ii) continue;
      const md = ii.extmetadata ?? {};
      const licence = clean(md.LicenseShortName?.value);
      if (!OPEN_LICENCE.test(licence) || ii.width < 800) continue;
      out.push({
        file: p.title,
        title: p.title.replace(/^File:/, '').replace(/\.[a-z]+$/i, '').replace(/_/g, ' '),
        url: ii.thumburl || ii.url,
        width: ii.thumbwidth || ii.width,
        height: ii.thumbheight || ii.height,
        pageUrl: ii.descriptionurl,
        // "Name (talk)" → "Name": drop the wiki user-talk link text
        author: (() => {
          const a = clean(md.Artist?.value).split('\n')[0].replace(/\s*\((?:talk|আলাপ)\)/gi, '').trim()
            .replace(/^(.+?)\1$/, '$1'); // Commons sometimes repeats the text ("Unknown authorUnknown author")
          return /^unknown author$/i.test(a) || !a ? 'অজ্ঞাত (Wikimedia Commons)' : a.slice(0, 80);
        })(),
        licence,
        licenceUrl: md.LicenseUrl?.value,
        description: clean(md.ImageDescription?.value).slice(0, 220),
      });
    }
  }
  return out;
}

async function scrapeWikipedia() {
  const page = CONFIG.wikipedia.page;
  const api = 'https://bn.wikipedia.org/w/api.php';
  const q = new URLSearchParams({
    action: 'query', format: 'json', redirects: '1', titles: page,
    prop: 'extracts|info|revisions|images', explaintext: '1', exintro: '1', inprop: 'url', rvprop: 'timestamp', imlimit: '100',
  });
  const j = await get(`${api}?${q}`, { json: true });
  const p = Object.values(j.query.pages)[0];
  assert(p && !('missing' in p), 'page missing');
  const intro = clean(p.extract);
  assert(intro.length > 200, 'intro too short');

  // bn.wikipedia returns localised namespaces ("চিত্র:"); Commons needs "File:".
  const files = (p.images ?? []).map((x) => 'File:' + x.title.replace(/^[^:]+:/, '')).filter((t) => !SKIP_FILE.test(t));
  const photos = await commonsInfo(files);

  // Extra photos for places the article does not show (Commons full-text search, files only).
  const placePhotos = {};
  for (const [placeId, query] of Object.entries(CONFIG.wikipedia.placeSearch)) {
    const sq = new URLSearchParams({ action: 'query', format: 'json', list: 'search', srsearch: query, srnamespace: '6', srlimit: '6' });
    try {
      const s = await get(`https://commons.wikimedia.org/w/api.php?${sq}`, { json: true });
      const must = new RegExp(query.split(' ')[0], 'i'); // the file name itself must name the place
      const titles = (s.query?.search ?? []).map((x) => x.title).filter((t) => !SKIP_FILE.test(t) && must.test(t));
      placePhotos[placeId] = (await commonsInfo(titles)).slice(0, 4);
    } catch (e) {
      console.warn('  commons search failed:', placeId, e.message);
    }
  }

  return {
    title: p.title,
    sourceUrl: p.fullurl,
    lastEdited: p.revisions?.[0]?.timestamp,
    licence: 'CC BY-SA 4.0',
    introBn: intro,
    photos,
    placePhotos,
  };
}

/* ------------------- 3b. Wikipedia profiles (people, places, topics) ------------------- */

// For every entry in CONFIG.wikiProfiles: the article's introduction (CC BY-SA) and its lead photo
// when that photo is on Wikimedia Commons under an open licence (fair-use images are skipped).
async function scrapeWikiProfiles() {
  const entries = Object.entries(CONFIG.wikiProfiles);
  const profiles = {};
  for (let i = 0; i < entries.length; i += 15) {
    const batch = entries.slice(i, i + 15);
    const q = new URLSearchParams({
      action: 'query', format: 'json', redirects: '1', titles: batch.map(([, t]) => t).join('|'),
      prop: 'extracts|pageimages|info', exintro: '1', explaintext: '1', exlimit: 'max',
      piprop: 'name|thumbnail', pithumbsize: '480', pilimit: 'max', inprop: 'url',
    });
    const j = await get(`https://bn.wikipedia.org/w/api.php?${q}`, { json: true });
    // requested title → final title (normalisation + redirects)
    const resolve = (t) => {
      let x = t;
      for (const n of j.query.normalized ?? []) if (n.from === x) x = n.to;
      for (const r of j.query.redirects ?? []) if (r.from === x) x = r.to;
      return x;
    };
    const byTitle = Object.fromEntries(Object.values(j.query.pages).map((p) => [p.title, p]));
    for (const [id, title] of batch) {
      const p = byTitle[resolve(title)];
      if (!p || 'missing' in p) continue;
      profiles[id] = { title: p.title, url: p.fullurl, extract: clean(p.extract), lastEdited: p.touched };
      // Only Commons-hosted, openly licensed photos.
      if (p.pageimage && p.thumbnail?.source?.includes('/wikipedia/commons/')) {
        const [info] = await commonsInfo([`File:${p.pageimage}`]);
        if (info) profiles[id].image = { url: p.thumbnail.source, author: info.author, licence: info.licence, pageUrl: info.pageUrl };
      }
    }
  }
  assert(Object.keys(profiles).length >= entries.length / 2, `only ${Object.keys(profiles).length}/${entries.length} profiles`);
  return { licence: 'CC BY-SA 4.0', profiles };
}

/* ------------------- 4. Banglapedia (facts only) ------------------- */

async function scrapeBanglapedia() {
  const url = CONFIG.banglapedia.url;
  const html = await get(url);
  const body = html.slice(html.indexOf('mw-content-text'));
  const text = clean(body.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<\/(tr|td|th|h\d|li)>/g, (m) => m + '\n'));
  const para = (label) => {
    const m = text.match(new RegExp(label + '\\s+([^\\n]+)'));
    return m ? m[1].trim() : '';
  };
  const num = (re) => {
    const m = text.match(re);
    return m ? toNumber(m[1]) : undefined;
  };

  // Upazila census table: each row "Name\nArea\nMunicipality\nUnion\nMouza\nVillage\nPopulation\nDensity\nLiteracy"
  const tableRows = [...body.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((m) =>
    [...m[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((c) => clean(c[1])),
  );
  const upazilas = tableRows
    .filter((r) => r.length === 9 && /^[A-Z][a-z]+( Sadar)?$/.test(r[0]) && !/Name/.test(r[0]))
    .map(([name, area, municipality, unions, mouzas, villages, population, density, literacy]) => ({
      name,
      areaKm2: toNumber(area),
      municipalities: municipality === '-' ? 0 : toNumber(municipality),
      unions: toNumber(unions),
      mouzas: toNumber(mouzas),
      villages: toNumber(villages),
      population: toNumber(population),
      densityPerKm2: toNumber(density),
      literacyPct: toNumber(literacy),
    }));

  const districtRow = tableRows.find((r) => r.length >= 10 && toNumber(r[0]) > 2000 && toNumber(r[0]) < 3000);
  const income = Object.fromEntries(
    [...para('Main sources of income').matchAll(/([A-Za-z ,-]+?)\s+([\d.]+)%/g)].map((m) => [m[1].replace(/^[\s,]*(and\s+)?/, '').trim(), +m[2]]),
  );
  const count = (label) => num(new RegExp(label + '\\s+(\\d+)'));

  const facts = {
    sourceUrl: url,
    lastEdited: (text.match(/last edited on ([^,]+ \d{4})/) || [])[1],
    censusYear: 2011,
    areaKm2: num(/area\s+([\d.]+)\s*km/i),
    latitude: (text.match(/between\s+([\d°' ]+N?)\s*and\s*([\d°' ]+)\s*north latitudes/) || []).slice(1, 3).map((s) => s.trim()),
    longitude: (text.match(/between\s+([\d°' ]+)\s*and\s*([\d°' ]+)\s*east longitudes/) || []).slice(1, 3).map((s) => s.trim()),
    population: {
      total: num(/Population Total\s+([\d,]+)/),
      male: num(/male\s+([\d,]+)/),
      female: num(/female\s+([\d,]+)/),
      urban: districtRow ? toNumber(districtRow[6]) : undefined,
      rural: districtRow ? toNumber(districtRow[7]) : undefined,
      densityPerKm2: districtRow ? toNumber(districtRow[8]) : undefined,
      literacyPct: districtRow ? toNumber(districtRow[9]) : undefined,
    },
    administration: districtRow
      ? { upazilas: toNumber(districtRow[1]), municipalities: toNumber(districtRow[2]), unions: toNumber(districtRow[3]), mouzas: toNumber(districtRow[4]), villages: toNumber(districtRow[5]) }
      : undefined,
    subdivisionFormed: num(/Sub-division was formed in (\d{4})/),
    districtFormed: num(/turned into a district in (\d{4})/),
    mainRivers: ((para('Water bodies').match(/Main rivers:\s*([^.]+)/) || [])[1] ?? '').split(',').map((s) => s.trim()).filter(Boolean),
    institutions: {
      college: count('college'),
      secondarySchool: count('secondary school'),
      primarySchool: count('primary school'),
      madrasa: count('madrasa'),
    },
    literacy: {
      averagePct: num(/Average literacy\s+([\d.]+)%/),
      malePct: num(/Average literacy\s+[\d.]+%;\s*male\s+([\d.]+)%/),
      femalePct: num(/Average literacy[^\n]*?female\s+([\d.]+)%/),
    },
    incomeSharePct: income,
    indigenousCommunities: ['Garo', 'Hajong', 'Hodi', 'Banai'].filter((n) => new RegExp(n, 'i').test(text)),
    upazilas,
  };
  assert(facts.areaKm2 > 2000, 'area not found');
  assert(upazilas.length === 10, `expected 10 upazila rows, got ${upazilas.length}`);
  return facts;
}

/* ------------------------------ runner ------------------------------ */

const JOBS = {
  gov: ['gov-tourist-spots.json', scrapeGovTouristSpots],
  gallery: ['gov-photo-gallery.json', scrapeGovGallery],
  wiki: ['wikipedia.json', scrapeWikipedia],
  profiles: ['wiki-profiles.json', scrapeWikiProfiles],
  banglapedia: ['banglapedia.json', scrapeBanglapedia],
};

const wanted = process.argv.slice(2).filter((a) => JOBS[a]);
const status = readJson('status.json', { sources: {} });
let failures = 0;
for (const key of wanted.length ? wanted : Object.keys(JOBS)) {
  const [file, fn] = JOBS[key];
  const started = new Date().toISOString();
  process.stdout.write(`- ${key} ... `);
  try {
    const data = await fn();
    writeJson(file, { fetchedAt: started, ...data });
    status.sources[key] = { ok: true, file, lastSuccess: started, lastAttempt: started };
    console.log('ok');
  } catch (e) {
    failures++;
    status.sources[key] = { ...(status.sources[key] ?? {}), ok: false, file, lastAttempt: started, error: String(e.message ?? e).slice(0, 300) };
    console.log('FAILED (previous data kept):', e.message);
  }
}
status.updatedAt = new Date().toISOString();
writeJson('status.json', status);
process.exitCode = failures ? 1 : 0;
