// Key facts about Netrokona: history, notable people, folk literature and landmarks.
// Every item is checked against the cited source (Banglapedia, Bengali Wikipedia or netrokona.gov.bd);
// anything that could not be verified is left out.

export interface Source { label: string; url: string }

const BP: Source = { label: 'বাংলাপিডিয়া', url: 'https://en.banglapedia.org/index.php/Netrokona_District' };
const GOV: Source = { label: 'নেত্রকোণা জেলা তথ্য বাতায়ন', url: 'https://netrokona.gov.bd/pages/tourist-spot' };
const wiki = (title: string): Source => ({
  label: 'বাংলা উইকিপিডিয়া',
  url: `https://bn.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
});

/* ------------------------------- History timeline ------------------------------- */

export interface TimelineItem {
  id: string;
  yearBn: string;
  yearEn: string;
  titleBn: string;
  titleEn: string;
  textBn: string;
  textEn: string;
  source: Source;
}

export const KEY_TIMELINE: TimelineItem[] = [
  {
    id: 'someshwar', yearBn: '৬৮৬ বঙ্গাব্দ (প্রায় ১২৮০ খ্রি.)', yearEn: '686 BS (c. 1280 AD)',
    titleBn: 'সোমেশ্বর পাঠক ও সোমেশ্বরী নদী', titleEn: 'Someshwar Pathak and the Someshwari',
    textBn: 'সোমেশ্বর পাঠক সুসং অঞ্চল অধিকার করার পর থেকে আগের “সিমসাং” নদী তাঁর নামে সোমেশ্বরী নামে পরিচিত হয়।',
    textEn: 'After Someshwar Pathak took the Susang region, the river once called Simsang became known as the Someshwari, after him.',
    source: wiki('সোমেশ্বরী নদী'),
  },
  {
    id: 'subdivision', yearBn: '১৮৮২', yearEn: '1882',
    titleBn: 'নেত্রকোণা মহকুমা গঠন', titleEn: 'Netrokona sub-division formed',
    textBn: 'ব্রিটিশ আমলে ময়মনসিংহ জেলার অধীনে নেত্রকোণা মহকুমা গঠিত হয়। (উইকিপিডিয়ায় সাল ১৮৮০ উল্লেখ আছে।)',
    textEn: 'Netrokona became a sub-division of Mymensingh district under British rule. (Wikipedia gives 1880.)',
    source: BP,
  },
  {
    id: 'tonk', yearBn: '৩১ জানুয়ারি ১৯৪৬', yearEn: '31 January 1946',
    titleBn: 'টংক আন্দোলন: প্রথম শহীদ রাশিমণি হাজং', titleEn: 'Tonk movement: first martyr Rashimoni Hajong',
    textBn: 'কমরেড মণি সিংহের নেতৃত্বে টংক প্রথার বিরুদ্ধে কৃষক ও হাজং-গারোদের আন্দোলনে হাজং মাতা রাশিমণি হাজং প্রথম শহীদ হন।',
    textEn: 'In the peasant and Hajong–Garo uprising against the Tonk system led by Comrade Moni Singh, Rashimoni Hajong became the first martyr.',
    source: wiki('রাসিমণি হাজং'),
  },
  {
    id: 'seven-martyrs', yearBn: '২৬ জুলাই ১৯৭১', yearEn: '26 July 1971',
    titleBn: 'নাজিরপুরের যুদ্ধ, কলমাকান্দা', titleEn: 'Battle of Nazirpur, Kalmakanda',
    textBn: 'মুক্তিযুদ্ধে পাকিস্তানি বাহিনীর সাথে সম্মুখযুদ্ধে ৭ জন মুক্তিযোদ্ধা শহীদ হন; তাঁদের সমাধি “সাত শহীদের মাজার”।',
    textEn: 'Seven freedom fighters fell in a direct battle with the Pakistani army; they rest at the “Seven Martyrs’ Shrine”.',
    source: BP,
  },
  {
    id: 'district', yearBn: '১৭ জানুয়ারি ১৯৮৪', yearEn: '17 January 1984',
    titleBn: 'নেত্রকোণা জেলা প্রতিষ্ঠা', titleEn: 'Netrokona becomes a district',
    textBn: 'মহকুমা থেকে পূর্ণাঙ্গ জেলায় উন্নীত হয়; বর্তমানে ময়মনসিংহ বিভাগের অন্তর্গত।',
    textEn: 'The sub-division was upgraded to a full district; it is now part of Mymensingh Division.',
    source: wiki('নেত্রকোণা জেলা'),
  },
  {
    id: 'university', yearBn: '২০১৮', yearEn: '2018',
    titleBn: 'নেত্রকোণা বিশ্ববিদ্যালয়', titleEn: 'Netrokona University',
    textBn: 'রাজুর বাজারে সরকারি বিশ্ববিদ্যালয় প্রতিষ্ঠিত হয়; পূর্ব নাম শেখ হাসিনা বিশ্ববিদ্যালয়।',
    textEn: 'A public university was founded at Rajur Bazar; formerly named Sheikh Hasina University.',
    source: wiki('নেত্রকোণা বিশ্ববিদ্যালয়'),
  },
  {
    id: 'balish-gi', yearBn: '২০২৫', yearEn: '2025',
    titleBn: 'বালিশ মিষ্টির জিআই স্বীকৃতি', titleEn: 'GI status for balish mishti',
    textBn: 'শিল্প মন্ত্রণালয় নেত্রকোণার ঐতিহ্যবাহী বালিশ মিষ্টিকে (“গয়ানাথের বালিশ”) ভৌগোলিক নির্দেশক পণ্যের সনদ দেয়।',
    textEn: 'The Ministry of Industries registered Netrokona’s balish mishti (“Gayanath’s balish”) as a Geographical Indication.',
    source: wiki('বালিশ মিষ্টি'),
  },
];

/* ------------------------------- District at a glance ------------------------------- */

export interface KeyValueFact { id: string; labelBn: string; labelEn: string; valueBn: string; valueEn: string; source: Source }

export const KEY_DISTRICT_FACTS: KeyValueFact[] = [
  { id: 'division', labelBn: 'বিভাগ', labelEn: 'Division', valueBn: 'ময়মনসিংহ', valueEn: 'Mymensingh', source: wiki('নেত্রকোণা জেলা') },
  { id: 'area', labelBn: 'আয়তন', labelEn: 'Area', valueBn: '২,৭৯৪.২৮ বর্গ কিমি', valueEn: '2,794.28 km²', source: BP },
  { id: 'admin', labelBn: 'উপজেলা / ইউনিয়ন / পৌরসভা', labelEn: 'Upazilas / unions / municipalities', valueBn: '১০ / ৮৬ / ৫', valueEn: '10 / 86 / 5', source: BP },
  { id: 'largest', labelBn: 'বৃহত্তম উপজেলা', labelEn: 'Largest upazila', valueBn: 'কলমাকান্দা', valueEn: 'Kalmakanda', source: BP },
  { id: 'smallest', labelBn: 'ক্ষুদ্রতম উপজেলা', labelEn: 'Smallest upazila', valueBn: 'আটপাড়া', valueEn: 'Atpara', source: BP },
  { id: 'seats', labelBn: 'সংসদীয় আসন', labelEn: 'Parliamentary seats', valueBn: '৫টি', valueEn: '5', source: wiki('নেত্রকোণা জেলা') },
  { id: 'north', labelBn: 'উত্তর সীমান্ত', labelEn: 'Northern border', valueBn: 'ভারতের মেঘালয় (গারো পাহাড়)', valueEn: 'Meghalaya, India (Garo Hills)', source: BP },
  { id: 'neighbours', labelBn: 'দক্ষিণ / পূর্ব / পশ্চিম', labelEn: 'South / east / west', valueBn: 'কিশোরগঞ্জ / সুনামগঞ্জ / ময়মনসিংহ', valueEn: 'Kishoreganj / Sunamganj / Mymensingh', source: BP },
  { id: 'rivers', labelBn: 'প্রধান নদী', labelEn: 'Main rivers', valueBn: 'ধনু, ধলাই, ঘোড়াউত্রা, পিয়াইন, গুনাই, সোমেশ্বরী', valueEn: 'Dhanu, Dhalai, Ghorautra, Piyain, Gunai, Someshwari', source: BP },
  { id: 'town-river', labelBn: 'জেলা শহরের নদী', labelEn: 'River through the town', valueBn: 'মগড়া', valueEn: 'Mogra', source: BP },
  { id: 'indigenous', labelBn: 'ক্ষুদ্র নৃগোষ্ঠী', labelEn: 'Indigenous communities', valueBn: 'গারো, হাজং, হদি, বানাই', valueEn: 'Garo, Hajong, Hodi, Banai', source: BP },
  { id: 'mineral', labelBn: 'বিখ্যাত খনিজ', labelEn: 'Known mineral', valueBn: 'সাদামাটি (চীনামাটি), বিজয়পুর', valueEn: 'White (china) clay, Bijoypur', source: GOV },
];

/* ------------------------------- People ------------------------------- */

export type PersonGroup = 'writers' | 'baul' | 'movement';

export interface KeyPerson {
  id: string;
  group: PersonGroup;
  nameBn: string;
  nameEn: string;
  roleBn: string;
  roleEn: string;
  bornBn: string;
  bornEn: string;
  highlightsBn: string[];
  highlightsEn: string[];
  source: Source;
}

export const KEY_PEOPLE: KeyPerson[] = [
  {
    id: 'humayun', group: 'writers', nameBn: 'হুমায়ূন আহমেদ', nameEn: 'Humayun Ahmed', roleBn: 'কথাসাহিত্যিক ও চলচ্চিত্রকার', roleEn: 'Novelist & filmmaker',
    bornBn: '১৩ নভেম্বর ১৯৪৮, মোহনগঞ্জ (নানাবাড়ি) · মৃত্যু ১৯ জুলাই ২০১২; পৈতৃক বাড়ি কুতুবপুর, কেন্দুয়া', bornEn: '13 Nov 1948, Mohanganj (maternal home) · d. 19 Jul 2012; ancestral home Kutubpur, Kendua',
    highlightsBn: ['প্রথম উপন্যাস “নন্দিত নরকে” (১৯৭২)', 'সৃষ্ট চরিত্র হিমু ও মিসির আলি', 'পিতা শহীদ ফয়জুর রহমান আহমদ'],
    highlightsEn: ['First novel “Nondito Noroke” (1972)', 'Created Himu and Misir Ali', 'Father: Shaheed Foyzur Rahman Ahmed'],
    source: wiki('হুমায়ূন আহমেদ'),
  },
  {
    id: 'goon', group: 'writers', nameBn: 'নির্মলেন্দু গুণ', nameEn: 'Nirmalendu Goon', roleBn: 'কবি', roleEn: 'Poet',
    bornBn: '২১ জুন ১৯৪৫, কাশবন, বারহাট্টা', bornEn: '21 Jun 1945, Kashban, Barhatta',
    highlightsBn: ['প্রথম কাব্যগ্রন্থ “প্রেমাংশুর রক্ত চাই” (১৯৭০)', 'বিখ্যাত কবিতা “হুলিয়া”', 'একুশে পদক ২০০১, স্বাধীনতা পুরস্কার ২০১৬'],
    highlightsEn: ['First book “Premangshur Rokto Chai” (1970)', 'Famous poem “Hulia”', 'Ekushey Padak 2001, Independence Award 2016'],
    source: wiki('নির্মলেন্দু গুণ'),
  },
  {
    id: 'helal', group: 'writers', nameBn: 'হেলাল হাফিজ', nameEn: 'Helal Hafiz', roleBn: 'কবি (প্রেম ও দ্রোহের কবি)', roleEn: 'Poet of love and protest',
    bornBn: '৭ অক্টোবর ১৯৪৮, বড়তলী, আটপাড়া (মৃত্যু ১৩ ডিসেম্বর ২০২৪)', bornEn: '7 Oct 1948, Baratali, Atpara (d. 13 Dec 2024)',
    highlightsBn: ['কাব্যগ্রন্থ “যে জলে আগুন জ্বলে” (১৯৮৬)', '“এখন যৌবন যার মিছিলে যাবার তার শ্রেষ্ঠ সময়” (নিষিদ্ধ সম্পাদকীয়)', 'বাংলা একাডেমি পুরস্কার ২০১৩'],
    highlightsEn: ['“Je Jole Agun Jole” (1986)', '“Ekhon joubon jar michhile jabar tar shreshtho shomoy” (Nishiddho Shompadokio)', 'Bangla Academy Award 2013'],
    source: wiki('হেলাল হাফিজ'),
  },
  {
    id: 'jatin', group: 'writers', nameBn: 'যতীন সরকার', nameEn: 'Jatin Sarkar', roleBn: 'প্রাবন্ধিক ও শিক্ষাবিদ', roleEn: 'Essayist & educator',
    bornBn: '১৮ আগস্ট ১৯৩৬, চন্দপাড়া, কেন্দুয়া (মৃত্যু ১৩ আগস্ট ২০২৫)', bornEn: '18 Aug 1936, Chandpara, Kendua (d. 13 Aug 2025)',
    highlightsBn: ['স্বাধীনতা পুরস্কার ২০১০', 'বাগ্মিতার জন্য সুপরিচিত'],
    highlightsEn: ['Independence Award 2010', 'Renowned orator'],
    source: wiki('যতীন সরকার'),
  },
  {
    id: 'khalekdad', group: 'writers', nameBn: 'খালেকদাদ চৌধুরী', nameEn: 'Khalekdad Chowdhury', roleBn: 'সাহিত্যিক', roleEn: 'Writer',
    bornBn: '২ ফেব্রুয়ারি ১৯০৭, চানগাঁও, মদন (মৃত্যু ১৬ অক্টোবর ১৯৮৫); পৈতৃক বাড়ি সোনাজোড়, আটপাড়া', bornEn: '2 Feb 1907, Changaon, Madan (d. 16 Oct 1985); ancestral home Sonajor, Atpara',
    highlightsBn: [], highlightsEn: [],
    source: wiki('খালেকদাদ চৌধুরী'),
  },
  {
    id: 'ukil', group: 'baul', nameBn: 'উকিল মুন্সী', nameEn: 'Ukil Munshi', roleBn: 'বাউল সাধক ও গীতিকার', roleEn: 'Baul mystic & songwriter',
    bornBn: '১১ জুন ১৮৮৫, নূরপুর বোয়ালী, খালিয়াজুড়ি (মৃত্যু ১২ ডিসেম্বর ১৯৭৮)', bornEn: '11 Jun 1885, Nurpur Boali, Khaliajuri (d. 12 Dec 1978)',
    highlightsBn: ['গান: “আষাঢ় মাইস্যা ভাসা পানি রে”, “সোনা বন্ধুয়া রে”', 'প্রকৃত নাম সৈয়দ আব্দুল হক আকন্দ', 'গানের গুরু রশিদ উদ্দিন'],
    highlightsEn: ['Songs: “Asharh maissa bhasha pani re”, “Shona bondhuya re”', 'Real name Syed Abdul Haq Akanda', 'Music teacher: Rashid Uddin'],
    source: wiki('উকিল মুন্সী'),
  },
  {
    id: 'rashid', group: 'baul', nameBn: 'রশিদ উদ্দিন', nameEn: 'Rashid Uddin', roleBn: 'বাউল সাধক', roleEn: 'Baul mystic',
    bornBn: '২১ জানুয়ারি ১৮৮৯, বাহিরচাপড়া, নেত্রকোণা পৌরসভা (মৃত্যু ১৯৬৪)', bornEn: '21 Jan 1889, Bahirchapra, Netrokona municipality (d. 1964)',
    highlightsBn: ['গান: “মানুষ ধর, মানুষ ভজ”, “মানুষ একটা কলের গাড়ি”', 'উকিল মুন্সীর গানের গুরু'],
    highlightsEn: ['Songs: “Manush dhoro, manush bhojo”, “Manush ekta koler gari”', 'Teacher of Ukil Munshi'],
    source: wiki('রশিদ উদ্দিন'),
  },
  {
    id: 'jalal', group: 'baul', nameBn: 'জালাল উদ্দিন খাঁ', nameEn: 'Jalal Uddin Khan', roleBn: 'বাউল সাধক ও গীতিকবি', roleEn: 'Baul lyricist',
    bornBn: '২৫ এপ্রিল ১৮৯৪, আসদহাটি, কেন্দুয়া (মৃত্যু ১৯৭২)', bornEn: '25 Apr 1894, Asadhati, Kendua (d. 1972)',
    highlightsBn: ['গানের সংকলন “জালাল গীতিকা”', 'গান আত্মতত্ত্ব, পরমতত্ত্ব, দেশতত্ত্ব ইত্যাদি তত্ত্বে বিন্যস্ত'],
    highlightsEn: ['Song collection “Jalal Geetika”', 'Songs grouped into tattvas: self, supreme, country…'],
    source: wiki('জালাল উদ্দিন খাঁ'),
  },
  {
    id: 'bari', group: 'baul', nameBn: 'বারী সিদ্দিকী', nameEn: 'Bari Siddiqui', roleBn: 'লোকসংগীতশিল্পী ও বংশীবাদক', roleEn: 'Folk singer & flautist',
    bornBn: '১৫ নভেম্বর ১৯৫৪, নেত্রকোণা (মৃত্যু ২০১৭)', bornEn: '15 Nov 1954, Netrokona (d. 2017)',
    highlightsBn: ['গান: “শুয়া চান পাখি”, “আমার গায়ে যত দুঃখ সয়”'],
    highlightsEn: ['Songs: “Shua chan pakhi”, “Amar gaye joto dukkho shoy”'],
    source: wiki('বারী সিদ্দিকী'),
  },
  {
    id: 'moni', group: 'movement', nameBn: 'কমরেড মণি সিংহ', nameEn: 'Comrade Moni Singh', roleBn: 'টংক আন্দোলনের নেতা', roleEn: 'Leader of the Tonk movement',
    bornBn: '২৮ জুলাই ১৯০১ – ৩১ ডিসেম্বর ১৯৯০', bornEn: '28 Jul 1901 – 31 Dec 1990',
    highlightsBn: ['টংক প্রথার বিরুদ্ধে আন্দোলনের অবিসংবাদিত নেতা', 'মুজিবনগর সরকারের উপদেষ্টা পরিষদের সদস্য'],
    highlightsEn: ['Undisputed leader of the movement against the Tonk system', 'Member of the Mujibnagar government’s advisory council'],
    source: wiki('মণি সিং'),
  },
  {
    id: 'rashimoni', group: 'movement', nameBn: 'রাশিমণি হাজং', nameEn: 'Rashimoni Hajong', roleBn: 'টংক আন্দোলনের প্রথম শহীদ', roleEn: 'First martyr of the Tonk movement',
    bornBn: '১৯০১ – ৩১ জানুয়ারি ১৯৪৬', bornEn: '1901 – 31 Jan 1946',
    highlightsBn: ['“হাজং মাতা” নামে পরিচিত', 'দুর্গাপুরে তাঁর স্মৃতিসৌধ রয়েছে'],
    highlightsEn: ['Known as “Hajong Mata”', 'A memorial stands in Durgapur'],
    source: wiki('রাসিমণি হাজং'),
  },
];

/* ------------------------------- Folk literature ------------------------------- */

export interface InfoCard { id: string; titleBn: string; titleEn: string; textBn: string; textEn: string; placeId?: string; source: Source }

export const KEY_FOLK: InfoCard[] = [
  {
    id: 'gitika', titleBn: 'মৈমনসিংহ গীতিকা', titleEn: 'Maimansingha Gitika',
    textBn: 'পালাগুলোর প্রধান সংগ্রাহক কেন্দুয়ার আইথর গ্রামের চন্দ্রকুমার দে। ড. দীনেশচন্দ্র সেনের সম্পাদনায় কলকাতা বিশ্ববিদ্যালয় থেকে ১৯২৩–৩২ সালে প্রকাশিত।',
    textEn: 'The ballads were chiefly collected by Chandra Kumar De of Aithar, Kendua, and published by the University of Calcutta (1923–32), edited by Dr Dinesh Chandra Sen.',
    source: wiki('মৈমনসিংহ গীতিকা'),
  },
  {
    id: 'chandrakumar', titleBn: 'চন্দ্রকুমার দে (১৮৮৯–১৯৪৬)', titleEn: 'Chandra Kumar De (1889–1946)',
    textBn: 'কেন্দুয়ার আইথর গ্রামের লোকসাহিত্য সংগ্রাহক; তাঁর সংগৃহীত পালাগানই মৈমনসিংহ গীতিকার মূল ভিত্তি।',
    textEn: 'Folk-literature collector from Aithar, Kendua; the ballads he gathered form the core of the Maimansingha Gitika.',
    source: wiki('চন্দ্রকুমার দে'),
  },
  {
    id: 'mahua', titleBn: 'মহুয়া ও অন্যান্য পালা', titleEn: 'Mahua and other ballads',
    textBn: '“মহুয়া”র রচয়িতা দ্বিজ কানাই, “কমলা” দ্বিজ ঈশান, “চন্দ্রাবতী” নয়নচাঁদ ঘোষ; “মলুয়া” পালার সূচনায় কবি চন্দ্রাবতীর বন্দনা আছে।',
    textEn: '“Mahua” by Dwij Kanai, “Kamala” by Dwij Ishan, “Chandrabati” by Nayanchand Ghosh; “Malua” opens with a hymn by poet Chandrabati.',
    source: wiki('মৈমনসিংহ গীতিকা'),
  },
];

/* ------------------------------- Places ------------------------------- */

export const KEY_PLACES: InfoCard[] = [
  { id: 'bijoypur', placeId: 'birishiri-ceramic-hill', titleBn: 'বিজয়পুর সাদামাটি', titleEn: 'Bijoypur white clay', textBn: 'দুর্গাপুরের কুল্লাগড়া ইউনিয়নে দেশের অন্যতম বৃহৎ সাদামাটি (চীনামাটি) খনিজ অঞ্চল।', textEn: 'One of the country’s largest white (china) clay deposits, in Kullagora union, Durgapur.', source: GOV },
  { id: 'birishiri', placeId: 'tribal-cultural-academy', titleBn: 'বিরিশিরি কালচারাল একাডেমি', titleEn: 'Birishiri Cultural Academy', textBn: 'দুর্গাপুরের বিরিশিরিতে ক্ষুদ্র নৃগোষ্ঠীর সংস্কৃতি চর্চার সরকারি প্রতিষ্ঠান।', textEn: 'Government academy for indigenous culture at Birishiri, Durgapur.', source: BP },
  { id: 'someshwari', placeId: 'someshwari-river', titleBn: 'সোমেশ্বরী নদী', titleEn: 'Someshwari River', textBn: 'মেঘালয়ের গারো পাহাড় থেকে দুর্গাপুর দিয়ে বাংলাদেশে প্রবেশকারী আন্তঃসীমান্ত নদী; দৈর্ঘ্য প্রায় ৫০ কিমি।', textEn: 'Trans-boundary river from Meghalaya’s Garo Hills, entering Bangladesh at Durgapur; about 50 km long.', source: wiki('সোমেশ্বরী নদী') },
  { id: 'roailbari', placeId: 'roailbari-fort', titleBn: 'রোয়াইলবাড়ি (কোটবাড়ী) দুর্গ', titleEn: 'Roailbari (Kotbari) fort', textBn: 'কেন্দুয়ায় অবস্থিত প্রাচীন দুর্গ ও প্রত্নতাত্ত্বিক স্থাপনার সমাহার।', textEn: 'Ancient fort and archaeological complex in Kendua.', source: wiki('রোয়াইলবাড়ি দুর্গ') },
  { id: 'ranikhong', placeId: 'rani-khong-church', titleBn: 'রানীখং মিশন', titleEn: 'Ranikhong Mission', textBn: '১৯১০ সালে দুর্গাপুরের কুল্লাগড়া ইউনিয়নে সোমেশ্বরীর তীরে পাহাড়চূড়ায় স্থাপিত ক্যাথলিক মিশন।', textEn: 'Catholic mission founded in 1910 on a hilltop by the Someshwari, Kullagora union, Durgapur.', source: GOV },
  { id: 'rashimoni-memorial', placeId: 'rashimoni-monument', titleBn: 'রাশিমণি স্মৃতিসৌধ ও টংক শহীদ স্মৃতিসৌধ', titleEn: 'Rashimoni & Tonk Martyrs’ memorials', textBn: 'টংক আন্দোলনের শহীদদের স্মরণে দুর্গাপুরে নির্মিত স্মৃতিসৌধ।', textEn: 'Memorials in Durgapur to the martyrs of the Tonk movement.', source: GOV },
  { id: 'seven-martyrs', placeId: 'lengura-memorial', titleBn: 'সাত শহীদের মাজার', titleEn: 'Seven Martyrs’ Shrine', textBn: 'কলমাকান্দায় ১৯৭১ সালে শহীদ ৭ মুক্তিযোদ্ধার সমাধি।', textEn: 'Graves of seven freedom fighters killed in 1971, Kalmakanda.', source: GOV },
  { id: 'rumi', placeId: 'shah-sultan-rumi-shrine', titleBn: 'শাহ সুলতান কমরউদ্দিন রুমী (রহ.)-এর মাজার', titleEn: 'Shrine of Shah Sultan Kamaruddin Rumi', textBn: 'নেত্রকোণা সদরের মদনপুরে অবস্থিত।', textEn: 'At Madanpur, Netrokona Sadar.', source: BP },
  { id: 'kamala', titleBn: 'কমলা রানীর দিঘি', titleEn: 'Kamala Rani’s Dighi', textBn: 'দুর্গাপুরে অবস্থিত ঐতিহাসিক দিঘি।', textEn: 'Historic pond in Durgapur.', source: GOV },
];
