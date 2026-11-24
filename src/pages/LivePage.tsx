import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Printer, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { LivePanel } from '../components/live/LivePanel';
import { UPAZILAS_DATA } from '../data/upazilas';
import { prayerTimesFor, dhakaToday, PRAYER_LABELS, type PrayerName } from '../lib/prayerTimes';
import { toBnDigits, banglaDate } from '../lib/bnCalendar';

const COLUMNS: PrayerName[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

export const LivePage: React.FC = () => {
  const { language } = useLanguage();
  const bn = language === 'bn';
  const today = dhakaToday();
  const [ym, setYm] = useState({ year: today.year, month: today.month });
  const [upazilaId, setUpazilaId] = useState('netrokona-sadar');
  const upazila = UPAZILAS_DATA.find((u) => u.id === upazilaId) ?? UPAZILAS_DATA[0];

  const days = useMemo(() => {
    const count = new Date(Date.UTC(ym.year, ym.month, 0)).getUTCDate();
    return Array.from({ length: count }, (_, i) => {
      const date = { year: ym.year, month: ym.month, day: i + 1 };
      return { ...date, p: prayerTimesFor(date, upazila.coordinates.lat, upazila.coordinates.lng) };
    });
  }, [ym, upazila]);

  const shift = (delta: number) =>
    setYm(({ year, month }) => {
      const m = month + delta;
      return m < 1 ? { year: year - 1, month: 12 } : m > 12 ? { year: year + 1, month: 1 } : { year, month: m };
    });

  const time = (d: Date) => d.toLocaleTimeString(bn ? 'bn-BD' : 'en-US', { timeZone: 'Asia/Dhaka', hour: 'numeric', minute: '2-digit' });
  const monthTitle = new Date(Date.UTC(ym.year, ym.month - 1, 15)).toLocaleDateString(bn ? 'bn-BD' : 'en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      <Breadcrumb items={[{ label: 'Live: weather & prayer times', labelBn: 'লাইভ: আবহাওয়া ও নামাজের সময়' }]} />

      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          {bn ? 'আজ নেত্রকোণায়' : 'Today in Netrokona'}
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          {bn
            ? 'লাইভ আবহাওয়া, বায়ুর মান, নামাজের সময় ও আজকের বাংলা-হিজরি তারিখ।'
            : 'Live weather, air quality, prayer times and today’s Bangla and Hijri dates.'}
        </p>
      </header>

      <LivePanel showLinks={false} />

      {/* Monthly prayer timetable */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-6 space-y-4" aria-labelledby="timetable-heading">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 print:hidden">
          <h2 id="timetable-heading" className="text-xl font-black text-slate-900 dark:text-white">
            {bn ? 'মাসিক নামাজের সময়সূচি' : 'Monthly prayer timetable'}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <span className="sr-only">{bn ? 'উপজেলা' : 'Upazila'}</span>
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 pointer-events-none" aria-hidden="true" />
              <select
                value={upazilaId}
                onChange={(e) => setUpazilaId(e.target.value)}
                className="h-10 pl-9 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-100"
              >
                {UPAZILAS_DATA.map((u) => (
                  <option key={u.id} value={u.id}>{bn ? u.nameBn : u.name}</option>
                ))}
              </select>
            </label>
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <button type="button" onClick={() => shift(-1)} className="h-10 w-10 inline-flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800" aria-label={bn ? 'আগের মাস' : 'Previous month'}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 text-sm font-bold text-slate-800 dark:text-slate-100 min-w-32 text-center">{monthTitle}</span>
              <button type="button" onClick={() => shift(1)} className="h-10 w-10 inline-flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800" aria-label={bn ? 'পরের মাস' : 'Next month'}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button type="button" onClick={() => window.print()} className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">
              <Printer className="w-4 h-4" /> {bn ? 'প্রিন্ট' : 'Print'}
            </button>
          </div>
        </div>
        <p className="hidden print:block text-lg font-bold">
          {bn ? `${upazila.nameBn} — নামাজের সময়সূচি, ${monthTitle}` : `${upazila.name} — prayer timetable, ${monthTitle}`}
        </p>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <th className="py-2 px-4 sm:px-2 font-semibold">{bn ? 'তারিখ' : 'Date'}</th>
                {COLUMNS.map((c) => (
                  <th key={c} className={`py-2 px-2 font-semibold text-right ${c === 'sunrise' ? 'text-amber-700 dark:text-amber-400' : ''}`}>
                    {bn ? PRAYER_LABELS[c].bn : PRAYER_LABELS[c].en}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((d) => {
                const isToday = d.year === today.year && d.month === today.month && d.day === today.day;
                const jsDate = new Date(Date.UTC(d.year, d.month - 1, d.day, 6));
                const isFriday = jsDate.getUTCDay() === 5;
                const b = banglaDate(jsDate);
                return (
                  <tr
                    key={d.day}
                    aria-current={isToday ? 'date' : undefined}
                    className={`border-b border-slate-100 dark:border-slate-800 last:border-0 ${
                      isToday ? 'bg-emerald-50 dark:bg-emerald-950/40 font-bold' : isFriday ? 'bg-slate-50/70 dark:bg-slate-800/40' : ''
                    }`}
                  >
                    <td className="py-2 px-4 sm:px-2 whitespace-nowrap">
                      <span className="tabular-nums text-slate-900 dark:text-white">{bn ? toBnDigits(d.day) : d.day}</span>
                      <span className="ms-2 text-xs text-slate-500 dark:text-slate-400">
                        {jsDate.toLocaleDateString(bn ? 'bn-BD' : 'en-GB', { weekday: 'short', timeZone: 'UTC' })}
                        {bn && ` · ${toBnDigits(b.day)} ${b.monthBn}`}
                      </span>
                      {isFriday && <span className="ms-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">{bn ? 'জুমা' : 'Jumu’ah'}</span>}
                    </td>
                    {COLUMNS.map((c) => (
                      <td key={c} className={`py-2 px-2 text-right tabular-nums ${c === 'sunrise' ? 'text-amber-800 dark:text-amber-300' : 'text-slate-800 dark:text-slate-200'}`}>
                        {time(d.p.times[c])}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {bn
            ? 'হিসাব: করাচি পদ্ধতি (ফজর ও এশা সূর্য দিগন্তের ১৮° নিচে), হানাফি আসর। রমজানে সেহরির শেষ সময় = ফজরের শুরু, ইফতার = মাগরিব। স্থানীয় মসজিদের সময়ের সাথে ১–২ মিনিট পার্থক্য হতে পারে।'
            : 'Method: Karachi (Fajr and Isha at 18° below the horizon), Hanafi Asr. In Ramadan, Sehri ends at Fajr and Iftar is at Maghrib. May differ from local mosque times by 1–2 minutes.'}
        </p>
      </section>
    </div>
  );
};
