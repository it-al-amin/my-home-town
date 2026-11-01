export interface FisheryInfo {
  haorFisheriesOverview: {
    bn: string;
    en: string;
  };
  keySpecies: {
    name: string;
    nameBn: string;
    type: string;
    description: string;
  }[];
  majorFishMarkets: {
    name: string;
    nameBn: string;
    location: string;
    locationBn: string;
    features: string;
    featuresBn: string;
  }[];
  governmentSchemes: {
    title: string;
    titleBn: string;
    description: string;
    descriptionBn: string;
    authority: string;
    portalUrl: string;
  }[];
}

export const FISHERIES_DATA: FisheryInfo = {
  haorFisheriesOverview: {
    bn: 'নেত্রকোণা জেলার বিশেষ করে খালিয়াজুরী, মোহনগঞ্জ ও মদন উপজেলার বিস্তৃত হাওরাঞ্চল বাংলাদেশের মিঠাপানির প্রাকৃতিক মৎস্য ভাণ্ডার হিসেবে স্বীকৃত। বর্ষাকালে হাওরগুলো প্লাবিত হয়ে প্রাকৃতিক মৎস্য প্রজননক্ষেত্রে পরিণত হয়। বোয়াল, আইড়, চিতল, পাবদা, গুলশা, কৈ, শোল এবং চাপিলাসহ শতাধিক প্রজাতির দেশীয় মাছ এখানে প্রচুর পরিমাণে উৎপাদিত হয় এবং ঢাকা ও ময়মনসিংহের বাজারে রপ্তানি হয়।',
    en: 'Netrokona District, especially the expansive haor upazilas of Khaliajuri, Mohanganj, and Madan, is renowned as a primary freshwater open-water fisheries hub of Bangladesh. During the monsoon, vast wetland basins merge into enormous natural breeding grounds producing abundant indigenous species like Boal, Aier, Chitol, Pabda, Gulsha, and indigenous carps that are distributed nationwide.',
  },
  keySpecies: [
    {
      name: 'Boal & Aier (Giant Freshwater Catfish)',
      nameBn: 'বোয়াল ও আইড় মাছ',
      type: 'Indigenous Haor Catfish',
      description: 'Found abundantly in deep haor beels (Dhanu river basin). Coveted in urban markets for premium quality.',
    },
    {
      name: 'Chitol & Foli (Featherback)',
      nameBn: 'চিতল ও ফলি মাছ',
      type: 'Haor Open Water',
      description: 'Native predatory fish thriving in quiet deep haor waters during winter drawdown.',
    },
    {
      name: 'Pabda, Gulsha & Tengra',
      nameBn: 'পাবদা, গুলশা ও টেংরা',
      type: 'Indigenous Small Fish',
      description: 'Delicate freshwater species with high nutritional value, widely harvested in haor canals.',
    },
    {
      name: 'Rui, Katla & Mrigel (Major Carps)',
      nameBn: 'রুই, কাতলা ও মৃগেল',
      type: 'Riverine & Culture',
      description: 'Cultured extensively in commercial fish enclosures and seasonal water bodies.',
    },
  ],
  majorFishMarkets: [
    {
      name: 'Mohanganj Station Fish Market & Mokam',
      nameBn: 'মোহনগঞ্জ রেলওয়ে স্টেশন মাছের আড়ৎ ও পাইকারি মোকাম',
      location: 'Mohanganj Station Road',
      locationBn: 'মোহনগঞ্জ স্টেশন রোড',
      features: 'The largest freshwater wholesale fish market in the region. Fish caught in Dingapota Haor and Khaliajuri are auctioned early morning and loaded onto express trains and iced trucks for Dhaka.',
      featuresBn: 'বৃহত্তর হাওরাঞ্চলের সর্ববৃহৎ তাজা মিঠাপানির মাছের পাইকারি আড়ৎ। ভোরবেলা ডিংগাপোতা ও খালিয়াজুরীর তাজা মাছ এখানে নিলামে বিক্রি হয় এবং ঢাকাগামী ট্রেন ও ট্রাকে লোড করা হয়।',
    },
    {
      name: 'Khaliajuri Lipsa Ghat Fish Landing Center',
      nameBn: 'খালিয়াজুরী লেপসা ঘাট মাছের আড়ৎ',
      location: 'Lipsa, Khaliajuri Upazila',
      locationBn: 'লেপসা, খালিয়াজুরী উপজেলা',
      features: 'Primary landing point for deep haor motorized trawlers bringing direct morning catches.',
      featuresBn: 'গভীর হাওর থেকে আসা মাছের সরাসরি ট্রলার অবতরণ ও পাইকারি কেনাবেচার ঘাট।',
    },
    {
      name: 'Netrokona Sadar Boro Bazar Fish Market',
      nameBn: 'নেত্রকোণা সদর বড় বাজার মাছের বাজার',
      location: 'Boro Bazar, Sadar',
      locationBn: 'বড় বাজার, নেত্রকোণা সদর',
      features: 'Primary retail and wholesale market for the urban district center.',
      featuresBn: 'নেত্রকোণা জেলা শহরের প্রধান পাইকারি ও খুচরা মাছের বাজার।',
    },
  ],
  governmentSchemes: [
    {
      title: 'Fishermen Registration & Digital ID Scheme',
      titleBn: 'প্রকৃত জেলে নিবন্ধন ও ডিজিটাল স্মার্ট আইডি কার্ড প্রদান',
      description: 'Government issuance of verified fisherman cards ensuring direct food grains subsidy during seasonal ban on mother fish fishing.',
      descriptionBn: 'মা মাছ ও জাটকা সংরক্ষণ মৌসুমে মাছ ধরা নিষিদ্ধ থাকা অবস্থায় তালিকাভুক্ত জেলেদের ভিজিএফ চাল ও বিকল্প কর্মসংস্থান সহায়তা।',
      authority: 'District Fisheries Office, Netrokona',
      portalUrl: 'http://fisheries.netrokona.gov.bd',
    },
    {
      title: 'Beel Nursery & Fish Sanctuary Protection Project',
      titleBn: 'বিল নার্সারি স্থাপন ও দেশীয় মাছের স্থায়ী অভয়াশ্রম প্রকল্প',
      description: 'Establishment of permanent freshwater sanctuaries in haor beels to preserve endangered indigenous fish varieties from extinction.',
      descriptionBn: 'বিলুপ্তপ্রায় দেশীয় মাছের বংশবৃদ্ধির জন্য হাওরের বিভিন্ন বিলে স্থায়ী অভয়াশ্রম স্থাপন ও পাহারা ব্যবস্থা।',
      authority: 'Department of Fisheries, Ministry of Fisheries and Livestock',
      portalUrl: 'http://fisheries.gov.bd',
    },
  ],
};
