import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sun, Moon, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudLightning,
  Droplets, Wind, Thermometer, RefreshCw, ArrowRight, Leaf, CalendarDays, Clock3,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useLiveEnvironment, weatherLabel, aqiCategory } from '../../lib/useLiveEnvironment';
import { prayerTimesFor, PRAYER_ORDER, PRAYER_LABELS, type PrayerName } from '../../lib/prayerTimes';
import { banglaDate, hijriDate, moonPhase, toBnDigits, dhakaParts } from '../../lib/bnCalendar';

const NETROKONA_SADAR = { lat: 24.8833, lng: 90.7333 };

/** Ticks every second (pauses when the tab is hidden). */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!document.hidden) setNow(new Date());
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

export const WeatherIcon: React.FC<{ code: number; isDay?: boolean; className?: string }> = ({ code, isDay = true, className = 'w-6 h-6' }) => {
  const kind = weatherLabel(code).kind;
  const Icon =
    kind === 'clear' ? (isDay ? Sun : Moon) :
    kind === 'partly' ? CloudSun :
    kind === 'fog' ? CloudFog :
    kind === 'drizzle' ? CloudDrizzle :
    kind === 'rain' ? CloudRain :
    kind === 'storm' ? CloudLightning : Cloud;
  const tone = kind === 'clear' ? (isDay ? 'text-amber-500' : 'text-indigo-400') : kind === 'rain' || kind === 'storm' || kind === 'drizzle' ? 'text-sky-600' : 'text-slate-500';
  return <Icon className={`${className} ${tone}`} aria-hidden="true" />;
};

