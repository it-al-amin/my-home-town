import type { DistrictOverview } from '../types';

export const DISTRICT_DATA: DistrictOverview = {
  name: 'Netrokona',
  nameBn: 'নেত্রকোণা',
  motto: {
    bn: 'প্রকৃতি, ইতিহাস, মানুষ ও সম্ভাবনার জেলা',
    en: 'District of Nature, Heritage, People & Horizons',
  },
  division: 'Mymensingh',
  divisionBn: 'ময়মনসিংহ',
  headquarters: 'Netrokona Sadar',
  headquartersBn: 'নেত্রকোণা সদর',
  established: 1984, // Elevated from Sub-division (established in 1882) to full District on 17 January 1984
  areaKm2: 2794.28,
  population: 2324856, // Bangladesh Bureau of Statistics (BBS) 2022 Census
  populationDensity: 832, // persons per sq km
  literacyRate: 68.4,
  postalCode: '2400',
  coordinates: {
    lat: 24.8833,
    lng: 90.7333,
  },
  upazilasCount: 10,
  unionsCount: 86,
  villagesCount: 2284,
  parliamentSeatsCount: 5,
  borderDistricts: [
    { bn: 'উত্তরে ভারতের মেঘালয় রাজ্য (গারো পাহাড়)', en: 'North: Meghalaya State of India (Garo Hills)' },
    { bn: 'দক্ষিণে কিশোরগঞ্জ জেলা', en: 'South: Kishoreganj District' },
    { bn: 'পূর্বে সুনামগঞ্জ জেলা (বিশাল হাওরাঞ্চল)', en: 'East: Sunamganj District (Haor Region)' },
    { bn: 'পশ্চিমে ময়মনসিংহ জেলা', en: 'West: Mymensingh District' },
  ],
  rivers: [
    { bn: 'সোমেশ্বরী নদী (বিরিশিরি ও দুর্গাপুর)', en: 'Someshwari River (Birishiri & Durgapur)' },
    { bn: 'কংস নদী (পূর্বধলা ও সদর)', en: 'Kangsha River' },
    { bn: 'ধনু নদী (খালিয়াজুরী ও মোহনগঞ্জ)', en: 'Dhanu River (Haor basin)' },
    { bn: 'মগড়া নদী (নেত্রকোণা শহর)', en: 'Mogra River (flowing through Netrokona town)' },
    { bn: 'বাউলাই নদী', en: 'Baulai River' },
    { bn: 'সুরমা-মেঘনা অববাহিকা শাখা নদীসমূহ', en: 'Surma-Meghna basin tributaries' },
  ],
  keyHaors: [
    { bn: 'ডিংগাপোতা হাওর (মোহনগঞ্জ ও খালিয়াজুরী)', en: 'Dingapota Haor (Mohanganj & Khaliajuri)' },
    { bn: 'গণেশের হাওর', en: 'Ganesher Haor' },
    { bn: 'মেদা হাওর', en: 'Meda Haor' },
    { bn: 'মাকরা হাওর', en: 'Makra Haor' },
    { bn: 'বেড়ালী হাওর', en: 'Berali Haor' },
  ],
  quickStats: [
    {
      label: { bn: 'উপজেলা সংখ্যা', en: 'Total Upazilas' },
      value: '10',
      valueBn: '১০টি',
    },
    {
      label: { bn: 'মোট আয়তন', en: 'Total Area' },
      value: '2,794.28 sq km',
      valueBn: '২,৭৯৪.২৮ বর্গ কিমি',
    },
    {
      label: { bn: 'মোট জনসংখ্যা', en: 'Population (2022 Census)' },
      value: '2.32 Million',
      valueBn: '২৩,২৪,৮৫৬ জন',
    },
    {
      label: { bn: 'সংসদীয় আসন', en: 'Parliamentary Seats' },
      value: '5 Seats',
      valueBn: '৫টি আসন',
    },
    {
      label: { bn: 'ইউনিয়ন সংখ্যা', en: 'Total Unions' },
      value: '86 Unions',
      valueBn: '৮৬টি ইউনিয়ন',
    },
    {
      label: { bn: 'পৌরসভা', en: 'Municipalities' },
      value: '5 Municipalities',
      valueBn: '৫টি পৌরসভা',
    },
    {
      label: { bn: 'প্রধান খনিজ সম্পদ', en: 'Mineral Resource' },
      value: 'China Clay (White Clay)',
      valueBn: 'সাদামাটি (চীনামাটি) ও নুড়িপাথর',
    },
    {
      label: { bn: 'বিখ্যাত ঐতিহ্যবাহী মিষ্টি', en: 'Traditional Sweet' },
      value: 'Balish Mishti',
      valueBn: 'বালিশ মিষ্টি (গয়ানাথ)',
    },
  ],
};
