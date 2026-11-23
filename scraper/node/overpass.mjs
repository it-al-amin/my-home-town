// Shared Overpass helper (polite: own UA, retries, mirror fallback). Node 18+.
const UA = 'NetrokonaPortalBot/1.0 (community info aggregator)';
const MIRRORS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
export const AREA = '[out:json][timeout:180];rel["boundary"="administrative"]["name:en"~"^Netrokona( District)?$"]["admin_level"="5"];map_to_area->.a;';
export async function overpass(query, tries = 3) {
  let last;
  for (let a = 0; a < tries; a++) {
    for (const url of MIRRORS) {
      try {
        const r = await fetch(url, { method: 'POST', body: new URLSearchParams({ data: query }), headers: { 'User-Agent': UA } });
        if (r.ok) {
          const j = await r.json();
          if (j.remark && /error|timed out|out of memory/i.test(j.remark)) { last = `${j.remark} ${url}`; continue; }
          return j;
        }
        last = `HTTP ${r.status} ${url}`;
      } catch (e) { last = `${e.message} ${url}`; }
    }
    await new Promise((r) => setTimeout(r, 8000 * (a + 1)));
  }
  throw new Error('Overpass unavailable: ' + last);
}
