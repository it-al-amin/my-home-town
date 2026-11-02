import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, ExternalLink, ArrowRight, Compass, Users, 
  Maximize2, RotateCcw, Download, Eye, Layers, Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { UPAZILAS_DATA } from '../../data/upazilas';
import { UNIONS_DATA } from '../../data/unions';
import type { Upazila } from '../../types';

interface UpazilaSvgConfig {
  id: string;
  name: string;
  nameBn: string;
  centroid: { x: number; y: number };
  color: string;
  hoverColor: string;
  path: string;
}

// Seamless vector paths representing the 10 upazilas of Netrokona District
// Geographically ordered: North (Durgapur, Kalmakanda), West (Purbadhala),
// Center (Netrokona Sadar, Barhatta, Atpara), South (Kendua, Madan), East/Haor (Mohanganj, Khaliajuri)
export const UPAZILA_SVG_PATHS: UpazilaSvgConfig[] = [
  {
    id: 'durgapur',
    name: 'Durgapur',
    nameBn: 'দুর্গাপুর',
    centroid: { x: 260, y: 135 },
    color: '#0d9488', // Teal
    hoverColor: '#14b8a6',
    path: `M 150 170 
           L 155 120 
           C 180 85, 230 45, 280 40 
           C 320 35, 360 55, 395 65 
           L 380 130 
           C 365 170, 345 200, 310 215 
           C 270 225, 240 215, 210 205 
           L 150 170 Z`,
  },
  {
    id: 'kalmakanda',
    name: 'Kalmakanda',
    nameBn: 'কলমাকান্দা',
    centroid: { x: 505, y: 145 },
    color: '#6366f1', // Indigo
    hoverColor: '#818cf8',
    path: `M 395 65 
           C 440 60, 490 50, 545 45 
           C 590 40, 625 70, 645 105 
           C 660 135, 650 175, 630 205 
           C 610 230, 570 245, 520 240 
           C 475 235, 430 220, 380 205 
           L 380 130 Z`,
  },
  {
    id: 'purbadhala',
    name: 'Purbadhala',
    nameBn: 'পূর্বধলা',
    centroid: { x: 155, y: 310 },
    color: '#059669', // Emerald
    hoverColor: '#10b981',
    path: `M 150 170 
           L 210 205 
           C 215 250, 225 300, 220 355 
           C 210 400, 190 435, 145 440 
           C 115 445, 85 410, 75 365 
           C 65 315, 85 270, 110 225 
           L 150 170 Z`,
  },
  {
    id: 'netrokona-sadar',
    name: 'Netrokona Sadar',
    nameBn: 'নেত্রকোণা সদর',
    centroid: { x: 325, y: 310 },
    color: '#0284c7', // Sky / Cyan
    hoverColor: '#38bdf8',
    path: `M 210 205 
           C 240 215, 270 225, 310 215 
           C 345 200, 365 170, 380 205 
           L 385 240 
           C 420 260, 435 285, 430 330 
           C 425 365, 395 385, 360 395 
           C 310 405, 265 390, 225 375 
           C 220 325, 215 265, 210 205 Z`,
  },
  {
    id: 'barhatta',
    name: 'Barhatta',
    nameBn: 'বারহাট্টা',
    centroid: { x: 505, y: 300 },
    color: '#9333ea', // Purple
    hoverColor: '#c084fc',
    path: `M 380 205 
           C 430 220, 475 235, 520 240 
           C 570 245, 605 260, 620 295 
           C 630 325, 615 360, 580 375 
           C 540 390, 495 385, 455 375 
           C 435 340, 420 295, 385 240 Z`,
  },
  {
    id: 'atpara',
    name: 'Atpara',
    nameBn: 'আটপাড়া',
    centroid: { x: 385, y: 465 },
    color: '#e11d48', // Rose
    hoverColor: '#fb7185',
    path: `M 360 395 
           C 395 385, 425 365, 430 330 
           L 455 375 
           C 490 395, 510 420, 500 455 
           C 490 495, 460 525, 420 540 
           C 380 550, 345 530, 325 505 
           C 305 470, 325 430, 360 395 Z`,
  },
  {
    id: 'kendua',
    name: 'Kendua',
    nameBn: 'কেন্দুয়া',
    centroid: { x: 270, y: 535 },
    color: '#d97706', // Amber / Terracotta
    hoverColor: '#fbbf24',
    path: `M 225 375 
           C 265 390, 310 405, 360 395 
           C 325 430, 305 470, 325 505 
           C 345 530, 380 550, 420 540 
           C 405 585, 370 635, 320 655 
           C 265 675, 215 650, 185 605 
           C 155 555, 175 490, 195 440 
           C 210 410, 220 390, 225 375 Z`,
  },
  {
    id: 'madan',
    name: 'Madan',
    nameBn: 'মদন',
    centroid: { x: 535, y: 490 },
    color: '#65a30d', // Lime / Olive
    hoverColor: '#a3e635',
    path: `M 455 375 
           C 495 385, 540 390, 580 375 
           L 600 410 
           C 625 440, 630 480, 610 525 
           C 585 570, 545 600, 495 605 
           C 460 610, 435 580, 420 540 
           C 460 525, 490 495, 500 455 
           C 510 420, 490 395, 455 375 Z`,
  },
  {
    id: 'mohanganj',
    name: 'Mohanganj',
    nameBn: 'মোহনগঞ্জ',
    centroid: { x: 690, y: 310 },
    color: '#ea580c', // Orange
    hoverColor: '#fb923c',
    path: `M 520 240 
           C 570 245, 610 230, 630 205 
           C 670 215, 715 220, 755 240 
           C 785 260, 795 295, 785 340 
           C 770 380, 740 410, 695 425 
           C 655 435, 620 415, 600 410 
           L 580 375 
           C 615 360, 630 325, 620 295 
           C 605 260, 570 245, 520 240 Z`,
  },
  {
    id: 'khaliajuri',
    name: 'Khaliajuri',
    nameBn: 'খালিয়াজুরী',
    centroid: { x: 740, y: 520 },
    color: '#2563eb', // Deep Haor Blue
    hoverColor: '#60a5fa',
    path: `M 695 425 
           C 740 410, 770 380, 785 340 
           C 815 365, 845 400, 855 450 
           C 865 510, 840 575, 800 625 
           C 755 675, 700 685, 650 670 
           C 615 655, 600 620, 610 525 
           C 630 480, 625 440, 600 410 
           C 620 415, 655 435, 695 425 Z`,
  },
];

