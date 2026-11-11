/** Mirrors scraper/models/article.py (public export shape). Keep in sync with scraper/README.md. */
export type FeedCategory =
  | 'local-news' | 'government-news' | 'government-notice' | 'recruitment' | 'tender'
  | 'education' | 'health' | 'agriculture' | 'fisheries-livestock' | 'tourism'
  | 'development-projects' | 'infrastructure' | 'culture' | 'emergency' | 'district-admin';

export type FeedStatus = 'pending_review' | 'approved' | 'rejected' | 'published';

export interface FeedItem {
  id: string;
  title: string;
  titleBn: string | null;
  summary: string;
  summaryBn: string | null;
  category: FeedCategory;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  imageUrl: string | null;
  publishedAt: string | null;
  scrapedAt: string;
  language: 'bn' | 'en';
  district: string;
  upazila: string | null;
  locations: string[];
  relevanceScore: number;
  status: FeedStatus; // only "published" ever appears in public JSON
  isVerified: boolean;
}

export interface FeedSourceStatus {
  sourceId: string;
  sourceName: string;
  availability: 'available' | 'degraded' | 'unavailable' | 'not_run';
  lastSuccessfulScrape: string | null;
  recordsCollected: number;
  relevantRecords: number;
}

export interface ScrapingStatus {
  lastExportedAt: string | null;
  lastScrapedAt: string | null;
  publishedCount: number;
  pendingCount: number;
  sources: FeedSourceStatus[];
}
