import type { BilingualText } from '../types';

export interface HistorySection {
  id: string;
  title: BilingualText;
  paragraphs: BilingualText[];
  /** Marks content that is folk tradition or where sources disagree */
  uncertain?: boolean;
}

export const HISTORY_INTRO: BilingualText = {
  en: 'Netrokona sits where the Garo Hills meet the haor wetlands of north Mymensingh. Its story is shaped by hill rivers such as the Someshwari and Kangsha, the Susang kingdom, peasant movements of the 1930s-40s, the 1971 Liberation War, and elevation to a full district in 1984.',
  bn: 'গারো পাহাড় ও হাওরাঞ্চলের মিলনস্থলে অবস্থিত নেত্রকোণা। সোমেশ্বরী ও কংসের মতো পাহাড়ি নদী, সুসং রাজ্য, ত্রিশ-চল্লিশের দশকের কৃষক আন্দোলন, ১৯৭১ সালের মুক্তিযুদ্ধ এবং ১৯৮৪ সালে পূর্ণাঙ্গ জেলায় উন্নীত হওয়া—এই সবকিছু মিলিয়ে নেত্রকোণার ইতিহাস।',
};

export const HISTORY_SECTIONS: HistorySection[] = [
  {
    id: 'name-origin',
    title: { en: 'Origin of the Name', bn: 'নামের উৎস' },
    uncertain: true,
    paragraphs: [
      {
        en: 'There is no single agreed explanation for the name "Netrokona". Local tradition offers several folk accounts, and none is confirmed by a primary source.',
        bn: '"নেত্রকোণা" নামের উৎস নিয়ে একক কোনো সর্বসম্মত ব্যাখ্যা নেই। স্থানীয় লোকশ্রুতিতে একাধিক মত প্রচলিত আছে, তবে কোনোটিই প্রাথমিক সূত্রে নিশ্চিত নয়।',
      },
    ],
  },
  {
    id: 'rivers',
    title: { en: 'Rivers and Haors', bn: 'নদী ও হাওর' },
    paragraphs: [
      {
        en: 'The district is drained by the Someshwari, Kangsha, Mogra and Dhanu systems. Hill rivers from Meghalaya bring silt and flash floods, and the southern upazilas form part of a haor basin that floods each monsoon.',
        bn: 'সোমেশ্বরী, কংস, মগড়া ও ধনুসহ বিভিন্ন নদী জেলার ভেতর দিয়ে প্রবাহিত। মেঘালয়ের পাহাড় থেকে নামা নদীগুলো পলি ও আকস্মিক বন্যা বয়ে আনে; দক্ষিণের উপজেলাগুলো প্রতি বর্ষায় হাওরের পানিতে ডুবে যায়।',
      },
    ],
  },
  {
    id: 'ancient-medieval',
    title: { en: 'Ancient and Medieval Period', bn: 'প্রাচীন ও মধ্যযুগ' },
    paragraphs: [
      {
        en: 'The northern hill belt was part of the wider Kamarupa sphere, with Garo, Hajong and Koch communities settled along the hill rivers. The Susang kingdom, with its seat at Durgapur, ruled the foothills for centuries; the Someshwari is traditionally linked to its founder.',
        bn: 'উত্তরের পাহাড়ি অঞ্চল কামরূপ প্রভাববলয়ের অংশ ছিল, যেখানে নদীর তীরে গারো, হাজং ও কোচ জনগোষ্ঠী বসতি গড়ে। দুর্গাপুরকেন্দ্রিক সুসং রাজ্য শতাব্দীজুড়ে পাহাড়ের পাদদেশ শাসন করে; ঐতিহ্যগতভাবে সোমেশ্বরী নদীর নাম এর প্রতিষ্ঠাতার সাথে যুক্ত।',
      },
    ],
  },
  {
    id: 'administration',
    title: { en: 'From Subdivision to District', bn: 'মহকুমা থেকে জেলা' },
    paragraphs: [
      {
        en: 'Under British rule the area belonged to Mymensingh district, and Netrokona became a subdivision in 1882. It was raised to a full district on 17 January 1984.',
        bn: 'ব্রিটিশ আমলে এই অঞ্চল ময়মনসিংহ জেলার অন্তর্ভুক্ত ছিল এবং ১৮৮২ সালে নেত্রকোণা মহকুমায় পরিণত হয়। ১৯৮৪ সালের ১৭ জানুয়ারি এটি পূর্ণাঙ্গ জেলায় উন্নীত হয়।',
      },
    ],
  },
  {
    id: 'movements',
    title: { en: 'Peasant Movements', bn: 'কৃষক আন্দোলন' },
    paragraphs: [
      {
        en: 'The Tonk movement (roughly 1937-1946), centred on Susang Durgapur and the Hajong and Garo farming communities, resisted the tonk system of payment in kind to landlords. It is among the best-known peasant struggles of the region.',
        bn: 'সুসং দুর্গাপুর ও হাজং-গারো কৃষক সমাজকে ঘিরে (আনুমানিক ১৯৩৭–১৯৪৬) গড়ে ওঠা টঙ্ক আন্দোলন জমিদারদের কাছে ফসলে খাজনা দেওয়ার টঙ্ক প্রথার বিরুদ্ধে প্রতিরোধ গড়ে তোলে। এটি এই অঞ্চলের সবচেয়ে পরিচিত কৃষক সংগ্রামগুলোর একটি।',
      },
    ],
  },
  {
    id: 'liberation-war',
    title: { en: '1971 Liberation War', bn: '১৯৭১-এর মুক্তিযুদ্ধ' },
    uncertain: true,
    paragraphs: [
      {
        en: 'Because of its border with Meghalaya, Netrokona served as an important route for freedom fighters and refugees in 1971. Local fighters, including many from the Garo and Hajong communities, took part in operations in the northern upazilas. The exact liberation date differs between local accounts.',
        bn: 'মেঘালয় সীমান্ত থাকায় ১৯৭১ সালে নেত্রকোণা মুক্তিযোদ্ধা ও শরণার্থীদের গুরুত্বপূর্ণ পথ ছিল। গারো ও হাজংসহ স্থানীয় যোদ্ধারা উত্তরের উপজেলাগুলোতে অভিযানে অংশ নেন। মুক্ত হওয়ার সঠিক তারিখ নিয়ে স্থানীয় বর্ণনায় ভিন্নতা আছে।',
      },
    ],
  },
  {
    id: 'heritage-sites',
    title: { en: 'Historical Sites', bn: 'ঐতিহাসিক স্থান' },
    paragraphs: [
      {
        en: 'Notable sites include the Susang Durgapur royal remains, the Roailbari fort and mosque area in Kendua, the shrine of Shah Sultan Kamaruddin Rumi at Madanpur, and the Birishiri ethnic cultural heritage area. See the Places section for details.',
        bn: 'উল্লেখযোগ্য স্থানের মধ্যে রয়েছে সুসং দুর্গাপুরের রাজবাড়ির নিদর্শন, কেন্দুয়ার রোয়াইলবাড়ি দুর্গ ও মসজিদ এলাকা, মদনপুরে শাহ সুলতান কমরুদ্দীন রুমী (রহ.)-এর মাজার এবং বিরিশিরির আদিবাসী সংস্কৃতিকেন্দ্র। বিস্তারিত দেখুন “দর্শনীয় স্থান” অংশে।',
      },
    ],
  },
];

