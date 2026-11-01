export interface CropItem {
  id: string;
  name: string;
  nameBn: string;
  season: string;
  seasonBn: string;
  prominentUpazilas: string[];
  prominentUpazilasBn: string[];
  description: string;
  descriptionBn: string;
}

export const AGRICULTURE_DATA = {
  overview: {
    bn: 'নেত্রকোণা মূলত কৃষিপ্রধান জেলা। জেলার অর্থনীতি ও জনজীবনের সবচেয়ে বড় ভিত্তি হলো বোরো ধান চাষ। বিশেষ করে খালিয়াজুরী, মদন, মোহনগঞ্জ এবং কলমাকান্দার হাওরাঞ্চলে শীতকালে কেবল একটিমাত্র ফসল—বোরো ধান আবাদ হয়, যা লক্ষ লক্ষ মেট্রিক টন খাদ্যশস্য জাতীয় মজুদে সরবরাহ করে। সমতল উপজেলাগুলোতে (পূর্বধলা, সদর, আটপাড়া, বারহাট্টা) রোপা আমন ও আউশ ধানের পাশাপাশি সরিষা, ভুট্টা, পাট এবং শীতকালীন সবজি ব্যাপক পরিমাণে চাষ হয়।',
    en: 'Netrokona is primarily an agricultural district. The agrarian backbone of the district is the winter Boro paddy. The wetland basins of Khaliajuri, Madan, Mohanganj, and Kalmakanda produce vast single-crop Boro harvests that contribute substantially to Bangladesh’s national food security. The mainland upazilas (Purbadhala, Sadar, Atpara, Barhatta) cultivate Aman and Aus rice, along with mustard, maize, jute, and winter vegetables.',
  },
  crops: [
    {
      id: 'boro-paddy',
      name: 'Boro Rice (বোরো ধান - হাওরের প্রাণ)',
      nameBn: 'বোরো ধান (হাওরের সোনালী ফসল)',
      season: 'December to May (Winter-Spring)',
      seasonBn: 'পৌষ থেকে বৈশাখ (শীত ও বসন্তকাল)',
      prominentUpazilas: ['Khaliajuri', 'Mohanganj', 'Madan', 'Kalmakanda', 'Atpara'],
      prominentUpazilasBn: ['খালিয়াজুরী', 'মোহনগঞ্জ', 'মদন', 'কলমাকান্দা', 'আটপাড়া'],
      description: 'The single most vital cash crop of the haors. Harvested swiftly in April-May before mountain flash floods enter from Meghalaya.',
      descriptionBn: 'হাওরাঞ্চলের কৃষকদের একমাত্র ও প্রধান জীবন-জীবিকার উৎস। মেঘালয়ের আগাম পাহাড়ি ঢল আসার পূর্বেই বৈশাখ মাসে দ্রুত এই সোনালী ফসল কাটা হয়।',
    },
    {
      id: 'aman-rice',
      name: 'Ropa Aman Rice (রোপা আমন)',
      nameBn: 'রোপা আমন ধান',
      season: 'July to December (Monsoon-Autumn)',
      seasonBn: 'আষাঢ় থেকে অগ্রহায়ণ (বর্ষা ও শরৎকাল)',
      prominentUpazilas: ['Purbadhala', 'Netrokona Sadar', 'Kendua', 'Barhatta', 'Durgapur'],
      prominentUpazilasBn: ['পূর্বধলা', 'নেত্রকোণা সদর', 'কেন্দুয়া', 'বারহাট্টা', 'দুর্গাপুর'],
      description: 'Cultivated in high and medium land plain upazilas that do not submerge during regular monsoon floods.',
      descriptionBn: 'সমতল ও মাঝারি উঁচু এলাকার কৃষিজমিতে বর্ষা মৌসুমে প্রচুর পরিমাণে আমন ধানের আবাদ হয়।',
    },
    {
      id: 'mustard',
      name: 'Mustard (সরিষা)',
      nameBn: 'সরিষা চাষ',
      season: 'November to February (Winter)',
      seasonBn: 'কার্তিক থেকে মাঘ (শীতকাল)',
      prominentUpazilas: ['Purbadhala', 'Atpara', 'Kendua', 'Sadar'],
      prominentUpazilasBn: ['পূর্বধলা', 'আটপাড়া', 'কেন্দুয়া', 'সদর'],
      description: 'Short-duration oilseed crop widely cultivated between Aman and Boro crop rotations.',
      descriptionBn: 'আমন ও বোরো ধানের মধ্যবর্তী সময়ে অতিরিক্ত লাভজনক ফসল হিসেবে ব্যাপকভাবে হলুদ সরিষা চাষ হয়।',
    },
    {
      id: 'jute',
      name: 'Jute (পাট - সোনালী আঁশ)',
      nameBn: 'পাট চাষ',
      season: 'March to August',
      seasonBn: 'চৈত্র থেকে শ্রাবণ',
      prominentUpazilas: ['Kendua', 'Purbadhala', 'Barhatta'],
      prominentUpazilasBn: ['কেন্দুয়া', 'পূর্বধলা', 'বারহাট্টা'],
      description: 'Traditional cash crop washed and processed in the freshwater rivers and canals.',
      descriptionBn: 'নদীমাতৃক খাল-বিলের পানিতে জাগ দেওয়া ঐতিহ্যবাহী অর্থকরী সোনালী আঁশ পাট।',
    },
  ],
  services: [
    {
      title: 'DAE Farmer Advisory & Fertilizer Subsidy',
      titleBn: 'কৃষি সম্প্রসারণ অধিদপ্তর ও সার-বীজ সহায়তা',
      office: 'Upazila Agriculture Office (All Upazilas)',
      officeBn: 'সকল উপজেলা কৃষি কার্যালয়',
      portalUrl: 'https://dae.netrokona.gov.bd',
      phone: '16123 (Krishi Call Centre)',
    },
    {
      title: 'Combine Harvester Subsidy Support for Haor Boro',
      titleBn: 'হাওরে দ্রুত ধান কাটার জন্য কম্বাইন হারভেস্টারে সরকারি ভর্তুকি',
      office: 'DAE & Upazila Administration',
      officeBn: 'উপজেলা প্রশাসন ও কৃষি অফিস',
      portalUrl: 'https://dae.gov.bd',
      phone: '16123',
    },
  ],
};
