// Loader for the district-profile JSON written by `node scraper/node/district_sources.mjs`.
// The JSON files are generated (refreshed daily by .github/workflows/scrape.yml); don't hand-edit them.
import type {
  GovTouristSpot,
  GovAlbum,
  WikipediaSnapshot,
  BanglapediaFacts,
  DistrictSourceStatus,
  CreditedPhoto,
  CommonsPhoto,
} from '../../../types/district';
import govSpots from './gov-tourist-spots.json';
import govGallery from './gov-photo-gallery.json';
import wikipedia from './wikipedia.json';
import banglapedia from './banglapedia.json';
import status from './status.json';

export const GOV_PORTAL_URL = 'https://netrokona.gov.bd';
export const GOV_CREDIT_BN = 'নেত্রকোণা জেলা তথ্য বাতায়ন';
export const GOV_CREDIT_EN = 'Netrokona District Portal (netrokona.gov.bd)';

export const GOV_SPOTS_SOURCE = govSpots as unknown as { fetchedAt: string; sourceUrl: string; spots: GovTouristSpot[] };
export const GOV_SPOTS: GovTouristSpot[] = GOV_SPOTS_SOURCE.spots ?? [];

export const GOV_GALLERY = govGallery as unknown as { fetchedAt: string; sourceUrl: string; albums: GovAlbum[] };
export const GOV_ALBUMS: GovAlbum[] = GOV_GALLERY.albums ?? [];

export const WIKIPEDIA = wikipedia as unknown as WikipediaSnapshot;
export const BANGLAPEDIA = banglapedia as unknown as BanglapediaFacts;
export const DISTRICT_SOURCE_STATUS = status as unknown as DistrictSourceStatus;

export const govSpotForPlace = (placeId: string) => GOV_SPOTS.find((s) => s.placeId === placeId);

const fromCommons = (p: CommonsPhoto): CreditedPhoto => ({
  url: p.url,
  alt: p.description || p.title,
  credit: `${p.author} / Wikimedia Commons`,
  creditUrl: p.pageUrl,
  licence: p.licence,
  origin: 'commons',
});

export const COMMONS_PHOTOS: CreditedPhoto[] = (WIKIPEDIA.photos ?? []).map(fromCommons);

/**
 * Real photos of a place: the district administration's own photos first, then openly-licensed
 * Wikimedia Commons photos found for that place. Empty when no real photo is known.
 */
export function realPhotosForPlace(placeId: string): CreditedPhoto[] {
  const spot = govSpotForPlace(placeId);
  const gov: CreditedPhoto[] = (spot?.images ?? []).map((url) => ({
    url,
    alt: spot!.titleBn,
    credit: GOV_CREDIT_BN,
    creditUrl: spot!.sourceUrl,
    origin: 'gov',
  }));
  const commons = (WIKIPEDIA.placePhotos?.[placeId] ?? []).map(fromCommons);
  return [...gov, ...commons];
}

/** Landscape hero photo for the home page (a real Netrokona photo from Commons). */
export const HERO_PHOTO: CreditedPhoto | undefined = (() => {
  const preferred = [/Upstream Someshwari/i, /Someshwari River, Durgapur/i, /সোমেশ্বরী/, /Birishiri/i];
  const landscape = (WIKIPEDIA.photos ?? []).filter((p) => p.width > p.height);
  for (const re of preferred) {
    const hit = landscape.find((p) => re.test(p.title));
    if (hit) return fromCommons(hit);
  }
  return landscape[0] ? fromCommons(landscape[0]) : undefined;
})();

/** "২৪ নভেম্বর ২০২৬" / "24 Nov 2026" */
export function formatSourceDate(iso: string | undefined, lang: 'bn' | 'en') {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
