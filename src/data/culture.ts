export interface CulturalElement {
  id: string;
  title: string;
  titleBn: string;
  category: 'literature' | 'music' | 'ethnic' | 'culinary' | 'festival';
  categoryLabel: { bn: string; en: string };
  description: string;
  descriptionBn: string;
  highlights: string[];
  highlightsBn: string[];
  source: string;
  sourceUrl: string;
}

export const CULTURE_DATA: CulturalElement[] = [
  {
    id: 'maimansingha-gitika',
    title: 'Maimansingha Gitika (Eastern Bengal Ballads)',
    titleBn: 'মৈমনসিংহ গীতিকার অমর লোকগাথা (মহুয়া ও মলুয়া)',
    category: 'literature',
    categoryLabel: { bn: 'লোকসাহিত্য', en: 'Folk Literature' },
    description: 'Dr. Dinesh Chandra Sen and Chandra Kumar De collected the world-famous ballads of "Maimansingha Gitika" predominantly from the rural bards and palagaan singers of Netrokona and Kendua. The tragic romantic ballad of Mahua and Nader Chand is deeply anchored in this riverine soil.',
    descriptionBn: 'ড. দীনেশচন্দ্র সেন এবং লোকসাহিত্যের সংগ্রাহক চন্দ্রকুমার দে কর্তৃক সংগৃহীত বিশ্বখ্যাত "মৈমনসিংহ গীতিকা"র অধিকাংশ অমর পালাগান নেত্রকোণা ও কেন্দুয়ার গ্রামীণ গায়েনদের কণ্ঠ থেকে সংগৃহীত। "মহুয়া", "মলুয়া", "দেওয়ানা মদিনা" প্রভৃতি অমর গীতিকা এই মাটিরই লোকজ সম্পদ।',
    highlights: ['Ballad of Mahua and Nader Chand', 'Folk poet Dvija Kanai tradition', 'Palagaan and Kobigaan performances in winter haats'],
    highlightsBn: ['মহুয়া ও নদের চাঁদের চিরন্তন প্রেমোপাখ্যান', 'লোককবি দ্বিজ কানাইয়ের রচনাশৈলী', 'শীতের রাতে গ্রামীণ মেলা ও হাটে পালাগানের আসর'],
    source: 'University of Calcutta & Bangla Academy',
    sourceUrl: 'https://banglaacademy.gov.bd',
  },
  {
    id: 'baul-and-bhatiali',
    title: 'Baul Mysticism & Bhatiali Haor Songs',
    titleBn: 'বাউল দর্শন, জল ও ভাটি অঞ্চলের অমর ভাটিয়ালি গান',
    category: 'music',
    categoryLabel: { bn: 'সঙ্গীত ও সুর', en: 'Music & Melodies' },
    description: 'Netrokona is an epicentre of Baul mysticism and Bhatiali boatman melodies. The humanist verses of Baul Jalal Uddin Khan (Jalalgeeti) and the soulful bamboo flute melodies popularized by maestro Bari Siddiqui express the joy, melancholy, and boundless water-horizons of the Haor.',
    descriptionBn: 'নেত্রকোণার জল ও হাওরের উন্মুক্ত প্রান্তরের সাথে মিশে আছে ভাটিয়ালি সুর ও বাউল দর্শন। বাউল সাধক জালাল উদ্দিন খাঁর "জালালগীতি" এবং বংশীবাদক ও কণ্ঠশিল্পী বারী সিদ্দিকীর আবেগঘন সুর এই অঞ্চলের মাটি ও মানুষের অন্তরের প্রতিচ্ছবি।',
    highlights: ['Jalalgeeti mystic gatherings', 'Soulful bamboo flute improvisations', 'Bhatiali melodies sung by fishermen across Dingapota Haor'],
    highlightsBn: ['জালালগীতির বার্ষিক ভক্ত সমাবেশ', 'গ্রামীণ বাঁশির সুর ও মারফতি ধারা', 'হাওরে নৌকা বেয়ে যাওয়ার সময় মাঝিদের ভাটিয়ালি তান'],
    source: 'National Folk Music Archives',
    sourceUrl: 'https://shilpakala.gov.bd',
  },
  {
    id: 'garo-hajong-traditions',
    title: 'Garo & Hajong Indigenous Heritage & Wangala Festival',
    titleBn: 'গারো ও হাজং নৃগোষ্ঠীর ঐতিহ্য ও নবান্ন উৎসব ওয়ানগালা',
    category: 'ethnic',
    categoryLabel: { bn: 'নৃগোষ্ঠী ও সংস্কৃতি', en: 'Indigenous Culture' },
    description: 'Along the foothills of Susang Durgapur and Kalmakanda, the Garo (Achik) and Hajong communities practice matrilineal customs, vibrant woven handicrafts (Dokmanda), and the jubilant autumn thanksgiving harvest festival "Wangala" dedicated to Sun God Saljong.',
    descriptionBn: 'সুসং দুর্গাপুর ও কলমাকান্দার পাহাড়ি পল্লীতে বাস করেন গারো (আচিক) ও হাজং জনগোষ্ঠীর মানুষ। গারোদের মাতৃতান্ত্রিক পারিবারিক ব্যবস্থা, তাঁতে বোনা বর্ণিল ঐতিহ্যবাহী পোশাক "দকমান্দা" এবং সূর্যদেবতা সালজং-এর উদ্দেশ্যে উদযাপিত নবান্ন উৎসব "ওয়ানগালা" অত্যন্ত উৎসবমুখর ও দৃষ্টিনন্দন।',
    highlights: ['Wangala post-harvest festival with 100-drum rhythms', 'Traditional attire: Dokmanda and Doksari', 'Preservation work by Tribal Cultural Academy, Birishiri'],
    highlightsBn: ['শত ঢোলের তালে তালে ওয়ানগালা উৎসবের নৃত্য', 'ঐতিহ্যবাহী পোশাক "দকমান্দা" ও হস্তশিল্প', 'বিরিশিরি কালচারাল একাডেমির মাধ্যমে ঐতিহ্য সংরক্ষণ'],
    source: 'Tribal Cultural Academy Birishiri & Ministry of Cultural Affairs',
    sourceUrl: 'http://durgapur.netrokona.gov.bd',
  },
  {
    id: 'balish-mishti-culinary',
    title: 'Goyanath’s Famous Balish Mishti (Pillow Sweet)',
    titleBn: 'নেত্রকোণার ঐতিহ্যবাহী গয়ানাথের বালিশ মিষ্টি',
    category: 'culinary',
    categoryLabel: { bn: 'ঐতিহ্যবাহী মিষ্টান্ন', en: 'Culinary Heritage' },
    description: 'Invented over a century ago by master sweetmaker Goyanath Ghosh in Netrokona Sadar, Balish Mishti is shaped like a plush pillow, prepared from fresh cow milk chhana, boiled in fragrant sugar syrup, and enveloped in thick clotted milk kheer cream.',
    descriptionBn: 'এক শতাব্দীরও বেশি সময় পূর্বে নেত্রকোণা শহরের ছোট বাজারে কারিগর গয়ানাথ ঘোষ এই মিষ্টির প্রচলন করেন। বালিশের আকৃতির এই মিষ্টি খাঁটি দুধের ছানা দিয়ে তৈরি এবং রসে ডুবিয়ে রাখার পর ক্ষীরের স্তরে ঢেকে পরিবেশন করা হয়। এটি নেত্রকোণার অন্যতম প্রধান ঐতিহ্য ও উপহার সামগ্রী।',
    highlights: ['Authentic recipe handed down across generations', 'Available in distinct sizes from mini to full-scale pillow sizes', 'Geographical hallmark of Netrokona District'],
    highlightsBn: ['প্রজন্মের পর প্রজন্ম ধরে সংরক্ষিত খাঁটি দুধের ছানার রেসিপি', 'ছোট থেকে শুরু করে বিশাল বালিশের সমান আকৃতিতে তৈরি', 'নেত্রকোণার অন্যতম প্রধান ভৌগোলিক ও ঐতিহ্যবাহী ব্র্যান্ড'],
    source: 'Netrokona Chamber of Commerce',
    sourceUrl: 'https://netrokona.gov.bd',
  },
  {
    id: 'nouka-baich-festival',
    title: 'Monsoon Boat Racing (ঐতিহ্যবাহী নৌকা বাইচ)',
    titleBn: 'বর্ষায় হাওর ও নদীতে ঐতিহ্যবাহী নৌকা বাইচ',
    category: 'festival',
    categoryLabel: { bn: 'উৎসব ও ক্রীড়া', en: 'Folk Sports' },
    description: 'During the high monsoon when the rivers Someshwari, Kangsha, and the vast Dingapota Haor swell with rainwater, thousands gather along banks to watch colorful long rowboats (Sarangi, Kosha) race with rhythmic drumbeats and folk chants.',
    descriptionBn: 'বর্ষাকালে যখন কংস, সোমেশ্বরী ও হাওরাঞ্চল কানায় কানায় পানিতে ভরে ওঠে, তখন বিভিন্ন উপজেলায় ঐতিহ্যবাহী নৌকা বাইচের আয়োজন করা হয়। সারিবদ্ধ মাঝিদের বৈঠার ছন্দ, জারিগান এবং ঢোলের তালে মুখরিত হয়ে ওঠে দুই তীর।',
    highlights: ['Century-old community boat race competitions', 'Festive harmony among village communities', 'Spectacular water pageantry in Mohanganj and Durgapur'],
    highlightsBn: ['শত বছরের ঐতিহ্যবাহী সামাজিক নৌকা প্রতিযোগিতা', 'হাজারো দর্শকের উপস্থিতিতে উৎসবমুখর আনন্দ', 'মোহনগঞ্জ, দুর্গাপুর ও খালিয়াজুরীর পানিপথে নৌ উৎসব'],
    source: 'Netrokona District Administration',
    sourceUrl: 'https://netrokona.gov.bd',
  },
];
