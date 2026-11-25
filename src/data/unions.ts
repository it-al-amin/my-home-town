import type { UnionInfo } from '../types';
import boundaries from './geo/union-boundaries.json';
import unionDetails from './aggregated/district/union-details.json';

/**
 * Union Parishads and municipalities (paurashava) of every upazila, built from the
 * official union boundaries: Bangladesh Bureau of Statistics via OCHA ROAP / geoBoundaries
 * (CC BY 3.0 IGO). Rebuild with `node scraper/node/build_union_geometry.mjs <ADM4 geojson>`.
 * Coordinates are each polygon's centroid, not a hand-placed guess.
 */
export const UNION_BOUNDARY_SOURCE = {
  label: 'Bangladesh Bureau of Statistics · OCHA ROAP (geoBoundaries, CC BY 3.0 IGO)',
  labelBn: 'বাংলাদেশ পরিসংখ্যান ব্যুরো · OCHA ROAP (geoBoundaries, CC BY 3.0 IGO)',
  url: 'https://www.geoboundaries.org/countryDownloads.html',
};

/** BBS boundary name -> [display name, Bangla name]. */
const NAMES: Record<string, [string, string]> = {
  // Netrokona Sadar
  Amtala: ['Amtala', 'আমতলা'],
  Challisha: ['Challisha', 'চল্লিশা'],
  'Dakshin Bishiura': ['Dakshin Bishiura', 'দক্ষিণ বিশিউড়া'],
  Kailati: ['Kailati', 'কাইলাটি'],
  'Kaliara Gabragat': ['Kaliara Gabragati', 'কালিয়ারা গাবরাগাতি'],
  Lakshmiganj: ['Lakshmiganj', 'লক্ষ্মীগঞ্জ'],
  Madanpur: ['Madanpur', 'মদনপুর'],
  Maugati: ['Maugati', 'মৌগাতি'],
  Medni: ['Medni', 'মেদনী'],
  Rauha: ['Rauha', 'রৌহা'],
  'Singhar Bangla': ['Singher Bangla', 'সিংহের বাংলা'],
  Thakurakona: ['Thakurakona', 'ঠাকুরাকোনা'],
  'Netrokona Paurashava': ['Netrokona Municipality', 'নেত্রকোণা পৌরসভা'],
  // Durgapur
  Bakaljora: ['Bakaljora', 'বাকলজোড়া'],
  Birisiri: ['Birishiri', 'বিরিশিরি'],
  Chandigarh: ['Chandigarh', 'চণ্ডীগড়'],
  Durgapur: ['Durgapur', 'দুর্গাপুর'],
  Gaokandia: ['Gaokandia', 'গাঁওকান্দিয়া'],
  Kakairgara: ['Kakairgara', 'কাকৈরগড়া'],
  Kullagora: ['Kullagora', 'কুল্লাগড়া'],
  'Durgapur Paurashava': ['Durgapur Municipality', 'দুর্গাপুর পৌরসভা'],
  // Kalmakanda
  'Bara Kharpan': ['Barakharpan', 'বড়খারপান'],
  Kalmakanda: ['Kalmakanda', 'কলমাকান্দা'],
  Kharnai: ['Kharnai', 'খারনৈ'],
  Lengura: ['Lengura', 'লেংগুরা'],
  Nazirpur: ['Nazirpur', 'নাজিরপুর'],
  Pogla: ['Pogla', 'পোগলা'],
  Rangchhati: ['Rangchhati', 'রংছাতি'],
  // Mohanganj
  'Baratali Banihari': ['Baratali Banihari', 'বড়তলী বানিহারী'],
  'Barkashia Biramp': ['Barkashia Birampur', 'বরকাশিয়া বিরামপুর'],
  Gaglajur: ['Gaglajur', 'গাগলাজুর'],
  'Maghan Siadhar': ['Maghan Siadhar', 'মাঘান সিয়াধার'],
  'Samaj Sahildeo': ['Samaj Sahildeo', 'সমাজ সহিলদেও'],
  Suair: ['Suair', 'সুয়াইর'],
  Tentulia: ['Tentulia', 'তেঁতুলিয়া'],
  'Mohanganj Paurashava': ['Mohanganj Municipality', 'মোহনগঞ্জ পৌরসভা'],
  // Khaliajuri
  Chakua: ['Chakua', 'চাকুয়া'],
  Gazipur: ['Gazipur', 'গাজীপুর'],
  Khaliajuri: ['Khaliajuri', 'খালিয়াজুরী'],
  Krishnapur: ['Krishnapur', 'কৃষ্ণপুর'],
  Mendipur: ['Mendipur', 'মেন্দিপুর'],
  Nagar: ['Nagar', 'নগর'],
  // Kendua
  Asujia: ['Asujia', 'আশুজিয়া'],
  Balaishimul: ['Balaishimul', 'বলাইশিমুল'],
  Chirang: ['Chirang', 'চিরাং'],
  Dalpa: ['Dalpa', 'দলপা'],
  Ganda: ['Ganda', 'গণ্ডা'],
  Garadoba: ['Garadoba', 'গড়াডোবা'],
  Kandiura: ['Kandiura', 'কান্দিউড়া'],
  Mashka: ['Mashka', 'মাসকা'],
  Muzaffarpur: ['Muzaffarpur', 'মোজাফফরপুর'],
  Noapara: ['Noapara', 'নওপাড়া'],
  Paikura: ['Paikura', 'পাইকুড়া'],
  Roailbari: ['Roailbari Amtala', 'রোয়াইলবাড়ি আমতলা'],
  Sandikona: ['Sandikona', 'সান্দিকোনা'],
  'Kendua Paurashava': ['Kendua Municipality', 'কেন্দুয়া পৌরসভা'],
  // Madan
  Chandgaon: ['Chandgaon', 'চানগাঁও'],
  Fatehpur: ['Fatehpur', 'ফতেপুর'],
  Gobindasree: ['Gobindasree', 'গোবিন্দশ্রী'],
  Kaitail: ['Kaitail', 'কাইটাইল'],
  Madan: ['Madan', 'মদন'],
  Maghan: ['Maghan', 'মাঘান'],
  Nayekpur: ['Nayekpur', 'নায়েকপুর'],
  Tiasree: ['Tiasree', 'তিয়শ্রী'],
  'Madan Paurashava': ['Madan Municipality', 'মদন পৌরসভা'],
  // Barhatta
  Asma: ['Asma', 'আসমা'],
  Barhatta: ['Barhatta', 'বারহাট্টা'],
  Baushi: ['Baushi', 'বাউসী'],
  Chhiram: ['Chhiram', 'চিরাম'],
  Roypur: ['Roypur', 'রায়পুর'],
  Sahata: ['Sahata', 'সাহতা'],
  Singdha: ['Singdha', 'সিংধা'],
  // Atpara
  Baniajan: ['Baniajan', 'বানিয়াজান'],
  Duaz: ['Duaz', 'দুওজ'],
  Loneshwar: ['Loneshwar', 'লুনেশ্বর'],
  Sarmaisa: ['Sarmaisa', 'স্বরমুশিয়া'],
  Sonai: ['Sonai', 'সোনাই'],
  Sukhari: ['Sukhari', 'সুখারী'],
  Teligati: ['Teligati', 'তেলিগাতী'],
  // Purbadhala
  Agia: ['Agia', 'আগিয়া'],
  Bairati: ['Bairati', 'বৈরাটি'],
  Bishkakuni: ['Bishkakuni', 'বিশকাকুনী'],
  'Dhala Mulgaon': ['Dhalamulgaon', 'ধলামূলগাঁও'],
  Ghagra: ['Ghagra', 'ঘাগড়া'],
  Gohalakanda: ['Gohalakanda', 'গোহালাকান্দা'],
  Hogla: ['Hogla', 'হোগলা'],
  Jaria: ['Jaria', 'জারিয়া'],
  Khalishaur: ['Khalishaur', 'খলিশাউড়'],
  Narandia: ['Narandia', 'নারান্দিয়া'],
  Purbadhala: ['Purbadhala', 'পূর্বধলা'],
  'Purbadhala Paurashava': ['Purbadhala Municipality', 'পূর্বধলা পৌরসভা'],
};

