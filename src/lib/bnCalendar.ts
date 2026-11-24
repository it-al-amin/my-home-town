// Calendar helpers: Bangladesh (revised) Bangla calendar, seasons, Hijri date and moon phase.

export const toBnDigits = (v: number | string) => String(v).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);

const BANGLA_MONTHS = ['বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন', 'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'];
const BANGLA_MONTHS_EN = ['Boishakh', 'Jyoishtho', 'Asharh', 'Srabon', 'Bhadro', 'Ashwin', 'Kartik', 'Agrahayan', 'Poush', 'Magh', 'Falgun', 'Chaitra'];
const SEASONS = [
  { bn: 'গ্রীষ্মকাল', en: 'Summer' },
  { bn: 'বর্ষাকাল', en: 'Monsoon' },
  { bn: 'শরৎকাল', en: 'Autumn' },
  { bn: 'হেমন্তকাল', en: 'Late autumn' },
  { bn: 'শীতকাল', en: 'Winter' },
  { bn: 'বসন্তকাল', en: 'Spring' },
];

/** Civil date parts in Bangladesh time. */
export function dhakaParts(d: Date) {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka', year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(d)
    .reduce<Record<string, string>>((o, x) => ((o[x.type] = x.value), o), {});
  return { year: +p.year, month: +p.month, day: +p.day };
}

const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

/**
 * Bangladesh revised Bangla calendar (2019): 1 Boishakh = 14 April; Boishakh–Ashwin have 31 days,
 * Kartik–Magh and Chaitra 30, Falgun 29 (30 when the Gregorian year containing it is a leap year).
 */
export function banglaDate(d: Date) {
  const { year, month, day } = dhakaParts(d);
  const beforeNewYear = month < 4 || (month === 4 && day < 14);
  const startYear = beforeNewYear ? year - 1 : year;
  const start = Date.UTC(startYear, 3, 14);
  let offset = Math.round((Date.UTC(year, month - 1, day) - start) / 86400000);
  const lengths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, isLeap(startYear + 1) ? 30 : 29, 30];
  let m = 0;
  while (m < 11 && offset >= lengths[m]) {
    offset -= lengths[m];
    m++;
  }
  const bnYear = startYear - 593;
  return {
    day: offset + 1,
    monthIndex: m,
    monthBn: BANGLA_MONTHS[m],
    monthEn: BANGLA_MONTHS_EN[m],
    year: bnYear,
    season: SEASONS[Math.floor(m / 2)],
  };
}

const HIJRI_MONTHS_BN = ['মহররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি', 'জমাদিউল আউয়াল', 'জমাদিউস সানি', 'রজব', 'শাবান', 'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ'];
const HIJRI_MONTHS_EN = ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban', 'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'];

/** Hijri date (Umm al-Qura tables). Bangladesh follows local moon sighting, so it may differ by a day. */
export function hijriDate(d: Date) {
  try {
    const p = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { timeZone: 'Asia/Dhaka', day: 'numeric', month: 'numeric', year: 'numeric' })
      .formatToParts(d)
      .reduce<Record<string, string>>((o, x) => ((o[x.type] = x.value), o), {});
    const m = +p.month - 1;
    return { day: +p.day, monthBn: HIJRI_MONTHS_BN[m], monthEn: HIJRI_MONTHS_EN[m], year: parseInt(p.year, 10), monthIndex: m };
  } catch {
    return null;
  }
}

/** Moon phase from the mean synodic month (good to within about a day). */
export function moonPhase(d: Date) {
  const SYNODIC = 29.530588853;
  const REF_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);
  const age = ((((d.getTime() - REF_NEW_MOON) / 86400000) % SYNODIC) + SYNODIC) % SYNODIC;
  const illumination = Math.round(((1 - Math.cos((2 * Math.PI * age) / SYNODIC)) / 2) * 100);
  const waxing = age < SYNODIC / 2;
  let name: { bn: string; en: string };
  if (age < 1.2 || age > SYNODIC - 1.2) name = { bn: 'অমাবস্যা', en: 'New moon' };
  else if (Math.abs(age - SYNODIC / 2) < 1.2) name = { bn: 'পূর্ণিমা', en: 'Full moon' };
  else name = waxing ? { bn: 'শুক্লপক্ষ (চাঁদ বাড়ছে)', en: 'Waxing' } : { bn: 'কৃষ্ণপক্ষ (চাঁদ কমছে)', en: 'Waning' };
  return { age, illumination, waxing, name };
}
