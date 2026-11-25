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

export interface UpazilaTimelineEntry {
  year: string;
  text: BilingualText;
}

export interface UpazilaHistory {
  /** Key dates, oldest first */
  timeline: UpazilaTimelineEntry[];
  /** Archaeological and heritage sites */
  heritage: BilingualText;
}

/** Facts summarised in our own words from each upazila's Banglapedia entry. */
export const UPAZILA_HISTORY_SOURCE = {
  label: 'Banglapedia, Asiatic Society of Bangladesh',
  labelBn: 'বাংলাপিডিয়া, বাংলাদেশ এশিয়াটিক সোসাইটি',
  url: 'https://en.banglapedia.org/index.php/Netrokona_District',
};

const t = (year: string, en: string, bn: string): UpazilaTimelineEntry => ({ year, text: { en, bn } });
const UPAZILA_1983 = t('1983', 'The thana becomes an upazila.', 'থানাটি উপজেলায় উন্নীত হয়।');

export const UPAZILA_HISTORY: Record<string, UpazilaHistory> = {
  'netrokona-sadar': {
    timeline: [
      t('1874', 'Netrokona thana is established.', 'নেত্রকোণা থানা প্রতিষ্ঠিত হয়।'),
      t('1939', 'Netaji Subhas Chandra Bose speaks at a public meeting in the town (15 March).', 'নেতাজি সুভাষচন্দ্র বসু শহরে এক জনসভায় বক্তব্য দেন (১৫ মার্চ)।'),
      t('1945', 'The All India Kisan Sabha (peasant) conference meets in Netrokona, 8–10 April.', 'নেত্রকোণায় নিখিল ভারত কৃষক সম্মেলন অনুষ্ঠিত হয় (৮–১০ এপ্রিল)।'),
      t('1971', 'Four local people are executed at Trimohani bridge in April; in December freedom fighters defeat the army at the Agricultural Farm.', 'এপ্রিলে ত্রিমোহনী ব্রিজে চারজনকে হত্যা করা হয়; ডিসেম্বরে কৃষি খামারের যুদ্ধে মুক্তিযোদ্ধারা পাকবাহিনীকে পরাজিত করেন।'),
      UPAZILA_1983,
    ],
    heritage: { en: 'Shrine of Hazrat Shah Sultan Kamruddin Rumi (R) at Madanpur.', bn: 'মদনপুরে হযরত শাহ সুলতান কমরুদ্দীন রুমী (রহ.)-এর মাজার।' },
  },
  durgapur: {
    timeline: [
      t('1848', 'Garo uprising in the Susang hills.', 'সুসং পাহাড়ে গারো বিদ্রোহ।'),
      t('1874', 'Durgapur thana is established.', 'দুর্গাপুর থানা প্রতিষ্ঠিত হয়।'),
      t('1890s', 'Hajong revolt led by Mona Sardar against unpaid forced labour at the elephant stockades (hatikheda).', 'হাতিখেদায় বিনা মজুরির বাধ্যতামূলক শ্রমের বিরুদ্ধে মনা সর্দারের নেতৃত্বে হাজং বিদ্রোহ।'),
      t('1942–47', 'Comrade Moni Singh leads the Tonk and Tebhaga peasant movements from this area.', 'কমরেড মণি সিংহের নেতৃত্বে এই অঞ্চল থেকে টংক ও তেভাগা আন্দোলন।'),
      t('1971', 'After Gaokandia villagers kill two Pakistani soldiers, the army retaliates by seizing about a hundred villagers.', 'গাঁওকান্দিয়ার গ্রামবাসী দুই পাকসেনাকে হত্যা করলে প্রতিশোধ হিসেবে পাকবাহিনী প্রায় একশ গ্রামবাসীকে ধরে নিয়ে যায়।'),
      UPAZILA_1983,
    ],
    heritage: { en: 'A Sultanate-era mosque at Maskandha village and the Susang royal estate.', bn: 'মাসকান্দা গ্রামে সুলতানি আমলের মসজিদ এবং সুসং রাজবাড়ি।' },
  },
  kalmakanda: {
    timeline: [
      t('1941', 'Kalmakanda thana is established.', 'কলমাকান্দা থানা প্রতিষ্ঠিত হয়।'),
      t('1942', 'Kalmakanda Pilot High School is founded.', 'কলমাকান্দা পাইলট উচ্চ বিদ্যালয় প্রতিষ্ঠিত হয়।'),
      t('1971', 'Seven freedom fighters fall in a battle at the Nazirpur three-road junction (26 July).', 'নাজিরপুরের তিন রাস্তার মোড়ে সম্মুখযুদ্ধে সাতজন মুক্তিযোদ্ধা শহীদ হন (২৬ জুলাই)।'),
      UPAZILA_1983,
    ],
    heritage: { en: 'Tomb of Monai Shah at Battala village.', bn: 'বটতলা গ্রামে মনাই শাহের মাজার।' },
  },
  mohanganj: {
    timeline: [
      t('1920', 'Mohanganj thana is established (6 April).', 'মোহনগঞ্জ থানা প্রতিষ্ঠিত হয় (৬ এপ্রিল)।'),
      t('1971', 'Freedom fighters take Mohanganj police station; on 8 December fighters and villagers overpower 19 razakars at Patharghata.', 'মুক্তিযোদ্ধারা মোহনগঞ্জ থানা দখল করেন; ৮ ডিসেম্বর পাথরঘাটায় মুক্তিযোদ্ধা ও জনতা ১৯ জন রাজাকারকে পরাস্ত করেন।'),
      UPAZILA_1983,
    ],
    heritage: {
      en: 'Fort remains at Betham and the Shekher Bari mosque (Hussain Shah period), and the Daulatpur temple (876 BS).',
      bn: 'বেতামের দুর্গের ধ্বংসাবশেষ ও শেখের বাড়ি মসজিদ (হোসেন শাহি আমল), এবং দৌলতপুর মন্দির (৮৭৬ বঙ্গাব্দ)।',
    },
  },
  khaliajuri: {
    timeline: [
      t('1906', 'Khaliajuri thana is established.', 'খালিয়াজুরী থানা প্রতিষ্ঠিত হয়।'),
      UPAZILA_1983,
    ],
    heritage: {
      en: 'Its heritage is the haor itself: villages on raised mounds, boat routes and seasonal embankments.',
      bn: 'হাওরই এর ঐতিহ্য: উঁচু ভিটার গ্রাম, নৌপথ ও মৌসুমি বাঁধ।',
    },
  },
  kendua: {
    timeline: [
      t('1890', 'Kendua thana is established.', 'কেন্দুয়া থানা প্রতিষ্ঠিত হয়।'),
      t('1971', 'Freedom fighters raid Kendua police station in August and attack the Pakistani camp at Patkura bridge on 20 November.', 'আগস্টে মুক্তিযোদ্ধারা কেন্দুয়া থানায় হামলা চালান; ২০ নভেম্বর পাটকুড়া ব্রিজের পাকসেনা ক্যাম্পে আক্রমণ করেন।'),
      UPAZILA_1983,
    ],
    heritage: {
      en: 'Roailbari fort and Jalal mosque, the Kali temple and dighi at Danachapuri, and the Khoaj mosque at Jafarpur.',
      bn: 'রোয়াইলবাড়ি দুর্গ ও জালাল মসজিদ, দানাচাপুরীর কালী মন্দির ও দিঘি, এবং জাফরপুরের খোয়াজ মসজিদ।',
    },
  },
  madan: {
    timeline: [
      t('1917', 'Madan thana is established.', 'মদন থানা প্রতিষ্ঠিত হয়।'),
      t('1971', 'A week of fighting, 1–8 November, ends with heavy Pakistani losses.', '১–৮ নভেম্বরের টানা যুদ্ধে পাকবাহিনী ব্যাপক ক্ষয়ক্ষতির শিকার হয়।'),
      UPAZILA_1983,
    ],
    heritage: { en: 'A Mughal-era mosque in Chandgaon union and the tomb of Bura Pir.', bn: 'চানগাঁও ইউনিয়নে মুঘল আমলের মসজিদ এবং বুড়া পীরের মাজার।' },
  },
  barhatta: {
    timeline: [
      t('1905', 'Barhatta thana is established.', 'বারহাট্টা থানা প্রতিষ্ঠিত হয়।'),
      t('1971', 'Freedom fighters blow up the Thakurakona rail bridge to stop the army; Barhatta is freed on 8 December.', 'পাকবাহিনী ঠেকাতে মুক্তিযোদ্ধারা ঠাকুরাকোনা রেলসেতু উড়িয়ে দেন; ৮ ডিসেম্বর বারহাট্টা হানাদারমুক্ত হয়।'),
      UPAZILA_1983,
    ],
    heritage: {
      en: 'Twin ponds at Amghail Pirijpur, the Deva temple at Singdha, and a Mughal-era building at Saoudpur.',
      bn: 'আমঘাইল পীরিজপুরের জোড়া পুকুর, সিংধার দেব মন্দির এবং সাওদপুরে মুঘল আমলের ভবন।',
    },
  },
  atpara: {
    timeline: [
      t('1926', 'Atpara thana is established.', 'আটপাড়া থানা প্রতিষ্ঠিত হয়।'),
      t('1971', 'Freedom fighters attack Atpara thana on 19 August and seize its arms.', '১৯ আগস্ট মুক্তিযোদ্ধারা আটপাড়া থানা আক্রমণ করে অস্ত্র দখল করেন।'),
      t('1983', 'The thana becomes an upazila (2 July).', 'থানাটি উপজেলায় উন্নীত হয় (২ জুলাই)।'),
    ],
    heritage: {
      en: 'The three-domed Mughal mosque at Saramushia-Haripur and remains of the Roy zamindar house at Rameshwarpur.',
      bn: 'স্বরমুশিয়া-হরিপুরের মুঘল আমলের তিন গম্বুজ মসজিদ এবং রামেশ্বরপুরের রায় জমিদারবাড়ির ধ্বংসাবশেষ।',
    },
  },
  purbadhala: {
    timeline: [
      t('1792', 'Karam Shah, founder of the Pagalpanthi movement, and his son Tipu Shah settle at Latirkandha and lead peasant resistance to British rule.', 'পাগলপন্থী মতবাদের প্রবর্তক করম শাহ ও পুত্র টিপু শাহ লেটিরকান্দায় বসতি গড়ে ব্রিটিশবিরোধী কৃষক আন্দোলন পরিচালনা করেন।'),
      t('1917', 'Purbadhala thana is established.', 'পূর্বধলা থানা প্রতিষ্ঠিত হয়।'),
      t('1971', 'The army reaches Purbadhala on 29 April; physician Dr. Hem Bagchi is killed at his home on 1 May.', '২৯ এপ্রিল পাকবাহিনী পূর্বধলায় আসে; ১ মে চিকিৎসক ডা. হেম বাগচীকে নিজ বাড়িতে হত্যা করা হয়।'),
      UPAZILA_1983,
    ],
    heritage: {
      en: 'Mughal-era mosques at Sunaikandha and Latirkandha, an old temple at Hogla, and zamindar houses at Baghber and Narayandahar.',
      bn: 'সুনাইকান্দা ও লেটিরকান্দার মুঘল আমলের মসজিদ, হোগলার প্রাচীন মন্দির এবং বাঘবেড় ও নারায়ণডহরের জমিদারবাড়ি।',
    },
  },
};
