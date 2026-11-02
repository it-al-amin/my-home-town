import React, { useState } from 'react';
import { 
  X, Upload, Image as ImageIcon, Send, CheckCircle2, 
  AlertCircle, ShieldCheck, Sparkles, MapPin, Tag 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { UPAZILAS_DATA } from '../../data/upazilas';
import type { NewsNotice } from '../../types';

interface SubmitPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: NewsNotice['category'];
  defaultUpazilaId?: string;
}

export const SubmitPostModal: React.FC<SubmitPostModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'district',
  defaultUpazilaId = '',
}) => {
  const { language } = useLanguage();
  const { submitCommunityPost } = useData();

  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [category, setCategory] = useState<NewsNotice['category']>(defaultCategory);
  const [upazilaId, setUpazilaId] = useState(defaultUpazilaId);
  const [authorName, setAuthorName] = useState('');
  const [authorContact, setAuthorContact] = useState('');
  const [summaryBn, setSummaryBn] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Handle local file upload to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setErrorMessage(
          language === 'bn' 
            ? 'ছবির সাইজ ৩ মেগাবাইটের কম হতে হবে।' 
            : 'Image size must be under 3MB.'
        );
        return;
      }
      setErrorMessage('');
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleBn.trim() || !summaryBn.trim() || !authorName.trim()) {
      setErrorMessage(
        language === 'bn' 
          ? 'অনুগ্রহ করে শিরোনাম, বিস্তারিত বিবরণ এবং আপনার নাম পূরণ করুন।' 
          : 'Please fill in the title, details, and your name.'
      );
      return;
    }

    submitCommunityPost({
      title: titleEn.trim() || titleBn.trim(),
      titleBn: titleBn.trim(),
      category,
      summaryBn: summaryBn.trim(),
      authorName: authorName.trim(),
      authorContact: authorContact.trim(),
      imageUrl: imageUrl.trim() || undefined,
      upazilaId: upazilaId || undefined,
    });

    setIsSubmitted(true);
    setErrorMessage('');
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setTitleBn('');
    setTitleEn('');
    setSummaryBn('');
    setAuthorName('');
    setAuthorContact('');
    setImageUrl('');
    setImagePreview(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-200 border border-white/20">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                {language === 'bn' ? 'নাগরিক সংবাদ বা তথ্য জমা দিন' : 'Submit Community News / Report'}
              </h3>
              <p className="text-xs text-emerald-100">
                {language === 'bn'
                  ? 'আপনার এলাকার খবর বা আপডেট পাঠান, এডমিন যাচাই করে প্রকাশ করবেন'
                  : 'Submit local news or updates for admin review and approval'}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-slate-800 dark:text-slate-100">
          {isSubmitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                {language === 'bn' ? 'সংবাদটি সফলভাবে জমা হয়েছে!' : 'Submission Successful!'}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                {language === 'bn'
                  ? 'আপনার প্রেরিত সংবাদ ও তথ্যটি আমাদের এডমিন পর্যালোচনার তালিকায় পাঠানো হয়েছে। এডমিন অনুমোদন দিলে তা জেলা পোর্টাল এবং হোমপেজে সরাসরি দেখা যাবে।'
                  : 'Your post is now in the Admin Approval queue. Once verified by our district administrators, it will be published live.'}
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  {language === 'bn' ? 'ঠিক আছে / বন্ধ করুন' : 'Done / Close'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Title Bangla */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'সংবাদের শিরোনাম (বাংলায়) *' : 'Post Title (Bangla) *'}
                </label>
                <input
                  type="text"
                  required
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: দুর্গাপুরে সোমেশ্বরী নদীর তীরে ঐতিহ্যবাহী উৎসব...' : 'Enter Bangla title...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Category & Upazila */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'bn' ? 'বিভাগ বা ক্যাটাগরি' : 'Category'}</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NewsNotice['category'])}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
                  >
                    <option value="district">জেলা সংবাদ ও নাগরিক আপডেট</option>
                    <option value="tourism">দর্শনীয় স্থান ও পর্যটন</option>
                    <option value="weather">আবহাওয়া, হাওর ও নদী সতর্কতা</option>
                    <option value="education">শিক্ষা, স্কুল ও বিশ্ববিদ্যালয়</option>
                    <option value="agriculture">কৃষি, হাওর ফসল ও ফলন</option>
                    <option value="fisheries">মৎস্য সম্পদ ও নদী সংবাদ</option>
                    <option value="culture">ঐতিহ্য, মেলা ও লোকসংস্কৃতি</option>
                    <option value="health">স্বাস্থ্য সেবা ও হাসপাতাল</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'bn' ? 'উপজেলা (প্রযোজ্য ক্ষেত্রে)' : 'Upazila'}</span>
                  </label>
                  <select
                    value={upazilaId}
                    onChange={(e) => setUpazilaId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
                  >
                    <option value="">{language === 'bn' ? 'পুরো জেলা / সাধারণ' : 'Entire District / General'}</option>
                    {UPAZILAS_DATA.map((u) => (
                      <option key={u.id} value={u.id}>
                        {language === 'bn' ? u.nameBn : u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Author & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'আপনার নাম / প্রতিবেদকের নাম *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder={language === 'bn' ? 'যেমন: সাইদুর রহমান' : 'Full Name'}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'যোগাযোগ (মোবাইল / ইমেইল)' : 'Contact (Phone / Email)'}
                  </label>
                  <input
                    type="text"
                    value={authorContact}
                    onChange={(e) => setAuthorContact(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Details Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'সংবাদের বিস্তারিত বিবরণ *' : 'Report Details *'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={summaryBn}
                  onChange={(e) => setSummaryBn(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'ঘটনাস্থল, সময় এবং বিস্তারিত তথ্য লিখুন...'
                      : 'Write complete details of the incident or update...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none"
                />
              </div>

              {/* Dynamic Image Upload */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'bn' ? 'সংবাদের ছবি বা প্রমাণক (ঐচ্ছিক)' : 'Attach Photo (Optional)'}</span>
                  </label>
                  <div className="flex items-center gap-1 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      className={`px-2 py-0.5 rounded-md cursor-pointer ${imageMode === 'upload' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}
                    >
                      ডিভাইস থেকে
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`px-2 py-0.5 rounded-md cursor-pointer ${imageMode === 'url' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}
                    >
                      ইমেজ লিংক
                    </button>
                  </div>
                </div>

                {imageMode === 'upload' ? (
                  <div className="flex items-center gap-3">
                    <label className="flex-1 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-emerald-500 rounded-xl p-3 text-center cursor-pointer transition-colors bg-white dark:bg-slate-900">
                      <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                        ছবি নির্বাচন করুন (PNG, JPG)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                )}

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative mt-2 rounded-xl overflow-hidden h-36 bg-slate-950 border border-slate-200 dark:border-slate-700">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageUrl('');
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 cursor-pointer shadow-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Admin Approval Note */}
              <div className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {language === 'bn'
                    ? 'তথ্য নির্ভুলতা বজায় রাখতে প্রতিটি সংবাদ সরাসরি প্রকাশের পূর্বে জেলা এডমিন কর্তৃক অনুমোদিত হতে হবে।'
                    : 'To maintain accuracy and avoid misinformation, all submissions are reviewed by an admin prior to publication.'}
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'bn' ? 'সংবাদ জমা দিন' : 'Submit for Approval'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

