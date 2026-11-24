// Shapes of the JSON written by `node scraper/node/district_sources.mjs` (src/data/aggregated/district/).

export interface GovTouristSpot {
  govId: string;
  titleBn: string;
  locationBn: string;
  transportationBn: string;
  contact?: string;
  descriptionBn: string;
  images: string[];
  sourceUrl: string;
  /** Matching place id on this site, when there is one. */
  placeId?: string;
}

export interface GovAlbum {
  id: string;
  titleBn: string;
  /** "YYYY-MM" taken from the upload path. */
  uploaded?: string;
  images: string[];
  sourceUrl: string;
}

export interface CommonsPhoto {
  file: string;
  title: string;
  url: string;
  width: number;
  height: number;
  pageUrl: string;
  author: string;
  licence: string;
  licenceUrl?: string;
  description: string;
}

export interface WikipediaSnapshot {
  fetchedAt: string;
  title: string;
  sourceUrl: string;
  lastEdited?: string;
  licence: string;
  introBn: string;
  photos: CommonsPhoto[];
  placePhotos: Record<string, CommonsPhoto[]>;
}

export interface BanglapediaUpazilaRow {
  name: string;
  areaKm2: number;
  municipalities: number;
  unions: number;
  mouzas: number;
  villages: number;
  population: number;
  densityPerKm2: number;
  literacyPct: number;
}

export interface BanglapediaFacts {
  fetchedAt: string;
  sourceUrl: string;
  lastEdited?: string;
  censusYear: number;
  areaKm2: number;
  latitude: string[];
  longitude: string[];
  population: {
    total?: number;
    male?: number;
    female?: number;
    urban?: number;
    rural?: number;
    densityPerKm2?: number;
    literacyPct?: number;
  };
  administration?: { upazilas: number; municipalities: number; unions: number; mouzas: number; villages: number };
  subdivisionFormed?: number;
  districtFormed?: number;
  mainRivers: string[];
  institutions: { college?: number; secondarySchool?: number; primarySchool?: number; madrasa?: number };
  literacy: { averagePct?: number; malePct?: number; femalePct?: number };
  incomeSharePct: Record<string, number>;
  indigenousCommunities: string[];
  upazilas: BanglapediaUpazilaRow[];
}

export interface DistrictSourceStatus {
  updatedAt?: string;
  sources: Record<string, { ok: boolean; file: string; lastSuccess?: string; lastAttempt: string; error?: string }>;
}

/** One photo ready to render, with the attribution its licence requires. */
export interface CreditedPhoto {
  url: string;
  alt: string;
  credit: string;
  creditUrl: string;
  licence?: string;
  origin: 'gov' | 'commons';
}
