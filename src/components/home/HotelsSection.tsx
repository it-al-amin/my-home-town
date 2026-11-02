import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Phone, MapPin, CheckCircle2, ShieldCheck, ChevronRight, Calendar } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { HOTELS_DATA } from '../../data/hotels';

export const HotelsSection: React.FC = () => {
  const { language } = useLanguage();

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold text-teal-800 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-md border border-teal-200">
            {language === 'bn' ? 'আবাসন ও থাকার ব্যবস্থা' : 'Hotels & Accommodation'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            {language === 'bn' ? 'নেত্রকোণা ও বিরিশিরির হোটেল ও রিসোর্ট' : 'Hotels & Resorts in Netrokona & Birishiri'}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'সাদামাটির পাহাড়, সোমেশ্বরী নদী বা ডিংগাপোতা হাওর ভ্রমণে নিরাপদ ও আরামদায়ক থাকার তথ্য।'
              : 'Verified rest houses, eco-resorts, and guest houses with phone numbers and price guides.'}
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
          {language === 'bn' ? 'পরামর্শ: ভ্রমণের পূর্বে ফোনে বুকিং নিশ্চিত করুন' : 'Tip: Call in advance during peak season'}
        </div>
      </div>

      {/* Grid of Hotels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {HOTELS_DATA.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-teal-400 shadow-2xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Hotel Image & Badge */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                  {language === 'bn' ? hotel.typeLabel.bn : hotel.typeLabel.en}
                </div>
                <div className="absolute bottom-3 right-3 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow-md">
                  {language === 'bn' ? hotel.priceRangeBn : hotel.priceRange}
                </div>
              </div>

              {/* Info Body */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 line-clamp-1">
                    {language === 'bn' ? hotel.nameBn : hotel.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{language === 'bn' ? hotel.locationBn : hotel.location}</span>
                  </p>
                </div>

                {/* Features Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(language === 'bn' ? hotel.featuresBn : hotel.features).slice(0, 3).map((feat, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      ✓ {feat}
                    </span>
                  ))}
                </div>

                {/* Booking Advice */}
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                  "{language === 'bn' ? hotel.bookingAdviceBn : hotel.bookingAdvice}"
                </p>
              </div>
            </div>

            {/* Contact Action Footer */}
            <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
              <a
                href={`tel:${hotel.phone}`}
                className="flex-1 py-2 px-3 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{hotel.phone}</span>
              </a>
              {hotel.alternatePhone && (
                <a
                  href={`tel:${hotel.alternatePhone}`}
                  className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors"
                  title="Alternate Number"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

