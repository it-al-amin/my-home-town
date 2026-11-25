// Number formatting shared by every page (Bangla digits in bn mode).

export const toBnDigits = (v: number | string) => String(v).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);

/** Locale-aware thousands separators: 12,345 / ১২,৩৪৫. */
export const formatNumber = (n: number, bn: boolean) => n.toLocaleString(bn ? 'bn-BD' : 'en-US');

/** Plain digits in the page language (years, codes): 1983 / ১৯৮৩. */
export const digits = (v: number | string, bn: boolean) => (bn ? toBnDigits(v) : String(v));