const AQI_TONE: Record<string, { bar: string; chip: string }> = {
  good: { bar: 'bg-emerald-500', chip: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200' },
  moderate: { bar: 'bg-yellow-400', chip: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-200' },
  sensitive: { bar: 'bg-orange-500', chip: 'bg-orange-100 text-orange-900 dark:bg-orange-900/40 dark:text-orange-200' },
  unhealthy: { bar: 'bg-red-500', chip: 'bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-200' },
  very: { bar: 'bg-purple-600', chip: 'bg-purple-100 text-purple-900 dark:bg-purple-900/40 dark:text-purple-200' },
  hazard: { bar: 'bg-rose-900', chip: 'bg-rose-200 text-rose-950 dark:bg-rose-950/60 dark:text-rose-200' },
};

export const MoonGlyph: React.FC<{ illumination: number; waxing: boolean; size?: number }> = ({ illumination, waxing, size = 44 }) => {
  // Terminator as an ellipse: x-radius goes from r (new) through 0 (half) to r (full).
  const r = size / 2 - 2;
  const k = 1 - (2 * illumination) / 100; // 1 → -1
  const rx = Math.abs(k) * r;
  const sweepLit = waxing ? 1 : 0;
  const cx = size / 2;
  const top = `${cx} ${cx - r}`;
  const bottom = `${cx} ${cx + r}`;
  const d = `M ${top} A ${r} ${r} 0 0 ${sweepLit} ${bottom} A ${rx} ${r} 0 0 ${k > 0 ? 1 - sweepLit : sweepLit} ${top} Z`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={cx} cy={cx} r={r} className="fill-slate-300 dark:fill-slate-600" />
      <path d={d} className="fill-amber-200 dark:fill-amber-100" />
      <circle cx={cx} cy={cx} r={r} fill="none" className="stroke-slate-400/50" />
    </svg>
  );
};

const card = 'rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur p-4 sm:p-5 shadow-sm flex flex-col gap-3 min-w-0';
const cardTitle = 'flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200';

export const LivePanel: React.FC<{ showLinks?: boolean }> = ({ showLinks = true }) => {
  const { language } = useLanguage();
  const bn = language === 'bn';
  const now = useNow();
  const { data, error, loading, reload } = useLiveEnvironment();

  const num = (v: number | string) => (bn ? toBnDigits(v) : String(v));
  const time = (d: Date, seconds = false) =>
    d.toLocaleTimeString(bn ? 'bn-BD' : 'en-US', { timeZone: 'Asia/Dhaka', hour: 'numeric', minute: '2-digit', ...(seconds ? { second: '2-digit' } : {}) });

  const today = dhakaParts(now);
  const todayKey = `${today.year}-${today.month}-${today.day}`;
  const prayers = useMemo(
    () => prayerTimesFor(today, NETROKONA_SADAR.lat, NETROKONA_SADAR.lng),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [todayKey],
  );
  const tomorrowFajr = useMemo(() => {
    const t = new Date(Date.UTC(today.year, today.month - 1, today.day + 1));
    return prayerTimesFor({ year: t.getUTCFullYear(), month: t.getUTCMonth() + 1, day: t.getUTCDate() }, NETROKONA_SADAR.lat, NETROKONA_SADAR.lng).times.fajr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayKey]);

  const next = PRAYER_ORDER.map((p) => ({ p, at: prayers.times[p] })).find((x) => x.at > now) ?? { p: 'fajr' as PrayerName, at: tomorrowFajr };
  const current = [...PRAYER_ORDER].reverse().find((p) => prayers.times[p] <= now);
  const left = Math.max(0, Math.floor((next.at.getTime() - now.getTime()) / 1000));
  const countdown = `${Math.floor(left / 3600)}:${String(Math.floor((left % 3600) / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`;

  const bd = banglaDate(now);
  const hj = hijriDate(now);
  const moon = moonPhase(now);
  const weekday = now.toLocaleDateString(bn ? 'bn-BD' : 'en-GB', { timeZone: 'Asia/Dhaka', weekday: 'long' });
  const english = now.toLocaleDateString(bn ? 'bn-BD' : 'en-GB', { timeZone: 'Asia/Dhaka', day: 'numeric', month: 'long', year: 'numeric' });

  const w = data?.weather;
  const wl = w ? weatherLabel(w.code) : null;
  const aqi = data?.air ? aqiCategory(data.air.aqi) : null;
  const dayName = (iso: string) => new Date(iso + 'T12:00:00+06:00').toLocaleDateString(bn ? 'bn-BD' : 'en-GB', { weekday: 'short' });

  return (
    <div className="space-y-4">
      {/* Clock line */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">{bn ? 'লাইভ' : 'Live'}</span>
          <span className="text-2xl sm:text-3xl font-black tabular-nums text-slate-900 dark:text-white" aria-live="off">
            {time(now, true)}
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {weekday} · {english} · {bn ? `${num(bd.day)} ${bd.monthBn} ${num(bd.year)}` : `${bd.day} ${bd.monthEn} ${bd.year} BS`} · {bn ? bd.season.bn : bd.season.en}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Weather */}
        <section className={card} aria-label={bn ? 'আবহাওয়া' : 'Weather'}>
          <div className="flex items-center justify-between">
            <h3 className={cardTitle}><Thermometer className="w-4 h-4 text-emerald-600" />{bn ? 'আবহাওয়া' : 'Weather'}</h3>
            <button type="button" onClick={() => void reload()} className="p-2 -m-2 text-slate-400 hover:text-emerald-700" aria-label={bn ? 'হালনাগাদ করুন' : 'Refresh'}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          {w && wl ? (
            <>
              <div className="flex items-center gap-3">
                <WeatherIcon code={w.code} isDay={w.isDay} className="w-12 h-12" />
                <div>
                  <div className="text-4xl font-black tabular-nums text-slate-900 dark:text-white leading-none">{num(Math.round(w.temp))}°</div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1">{bn ? wl.bn : wl.en}</div>
                </div>
                <div className="ms-auto text-right text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  <div>↑ {num(Math.round(w.daily[0]?.max ?? w.temp))}°</div>
                  <div>↓ {num(Math.round(w.daily[0]?.min ?? w.temp))}°</div>
                </div>
              </div>
              <dl className="grid grid-cols-3 gap-2 text-center">
                {[
                  [Thermometer, bn ? 'অনুভূত' : 'Feels', `${num(Math.round(w.feelsLike))}°`],
                  [Droplets, bn ? 'আর্দ্রতা' : 'Humidity', `${num(w.humidity)}%`],
                  [Wind, bn ? 'বাতাস' : 'Wind', `${num(Math.round(w.wind))} ${bn ? 'কিমি/ঘ' : 'km/h'}`],
                ].map(([Icon, label, value]) => {
                  const I = Icon as typeof Wind;
                  return (
                    <div key={label as string} className="rounded-xl bg-slate-50 dark:bg-slate-800 py-2">
                      <dt className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1"><I className="w-3 h-3" />{label as string}</dt>
                      <dd className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">{value as string}</dd>
                    </div>
                  );
                })}
              </dl>
              <ul className="grid grid-cols-4 gap-1 text-center border-t border-slate-100 dark:border-slate-800 pt-3">
                {w.daily.slice(1, 5).map((d) => (
                  <li key={d.date} className="text-[11px] text-slate-600 dark:text-slate-300">
                    <div className="font-semibold">{dayName(d.date)}</div>
                    <WeatherIcon code={d.code} className="w-5 h-5 mx-auto my-1" />
                    <div className="tabular-nums font-bold text-slate-900 dark:text-white">{num(Math.round(d.max))}°<span className="text-slate-400 font-normal">/{num(Math.round(d.min))}°</span></div>
                    <div className="tabular-nums text-sky-700 dark:text-sky-400">{num(d.rainChance)}%</div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">
              {error ? (bn ? 'আবহাওয়ার তথ্য আনা যায়নি। আবার চেষ্টা করুন।' : 'Could not load the weather. Try again.') : bn ? 'লোড হচ্ছে…' : 'Loading…'}
            </p>
          )}
          <p className="mt-auto text-[11px] text-slate-400">{bn ? 'তথ্য: Open-Meteo' : 'Data: Open-Meteo'}</p>
        </section>

        {/* Air quality */}
        <section className={card} aria-label={bn ? 'বায়ুর মান' : 'Air quality'}>
          <h3 className={cardTitle}><Leaf className="w-4 h-4 text-emerald-600" />{bn ? 'বায়ুর মান ও পরিবেশ' : 'Air quality & environment'}</h3>
          {data?.air && aqi ? (
            <>
              <div className="flex items-end gap-3">
                <div className="text-4xl font-black tabular-nums text-slate-900 dark:text-white leading-none">{num(data.air.aqi)}</div>
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${AQI_TONE[aqi.tone].chip}`}>{bn ? aqi.bn : aqi.en}</span>
              </div>
              <div className="relative h-2 rounded-full bg-gradient-to-r from-emerald-500 via-yellow-400 via-40% to-purple-600" aria-hidden="true">
                <span
                  className="absolute -top-1 w-1 h-4 rounded bg-slate-900 dark:bg-white"
                  style={{ left: `${Math.min(100, (data.air.aqi / 300) * 100)}%` }}
                />
              </div>
              <p className="text-[13px] text-slate-600 dark:text-slate-300">{bn ? aqi.adviceBn : aqi.adviceEn}</p>
              <dl className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800 py-2">
                  <dt className="text-[11px] text-slate-500 dark:text-slate-400">PM2.5</dt>
                  <dd className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">{num(Math.round(data.air.pm25))}</dd>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800 py-2">
                  <dt className="text-[11px] text-slate-500 dark:text-slate-400">PM10</dt>
                  <dd className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">{num(Math.round(data.air.pm10))}</dd>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800 py-2">
                  <dt className="text-[11px] text-slate-500 dark:text-slate-400">{bn ? 'ইউভি সূচক' : 'UV index'}</dt>
                  <dd className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">{w?.uvMax != null ? num(Math.round(w.uvMax)) : '—'}</dd>
                </div>
              </dl>
            </>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">
              {error ? (bn ? 'বায়ুর মানের তথ্য পাওয়া যায়নি।' : 'Air-quality data unavailable.') : bn ? 'লোড হচ্ছে…' : 'Loading…'}
            </p>
          )}
          <p className="mt-auto text-[11px] text-slate-400">{bn ? 'মার্কিন AQI মানদণ্ড · তথ্য: Open-Meteo' : 'US AQI scale · Data: Open-Meteo'}</p>
        </section>

        {/* Prayer times */}
        <section className={card} aria-label={bn ? 'নামাজের সময়' : 'Prayer times'}>
          <h3 className={cardTitle}><Clock3 className="w-4 h-4 text-emerald-600" />{bn ? 'নামাজের সময়' : 'Prayer times'}</h3>
          <div className="rounded-xl bg-gradient-to-br from-emerald-700 to-teal-700 text-white px-4 py-3">
            <div className="text-xs opacity-90">{bn ? 'পরের নামাজ' : 'Next prayer'}</div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xl font-black">{bn ? PRAYER_LABELS[next.p].bn : PRAYER_LABELS[next.p].en}</span>
              <span className="text-lg font-bold tabular-nums">{time(next.at)}</span>
            </div>
            <div className="text-xs opacity-90 tabular-nums">{bn ? `শুরু হতে বাকি ${toBnDigits(countdown)}` : `Starts in ${countdown}`}</div>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {PRAYER_ORDER.map((p) => (
              <li
                key={p}
                className={`flex items-center justify-between py-1.5 text-sm ${
                  current === p ? 'font-bold text-emerald-800 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  {current === p && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" aria-hidden="true" />}
                  {bn ? PRAYER_LABELS[p].bn : PRAYER_LABELS[p].en}
                </span>
                <span className="tabular-nums">{time(prayers.times[p])}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 py-1.5 text-amber-900 dark:text-amber-200">
              {bn ? 'সূর্যোদয়' : 'Sunrise'} <b className="tabular-nums">{time(prayers.times.sunrise)}</b>
            </div>
            <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 py-1.5 text-orange-900 dark:text-orange-200">
              {bn ? 'সূর্যাস্ত' : 'Sunset'} <b className="tabular-nums">{time(prayers.sunset)}</b>
            </div>
          </div>
          <p className="mt-auto text-[11px] text-slate-400">
            {bn ? 'নেত্রকোণা সদর · করাচি পদ্ধতি, হানাফি আসর। মসজিদের সময়ের সাথে ১–২ মিনিট পার্থক্য হতে পারে।' : 'Netrokona Sadar · Karachi method, Hanafi Asr. May differ from mosque times by 1–2 min.'}
          </p>
        </section>

        {/* Today */}
        <section className={card} aria-label={bn ? 'আজকের তারিখ' : 'Today'}>
          <h3 className={cardTitle}><CalendarDays className="w-4 h-4 text-emerald-600" />{bn ? 'আজকের তারিখ' : 'Today'}</h3>
          <dl className="space-y-2.5 text-sm">
            <div>
              <dt className="text-[11px] text-slate-500 dark:text-slate-400">{bn ? 'বাংলা' : 'Bangla calendar'}</dt>
              <dd className="font-bold text-slate-900 dark:text-white">
                {bn ? `${num(bd.day)} ${bd.monthBn}, ${num(bd.year)} বঙ্গাব্দ` : `${bd.day} ${bd.monthEn}, ${bd.year} BS`}
                <span className="ms-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">{bn ? bd.season.bn : bd.season.en}</span>
              </dd>
            </div>
            {hj && (
              <div>
                <dt className="text-[11px] text-slate-500 dark:text-slate-400">{bn ? 'হিজরি' : 'Hijri'}</dt>
                <dd className="font-bold text-slate-900 dark:text-white">{bn ? `${num(hj.day)} ${hj.monthBn}, ${num(hj.year)} হিজরি` : `${hj.day} ${hj.monthEn}, ${hj.year} AH`}</dd>
              </div>
            )}
            <div>
              <dt className="text-[11px] text-slate-500 dark:text-slate-400">{bn ? 'ইংরেজি' : 'Gregorian'}</dt>
              <dd className="font-bold text-slate-900 dark:text-white">{weekday}, {english}</dd>
            </div>
          </dl>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-800 px-3 py-2">
            <MoonGlyph illumination={moon.illumination} waxing={moon.waxing} />
            <div className="text-sm">
              <div className="font-bold text-slate-900 dark:text-white">{bn ? moon.name.bn : moon.name.en}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">{bn ? `${num(moon.illumination)}% আলোকিত` : `${moon.illumination}% illuminated`}</div>
            </div>
          </div>
          <p className="mt-auto text-[11px] text-slate-400">
            {bn ? 'হিজরি তারিখ চাঁদ দেখার ওপর নির্ভর করে, এক দিন কমবেশি হতে পারে।' : 'The Hijri date depends on moon sighting and may differ by a day.'}
          </p>
        </section>
      </div>

      {showLinks && (
        <div className="flex justify-end">
          <Link to="/live" className="inline-flex items-center gap-1.5 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
            {bn ? 'মাসিক নামাজের সময়সূচি ও বিস্তারিত' : 'Monthly prayer timetable & details'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};
