export type Language = 'bn' | 'en';

export interface BilingualText {
  bn: string;
  en: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface VerificationInfo {
  source?: string;
  sourceUrl?: string;
  lastVerified?: string;
  verified?: boolean;
  needsVerification?: boolean;
}

export interface Upazila extends VerificationInfo {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  areaKm2: number;
  population: number;
  headquarters: string;
  headquartersBn: string;
  unionsCount: number;
  villagesCount: number;
  coordinates: Coordinates;
  mapQuery: string;
  description: string;
  descriptionBn: string;
  highlights: string[];
  highlightsBn: string[];
  rivers: string[];
  riversBn: string[];
  majorMarkets: string[];
  majorMarketsBn: string[];
  unionsList: string[];
  unionsListBn: string[];
  emergencyContacts?: {
    police?: string;
    fireService?: string;
    healthComplex?: string;
    uno?: string;
  };
  image?: string;
}

export interface TouristPlace extends VerificationInfo {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  upazilaId: string;
  category: 'natural' | 'historical' | 'haor' | 'hills' | 'rivers' | 'religious' | 'cultural';
  categoryLabel: BilingualText;
  location: string;
  locationBn: string;
  coordinates: Coordinates;
  mapQuery: string;
  description: string;
  descriptionBn: string;
  whyVisit: string;
  whyVisitBn: string;
  bestTimeToVisit: string;
  bestTimeToVisitBn: string;
  nearbyPlaces: string[];
  nearbyPlacesBn: string[];
  travelTips: string;
  travelTipsBn: string;
  image: string;
  imageCredit: string;
  galleryImages?: string[];
  featured?: boolean;
}

export type InstitutionCategory = 'university' | 'college' | 'school' | 'primary' | 'madrasa' | 'technical';

export interface EducationInstitution extends VerificationInfo {
  id: string;
  name: string;
  nameBn: string;
  category: InstitutionCategory;
  categoryLabel: BilingualText;
  upazilaId: string;
  established?: number;
  eiin?: string;
  type: 'government' | 'non-government';
  location: string;
  locationBn: string;
  website?: string;
  phone?: string;
  coordinates?: Coordinates;
  description: string;
  descriptionBn: string;
}

export type HealthFacilityCategory = 'district_hospital' | 'upazila_health_complex' | 'specialized' | 'private' | 'maternity';

export interface HealthFacility extends VerificationInfo {
  id: string;
  name: string;
  nameBn: string;
  category: HealthFacilityCategory;
  categoryLabel: BilingualText;
  upazilaId: string;
  beds?: number;
  isEmergency24h: boolean;
  address: string;
  addressBn: string;
  phone?: string;
  ambulanceContact?: string;
  coordinates?: Coordinates;
  servicesAvailable: string[];
  servicesAvailableBn: string[];
}

export type ServiceDepartment = 
  | 'administration' 
  | 'police' 
  | 'fire_service' 
  | 'land' 
  | 'civil_registration' 
  | 'passport' 
  | 'agriculture' 
  | 'fisheries' 
  | 'livestock' 
  | 'health' 
  | 'social_welfare'
  | 'utilities'
  | 'disaster';

export interface CitizenService extends VerificationInfo {
  id: string;
  title: string;
  titleBn: string;
  department: ServiceDepartment;
  departmentLabel: BilingualText;
  description: string;
  descriptionBn: string;
  isOfficialGovService: boolean;
  officialPortalUrl: string;
  responsibleOffice: string;
  responsibleOfficeBn: string;
  procedureSteps?: string[];
  procedureStepsBn?: string[];
  requiredDocs?: string[];
  requiredDocsBn?: string[];
}

export interface EmergencyContact extends VerificationInfo {
  id: string;
  title: string;
  titleBn: string;
  category: 'national' | 'police' | 'fire' | 'hospital' | 'ambulance' | 'admin' | 'disaster';
  categoryLabel: BilingualText;
  number: string;
  availableHours: string;
  upazilaId?: string;
  address?: string;
  addressBn?: string;
  note?: string;
  noteBn?: string;
}

export interface ParliamentarySeat extends VerificationInfo {
  seatNumber: number; // 157 to 161
  constituencyCode: string; // Netrokona-1 etc.
  name: string;
  nameBn: string;
  upazilasCovered: string[];
  upazilasCoveredBn: string[];
  currentStatus: string;
  currentStatusBn: string;
  historicalNote: string;
  historicalNoteBn: string;
  officialParliamentUrl: string;
}

export interface NotablePerson extends VerificationInfo {
  id: string;
  name: string;
  nameBn: string;
  category: 'poet' | 'writer' | 'freedom_fighter' | 'scholar' | 'artist' | 'historic';
  categoryLabel: BilingualText;
  birthYear?: string;
  deathYear?: string;
  birthPlace: string;
  birthPlaceBn: string;
  upazilaId: string;
  bio: string;
  bioBn: string;
  keyContributions: string[];
  keyContributionsBn: string[];
  image?: string;
  imageCredit?: string;
}

export interface TimelineEvent extends VerificationInfo {
  id: string;
  period: 'ancient' | 'medieval' | 'mughal' | 'british' | '1947' | '1971' | '1984' | 'modern';
  periodLabel: BilingualText;
  yearDisplay: string;
  yearDisplayBn: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  significance: string;
  significanceBn: string;
}

export interface NewsNotice extends VerificationInfo {
  id: string;
  title: string;
  titleBn: string;
  category: 'district' | 'government' | 'weather' | 'agriculture' | 'fisheries' | 'culture' | 'education' | 'tourism' | 'health';
  categoryLabel: BilingualText;
  date: string;
  summary: string;
  summaryBn: string;
  source: string;
  sourceUrl: string;
  upazilaId?: string;
  urgent?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  authorName?: string;
  authorContact?: string;
  imageUrl?: string;
  submittedAt?: string;
  content?: string;
  contentBn?: string;
}

export interface SectionImagesConfig {
  heroBanner: string;
  foodBanner?: string;
  travelBanner?: string;
  educationBanner?: string;
  businessBanner?: string;
  [key: string]: string | undefined;
}

export interface TransportRoute extends VerificationInfo {
  id: string;
  mode: 'train' | 'bus' | 'waterway' | 'local';
  modeLabel: BilingualText;
  routeTitle: string;
  routeTitleBn: string;
  from: string;
  fromBn: string;
  to: string;
  toBn: string;
  description: string;
  descriptionBn: string;
  keyStops: string[];
  keyStopsBn: string[];
  approxDuration: string;
  approxDurationBn: string;
  officialLink?: string;
}

export interface MarketBazar extends VerificationInfo {
  id: string;
  name: string;
  nameBn: string;
  upazilaId: string;
  haatDays: string;
  haatDaysBn: string;
  speciality: string;
  specialityBn: string;
  location: string;
  locationBn: string;
}

export interface Hotel extends VerificationInfo {
  id: string;
  name: string;
  nameBn: string;
  upazilaId: string;
  type: 'resort' | 'rest_house' | 'hotel' | 'guest_house';
  typeLabel: BilingualText;
  location: string;
  locationBn: string;
  coordinates?: Coordinates;
  phone: string;
  alternatePhone?: string;
  priceRange: string;
  priceRangeBn: string;
  features: string[];
  featuresBn: string[];
  bookingAdvice: string;
  bookingAdviceBn: string;
  image?: string;
}

export interface FamousFood extends VerificationInfo {
  id: string;
  name: string;
  nameBn: string;
  upazilaId?: string;
  category: 'sweet' | 'traditional' | 'fish' | 'haor_delicacy' | 'beverage';
  categoryLabel: BilingualText;
  history: string;
  historyBn: string;
  description: string;
  descriptionBn: string;
  speciality: string;
  specialityBn: string;
  approxPrice: string;
  approxPriceBn: string;
  whereToFind: string;
  whereToFindBn: string;
  image?: string;
}

export interface UnionInfo {
  id: string;
  name: string;
  nameBn?: string;
  upazilaId?: string;
  coordinates: Coordinates;
  villagesCount?: number;
  unionsCouncilOffice?: string;
  unionsCouncilOfficeBn?: string;
  keySpots?: string[];
  keySpotsBn?: string[];
  /** true when coordinates are an estimated placement, not surveyed GPS */
  approximate?: boolean;
}


export interface DistrictOverview {
  name: string;
  nameBn: string;
  motto: BilingualText;
  division: string;
  divisionBn: string;
  headquarters: string;
  headquartersBn: string;
  established: number;
  areaKm2: number;
  population: number;
  populationDensity: number;
  literacyRate: number;
  postalCode: string;
  coordinates: Coordinates;
  upazilasCount: number;
  unionsCount: number;
  villagesCount: number;
  parliamentSeatsCount: number;
  borderDistricts: BilingualText[];
  rivers: BilingualText[];
  keyHaors: BilingualText[];
  quickStats: {
    label: BilingualText;
    value: string;
    valueBn: string;
  }[];
}
