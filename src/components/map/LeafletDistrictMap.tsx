import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../../context/LanguageContext';
import { UPAZILAS_DATA } from '../../data/upazilas';
import { PLACES_DATA } from '../../data/places';
import { HEALTH_DATA } from '../../data/health';
import { Layers, Compass, Map as MapIcon, Satellite, ExternalLink } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import {
  BASEMAPS,
  MARKER_COLORS,
  GOOGLE_MAPS_DISTRICT_URL,
  upazilaFeatureCollection,
  densityColor,
  type BasemapId,
} from './geo';

// Custom SVG icon generator for Leaflet
const createCustomIcon = (color: string, label: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="30" height="40">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 11.5 16 26 16 26s16-14.5 16-26c0-8.837-7.163-16-16-16z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
      <circle cx="16" cy="15" r="7" fill="#ffffff"/>
      <text x="16" y="18" font-size="8" font-family="sans-serif" font-weight="bold" fill="${color}" text-anchor="middle">${label.slice(0, 1)}</text>
    </svg>
  `;
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svg,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -36],
  });
};

interface MapProps {
  height?: string;
  selectedUpazilaId?: string;
  className?: string;
}

export const LeafletDistrictMap: React.FC<MapProps> = ({
  height = '520px',
  selectedUpazilaId,
  className = '',
}) => {
  const { language } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upazilas' | 'places' | 'health'>('all');
  const [basemap, setBasemap] = useState<BasemapId>('map');
  const { theme } = useTheme();
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const boundaryLayerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up previous map instance if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center on Netrokona District
    const initialLat = 24.8833;
    const initialLng = 90.7333;
    const initialZoom = 10;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: initialZoom,
      scrollWheelZoom: false,
    });

    // Real upazila boundaries (OpenStreetMap), lightly tinted by population density.
    const boundary = L.geoJSON(upazilaFeatureCollection() as GeoJSON.FeatureCollection, {
      style: (feature) => ({
        color: '#ffffff',
        weight: 1.5,
        fillColor: densityColor(feature?.properties?.id ?? ''),
        fillOpacity: 0.18,
      }),
      onEachFeature: (feature, layer) => {
        const u = UPAZILAS_DATA.find((x) => x.id === feature.properties?.id);
        if (u) layer.bindTooltip(u.nameBn + ' · ' + u.name, { sticky: true, direction: 'top' });
        layer.on({
          mouseover: () => (layer as L.Path).setStyle({ weight: 3, fillOpacity: 0.32 }),
          mouseout: () => (layer as L.Path).setStyle({ weight: 1.5, fillOpacity: 0.18 }),
        });
      },
    }).addTo(map);
    boundaryLayerRef.current = boundary;
    map.fitBounds(boundary.getBounds(), { padding: [16, 16] });

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
      boundaryLayerRef.current = null;
    };
  }, []);

  // Basemap follows the site theme; "satellite" switches to aerial imagery.
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const cfg = basemap === 'satellite' ? BASEMAPS.satellite : theme === 'dark' ? BASEMAPS.dark : BASEMAPS.light;
    tileLayerRef.current?.remove();
    tileLayerRef.current = L.tileLayer(cfg.url, { attribution: cfg.attribution, maxZoom: 18, subdomains: 'abcd', className: cfg === BASEMAPS.dark ? 'nk-dark-tiles' : '' }).addTo(map);
    tileLayerRef.current.bringToBack();
    boundaryLayerRef.current?.setStyle({ color: basemap === 'satellite' ? '#fde68a' : theme === 'dark' ? '#e2e8f0' : '#ffffff' });
  }, [basemap, theme]);

  // Update markers on filter or language change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    const upazilaIcon = createCustomIcon(MARKER_COLORS.upazila, 'U');
    const placeIcon = createCustomIcon(MARKER_COLORS.place, 'P');
    const healthIcon = createCustomIcon(MARKER_COLORS.health, 'H');

    // 1. Upazila Markers
    if (activeFilter === 'all' || activeFilter === 'upazilas') {
      UPAZILAS_DATA.forEach((upazila) => {
        const marker = L.marker([upazila.coordinates.lat, upazila.coordinates.lng], {
          icon: upazilaIcon,
        });

        const title = language === 'bn' ? upazila.nameBn : upazila.name;
        const hq = language === 'bn' ? upazila.headquartersBn : upazila.headquarters;
        const pop = language === 'bn' ? `${upazila.population.toLocaleString('bn-BD')} জন` : `${upazila.population.toLocaleString()} people`;
        const area = language === 'bn' ? `${upazila.areaKm2} বর্গ কিমি` : `${upazila.areaKm2} sq km`;

        const popupContent = `
          <div style="min-width: 220px; font-family: sans-serif; padding: 4px;">
            <div style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #0f766e; margin-bottom: 2px;">
              ${language === 'bn' ? 'উপজেলা সদর' : 'Upazila'}
            </div>
            <h4 style="margin: 0 0 6px 0; font-size: 16px; font-weight: bold; color: #0f172a;">${title}</h4>
            <div style="font-size: 12px; color: #475569; margin-bottom: 4px;">
              <strong>${language === 'bn' ? 'সদর:' : 'HQ:'}</strong> ${hq}
            </div>
            <div style="font-size: 12px; color: #475569; margin-bottom: 4px;">
              <strong>${language === 'bn' ? 'জনসংখ্যা:' : 'Pop:'}</strong> ${pop} | <strong>${language === 'bn' ? 'আয়তন:' : 'Area:'}</strong> ${area}
            </div>
            <div style="margin-top: 10px; display: flex; gap: 6px;">
              <a href="/upazilas/${upazila.slug}" style="flex: 1; text-align: center; background: #0f766e; color: white; padding: 5px 8px; border-radius: 6px; font-size: 11px; text-decoration: none; font-weight: bold;">
                ${language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Upazila'}
              </a>
              <a href="https://www.google.com/maps/search/?api=1&query=${upazila.coordinates.lat},${upazila.coordinates.lng}" target="_blank" rel="noopener noreferrer" style="background: #f1f5f9; color: #0f172a; padding: 5px 8px; border-radius: 6px; font-size: 11px; text-decoration: none; border: 1px solid #cbd5e1;">
                Maps ↗
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        markersLayer.addLayer(marker);
      });
    }

    // 2. Tourist Place Markers
    if (activeFilter === 'all' || activeFilter === 'places') {
      PLACES_DATA.forEach((place) => {
        const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
          icon: placeIcon,
        });

        const title = language === 'bn' ? place.nameBn : place.name;
        const loc = language === 'bn' ? place.locationBn : place.location;
        const cat = language === 'bn' ? place.categoryLabel.bn : place.categoryLabel.en;

        const popupContent = `
          <div style="min-width: 220px; font-family: sans-serif; padding: 4px;">
            <div style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #c2410c; margin-bottom: 2px;">
              ${cat}
            </div>
            <h4 style="margin: 0 0 6px 0; font-size: 15px; font-weight: bold; color: #0f172a;">${title}</h4>
            <div style="font-size: 12px; color: #475569; margin-bottom: 8px;">
              ${loc}
            </div>
            <div style="display: flex; gap: 6px;">
              <a href="/places/${place.id}" style="flex: 1; text-align: center; background: #c2410c; color: white; padding: 5px 8px; border-radius: 6px; font-size: 11px; text-decoration: none; font-weight: bold;">
                ${language === 'bn' ? 'স্থান বিবরণ' : 'Place Info'}
              </a>
              <a href="https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}" target="_blank" rel="noopener noreferrer" style="background: #fff7ed; color: #9a3412; padding: 5px 8px; border-radius: 6px; font-size: 11px; text-decoration: none; border: 1px solid #fed7aa;">
                Google Maps ↗
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        markersLayer.addLayer(marker);
      });
    }

    // 3. Health & Emergency Markers
    if (activeFilter === 'all' || activeFilter === 'health') {
      HEALTH_DATA.slice(0, 6).forEach((h) => {
        if (!h.coordinates) return;
        const marker = L.marker([h.coordinates.lat, h.coordinates.lng], {
          icon: healthIcon,
        });

        const title = language === 'bn' ? h.nameBn : h.name;
        const addr = language === 'bn' ? h.addressBn : h.address;

        const popupContent = `
          <div style="min-width: 220px; font-family: sans-serif; padding: 4px;">
            <div style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #be123c; margin-bottom: 2px;">
              ${language === 'bn' ? 'জরুরি চিকিৎসা কেন্দ্র' : 'Emergency Hospital'}
            </div>
            <h4 style="margin: 0 0 6px 0; font-size: 14px; font-weight: bold; color: #0f172a;">${title}</h4>
            <div style="font-size: 12px; color: #475569; margin-bottom: 6px;">
              ${addr}
            </div>
            ${h.phone ? `
              <div style="font-size: 12px; margin-bottom: 8px; color: #be123c; font-weight: bold;">
                📞 ${h.phone}
              </div>
            ` : ''}
            <a href="/health" style="display: block; text-align: center; background: #be123c; color: white; padding: 5px 8px; border-radius: 6px; font-size: 11px; text-decoration: none; font-weight: bold;">
              ${language === 'bn' ? 'স্বাস্থ্য ডিরেক্টরি' : 'Health Info'}
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);
        markersLayer.addLayer(marker);
      });
    }

    // Focus on specific upazila if requested
    if (selectedUpazilaId && mapInstanceRef.current) {
      const target = UPAZILAS_DATA.find((u) => u.id === selectedUpazilaId || u.slug === selectedUpazilaId);
      if (target) {
        mapInstanceRef.current.setView([target.coordinates.lat, target.coordinates.lng], 12);
      }
    }
  }, [activeFilter, language, selectedUpazilaId]);

  return (
    <div className={`relative bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>
      {/* Map Filter Controls Bar */}
      <div className="absolute top-3 left-3 z-400 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200/90 dark:border-slate-700/90 shadow-md flex items-center gap-1 flex-wrap text-xs font-semibold">
        <span className="px-2 text-slate-500 dark:text-slate-400 hidden sm:inline flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'ফিল্টার:' : 'Filter:'}</span>
        </span>

        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-2.5 py-1 rounded-lg transition-colors ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          {language === 'bn' ? 'সকল মার্কার' : 'All'}
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('upazilas')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
            activeFilter === 'upazilas'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-teal-700 inline-block"></span>
          <span>{language === 'bn' ? '১০টি উপজেলা' : 'Upazilas'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('places')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
            activeFilter === 'places'
              ? 'bg-orange-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-orange-700 inline-block"></span>
          <span>{language === 'bn' ? 'দর্শনীয় স্থান' : 'Tourist Places'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('health')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
            activeFilter === 'health'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-700 inline-block"></span>
          <span>{language === 'bn' ? 'জরুরি হাসপাতাল' : 'Hospitals'}</span>
        </button>
      </div>

      {/* Basemap switch + Google Maps */}
      <div className="absolute top-3 right-3 z-400 flex flex-col items-end gap-1.5">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1 rounded-xl border border-slate-200/90 dark:border-slate-700/90 shadow-md flex text-xs font-semibold" role="group" aria-label={language === 'bn' ? 'মানচিত্রের ধরন' : 'Map type'}>
          {([
            ['map', MapIcon, language === 'bn' ? 'মানচিত্র' : 'Map'],
            ['satellite', Satellite, language === 'bn' ? 'স্যাটেলাইট' : 'Satellite'],
          ] as const).map(([id, Icon, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setBasemap(id)}
              aria-pressed={basemap === id}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                basemap === id ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
        <a
          href={GOOGLE_MAPS_DISTRICT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-700/90 shadow-md text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {language === 'bn' ? 'গুগল ম্যাপে খুলুন' : 'Open in Google Maps'}
        </a>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-7 right-3 z-400 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200/90 dark:border-slate-700/90 shadow-md text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
        <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-teal-600" />
          <span>{language === 'bn' ? 'মানচিত্র নির্দেশিকা' : 'Map Legend'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-700"></span>
          <span>{language === 'bn' ? 'উপজেলা সদর দপ্তর' : 'Upazila HQ'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-700"></span>
          <span>{language === 'bn' ? 'পর্যটন স্থান' : 'Tourist Place'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-700"></span>
          <span>{language === 'bn' ? 'হাসপাতাল' : 'Hospital'}</span>
        </div>
      </div>

      {/* Leaflet DOM container */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-0" />
    </div>
  );
};