export const HISTORY_SOURCE_NOTE: BilingualText = {
  en: 'Content is compiled from published references such as Banglapedia and district administration pages. Folk accounts and items where sources disagree are labelled; local fact-checking is ongoing.',
  bn: 'বাংলাপিডিয়া ও জেলা প্রশাসনের প্রকাশিত তথ্যসহ বিভিন্ন সূত্র থেকে বিষয়বস্তু সংকলিত। লোকশ্রুতি ও সূত্রভেদে ভিন্নতা থাকা তথ্য চিহ্নিত করা হয়েছে; স্থানীয়ভাবে যাচাই চলছে।',
};

/** Short, conservative per-upazila historical notes. Only well-attested points are included. */
export const UPAZILA_HISTORY_NOTES: Record<string, BilingualText> = {
  'netrokona-sadar': {
    en: 'The seat of the 1882 subdivision and of the district since 1984. The town grew along the Mogra River as an administrative, educational and trading centre; the Madanpur shrine of Shah Sultan Kamaruddin Rumi lies within the upazila.',
    bn: '১৮৮২ সালের মহকুমা এবং ১৯৮৪ সাল থেকে জেলার সদর। মগড়া নদীর তীরে প্রশাসনিক, শিক্ষা ও বাণিজ্যকেন্দ্র হিসেবে শহরটি গড়ে ওঠে; মদনপুরে শাহ সুলতান কমরুদ্দীন রুমী (রহ.)-এর মাজার এই উপজেলায় অবস্থিত।',
  },
  durgapur: {
    en: 'Historic seat of the Susang kingdom and the heart of the Tonk peasant movement. Birishiri, on the Someshwari, is known for its Garo and Hajong cultural heritage and the ethnic cultural academy.',
    bn: 'সুসং রাজ্যের ঐতিহাসিক কেন্দ্র এবং টঙ্ক কৃষক আন্দোলনের প্রাণকেন্দ্র। সোমেশ্বরী তীরের বিরিশিরি গারো ও হাজং সংস্কৃতি এবং আদিবাসী সাংস্কৃতিক একাডেমির জন্য পরিচিত।',
  },
  kalmakanda: {
    en: 'A northern border upazila where hill and haor landscapes meet, with Garo and Hajong communities and the Meghalaya frontier shaping its 1971 and trading history.',
    bn: 'উত্তরের সীমান্তবর্তী উপজেলা, যেখানে পাহাড় ও হাওরের ভূদৃশ্য মিলেছে; গারো ও হাজং জনগোষ্ঠী এবং মেঘালয় সীমান্ত এর ১৯৭১ ও বাণিজ্যের ইতিহাস গড়েছে।',
  },
  mohanganj: {
    en: 'A haor-edge upazila whose history is closely tied to seasonal flooding, boro paddy farming and fishing livelihoods.',
    bn: 'হাওরঘেঁষা উপজেলা, যার ইতিহাস মৌসুমি বন্যা, বোরো ধানচাষ ও মাছ ধরার জীবিকার সাথে ঘনিষ্ঠভাবে জড়িত।',
  },
  khaliajuri: {
    en: 'One of the most remote haor upazilas, historically cut off from the mainland during the monsoon and dependent on boats and embankments.',
    bn: 'সবচেয়ে দুর্গম হাওর উপজেলাগুলোর একটি; বর্ষায় ঐতিহাসিকভাবে মূল ভূখণ্ড থেকে বিচ্ছিন্ন থাকত এবং নৌকা ও বাঁধের ওপর নির্ভরশীল ছিল।',
  },
  kendua: {
    en: 'Home to the Roailbari fort and mosque area, associated with medieval defensive settlements, and a long-standing trading and agricultural upazila.',
    bn: 'রোয়াইলবাড়ি দুর্গ ও মসজিদ এলাকা এখানে অবস্থিত, যা মধ্যযুগীয় প্রতিরক্ষা বসতির সাথে সম্পর্কিত; দীর্ঘদিনের বাণিজ্য ও কৃষিনির্ভর উপজেলা।',
  },
  madan: {
    en: 'A low-lying haor upazila whose settlement history follows the retreat of the monsoon waters and the growth of river markets.',
    bn: 'নিচু হাওর উপজেলা; বর্ষার পানি সরে যাওয়া এবং নদীতীরের হাটবাজার গড়ে ওঠার ধারায় এর জনবসতির ইতিহাস গড়ে উঠেছে।',
  },
  barhatta: {
    en: 'An agricultural upazila on the Kangsha river system, historically organised around weekly haats and rice farming.',
    bn: 'কংস নদী ব্যবস্থার তীরের কৃষিপ্রধান উপজেলা; ঐতিহাসিকভাবে সাপ্তাহিক হাট ও ধানচাষকে কেন্দ্র করে গড়ে উঠেছে।',
  },
  atpara: {
    en: 'A small agrarian upazila of the Mymensingh-Netrokona plains, with village-based settlement along seasonal channels.',
    bn: 'ময়মনসিংহ–নেত্রকোণা সমভূমির ছোট কৃষিপ্রধান উপজেলা; মৌসুমি খালের ধারে গ্রামভিত্তিক বসতি।',
  },
  purbadhala: {
    en: 'The largest upazila of the southern plains by area, known for its bazaars such as Shyamganj and its rice-growing villages.',
    bn: 'দক্ষিণের সমভূমির আয়তনে বৃহত্তম উপজেলা; শ্যামগঞ্জের মতো বাজার ও ধানচাষের গ্রামগুলোর জন্য পরিচিত।',
  },
};
