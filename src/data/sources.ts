export interface SourcedAuthority {
  name: string;
  nameBn: string;
  domain: string;
  url: string;
  description: string;
  descriptionBn: string;
  dataCategories: string[];
}

export const SOURCES_DATA: SourcedAuthority[] = [
  {
    name: 'Netrokona District Administration (National Portal)',
    nameBn: 'নেত্রকোণা জেলা প্রশাসন (জাতীয় তথ্য বাতায়ন)',
    domain: 'netrokona.gov.bd',
    url: 'https://netrokona.gov.bd',
    description: 'Official digital portal of the Government of Bangladesh for Netrokona District providing administrative hierarchy, citizen charters, upazila portals, and official notices.',
    descriptionBn: 'বাংলাদেশ সরকারের জেলা তথ্য বাতায়ন, যেখান থেকে উপজেলার তথ্য, নাগরিক সেবা ও সরকারি গেজেট নোটিশ সংগ্রহ করা হয়।',
    dataCategories: ['District Overview', '10 Upazilas', 'Citizen Services', 'Emergency Numbers'],
  },
  {
    name: 'Bangladesh Parliament Secretariat',
    nameBn: 'বাংলাদেশ জাতীয় সংসদ সচিবালয়',
    domain: 'parliament.gov.bd',
    url: 'http://www.parliament.gov.bd',
    description: 'Constitutional authority documenting parliamentary constituencies (Netrokona-1 to Netrokona-5), election gazettes, and legislative status.',
    descriptionBn: 'জাতীয় সংসদের নির্বাচনী এলাকার সীমানা নির্ধারণ ও সাংবিধানিক তথ্যের মূল সরকারি উৎস।',
    dataCategories: ['Parliamentary Constituencies (157 to 161)', 'Constitutional Dissolution Notice'],
  },
  {
    name: 'Bangladesh Bureau of Statistics (BBS)',
    nameBn: 'বাংলাদেশ পরিসংখ্যান ব্যুরো (বিবিএস)',
    domain: 'bbs.gov.bd',
    url: 'http://www.bbs.gov.bd',
    description: 'Official census data repository providing certified population counts, area measurements, literacy metrics, and household figures from the 2022 National Population Census.',
    descriptionBn: '২০২২ সালের জাতীয় জনশুমারি ও গৃহগণনার সরকারি তথ্যানুযায়ী জনসংখ্যা, আয়তন ও শিক্ষার হার।',
    dataCategories: ['Population (2.32M)', 'Upazila Census Breakdown', 'Area (2,794.28 km²)'],
  },
  {
    name: 'Directorate General of Health Services (DGHS)',
    nameBn: 'স্বাস্থ্য অধিদপ্তর (ডিজিএইচএস)',
    domain: 'dghs.gov.bd',
    url: 'http://dghs.gov.bd',
    description: 'National health registry verifying bed capacities, doctor staffing, and emergency facilities for Netrokona Sadar Modern Hospital and all Upazila Health Complexes.',
    descriptionBn: 'নেত্রকোণা আধুনিক সদর হাসপাতাল ও সকল উপজেলা স্বাস্থ্য কমপ্লেক্সের শয্যা সংখ্যা ও চিকিৎসা সেবা সংক্রান্ত তথ্য।',
    dataCategories: ['District Hospital', '10 Upazila Health Complexes', 'Ambulance & 24/7 ER'],
  },
  {
    name: 'Bangladesh Tourism Board & Department of Archaeology',
    nameBn: 'বাংলাদেশ পর্যটন বোর্ড ও প্রত্নতত্ত্ব অধিদপ্তর',
    domain: 'tourismboard.gov.bd',
    url: 'https://tourismboard.gov.bd',
    description: 'Heritage registry and ecotourism guidelines for Bijoypur Ceramic Lake, Roailbari Fort, Rani Khong, and the Someshwari River basin.',
    descriptionBn: 'বিজয়পুর সাদামাটির পাহাড়, ঐতিহাসিক রোয়াইলবাড়ি দুর্গ এবং সুসং দুর্গাপুরের প্রত্নতাত্ত্বিক ও পর্যটন তথ্য।',
    dataCategories: ['Tourist Spots', 'Heritage Monuments', 'Visitor Guidelines'],
  },
  {
    name: 'Department of Agricultural Extension (DAE)',
    nameBn: 'কৃষি সম্প্রসারণ অধিদপ্তর',
    domain: 'dae.gov.bd',
    url: 'http://dae.gov.bd',
    description: 'Crop production data, Boro rice seasonal monitoring, combine harvester subsidy programs, and farmer advisory helpline (16123).',
    descriptionBn: 'হাওরের বোরো ধান উৎপাদন, সার ও কীটনাশক ব্যবস্থাপনা এবং ফসল ক্যালেন্ডার সংক্রান্ত তথ্য।',
    dataCategories: ['Boro Paddy Lifeline', 'Seasonal Crops', 'Farmer Subsidies'],
  },
  {
    name: 'Department of Fisheries (DoF)',
    nameBn: 'মৎস্য অধিদপ্তর',
    domain: 'fisheries.gov.bd',
    url: 'http://fisheries.gov.bd',
    description: 'Inland haor fisheries documentation, indigenous fish sanctuary protections, and fisherman registration records.',
    descriptionBn: 'হাওরের দেশীয় মাছের প্রজনন, অভয়াশ্রম এবং প্রকৃত মৎস্যজীবী সহায়তা সম্পর্কিত তথ্য।',
    dataCategories: ['Haor Open-Water Fisheries', 'Fish Markets', 'Sanctuary Projects'],
  },
  {
    name: 'Banglapedia (National Encyclopedia of Bangladesh)',
    nameBn: 'বাংলাপিডিয়া (বাংলাদেশ এশিয়াটিক সোসাইটি)',
    domain: 'banglapedia.org',
    url: 'https://en.banglapedia.org',
    description: 'Peer-reviewed historical and biographical scholarship published by the Asiatic Society of Bangladesh covering Netrokona’s rivers, personalities, and heritage.',
    descriptionBn: 'এশিয়াটিক সোসাইটি কর্তৃক প্রণীত ঐতিহাসিক বিবরণ, বরেণ্য ব্যক্তিত্ব ও নদী-ভূগোলের তথ্যাবলী।',
    dataCategories: ['Historical Timeline', 'Biographies', 'Ancient Kingdom History'],
  },
];
