// Loader for the JSON exported by `python scraper/scraper.py --export-json`.
// The JSON files contain ONLY approved/published records. They are generated, do not hand-edit.
import type { FeedItem, FeedCategory, ScrapingStatus } from '../../types/aggregated';
import latest from './news/latest.json';
import archive from './news/archive.json';
import govNotices from './notices/government-notices.json';
import recruitment from './notices/recruitment.json';
import tenders from './notices/tenders.json';
import education from './updates/education.json';
import health from './updates/health.json';
import agriculture from './updates/agriculture.json';
import culture from './updates/culture.json';
import status from './metadata/scraping-status.json';

// Empty arrays are inferred as never[]; cast through unknown to the real model.
const as = (v: unknown): FeedItem[] => (Array.isArray(v) ? (v as FeedItem[]) : []);

const byDate = (a: FeedItem, b: FeedItem) =>
  (b.publishedAt ?? b.scrapedAt).localeCompare(a.publishedAt ?? a.scrapedAt);

export const FEED_LATEST = as(latest);
export const FEED_NEWS_ALL: FeedItem[] = [...as(latest), ...as(archive)].sort(byDate);
export const FEED_NOTICES = as(govNotices);
export const FEED_RECRUITMENT = as(recruitment);
export const FEED_TENDERS = as(tenders);
export const FEED_ALL_NOTICES: FeedItem[] = [...FEED_NOTICES, ...FEED_RECRUITMENT, ...FEED_TENDERS].sort(byDate);

export const FEED_UPDATES: Record<'education' | 'health' | 'agriculture' | 'culture', FeedItem[]> = {
  education: as(education),
  health: as(health),
  agriculture: as(agriculture),
  culture: as(culture),
};

export const SCRAPING_STATUS = status as unknown as ScrapingStatus;

export const FEED_CATEGORY_LABELS: Record<FeedCategory, { bn: string; en: string }> = {
  'local-news': { bn: 'স্থানীয় সংবাদ', en: 'Local News' },
  'government-news': { bn: 'সরকারি সংবাদ', en: 'Government News' },
  'government-notice': { bn: 'সরকারি নোটিশ', en: 'Government Notice' },
  recruitment: { bn: 'নিয়োগ ও চাকরি', en: 'Recruitment' },
  tender: { bn: 'দরপত্র', en: 'Tender' },
  education: { bn: 'শিক্ষা', en: 'Education' },
  health: { bn: 'স্বাস্থ্য', en: 'Health' },
  agriculture: { bn: 'কৃষি', en: 'Agriculture' },
  'fisheries-livestock': { bn: 'মৎস্য ও প্রাণিসম্পদ', en: 'Fisheries & Livestock' },
  tourism: { bn: 'পর্যটন ও ঐতিহ্য', en: 'Tourism & Heritage' },
  'development-projects': { bn: 'উন্নয়ন প্রকল্প', en: 'Development Projects' },
  infrastructure: { bn: 'অবকাঠামো', en: 'Infrastructure' },
  culture: { bn: 'সংস্কৃতি ও অনুষ্ঠান', en: 'Culture & Events' },
  emergency: { bn: 'জরুরি ও জনসেবা', en: 'Emergency & Services' },
  'district-admin': { bn: 'জেলা প্রশাসন', en: 'District Administration' },
};

export const FEED_UPAZILA_LABELS: Record<string, { bn: string; en: string }> = {
  'netrokona-sadar': { bn: 'নেত্রকোণা সদর', en: 'Netrokona Sadar' },
  durgapur: { bn: 'দুর্গাপুর', en: 'Durgapur' },
  kalmakanda: { bn: 'কলমাকান্দা', en: 'Kalmakanda' },
  purbadhala: { bn: 'পূর্বধলা', en: 'Purbadhala' },
  kendua: { bn: 'কেন্দুয়া', en: 'Kendua' },
  barhatta: { bn: 'বারহাট্টা', en: 'Barhatta' },
  atpara: { bn: 'আটপাড়া', en: 'Atpara' },
  madan: { bn: 'মদন', en: 'Madan' },
  mohanganj: { bn: 'মোহনগঞ্জ', en: 'Mohanganj' },
  khaliajuri: { bn: 'খালিয়াজুরী', en: 'Khaliajuri' },
};
