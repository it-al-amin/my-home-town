import type { BilingualText } from '../types';
import { UPAZILAS_DATA } from './upazilas';

export interface EducationRegistry {
  id: string;
  level: 'primary' | 'secondary' | 'all';
  label: BilingualText;
  description: BilingualText;
  url: string;
  authority: BilingualText;
}

export const EDUCATION_REGISTRIES: EducationRegistry[] = [
  {
    id: 'ipemis',
    level: 'primary',
    label: { bn: 'সরকারি প্রাথমিক বিদ্যালয়ের পূর্ণ রেজিস্ট্রি', en: 'Complete government primary-school registry' },
    description: {
      bn: 'উপজেলা ও বিদ্যালয়ভিত্তিক সরকারি প্রাথমিক শিক্ষার তথ্য IPEMIS-এ দেখুন।',
      en: 'Browse government primary-school records by upazila in IPEMIS.',
    },
    url: 'https://ipemis.dpe.gov.bd/',
    authority: { bn: 'প্রাথমিক শিক্ষা অধিদপ্তর', en: 'Directorate of Primary Education' },
  },
  {
    id: 'emis',
    level: 'secondary',
    label: { bn: 'মাধ্যমিক ও উচ্চমাধ্যমিক প্রতিষ্ঠানের রেজিস্ট্রি', en: 'Secondary and higher-secondary registry' },
    description: {
      bn: 'EIIN, প্রতিষ্ঠান ও উপজেলা দিয়ে মাধ্যমিক স্তরের সরকারি রেজিস্ট্রি যাচাই করুন।',
      en: 'Verify secondary-level institutions by EIIN, institution and upazila.',
    },
    url: 'https://emis.gov.bd/',
    authority: { bn: 'মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর', en: 'Directorate of Secondary and Higher Education' },
  },
  {
    id: 'banbeis',
    level: 'all',
    label: { bn: 'জাতীয় শিক্ষা পরিসংখ্যান ও প্রতিষ্ঠান তালিকা', en: 'National education statistics and directory' },
    description: {
      bn: 'শিক্ষা প্রতিষ্ঠান জরিপ ও জাতীয় পরিসংখ্যানের সরকারি উৎস।',
      en: 'Official source for education surveys and national education statistics.',
    },
    url: 'https://banbeis.gov.bd/',
    authority: { bn: 'বাংলাদেশ শিক্ষা তথ্য ও পরিসংখ্যান ব্যুরো', en: 'Bangladesh Bureau of Educational Information and Statistics' },
  },
];

export const EDUCATION_UPAZILA_COVERAGE = UPAZILAS_DATA.map((upazila) => ({
  id: upazila.id,
  name: upazila.name,
  nameBn: upazila.nameBn,
}));
