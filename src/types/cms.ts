export type CmsContentType = 'Place' | 'Institution' | 'HealthFacility' | 'GovernmentOffice' | 'EmergencyService' | 'News' | 'Event' | 'Info';
export const CMS_TYPES: CmsContentType[] = ['Place', 'Institution', 'HealthFacility', 'GovernmentOffice', 'EmergencyService', 'News', 'Event', 'Info'];
export const CMS_TYPE_LABELS: Record<CmsContentType, { bn: string; en: string }> = {
  Place: { bn: 'দর্শনীয় স্থান', en: 'Place' },
  Institution: { bn: 'শিক্ষা প্রতিষ্ঠান', en: 'Educational institution' },
  HealthFacility: { bn: 'স্বাস্থ্যসেবা কেন্দ্র', en: 'Health facility' },
  GovernmentOffice: { bn: 'সরকারি অফিস', en: 'Government office' },
  EmergencyService: { bn: 'জরুরি সেবা', en: 'Emergency service' },
  News: { bn: 'সংবাদ', en: 'News' },
  Event: { bn: 'অনুষ্ঠান', en: 'Event' },
  Info: { bn: 'অন্যান্য তথ্য', en: 'Other information' },
};

export const CMS_UPAZILAS = ['netrokona-sadar', 'durgapur', 'kalmakanda', 'purbadhala', 'kendua', 'barhatta', 'atpara', 'madan', 'mohanganj', 'khaliajuri'] as const;

/** Editable fields shared by admin editor, public submissions and corrections. */
export interface ContentFields {
  type: CmsContentType;
  titleEn?: string | null;
  titleBn?: string | null;
  summaryEn?: string | null;
  summaryBn?: string | null;
  bodyEn?: string | null;
  bodyBn?: string | null;
  upazilaId?: string | null;
  category?: string | null;
  addressEn?: string | null;
  addressBn?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  website?: string | null;
  email?: string | null;
  sourceName?: string | null;
  sourceUrl?: string | null;
  eventStartUtc?: string | null;
  eventEndUtc?: string | null;
}

export interface PublicImage { id: string; url: string; altEn: string | null; altBn: string | null; credit: string | null; isCover: boolean }

export interface PublicContent extends Omit<ContentFields, 'type'> {
  id: string; slug: string; type: CmsContentType; publishedAtUtc: string | null; updatedAtUtc: string; images: PublicImage[];
}

export interface Paged<T> { total: number; page: number; pageSize: number; items: T[] }

export interface Me { id: string; name: string; email: string; roles: string[]; permissions: string[] }

export type SubmissionStatus = 'Pending' | 'UnderReview' | 'Approved' | 'Rejected' | 'NeedsCorrection';
export const SUBMISSION_STATUSES: SubmissionStatus[] = ['Pending', 'UnderReview', 'NeedsCorrection', 'Approved', 'Rejected'];
export const STATUS_LABELS: Record<SubmissionStatus, { bn: string; en: string }> = {
  Pending: { bn: 'অপেক্ষমাণ', en: 'Pending' },
  UnderReview: { bn: 'পর্যালোচনাধীন', en: 'Under review' },
  NeedsCorrection: { bn: 'সংশোধন প্রয়োজন', en: 'Needs correction' },
  Approved: { bn: 'অনুমোদিত', en: 'Approved' },
  Rejected: { bn: 'প্রত্যাখ্যাত', en: 'Rejected' },
};