interface DistrictVectorMapProps {
  selectedUpazilaId?: string;
  onSelectUpazila?: (upazila: Upazila | null) => void;
  className?: string;
  interactive?: boolean;
  showLabels?: boolean;
  showInfoCard?: boolean;
  theme?: 'dark' | 'light';
}

export const DistrictVectorMap: React.FC<DistrictVectorMapProps> = ({
  selectedUpazilaId,
  onSelectUpazila,
  className = '',
  interactive = true,
  showLabels = true,
  showInfoCard = true,
  theme = 'dark',
}) => {
  const { language } = useLanguage();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
    selectedUpazilaId || 'netrokona-sadar'
  );
  const [labelsVisible, setLabelsVisible] = useState(showLabels);

  const activeId = hoveredId || internalSelectedId;
  const activeUpazila = UPAZILAS_DATA.find((u) => u.id === activeId) || UPAZILAS_DATA[0];

  const handleUpazilaClick = (id: string) => {
    if (!interactive) return;
    const nextId = internalSelectedId === id ? null : id;
    setInternalSelectedId(nextId);
    const upazila = UPAZILAS_DATA.find((u) => u.id === nextId) || null;
    if (onSelectUpazila) {
      onSelectUpazila(upazila);
    }
  };

  const handleDownloadSvg = () => {
    const svgElement = document.getElementById('netrokona-vector-map-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `netrokona-district-map-${language}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Map Control Toolbar */}
      <div className="w-full flex items-center justify-between gap-2 mb-3 px-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-medium ${
            isDark ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-100 text-slate-700 border border-slate-200'
          }`}>
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>{language === 'bn' ? '১০টি উপজেলা ভেক্টর মানচিত্র' : '10 Upazilas Vector Map'}</span>
          </span>
          <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            ({language === 'bn' ? 'ক্লিক করে তথ্য দেখুন' : 'Click region for details'})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setLabelsVisible(!labelsVisible)}
            type="button"
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors flex items-center gap-1 ${
              labelsVisible
                ? isDark ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-teal-100 text-teal-800 border border-teal-300'
                : isDark ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
            title={language === 'bn' ? 'উপজেলার নাম প্রদর্শন চালু/বন্ধ' : 'Toggle Labels'}
          >
            <Eye className="w-3 h-3" />
            <span>{language === 'bn' ? 'নাম' : 'Labels'}</span>
          </button>

          <button
            onClick={() => {
              setInternalSelectedId(null);
              setHoveredId(null);
              if (onSelectUpazila) onSelectUpazila(null);
            }}
            type="button"
            className={`p-1.5 rounded-md text-xs transition-colors ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
            title={language === 'bn' ? 'রিসেট করুন' : 'Reset Selection'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDownloadSvg}
            type="button"
            className={`p-1.5 rounded-md text-xs transition-colors ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
            title={language === 'bn' ? 'এসভিজি মানচিত্র ডাউনলোড করুন' : 'Download SVG Map'}
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Vector SVG Map Container */}
      <div className="relative w-full aspect-[900/740] max-h-[600px] flex items-center justify-center">
        <svg
          id="netrokona-vector-map-svg"
          viewBox="0 0 920 740"
          className="w-full h-full filter drop-shadow-2xl overflow-visible transition-all duration-300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Ambient map glows and drop-shadows */}
            <filter id="map-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="hover-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.5" />
            </filter>

            {/* Subtle River Wave Gradient */}
            <linearGradient id="someshwari-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
            </linearGradient>

            {/* Pattern for Garo Hills (Northern border with India) */}
            <pattern id="hills-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0 15 L 10 5 L 20 15" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.25" />
            </pattern>
          </defs>

          {/* District Outer Background Boundary Contour Glow */}
          <path
            d={`M 150 170 
               L 155 120 
               C 180 85, 230 45, 280 40 
               C 320 35, 360 55, 395 65 
               C 440 60, 490 50, 545 45 
               C 590 40, 625 70, 645 105 
               C 660 135, 650 175, 630 205 
               C 670 215, 715 220, 755 240 
               C 785 260, 795 295, 785 340 
               C 815 365, 845 400, 855 450 
               C 865 510, 840 575, 800 625 
               C 755 675, 700 685, 650 670 
               C 615 655, 600 620, 610 525 
               C 585 570, 545 600, 495 605 
               C 460 610, 435 580, 420 540 
               C 405 585, 370 635, 320 655 
               C 265 675, 215 650, 185 605 
               C 155 555, 175 490, 195 440 
               C 210 410, 190 435, 145 440 
               C 115 445, 85 410, 75 365 
               C 65 315, 85 270, 110 225 Z`}
            fill="none"
            stroke={isDark ? '#334155' : '#cbd5e1'}
            strokeWidth="14"
            strokeLinejoin="round"
            opacity="0.3"
          />

          {/* Render Upazila Regions */}
          <g id="upazila-polygons">
            {UPAZILA_SVG_PATHS.map((item) => {
              const isSelected = internalSelectedId === item.id;
              const isHovered = hoveredId === item.id;
              const isFocal = isSelected || isHovered;

              return (
                <g key={item.id} className="transition-all duration-200">
                  <path
                    d={item.path}
                    fill={item.color}
                    fillOpacity={isFocal ? 0.95 : isDark ? 0.72 : 0.85}
                    stroke={isSelected ? '#ffffff' : isHovered ? '#f8fafc' : isDark ? '#0f172a' : '#ffffff'}
                    strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 1.5}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    filter={isFocal ? 'url(#hover-shadow)' : undefined}
                    className={`cursor-pointer transition-all duration-200 ${
                      isFocal ? 'brightness-110 -translate-y-0.5' : 'hover:brightness-105'
                    }`}
                    onMouseEnter={() => interactive && setHoveredId(item.id)}
                    onMouseLeave={() => interactive && setHoveredId(null)}
                    onClick={() => handleUpazilaClick(item.id)}
                  />

                  {/* Centroid Pin & Pulsing Dot for Active Upazila */}
                  {isFocal && (
                    <g transform={`translate(${item.centroid.x}, ${item.centroid.y})`} className="pointer-events-none">
                      <circle r="12" fill="#ffffff" opacity="0.25" className="animate-ping" />
                      <circle r="6" fill="#ffffff" stroke={item.color} strokeWidth="2.5" />
                    </g>
                  )}

                  {/* Upazila Name Labels */}
                  {labelsVisible && (
                    <g
                      transform={`translate(${item.centroid.x}, ${item.centroid.y + (isFocal ? 18 : 6)})`}
                      className="pointer-events-none select-none text-center"
                    >
                      {/* Text Background for crystal clear legibility */}
                      <rect
                        x="-48"
                        y="-12"
                        width="96"
                        height="20"
                        rx="4"
                        fill={isDark ? '#090d16' : '#ffffff'}
                        fillOpacity={isFocal ? 0.85 : 0.65}
                        stroke={isFocal ? item.color : 'none'}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="2"
                        textAnchor="middle"
                        className={`text-[12px] font-bold ${
                          isFocal
                            ? isDark ? 'fill-white font-extrabold' : 'fill-slate-900 font-extrabold'
                            : isDark ? 'fill-slate-200' : 'fill-slate-800'
                        }`}
                        style={{ fontFamily: 'inherit' }}
                      >
                        {language === 'bn' ? item.nameBn : item.name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Prominent District Rivers (Kangsha, Someshwari, Mogra, Dhanu) */}
          <g id="rivers-overlay" className="pointer-events-none opacity-70">
            {/* Someshwari River (Birishiri & Durgapur from Garo hills into Kangsha) */}
            <path
              d="M 280 40 Q 270 100, 240 180 T 260 220 T 320 280"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="4 2"
              className="animate-pulse"
            />
            {/* Mogra River (flowing through Sadar and Atpara) */}
            <path
              d="M 240 260 Q 320 330, 360 410 T 430 490 T 520 540"
              fill="none"
              stroke="#67e8f9"
              strokeWidth="2"
            />
            {/* Kangsha & Dhanu River (Haor basin through Mohanganj & Khaliajuri) */}
            <path
              d="M 380 205 Q 490 280, 580 340 T 670 410 T 730 480 T 790 560"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />
          </g>

          {/* Border District Indicators */}
          <g id="border-annotations" className="text-[10px] fill-slate-400 font-medium pointer-events-none select-none">
            {/* Meghalaya / Garo Hills (North) */}
            <text x="400" y="25" textAnchor="middle" className="fill-emerald-400 font-semibold">
              ↑ {language === 'bn' ? 'মেঘালয় রাজ্য, ভারত (গারো পাহাড়)' : 'Meghalaya State, India (Garo Hills)'}
            </text>
            {/* Sunamganj Haor (East) */}
            <text x="830" y="280" textAnchor="start" className="fill-blue-400 font-semibold">
              → {language === 'bn' ? 'সুনামগঞ্জ জেলা (হাওরাঞ্চল)' : 'Sunamganj'}
            </text>
            {/* Kishoreganj (South) */}
            <text x="450" y="710" textAnchor="middle" className="fill-amber-400 font-semibold">
              ↓ {language === 'bn' ? 'কিশোরগঞ্জ জেলা' : 'Kishoreganj District'}
            </text>
            {/* Mymensingh (West) */}
            <text x="40" y="320" textAnchor="middle" transform="rotate(-90 40 320)" className="fill-teal-400 font-semibold">
              ← {language === 'bn' ? 'ময়মনসিংহ জেলা' : 'Mymensingh'}
            </text>
          </g>
        </svg>

        {/* Floating Tooltip during Hover (if not selected) */}
        {hoveredId && (
          <div
            className={`absolute top-4 right-4 pointer-events-none z-30 px-3.5 py-2 rounded-xl backdrop-blur-md shadow-xl border animate-in fade-in zoom-in-95 duration-150 ${
              isDark ? 'bg-slate-900/90 border-slate-700 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeUpazila ? UPAZILA_SVG_PATHS.find(p => p.id === activeUpazila.id)?.color : '#0d9488' }} />
              <h5 className="font-bold text-sm">
                {language === 'bn' ? activeUpazila.nameBn : activeUpazila.name}
              </h5>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {language === 'bn' ? `${activeUpazila.unionsCount}টি ইউনিয়ন` : `${activeUpazila.unionsCount} Unions`} • {language === 'bn' ? `${activeUpazila.areaKm2} বর্গ কিমি` : `${activeUpazila.areaKm2} km²`}
            </div>
          </div>
        )}
      </div>

      {/* Upazila Quick Badges Selector */}
      <div className="w-full flex items-center justify-center flex-wrap gap-1.5 mt-2 px-1">
        {UPAZILA_SVG_PATHS.map((item) => {
          const isSelected = (internalSelectedId || hoveredId) === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleUpazilaClick(item.id)}
              onMouseEnter={() => interactive && setHoveredId(item.id)}
              onMouseLeave={() => interactive && setHoveredId(null)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-white text-slate-900 shadow-md border-white scale-105 font-bold'
                  : isDark
                  ? 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                  : 'bg-white/90 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span>{language === 'bn' ? item.nameBn : item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Upazila Detailed Information Card Preview (if enabled) */}
      {showInfoCard && activeUpazila && (
        <div
          className={`w-full mt-4 p-4 sm:p-5 rounded-2xl border backdrop-blur-md transition-all ${
            isDark
              ? 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
              : 'bg-white border-slate-200 text-slate-900 shadow-lg'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-inner shrink-0"
                style={{ backgroundColor: UPAZILA_SVG_PATHS.find(p => p.id === activeUpazila.id)?.color || '#0d9488' }}
              >
                {activeUpazila.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-extrabold tracking-tight">
                    {language === 'bn' ? activeUpazila.nameBn : activeUpazila.name}
                  </h4>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    isDark ? 'bg-slate-800 text-teal-400 border border-slate-700' : 'bg-teal-50 text-teal-700 border border-teal-200'
                  }`}>
                    {language === 'bn' ? 'উপজেলা' : 'Upazila'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {language === 'bn' ? 'সদর দপ্তর:' : 'Headquarters:'} {language === 'bn' ? activeUpazila.headquartersBn : activeUpazila.headquarters}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to={`/upazilas/${activeUpazila.slug}`}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>{language === 'bn' ? 'উপজেলা তথ্য দেখুন' : 'View Upazila'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${activeUpazila.coordinates.lat},${activeUpazila.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-1.5 rounded-lg text-xs transition-colors border ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                }`}
                title="Google Maps"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Stat Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-1">
            <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-100'}`}>
              <div className="text-[11px] text-slate-400">{language === 'bn' ? 'মোট জনসংখ্যা' : 'Population'}</div>
              <div className="text-sm font-bold text-white mt-0.5">
                {language === 'bn' ? `${activeUpazila.population.toLocaleString('bn-BD')} জন` : activeUpazila.population.toLocaleString()}
              </div>
            </div>
            <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-100'}`}>
              <div className="text-[11px] text-slate-400">{language === 'bn' ? 'মোট আয়তন' : 'Total Area'}</div>
              <div className="text-sm font-bold text-white mt-0.5">
                {language === 'bn' ? `${activeUpazila.areaKm2} বর্গ কিমি` : `${activeUpazila.areaKm2} km²`}
              </div>
            </div>
            <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-100'}`}>
              <div className="text-[11px] text-slate-400">{language === 'bn' ? 'ইউনিয়ন সংখ্যা' : 'Unions'}</div>
              <div className="text-sm font-bold text-white mt-0.5">
                {language === 'bn' ? `${activeUpazila.unionsCount}টি` : activeUpazila.unionsCount}
              </div>
            </div>
            <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-100'}`}>
              <div className="text-[11px] text-slate-400">{language === 'bn' ? 'গ্রাম সংখ্যা' : 'Villages'}</div>
              <div className="text-sm font-bold text-white mt-0.5">
                {language === 'bn' ? `${activeUpazila.villagesCount}টি` : activeUpazila.villagesCount}
              </div>
            </div>
          </div>

          {/* Highlights */}
          {activeUpazila.highlights && activeUpazila.highlights.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto text-xs text-slate-400 pt-1">
              <span className="font-semibold text-slate-300 shrink-0">
                {language === 'bn' ? 'প্রধান আকর্ষণ:' : 'Key Highlights:'}
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(language === 'bn' ? activeUpazila.highlightsBn : activeUpazila.highlights).slice(0, 3).map((hl, i) => (
                  <span key={i} className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                    isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                  }`}>
                    • {hl}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mapped Unions List for Selected Upazila */}
          {activeUpazila && (
            <div className="mt-4 pt-3 border-t border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <span>
                    {language === 'bn' ? `${activeUpazila.nameBn} উপজেলার ইউনিয়নসমূহ (${activeUpazila.unionsCount}টি)` : `Mapped Unions of ${activeUpazila.name} (${activeUpazila.unionsCount})`}
                  </span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {language === 'bn' ? 'সঠিক জিপিএস স্থানাঙ্কসহ' : 'With GPS coordinates'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 max-h-48 overflow-y-auto pr-1">
                {(UNIONS_DATA[activeUpazila.id] || []).map((union) => (
                  <a
                    key={union.id}
                    href={`https://www.google.com/maps/search/?api=1&query=${union.coordinates.lat},${union.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-xl text-left border transition-all flex flex-col justify-between group ${
                      isDark
                        ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 hover:border-teal-500/50 text-slate-200'
                        : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-teal-500 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs group-hover:text-teal-400 transition-colors line-clamp-1">
                        {language === 'bn' ? union.nameBn : union.name}
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-teal-400 shrink-0" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                      <span>{union.coordinates.lat.toFixed(4)}°, {union.coordinates.lng.toFixed(4)}°</span>
                      {union.villagesCount && (
                        <span>{language === 'bn' ? `${union.villagesCount} গ্রাম` : `${union.villagesCount} vil.`}</span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

