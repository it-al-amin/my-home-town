import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Compass, Layers, ExternalLink, Info, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { UNIONS_DATA } from '../../data/unions';
import { PLACES_DATA } from '../../data/places';
import { HEALTH_DATA } from '../../data/health';
import type { Upazila, UnionInfo } from '../../types';

// Custom SVG marker pin generator for Leaflet
const createMarkerIcon = (color: string, label: string, isUnion: boolean = false) => {
  const svg = isUnion ? `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="28" height="36">
      <path d="M16 0 C7.16 0 0 7.16 0 16 c0 11 16 24 16 24 s16-13 16-24 c0-8.84-7.16-16-16-16 z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
      <circle cx="16" cy="15" r="7" fill="#ffffff"/>
      <circle cx="16" cy="15" r="4" fill="${color}"/>
    </svg>
  ` : `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="30" height="38">
      <path d="M16 0 C7.16 0 0 7.16 0 16 c0 11 16 24 16 24 s16-13 16-24 c0-8.84-7.16-16-16-16 z" fill="${color}" stroke="#ffffff" stroke-width="2.5"/>
      <circle cx="16" cy="15" r="6" fill="#ffffff"/>
      <text x="16" y="19" font-size="9" font-family="sans-serif" font-weight="bold" fill="${color}" text-anchor="middle">${label.slice(0, 1)}</text>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-upazila-marker',
    html: svg,
    iconSize: isUnion ? [28, 36] : [30, 38],
    iconAnchor: isUnion ? [14, 36] : [15, 38],
    popupAnchor: [0, -34],
  });
};

interface UpazilaUnionMapProps {
  upazila: Upazila;
  height?: string;
  className?: string;
}

export const UpazilaUnionMap: React.FC<UpazilaUnionMapProps> = ({
  upazila,
  height = '500px',
  className = '',
}) => {
  const { language } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeFilter, setActiveFilter] = useState<'all' | 'unions' | 'places' | 'health'>('all');
  const [selectedUnionId, setSelectedUnionId] = useState<string | null>(null);

  // Unions belonging to this upazila
  const upazilaUnions: UnionInfo[] = (UNIONS_DATA as Record<string, UnionInfo[]>)[upazila.id] || [];
  const upazilaPlaces = PLACES_DATA.filter((p) => p.upazilaId === upazila.id);
  const upazilaHealth = HEALTH_DATA.filter((h) => h.upazilaId === upazila.id);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up previous map if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Centered on this specific upazila coordinates with closer zoom level
    const map = L.map(mapContainerRef.current, {
      center: [upazila.coordinates.lat, upazila.coordinates.lng],
      zoom: 11,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [upazila.id]);

  // Update markers when filter or language changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    const unionIcon = createMarkerIcon('#059669', 'U', true); // Emerald
    const placeIcon = createMarkerIcon('#2563eb', 'P'); // Blue
    const healthIcon = createMarkerIcon('#dc2626', 'H'); // Red
    const hqIcon = createMarkerIcon('#7c3aed', 'H'); // Purple

    // 1. Upazila Headquarters Center Pin
    const hqMarker = L.marker([upazila.coordinates.lat, upazila.coordinates.lng], {
      icon: hqIcon,
    });
    hqMarker.bindPopup(`
      <div style="font-family: sans-serif; padding: 4px; min-width: 200px;">
        <span style="font-size: 10px; font-weight: bold; color: #7c3aed; text-transform: uppercase;">
          ${language === 'bn' ? 'উপজেলা সদর দপ্তর' : 'Upazila HQ'}
        </span>
        <h4 style="margin: 2px 0 6px 0; font-size: 15px; font-weight: bold; color: #0f172a;">
          ${language === 'bn' ? upazila.nameBn : upazila.name}
        </h4>
        <p style="font-size: 12px; color: #475569; margin: 0 0 6px 0;">
          ${language === 'bn' ? upazila.headquartersBn : upazila.headquarters}
        </p>
        <a href="https://www.google.com/maps/search/?api=1&query=${upazila.coordinates.lat},${upazila.coordinates.lng}" target="_blank" rel="noopener noreferrer" style="display: block; text-align: center; background: #7c3aed; color: #ffffff; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; text-decoration: none;">
          Google Maps ↗
        </a>
      </div>
    `);
    layer.addLayer(hqMarker);

    // 2. All Union Parishads of this Upazila
    if (activeFilter === 'all' || activeFilter === 'unions') {
      upazilaUnions.forEach((u) => {
        const marker = L.marker([u.coordinates.lat, u.coordinates.lng], {
          icon: unionIcon,
        });

        const name = language === 'bn' ? u.nameBn : u.name;
        const villages = u.villagesCount ? (language === 'bn' ? `${u.villagesCount}টি গ্রাম` : `${u.villagesCount} villages`) : '';
        const keySpots = u.keySpotsBn && u.keySpotsBn.length > 0 ? u.keySpotsBn.join(', ') : '';

        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px; min-width: 220px;">
            <span style="font-size: 10px; font-weight: bold; color: #059669; text-transform: uppercase;">
              ${language === 'bn' ? 'ইউনিয়ন পরিষদ' : 'Union Parishad'}
            </span>
            <h4 style="margin: 2px 0 4px 0; font-size: 15px; font-weight: bold; color: #0f172a;">${name}</h4>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">
              <strong>জিপিএস:</strong> ${u.coordinates.lat.toFixed(4)}° N, ${u.coordinates.lng.toFixed(4)}° E
            </div>
            ${villages ? `<div style="font-size: 12px; color: #334155; margin-bottom: 4px;"><strong>গ্রাম:</strong> ${villages}</div>` : ''}
            ${keySpots ? `<div style="font-size: 11px; color: #059669; margin-bottom: 6px;"><strong>আকর্ষণ:</strong> ${keySpots}</div>` : ''}
            <a href="https://www.google.com/maps/search/?api=1&query=${u.coordinates.lat},${u.coordinates.lng}" target="_blank" rel="noopener noreferrer" style="display: block; text-align: center; background: #059669; color: #ffffff; padding: 5px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; text-decoration: none;">
              গুগল ম্যাপে দিকনির্দেশনা ↗
            </a>
          </div>
        `);
        layer.addLayer(marker);
      });
    }

    // 3. Tourist spots in this upazila
    if (activeFilter === 'all' || activeFilter === 'places') {
      upazilaPlaces.forEach((p) => {
        const marker = L.marker([p.coordinates.lat, p.coordinates.lng], {
          icon: placeIcon,
        });
        const name = language === 'bn' ? p.nameBn : p.name;
        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px; min-width: 200px;">
            <span style="font-size: 10px; font-weight: bold; color: #2563eb; text-transform: uppercase;">
              ${language === 'bn' ? p.categoryLabel.bn : p.categoryLabel.en}
            </span>
            <h4 style="margin: 2px 0 6px 0; font-size: 14px; font-weight: bold; color: #0f172a;">${name}</h4>
            <a href="/places/${p.id}" style="display: block; text-align: center; background: #2563eb; color: #ffffff; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; text-decoration: none;">
              ${language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Place'}
            </a>
          </div>
        `);
        layer.addLayer(marker);
      });
    }

    // 4. Health facilities in this upazila
    if (activeFilter === 'all' || activeFilter === 'health') {
      upazilaHealth.forEach((h) => {
        if (!h.coordinates) return;
        const marker = L.marker([h.coordinates.lat, h.coordinates.lng], {
          icon: healthIcon,
        });
        const name = language === 'bn' ? h.nameBn : h.name;
        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px; min-width: 200px;">
            <span style="font-size: 10px; font-weight: bold; color: #dc2626; text-transform: uppercase;">
              ${language === 'bn' ? 'হাসপাতাল' : 'Hospital'}
            </span>
            <h4 style="margin: 2px 0 4px 0; font-size: 14px; font-weight: bold; color: #0f172a;">${name}</h4>
            ${h.phone ? `<div style="font-size: 11px; font-weight: bold; color: #dc2626; margin-bottom: 6px;">📞 ${h.phone}</div>` : ''}
            <a href="/health" style="display: block; text-align: center; background: #dc2626; color: #ffffff; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; text-decoration: none;">
              ${language === 'bn' ? 'স্বাস্থ্য তথ্য' : 'Health Info'}
            </a>
          </div>
        `);
        layer.addLayer(marker);
      });
    }
  }, [activeFilter, language, upazila]);

  const handleFocusUnion = (union: UnionInfo) => {
    setSelectedUnionId(union.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([union.coordinates.lat, union.coordinates.lng], 13, {
        duration: 1.2,
      });
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Map Filter Controls Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2.5 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'bn' ? 'ফিল্টার:' : 'Filter:'}</span>
          </span>

          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {language === 'bn' ? 'সকল মার্কার' : 'All Markers'}
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('unions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeFilter === 'unions'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>{language === 'bn' ? `${upazilaUnions.length}টি ইউনিয়ন পরিষদ` : `${upazilaUnions.length} Unions`}</span>
          </button>

          {upazilaPlaces.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveFilter('places')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeFilter === 'places'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 hover:bg-blue-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              <span>{language === 'bn' ? 'দর্শনীয় স্থান' : 'Places'}</span>
            </button>
          )}

          {upazilaHealth.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveFilter('health')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeFilter === 'health'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
              <span>{language === 'bn' ? 'জরুরি হাসপাতাল' : 'Health'}</span>
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {language === 'bn' ? `সদর দপ্তর: ${upazila.headquartersBn}` : `HQ: ${upazila.headquarters}`}
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
        <div ref={mapContainerRef} style={{ height }} className="w-full z-10" />

        {/* Map Legend Floating Box */}
        <div className="absolute bottom-4 right-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] shadow-lg space-y-1">
          <div className="font-bold text-slate-800 dark:text-slate-200 text-xs mb-1">
            {language === 'bn' ? 'মানচিত্র নির্দেশিকা' : 'Legend'}
          </div>
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
            <span>{language === 'bn' ? 'উপজেলা সদর দপ্তর' : 'Upazila HQ'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
            <span>{language === 'bn' ? 'ইউনিয়ন পরিষদ সমূহ' : 'Union Parishads'}</span>
          </div>
          {upazilaPlaces.length > 0 && (
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
              <span>{language === 'bn' ? 'দর্শনীয় পর্যটন কেন্দ্র' : 'Tourist Spots'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Union Cards Bar (Clicking focuses the map on that Union!) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>
              {language === 'bn' ? `${upazila.nameBn} উপজেলার সকল ইউনিয়ন পরিষদ (${upazilaUnions.length}টি)` : `All ${upazilaUnions.length} Unions of ${upazila.name}`}
            </span>
          </h4>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'bn' ? 'ক্লিক করে ম্যাপে জুম করুন' : 'Click to zoom on map'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {upazilaUnions.map((union) => {
            const isSelected = selectedUnionId === union.id;
            return (
              <button
                key={union.id}
                type="button"
                onClick={() => handleFocusUnion(union)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-emerald-400 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-1">
                      {language === 'bn' ? union.nameBn : union.name}
                    </span>
                    <Navigation className="w-3 h-3 text-emerald-600 shrink-0 ml-1" />
                  </div>
                  {union.villagesCount && (
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      {language === 'bn' ? `${union.villagesCount}টি গ্রাম` : `${union.villagesCount} villages`}
                    </span>
                  )}
                </div>

                <div className="mt-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{union.coordinates.lat.toFixed(2)}°N</span>
                  <span>{union.coordinates.lng.toFixed(2)}°E</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