type Ring = [number, number][]; // [lng, lat]
const RAW = boundaries as unknown as Record<string, { name: string; rings: Ring[] }[]>;

/** Area-weighted centroid of the largest ring (lng/lat, fine at upazila scale). */
const centroidOf = (rings: Ring[]) => {
  let best = { a: 0, x: 0, y: 0 };
  for (const r of rings) {
    let a = 0, cx = 0, cy = 0;
    for (let i = 0; i < r.length - 1; i++) {
      const f = r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1];
      a += f; cx += (r[i][0] + r[i + 1][0]) * f; cy += (r[i][1] + r[i + 1][1]) * f;
    }
    if (Math.abs(a) > Math.abs(best.a)) best = { a, x: cx / (3 * a), y: cy / (3 * a) };
  }
  return { lat: +best.y.toFixed(5), lng: +best.x.toFixed(5) };
};

interface RawDetails {
  goCode?: number;
  areaAcre?: number;
  male?: number;
  female?: number;
  literacyPct?: number;
  settlements?: number;
  villages: { en: string; bn: string; place: string; lat: number; lng: number }[];
}
const DETAILS = (unionDetails as unknown as { unions: Record<string, Record<string, RawDetails>> }).unions;
const ACRE_KM2 = 0.00404686;

/** Census 2011 figures (Banglapedia union tables) + named places (OpenStreetMap) + LGED settlement count. */
const detailsOf = (upazilaId: string, bbsName: string, unionName: string): Pick<UnionInfo, 'census' | 'villages' | 'settlementCount'> => {
  const d = DETAILS[upazilaId]?.[bbsName];
  const seen = new Set<string>();
  const villages = (d?.villages ?? [])
    .filter((v) => v.en.toLowerCase() !== unionName.toLowerCase() && !seen.has(v.bn) && seen.add(v.bn))
    .map((v) => ({ name: v.en, nameBn: v.bn, coordinates: { lat: v.lat, lng: v.lng } }));
  return {
    census: d?.male != null && d.areaAcre
      ? {
          goCode: d.goCode!,
          areaKm2: +(d.areaAcre * ACRE_KM2).toFixed(1),
          male: d.male,
          female: d.female!,
          population: d.male + d.female!,
          literacyPct: d.literacyPct!,
        }
      : undefined,
    villages,
    settlementCount: d?.settlements ?? 0,
  };
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

/** Every administrative area (unions and the municipality) of each upazila, with its boundary. */
export const UNION_AREAS: Record<string, UnionInfo[]> = Object.fromEntries(
  Object.entries(RAW).map(([upazilaId, list]) => [
    upazilaId,
    list.map(({ name, rings }) => {
      const [en, bn] = NAMES[name] ?? [name, name];
      return {
        id: `${upazilaId}-${slug(en)}`,
        name: en,
        nameBn: bn,
        upazilaId,
        sourceName: name,
        kind: /Paurashava$/.test(name) ? 'paurashava' : 'union',
        coordinates: centroidOf(rings),
        rings,
        ...detailsOf(upazilaId, name, en),
      } satisfies UnionInfo;
    }),
  ]),
);

/** Union Parishads only (municipalities excluded), keyed by upazila id. */
export const UNIONS_DATA: Record<string, UnionInfo[]> = Object.fromEntries(
  Object.entries(UNION_AREAS).map(([id, list]) => [id, list.filter((u) => u.kind === 'union')]),
);
