// Live weather + air quality for Netrokona from Open-Meteo (free, no key, CORS-enabled).
import { useCallback, useEffect, useState } from 'react';

export const NETROKONA = { lat: 24.8833, lng: 90.7333 };

export interface DailyForecast { date: string; code: number; max: number; min: number; rainChance: number }
export interface LiveEnvironment {
  fetchedAt: number;
  weather: {
    temp: number;
    feelsLike: number;
    humidity: number;
    wind: number;
    code: number;
    isDay: boolean;
    uvMax: number | null;
    daily: DailyForecast[];
  };
  air: { aqi: number; pm25: number; pm10: number } | null;
}

const CACHE_KEY = 'nk-live-env-v1';
const MAX_AGE = 15 * 60_000;

async function fetchLive(): Promise<LiveEnvironment> {
  const q = `latitude=${NETROKONA.lat}&longitude=${NETROKONA.lng}&timezone=Asia%2FDhaka`;
  const [w, a] = await Promise.allSettled([
    fetch(
      `https://api.open-meteo.com/v1/forecast?${q}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day` +
        '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max&forecast_days=5',
    ).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`weather ${r.status}`)))),
    fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${q}&current=us_aqi,pm2_5,pm10`).then((r) =>
      r.ok ? r.json() : Promise.reject(new Error(`air ${r.status}`)),
    ),
  ]);
  if (w.status !== 'fulfilled') throw w.reason;
  const c = w.value.current;
  const d = w.value.daily;
  const air = a.status === 'fulfilled' && a.value.current?.us_aqi != null ? a.value.current : null;
  return {
    fetchedAt: Date.now(),
    weather: {
      temp: c.temperature_2m,
      feelsLike: c.apparent_temperature,
      humidity: c.relative_humidity_2m,
      wind: c.wind_speed_10m,
      code: c.weather_code,
      isDay: c.is_day === 1,
      uvMax: d.uv_index_max?.[0] ?? null,
      daily: d.time.map((t: string, i: number) => ({
        date: t,
        code: d.weather_code[i],
        max: d.temperature_2m_max[i],
        min: d.temperature_2m_min[i],
        rainChance: d.precipitation_probability_max?.[i] ?? 0,
      })),
    },
    air: air ? { aqi: air.us_aqi, pm25: air.pm2_5, pm10: air.pm10 } : null,
  };
}

function readCache(): LiveEnvironment | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as LiveEnvironment;
    return Date.now() - v.fetchedAt < MAX_AGE ? v : null;
  } catch {
    return null;
  }
}

export function useLiveEnvironment() {
  const [data, setData] = useState<LiveEnvironment | null>(() => readCache());
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(!data);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const v = await fetchLive();
      setData(v);
      setError(false);
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(v));
      } catch {
        /* storage unavailable: fine */
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!readCache()) void load();
    const id = window.setInterval(() => void load(), MAX_AGE);
    return () => window.clearInterval(id);
  }, [load]);

  return { data, error, loading, reload: load };
}

/** WMO weather codes → Bangla / English description. */
export function weatherLabel(code: number): { bn: string; en: string; kind: 'clear' | 'partly' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'storm' } {
  if (code === 0) return { bn: 'পরিষ্কার আকাশ', en: 'Clear sky', kind: 'clear' };
  if (code === 1) return { bn: 'প্রায় পরিষ্কার', en: 'Mainly clear', kind: 'clear' };
  if (code === 2) return { bn: 'আংশিক মেঘলা', en: 'Partly cloudy', kind: 'partly' };
  if (code === 3) return { bn: 'মেঘাচ্ছন্ন', en: 'Overcast', kind: 'cloudy' };
  if (code === 45 || code === 48) return { bn: 'কুয়াশা', en: 'Fog', kind: 'fog' };
  if (code >= 51 && code <= 57) return { bn: 'গুঁড়ি গুঁড়ি বৃষ্টি', en: 'Drizzle', kind: 'drizzle' };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { bn: 'বৃষ্টি', en: 'Rain', kind: 'rain' };
  if (code >= 95) return { bn: 'বজ্রসহ বৃষ্টি', en: 'Thunderstorm', kind: 'storm' };
  return { bn: 'মেঘলা', en: 'Cloudy', kind: 'cloudy' };
}

/** US AQI categories with plain-language advice. */
export function aqiCategory(aqi: number) {
  if (aqi <= 50) return { bn: 'ভালো', en: 'Good', tone: 'good' as const, adviceBn: 'বাইরে চলাফেরার জন্য উপযুক্ত।', adviceEn: 'Air quality is fine for outdoor activity.' };
  if (aqi <= 100) return { bn: 'মাঝারি', en: 'Moderate', tone: 'moderate' as const, adviceBn: 'অতি সংবেদনশীলরা দীর্ঘ সময় বাইরে পরিশ্রম কমান।', adviceEn: 'Unusually sensitive people should limit prolonged exertion outdoors.' };
  if (aqi <= 150) return { bn: 'সংবেদনশীলদের জন্য অস্বাস্থ্যকর', en: 'Unhealthy for sensitive groups', tone: 'sensitive' as const, adviceBn: 'শিশু, বয়স্ক ও শ্বাসকষ্টের রোগীরা বাইরে মাস্ক ব্যবহার করুন।', adviceEn: 'Children, older adults and people with breathing problems should wear a mask outdoors.' };
  if (aqi <= 200) return { bn: 'অস্বাস্থ্যকর', en: 'Unhealthy', tone: 'unhealthy' as const, adviceBn: 'সবাই বাইরে পরিশ্রম কমান, মাস্ক ব্যবহার করুন।', adviceEn: 'Everyone should reduce outdoor exertion and wear a mask.' };
  if (aqi <= 300) return { bn: 'খুবই অস্বাস্থ্যকর', en: 'Very unhealthy', tone: 'very' as const, adviceBn: 'যতটা সম্ভব ঘরে থাকুন।', adviceEn: 'Stay indoors as much as possible.' };
  return { bn: 'বিপজ্জনক', en: 'Hazardous', tone: 'hazard' as const, adviceBn: 'ঘরের বাইরে যাওয়া এড়িয়ে চলুন।', adviceEn: 'Avoid going outdoors.' };
}
