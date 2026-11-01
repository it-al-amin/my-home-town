export interface LivestockActivity {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  keyAreas: string;
  keyAreasBn: string;
}

export const LIVESTOCK_DATA = {
  overview: {
    bn: 'নেত্রকোণা জেলার গ্রামীণ অর্থনীতির অন্যতম চালিকাশক্তি হলো প্রাণিসম্পদ খাত। বিশেষ করে হাওরাঞ্চলীয় উপজেলাগুলোতে (মোহনগঞ্জ, মদন, খালিয়াজুরী) প্রাকৃতিকভাবে হাঁস পালন এক অনন্য ঐতিহ্য ও অর্থনৈতিক বিপ্লব সৃষ্টি করেছে। উন্মুক্ত জলাশয় ও হাওরের শামুক-পোকামাকড় খেয়ে বেড়ে ওঠা লাখ লাখ দেশি হাঁস প্রতিদিন হাজার হাজার ডিম উৎপাদন করে সারা দেশে সরবরাহ করে। এছাড়াও সমতল উপজেলাগুলোতে উন্নত জাতের দুগ্ধ খামার ও গবাদিপশু পালন দিন দিন বৃদ্ধি পাচ্ছে।',
    en: 'Livestock rearing is a major economic pillar of rural Netrokona. In the wetland haors (Mohanganj, Madan, Khaliajuri), duck rearing is a distinct and thriving agro-ecological livelihood. Millions of native ducks forage naturally across wetland canals feeding on aquatic snails and plankton, generating massive yields of organic duck eggs. In mainland upazilas, cross-breed dairy farming and cattle rearing are expanding rapidly.',
  },
  activities: [
    {
      id: 'haor-duck-farming',
      name: 'Haor Open-Water Duck Farming (হাওরের হাঁসের খামার)',
      nameBn: 'হাওরাঞ্চলে উন্মুক্ত প্রাকৃতিক হাঁস পালন',
      description: 'Thousands of mobile duck herds (often 500-2,000 birds per herd) moved across receding water bodies, producing rich high-protein haor eggs for urban markets.',
      descriptionBn: 'হাওরের পানি কমার সাথে সাথে উন্মুক্ত বিলে বিলে ভ্রাম্যমাণ বাথান তৈরি করে হাজার হাজার হাঁস পালন করা হয়, যা দেশের ডিমের চাহিদার একটি বড় অংশ পূরণ করে।',
      keyAreas: 'Khaliajuri, Mohanganj, Madan, Kalmakanda',
      keyAreasBn: 'খালিয়াজুরী, মোহনগঞ্জ, মদন, কলমাকান্দা',
    },
    {
      id: 'cattle-dairy',
      name: 'Cattle Rearing & Milk Cooperatives (গবাদিপশু ও দুগ্ধ খামার)',
      nameBn: 'উন্নত জাতের গাভী পালন ও দুগ্ধ সমবায়',
      description: 'Breeding indigenous and Holstein-Friesian crossbred cattle supported by government artificial insemination centers.',
      descriptionBn: 'সরকারি কৃত্রিম প্রজনন কেন্দ্রের সহায়তায় ফ্রিজিয়ান ও দেশি জাতের গাভী পালন এবং সমবায় ভিত্তিক দুধ সংগ্রহ।',
      keyAreas: 'Netrokona Sadar, Purbadhala, Kendua, Atpara',
      keyAreasBn: 'নেত্রকোণা সদর, পূর্বধলা, কেন্দুয়া, আটপাড়া',
    },
    {
      id: 'goat-poultry',
      name: 'Black Bengal Goat & Backyard Poultry (ব্ল্যাক বেঙ্গল ছাগল ও মুরগি)',
      nameBn: 'ব্ল্যাক বেঙ্গল ছাগল ও দেশি মুরগি পালন',
      description: 'Rural household poverty alleviation through hardy native Black Bengal goats and backyard poultry rearing by women self-help groups.',
      descriptionBn: 'গ্রামীণ নারীদের স্বাবলম্বী করতে পারিবারিক পর্যায়ে পুষ্টিকর ডিম ও মাংসের জন্য ব্ল্যাক বেঙ্গল ছাগল ও দেশি মুরগি পালন।',
      keyAreas: 'All 10 Upazilas',
      keyAreasBn: 'জেলার সকল ১০টি উপজেলা',
    },
  ],
  services: [
    {
      title: 'Upazila Veterinary Hospital Consultation & Surgery',
      titleBn: 'উপজেলা প্রাণিসম্পদ হাসপাতাল ও চিকিৎসা সেবা',
      description: 'Free outdoor outpatient medical care, surgery, and prescription for farm livestock and pets.',
      descriptionBn: 'গবাদিপশু, হাঁস-মুরগি ও গৃহপালিত প্রাণীদের জন্য সরকারি হাসপাতালে বিনামূল্যে চিকিৎসাপত্র ও বিশেষজ্ঞ পরামর্শ।',
      authority: 'Department of Livestock Services (DLS)',
      portalUrl: 'http://dls.netrokona.gov.bd',
    },
    {
      title: 'Free Routine Vaccination Campaigns',
      titleBn: 'বিনামূল্যে নিয়মিত টিকাদান কর্মসূচি (অ্যানথ্রাক্স, ক্ষুরারোগ, ডাকপ্লেগ)',
      description: 'Government vaccines against Anthrax, Foot-and-Mouth Disease, PPR for goats, and Duck Plague for haor ducks.',
      descriptionBn: 'গবাদিপশুর তড়কা, বাদলা, ক্ষুরারোগ এবং হাঁসের মড়ক প্রতিরোধে উপজেলা প্রাণিসম্পদ দপ্তর কর্তৃক নিয়মিত সরকারি টিকা প্রদান।',
      authority: 'District Livestock Office, Netrokona',
      portalUrl: 'http://dls.gov.bd',
    },
  ],
};
