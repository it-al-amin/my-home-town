import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Sparkles, MapPin, Tag, ArrowRight, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { FAMOUS_FOODS_DATA } from '../../data/food';

export const FamousFoodSection: React.FC = () => {
  const { language } = useLanguage();
  const [selectedFoodId, setSelectedFoodId] = useState<string>(FAMOUS_FOODS_DATA[0].id);

  const selectedFood = FAMOUS_FOODS_DATA.find((f) => f.id === selectedFoodId) || FAMOUS_FOODS_DATA[0];

  return (
    <section className="bg-amber-50/60 rounded-3xl p-6 sm:p-10 border border-amber-200/70 shadow-xs space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-amber-200/60 pb-5">
        <div>
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-md border border-amber-300">
            {language === 'bn' ? 'স্বাদ ও রসনা বিলাস' : 'Culinary Heritage'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            {language === 'bn' ? 'নেত্রকোণার বিখ্যাত খাবার ও মিষ্টি' : 'Famous Food & Traditional Delicacies'}
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {language === 'bn'
              ? 'গয়ানাথের শতবর্ষী বালিশ মিষ্টি থেকে শুরু করে গারো পাহাড়ের খাঁটি পাহাড়ি মধু এবং হাওরের তাজা মিঠাপানির মাছ।'
              : 'From century-old pillow sweet (Balish Mishti) to hill country kalai ruti and freshwater haor delicacies.'}
          </p>
        </div>

        <Link
          to="/culture"
          className="inline-flex items-center gap-1.5 font-bold text-sm text-amber-900 hover:text-amber-700 shrink-0"
        >
          <span>{language === 'bn' ? 'সকল লোকসংস্কৃতি ও খাবার' : 'Explore Culture & Food'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Featured Balish Mishti & Food Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Food Navigation Cards */}
        <div className="lg:col-span-5 space-y-3">
          {FAMOUS_FOODS_DATA.map((food) => {
            const isSelected = selectedFoodId === food.id;
            return (
              <button
                key={food.id}
                type="button"
                onClick={() => setSelectedFoodId(food.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-400/20 translate-x-1'
                    : 'bg-white/80 border-amber-200/80 hover:bg-white hover:border-amber-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-inner ${isSelected ? 'ring-2 ring-amber-500' : ''}`}>
                    <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 line-clamp-1">
                      {language === 'bn' ? food.nameBn : food.name}
                    </h4>
                    <span className="text-xs font-semibold text-amber-800">
                      {language === 'bn' ? food.categoryLabel.bn : food.categoryLabel.en}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 block">
                    {language === 'bn' ? food.approxPriceBn : food.approxPrice}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Detailed Spotlight Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-amber-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-sm">
              <img
                src={selectedFood.image}
                alt={selectedFood.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                {language === 'bn' ? selectedFood.categoryLabel.bn : selectedFood.categoryLabel.en}
              </div>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {language === 'bn' ? selectedFood.nameBn : selectedFood.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {language === 'bn' ? selectedFood.descriptionBn : selectedFood.description}
              </p>
            </div>

            <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-100 space-y-2 text-xs">
              <div className="flex items-start gap-2 text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">{language === 'bn' ? 'ঐতিহাসিক পটভূমি:' : 'History:'} </strong>
                  <span>{language === 'bn' ? selectedFood.historyBn : selectedFood.history}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-slate-700 pt-1 border-t border-amber-200/50">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">{language === 'bn' ? 'কোথায় পাবেন:' : 'Where to Find:'} </strong>
                  <span>{language === 'bn' ? selectedFood.whereToFindBn : selectedFood.whereToFind}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2 flex items-center justify-between border-t border-slate-100 text-xs">
            <span className="font-bold text-slate-500">
              {language === 'bn' ? 'আনুমানিক মূল্য:' : 'Price:'} <strong className="text-slate-900 font-mono text-sm">{language === 'bn' ? selectedFood.approxPriceBn : selectedFood.approxPrice}</strong>
            </span>
            <Link
              to="/culture"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>{language === 'bn' ? 'খাবার ও সংস্কৃতি জানুন' : 'Learn More'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

