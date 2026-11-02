import type { UnionInfo } from '../types';
import { UPAZILAS_DATA } from './upazilas';

/**
 * Union Parishads keyed by upazila id.
 * Names come from each upazila's official union list. Union coordinates are NOT
 * surveyed GPS points: they are spread evenly around the upazila centre so every
 * union is visible on the map. Replace with surveyed coordinates when available.
 */
const buildUnions = (): Record<string, UnionInfo[]> => {
  const result: Record<string, UnionInfo[]> = {};

  UPAZILAS_DATA.forEach((u) => {
    const n = u.unionsList.length;
    // Radius ~ 55% of the upazila's equivalent circular radius, in km
    const radiusKm = 0.55 * Math.sqrt(u.areaKm2 / Math.PI);
    const latPerKm = 1 / 110.574;
    const lngPerKm = 1 / (111.32 * Math.cos((u.coordinates.lat * Math.PI) / 180));

    result[u.id] = u.unionsList.map((name, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      // Alternate inner/outer ring so labels do not overlap in crowded upazilas
      const r = radiusKm * (n > 6 && i % 2 === 1 ? 0.55 : 1);
      return {
        id: `${u.id}-union-${i + 1}`,
        name,
        nameBn: u.unionsListBn[i] ?? name,
        upazilaId: u.id,
        coordinates: {
          lat: +(u.coordinates.lat + r * Math.sin(angle) * latPerKm).toFixed(5),
          lng: +(u.coordinates.lng + r * Math.cos(angle) * lngPerKm).toFixed(5),
        },
        approximate: true,
      };
    });
  });

  return result;
};

export const UNIONS_DATA: Record<string, UnionInfo[]> = buildUnions();
