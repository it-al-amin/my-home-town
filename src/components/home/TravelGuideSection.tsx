import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Train, Bus, Navigation, Clock, DollarSign, ExternalLink, MapPin, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const TravelGuideSection: React.FC = () => {
  const { language } = useLanguage();
  const [activeOrigin, setActiveOrigin] = useState<'dhaka' | 'mymensingh'>('dhaka');

  const routesDhaka = [
    {
      destination: language === 'bn' ? 'ঢাকা ⇄ বিরিশিরি ও দুর্গাপুর (সাদামাটির পাহাড়)' : 'Dhaka to Birishiri & Durgapur',
      subtext: language === 'bn' ? 'সরাসরি বাস বা ট্রেনে জারিয়া/নেত্রকোণা হয়ে' : 'Direct bus or train via Netrokona / Jaria',
      mode: 'bus_train',
      duration: language === 'bn' ? '৫ থেকে ৬ ঘণ্টা' : '5 - 6 Hours',
      fare: language === 'bn' ? '৳৩৫০ - ৳৫০০ (বাস/ট্রেন)' : 'BDT 350 - 500',
      steps: [
        language === 'bn'
          ? 'মহাখালী বাস টার্মিনাল থেকে সরকার ট্রাভেলস বা জিন্নাত পরিবহনের সরাসরি বাসে বিরিশিরি/দুর্গাপুর (ভাড়া প্রায় ৳৪০০-৳৫০০)।'
          : 'Board direct buses (Sarkar Travels, Jinnat Paribahan) from Mohakhali Bus Terminal to Birishiri/Durgapur (~BDT 400-500).',
        language === 'bn'
          ? 'অথবা ঢাকা কমলাপুর/বিমানবন্দর থেকে ট্রেনে নেত্রকোণা সদর বা জারিয়া ঝাঁঝাইল স্টেশনে নেমে সিএনজি/টমটমে বিরিশিরি।'
          : 'Or take a train from Kamalapur to Netrokona or Jaria Jhanjail, then CNG/autorickshaw across Someshwari Bridge.',
        language === 'bn'
          ? 'বিরিশিরি বা দুর্গাপুর পৌঁছে ব্যাটারিচালিত টমটম বা মোটরবাইক ভাড়া করে বিজয়পুর সাদামাটির লেক ও রানীখং পাহাড় ভ্রমণ।'
          : 'From Birishiri bazar, hire local autorickshaws or motorbikes to reach Bijoypur White Clay Lake and Ranikhong Church.',
      ],
      highlight: language === 'bn' ? 'সেরা সময়: অক্টোবর থেকে মার্চ (শীতকাল)' : 'Best season: Oct - Mar (Clear water)',
    },
    {
      destination: language === 'bn' ? 'ঢাকা ⇄ নেত্রকোণা জেলা সদর (বালিশ মিষ্টির শহর)' : 'Dhaka to Netrokona Sadar',
      subtext: language === 'bn' ? 'আন্তঃনগর হাওর বা মোহনগঞ্জ এক্সপ্রেস ট্রেন' : 'Intercity Haor / Mohanganj Express Trains',
      mode: 'train',
      duration: language === 'bn' ? '৪ থেকে ৪.৫ ঘণ্টা' : '4 - 4.5 Hours',
      fare: language === 'bn' ? '৳১৯৫ - ৳৫৫০ (শোভন/স্নিগ্ধা)' : 'BDT 195 - 550',
      steps: [
        language === 'bn'
          ? 'কমলাপুর রেলওয়ে স্টেশন থেকে হাওর এক্সপ্রেস (সকাল ১০:১৫) বা মোহনগঞ্জ এক্সপ্রেস (দুপুর ১:১৫) ট্রেনে সরাসরি নেত্রকোণা স্টেশন।'
          : 'Board Haor Express (10:15 AM) or Mohanganj Express (1:15 PM) from Dhaka Kamalapur directly to Netrokona.',
        language === 'bn'
          ? 'বাসে যেতে চাইলে মহাখালী থেকে শাহজালাল এক্সপ্রেস, বিলাশ বা ফাহাদ পরিবহনে ৪ ঘণ্টায় নেত্রকোণা কেন্দ্রীয় বাস টার্মিনাল।'
          : 'By road: Take Shahjalal Express or Bilash Paribahan from Mohakhali (~4 hours via Gazipur & Mymensingh bypass).',
        language === 'bn'
          ? 'নেত্রকোণা শহরে নেমে রিকশায় মাত্র ১০ মিনিটে ছোট বাজার—সেখানে গয়ানাথের মূল দোকানে গরম বালিশ মিষ্টি উপভোগ করুন।'
          : 'From station/terminal, a 10-minute rickshaw ride takes you to Chhoto Bazar for authentic Gayanath Balish Mishti.',
      ],
      highlight: language === 'bn' ? 'অনলাইন ট্রেনের টিকিট: eticket.railway.gov.bd' : 'Book train online: eticket.railway.gov.bd',
    },
    {
      destination: language === 'bn' ? 'ঢাকা ⇄ ডিংগাপোতা হাওর ও খালিয়াজুরী' : 'Dhaka to Dingapota Haor & Khaliajuri',
      subtext: language === 'bn' ? 'সরাসরি ট্রেনে মোহনগঞ্জ টার্মিনাস ও ট্রলার' : 'Direct train to Mohanganj terminus & boat cruise',
      mode: 'train_boat',
      duration: language === 'bn' ? '৫ ঘণ্টা ট্রেন + নৌভ্রমণ' : '5h Train + Boat Cruise',
      fare: language === 'bn' ? '৳২২০ (ট্রেন) + নৌকা রিজার্ভ' : 'BDT 220 (Train) + Boat',
      steps: [
        language === 'bn'
          ? 'ঢাকা থেকে সরাসরি মোহনগঞ্জ এক্সপ্রেসে মোহনগঞ্জ শেষ স্টেশনে নামুন (যাত্রা সময় প্রায় ৫ ঘণ্টা)।'
          : 'Take the direct train to the last terminal Mohanganj Station (~5 hours from Dhaka).',
        language === 'bn'
          ? 'মোহনগঞ্জ স্টেশন থেকে অটোরিকশায় ১০ মিনিটে উচিতপুর ঘাট বা গাগলাজুর ঘাটে পৌঁছান।'
          : 'Take an autorickshaw from Mohanganj station to Uchitpur or Gaglajur boat ghat (10-15 mins).',
        language === 'bn'
          ? 'ঘাট থেকে ইঞ্জিনচালিত নৌকা/ট্রলার ভাড়া করে সুবিশাল ডিংগাপোতা হাওরের বুকে সূর্যাস্ত দেখা ও খালিয়াজুরী ভ্রমণ।'
          : 'Hire a motorized country boat from Uchitpur to cruise across immense Dingapota Haor to island villages.',
      ],
      highlight: language === 'bn' ? 'সেরা সময়: জুলাই থেকে অক্টোবর (বর্ষাকাল)' : 'Best season: Monsoon (July - October)',
    },
  ];

  const routesMymensingh = [
    {
      destination: language === 'bn' ? 'ময়মনসিংহ ⇄ নেত্রকোণা সদর' : 'Mymensingh to Netrokona Sadar',
      subtext: language === 'bn' ? 'স্থানীয় বাস, সিএনজি বা লোকাল ট্রেন' : 'Local Bus, CNG or Commuter Train',
      duration: language === 'bn' ? '১ থেকে ১.৫ ঘণ্টা' : '1 - 1.5 Hours',
      fare: language === 'bn' ? '৳৮০ - ৳১৫০' : 'BDT 80 - 150',
      steps: [
        language === 'bn'
          ? 'ময়মনসিংহ ব্রিজ মোড় (শম্ভুগঞ্জ) থেকে প্রতি ১০ মিনিট পর পর নেত্রকোণার গেটলক ও লোকাল বাস ছাড়ে।'
          : 'Buses depart every 10 mins from Shambhuganj (Mymensingh Bridge) via Shyamganj to Netrokona.',
        language === 'bn'
          ? 'এছাড়া ময়মনসিংহ জংশন থেকে দিনে একাধিক লোকাল ও আন্তঃনগর ট্রেনে সহজেই নেত্রকোণা পৌঁছানো যায়।'
          : 'Commuter trains run multiple times daily from Mymensingh Junction directly to Netrokona.',
      ],
      highlight: language === 'bn' ? 'দূরত্ব মাত্র ৪০ কিমি' : 'Distance: ~40 km only',
    },
    {
      destination: language === 'bn' ? 'ময়মনসিংহ ⇄ দুর্গাপুর (বিরিশিরি)' : 'Mymensingh to Durgapur (Birishiri)',
      subtext: language === 'bn' ? 'শ্যামগঞ্জ ও জারিয়া হয়ে সরাসরি বিরিশিরি' : 'Via Shyamganj & Jaria to Birishiri',
      duration: language === 'bn' ? '২ থেকে ২.৫ ঘণ্টা' : '2 - 2.5 Hours',
      fare: language === 'bn' ? '৳১৫০ - ৳২০০' : 'BDT 150 - 200',
      steps: [
        language === 'bn'
          ? 'ময়মনসিংহ ব্রিজ মোড় থেকে সরাসরি দুর্গাপুরের বাস পাওয়া যায়, যা শ্যামগঞ্জ ও জারিয়া হয়ে বিরিশিরি পৌঁছায়।'
          : 'Direct local buses depart from Mymensingh Bridge to Birishiri / Susang Durgapur via Jaria.',
        language === 'bn'
          ? 'সোমেশ্বরী নদীর ওপর নতুন পাকা সেতু তৈরি হওয়ায় এখন সরাসরি যানবাহন নিয়ে দুর্গাপুর শহরে যাওয়া যায়।'
          : 'With the modern Someshwari bridge open, direct vehicle access into Durgapur is fast and seamless.',
      ],
      highlight: language === 'bn' ? 'দূরত্ব প্রায় ৬৫ কিমি' : 'Distance: ~65 km',
    },
  ];

  const currentRoutes = activeOrigin === 'dhaka' ? routesDhaka : routesMymensingh;

  return (
    <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/20 px-3 py-1 rounded-md border border-emerald-400/30">
            {language === 'bn' ? 'যাতায়াত ও ভ্রমণ নির্দেশিকা' : 'How to Reach Netrokona'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            {language === 'bn' ? 'কীভাবে যাবেন: ঢাকা ও ময়মনসিংহ থেকে' : 'How to Go: Travel Guide & Routes'}
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {language === 'bn'
              ? 'সাদামাটির পাহাড়, ডিংগাপোতা হাওর ও বালিশ মিষ্টির শহরে ট্রেন, বাস ও নৌপথে সহজ যাতায়াত রুট।'
              : 'Complete route guide with train timing, bus terminals, travel duration and ticket links.'}
          </p>
        </div>

        {/* Origin Toggle Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl border border-slate-700 shrink-0">
          <button
            type="button"
            onClick={() => setActiveOrigin('dhaka')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeOrigin === 'dhaka'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'ঢাকা থেকে রুট' : 'From Dhaka'}
          </button>
          <button
            type="button"
            onClick={() => setActiveOrigin('mymensingh')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeOrigin === 'mymensingh'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'ময়মনসিংহ থেকে রুট' : 'From Mymensingh'}
          </button>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {currentRoutes.map((route, idx) => (
          <div
            key={idx}
            className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 flex flex-col justify-between hover:border-emerald-500/60 transition-all duration-300 shadow-xl space-y-4"
          >
            <div className="space-y-4">
              {/* Destination Header */}
              <div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {route.highlight}
                </span>
                <h3 className="text-lg font-black text-white mt-2 leading-snug">
                  {route.destination}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {route.subtext}
                </p>
              </div>

              {/* Quick Specs Strip */}
              <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">{language === 'bn' ? 'সময়কাল' : 'Duration'}</span>
                  <strong className="text-slate-200">{route.duration}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">{language === 'bn' ? 'ভাড়া' : 'Fare'}</span>
                  <strong className="text-emerald-400">{route.fare}</strong>
                </div>
              </div>

              {/* Step by step navigation list */}
              <div className="space-y-2 pt-1 text-xs text-slate-300">
                {route.steps.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                      {sIdx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
              <a
                href="https://eticket.railway.gov.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Train className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'রেলওয়ে টিকিট ↗' : 'Railway E-Ticket ↗'}</span>
              </a>
              <Link
                to="/transport"
                className="py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold transition-colors"
              >
                {language === 'bn' ? 'সকল রুট' : 'Details'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

