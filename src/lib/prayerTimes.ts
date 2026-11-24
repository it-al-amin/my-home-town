// Salah times from solar position (standard astronomical method, as published by PrayTimes.org).
// Settings follow common practice in Bangladesh: University of Islamic Sciences, Karachi
// (Fajr and Isha at 18° below the horizon) with Hanafi Asr (shadow factor 2).
// Results can differ from a local mosque timetable by a minute or two.

export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerDay {
  date: Date; // the civil date these times belong to (local Asia/Dhaka)
  times: Record<PrayerName, Date>;
  sunset: Date;
}

const DEG = Math.PI / 180;
const dsin = (d: number) => Math.sin(d * DEG);
const dcos = (d: number) => Math.cos(d * DEG);
const dtan = (d: number) => Math.tan(d * DEG);
const darcsin = (x: number) => Math.asin(x) / DEG;
const darccos = (x: number) => Math.acos(Math.max(-1, Math.min(1, x))) / DEG;
const darctan2 = (y: number, x: number) => Math.atan2(y, x) / DEG;
const darccot = (x: number) => Math.atan(1 / x) / DEG;
const fix = (a: number, b: number) => {
  const r = a - b * Math.floor(a / b);
  return r < 0 ? r + b : r;
};
const fixAngle = (a: number) => fix(a, 360);
const fixHour = (a: number) => fix(a, 24);

function julian(year: number, month: number, day: number) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function sunPosition(jd: number) {
  const D = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * dsin(g) + 0.02 * dsin(2 * g));
  const e = 23.439 - 0.00000036 * D;
  const RA = darctan2(dcos(e) * dsin(L), dcos(L)) / 15;
  return { declination: darcsin(dsin(e) * dsin(L)), equation: q / 15 - fixHour(RA) };
}

export const SETTINGS = { fajrAngle: 18, ishaAngle: 18, asrFactor: 2, riseSetAngle: 0.833, timezone: 6 } as const;

/** Prayer times for one civil date at the given coordinates (Bangladesh time, UTC+6). */
export function prayerTimesFor(date: { year: number; month: number; day: number }, lat: number, lng: number): PrayerDay {
  const jDate = julian(date.year, date.month, date.day) - lng / (15 * 24);

  const midDay = (t: number) => fixHour(12 - sunPosition(jDate + t).equation);
  const sunAngleTime = (angle: number, t: number, ccw = false) => {
    const decl = sunPosition(jDate + t).declination;
    const noon = midDay(t);
    const T = darccos((-dsin(angle) - dsin(decl) * dsin(lat)) / (dcos(decl) * dcos(lat))) / 15;
    return noon + (ccw ? -T : T);
  };
  const asrTime = (factor: number, t: number) => {
    const decl = sunPosition(jDate + t).declination;
    const angle = -darccot(factor + dtan(Math.abs(lat - decl)));
    return sunAngleTime(angle, t);
  };

  // Initial guesses (hours), refined twice.
  let h = { fajr: 5, sunrise: 6, dhuhr: 12, asr: 13, sunset: 18, isha: 18 };
  for (let i = 0; i < 2; i++) {
    h = {
      fajr: sunAngleTime(SETTINGS.fajrAngle, h.fajr / 24, true),
      sunrise: sunAngleTime(SETTINGS.riseSetAngle, h.sunrise / 24, true),
      dhuhr: midDay(h.dhuhr / 24),
      asr: asrTime(SETTINGS.asrFactor, h.asr / 24),
      sunset: sunAngleTime(SETTINGS.riseSetAngle, h.sunset / 24),
      isha: sunAngleTime(SETTINGS.ishaAngle, h.isha / 24),
    };
  }

  // Local solar time → Bangladesh clock time, then to a Date (rounded to the minute).
  const shift = SETTINGS.timezone - lng / 15;
  const toDate = (hours: number) => {
    const minutes = Math.round(fixHour(hours + shift) * 60);
    // midnight in Dhaka for that civil date, expressed in UTC
    const utcMidnight = Date.UTC(date.year, date.month - 1, date.day) - SETTINGS.timezone * 3600_000;
    return new Date(utcMidnight + minutes * 60_000);
  };

  const sunset = toDate(h.sunset);
  return {
    date: toDate(12),
    sunset,
    times: {
      fajr: toDate(h.fajr),
      sunrise: toDate(h.sunrise),
      dhuhr: toDate(h.dhuhr),
      asr: toDate(h.asr),
      maghrib: sunset,
      isha: toDate(h.isha),
    },
  };
}

/** Today's civil date in Bangladesh. */
export function dhakaToday(now = new Date()) {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka', year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(now)
    .reduce<Record<string, string>>((o, x) => ((o[x.type] = x.value), o), {});
  return { year: +p.year, month: +p.month, day: +p.day };
}

export const PRAYER_ORDER: Exclude<PrayerName, 'sunrise'>[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export const PRAYER_LABELS: Record<PrayerName, { bn: string; en: string }> = {
  fajr: { bn: 'ফজর', en: 'Fajr' },
  sunrise: { bn: 'সূর্যোদয়', en: 'Sunrise' },
  dhuhr: { bn: 'যোহর', en: 'Dhuhr' },
  asr: { bn: 'আসর', en: 'Asr' },
  maghrib: { bn: 'মাগরিব', en: 'Maghrib' },
  isha: { bn: 'এশা', en: 'Isha' },
};
