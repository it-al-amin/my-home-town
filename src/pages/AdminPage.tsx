import React, { useState } from 'react';
import { 
  ShieldCheck, Check, X, Trash2, Plus, Image as ImageIcon, 
  Upload, Sparkles, AlertTriangle, Layers, Newspaper, Eye, 
  MapPin, RefreshCw, LogIn, LogOut, CheckCircle2, ChevronRight,
  ExternalLink, Calendar, User, Phone, SlidersHorizontal
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { UPAZILAS_DATA } from '../data/upazilas';
import { Breadcrumb } from '../components/common/Breadcrumb';
import type { NewsNotice } from '../types';

export const AdminPage: React.FC = () => {
  const { language } = useLanguage();
  const {
    places,
    news,
    approvedNews,
    pendingNews,
    sectionImages,
    isAdmin,
    loginAdmin,
    logoutAdmin,
    approveNews,
    rejectNews,
    deleteNews,
    createDirectNews,
    addPlaceGalleryImage,
    removePlaceGalleryImage,
    setPlaceCoverImage,
    updateSectionImage,
    resetSectionImages,
    resetAllData,
  } = useData();

  const [activeTab, setActiveTab] = useState<'pending' | 'places' | 'sections' | 'allNews' | 'settings'>('pending');
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Selected place for image management
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>(places[0]?.id || 'birishiri-ceramic-hill');
  const [placeNewImageUrl, setPlaceNewImageUrl] = useState('');
  const [placeImagePreview, setPlaceImagePreview] = useState<string | null>(null);
  const [placeImageMode, setPlaceImageMode] = useState<'upload' | 'url'>('upload');

  // Direct News Form State
  const [directTitleBn, setDirectTitleBn] = useState('');
  const [directTitleEn, setDirectTitleEn] = useState('');
  const [directCategory, setDirectCategory] = useState<NewsNotice['category']>('district');
  const [directUpazilaId, setDirectUpazilaId] = useState('');
  const [directSummaryBn, setDirectSummaryBn] = useState('');
  const [directImageUrl, setDirectImageUrl] = useState('');
  const [directUrgent, setDirectUrgent] = useState(false);
  const [directSuccessMsg, setDirectSuccessMsg] = useState('');

  // Section Image Upload State
  const [selectedSectionKey, setSelectedSectionKey] = useState<string>('heroBanner');
  const [sectionImageUrl, setSectionImageUrl] = useState('');
  const [sectionImagePreview, setSectionImagePreview] = useState<string | null>(null);
  const [sectionSuccessMsg, setSectionSuccessMsg] = useState('');

  const currentPlace = places.find((p) => p.id === selectedPlaceId) || places[0];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passcode);
    if (!success) {
      setLoginError(language === 'bn' ? 'ভুল পাসকোড! অনুগ্রহ করে netrokona বা admin ব্যবহার করুন।' : 'Invalid passcode. Try "netrokona" or "admin".');
    } else {
      setLoginError('');
      setPasscode('');
    }
  };

  const handleQuickUnlock = () => {
    loginAdmin('netrokona');
  };

  // Place photo file reader
  const handlePlaceImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPlaceImagePreview(result);
        setPlaceNewImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Section image file reader
  const handleSectionImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSectionImagePreview(result);
        setSectionImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add gallery photo
  const handleAddGalleryPhoto = () => {
    if (!placeNewImageUrl.trim() || !selectedPlaceId) return;
    addPlaceGalleryImage(selectedPlaceId, placeNewImageUrl.trim());
    setPlaceNewImageUrl('');
    setPlaceImagePreview(null);
  };

  // Set as Cover Photo
  const handleSetCoverPhoto = () => {
    if (!placeNewImageUrl.trim() || !selectedPlaceId) return;
    setPlaceCoverImage(selectedPlaceId, placeNewImageUrl.trim());
    setPlaceNewImageUrl('');
    setPlaceImagePreview(null);
  };

  // Submit Direct News
  const handleCreateDirectNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directTitleBn.trim() || !directSummaryBn.trim()) return;

    createDirectNews({
      title: directTitleEn.trim() || directTitleBn.trim(),
      titleBn: directTitleBn.trim(),
      category: directCategory,
      summary: directSummaryBn.trim(),
      summaryBn: directSummaryBn.trim(),
      upazilaId: directUpazilaId || undefined,
      imageUrl: directImageUrl.trim() || undefined,
      urgent: directUrgent,
      source: 'জেলা এডমিন অফিস',
    });

    setDirectTitleBn('');
    setDirectTitleEn('');
    setDirectSummaryBn('');
    setDirectImageUrl('');
    setDirectUrgent(false);
    setDirectSuccessMsg(language === 'bn' ? 'সংবাদটি সফলভাবে সরাসরি প্রকাশিত হয়েছে!' : 'News published successfully!');
    setTimeout(() => setDirectSuccessMsg(''), 4000);
  };

  // Update Section Image
  const handleSaveSectionImage = () => {
    if (!sectionImageUrl.trim()) return;
    updateSectionImage(selectedSectionKey, sectionImageUrl.trim());
    setSectionSuccessMsg(language === 'bn' ? 'সেকশনের ছবি সফলভাবে আপডেট হয়েছে!' : 'Section image updated!');
    setSectionImageUrl('');
    setSectionImagePreview(null);
    setTimeout(() => setSectionSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Admin Dashboard', labelBn: 'এডমিন ড্যাশবোর্ড', href: '/admin' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-900/50">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {language === 'bn' ? 'ডায়নামিক ম্যানেজমেন্ট' : 'Dynamic Data Management'}
            </span>
            {isAdmin && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-300 flex items-center gap-1 border border-green-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'এডমিন সক্রিয়' : 'Admin Active'}</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {language === 'bn' ? 'আমার নেত্রকোণা • এডমিন কন্ট্রোল সেন্টার' : 'Amar Netrokona Admin Dashboard'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {language === 'bn'
              ? 'দর্শনীয় স্থানের একাধিক ছবি ও গ্যালারি সংযোজন, সেকশন ব্যানার আপলোড এবং নাগরিকদের প্রেরিত সংবাদের অনুমোদন ব্যবস্থাপনা।'
              : 'Manage place photos & galleries, section banners, and review & approve community submissions.'}
          </p>
        </div>

        {/* Quick Stats & Auth status */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-center">
            <span className="text-[11px] text-slate-300 block">{language === 'bn' ? 'অপেক্ষমাণ অনুমোদন' : 'Pending'}</span>
            <span className="text-xl font-black text-amber-400">{pendingNews.length}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-center">
            <span className="text-[11px] text-slate-300 block">{language === 'bn' ? 'প্রকাশিত সংবাদ' : 'Approved News'}</span>
            <span className="text-xl font-black text-emerald-400">{approvedNews.length}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-center">
            <span className="text-[11px] text-slate-300 block">{language === 'bn' ? 'মোট স্থান' : 'Places'}</span>
            <span className="text-xl font-black text-cyan-400">{places.length}</span>
          </div>

          {isAdmin ? (
            <button
              onClick={logoutAdmin}
              className="px-4 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
            </button>
          ) : (
            <button
              onClick={handleQuickUnlock}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{language === 'bn' ? 'এডমিন আনলক করুন' : 'Unlock Admin'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Login Dialog if not logged in */}
      {!isAdmin && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-3xl p-6 text-slate-800 dark:text-slate-200 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-extrabold text-base flex items-center gap-2 text-amber-900 dark:text-amber-200">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <span>{language === 'bn' ? 'এডমিন সুবিধা ব্যবহার করতে সাইন-ইন বা আনলক করুন' : 'Unlock Full Admin Access'}</span>
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                {language === 'bn'
                  ? 'সংবাদ অনুমোদন, দর্শনীয় স্থানের নতুন ছবি আপলোড বা সেকশন ব্যানার পরিবর্তনের জন্য এডমিন হিসেবে প্রবেশ করুন।'
                  : 'Enter passcode "netrokona" or click the quick unlock button to manage dynamic photos and approvals.'}
              </p>
            </div>
            <form onSubmit={handleLogin} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="password"
                placeholder={language === 'bn' ? 'পাসকোড (যেমন: netrokona)' : 'Passcode (e.g. netrokona)'}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
              >
                {language === 'bn' ? 'প্রবেশ' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={handleQuickUnlock}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors shrink-0 cursor-pointer shadow-xs"
              >
                {language === 'bn' ? 'দ্রুত আনলক' : 'Quick Unlock'}
              </button>
            </form>
          </div>
          {loginError && <p className="text-xs text-red-600 mt-2 font-semibold">{loginError}</p>}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'pending'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{language === 'bn' ? 'অনুমোদন অপেক্ষমাণ' : 'Pending Approvals'}</span>
          {pendingNews.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-slate-950">
              {pendingNews.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('places')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'places'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>{language === 'bn' ? 'দর্শনীয় স্থান ও ছবি আপলোড' : 'Places & Photo Gallery'}</span>
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sections'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{language === 'bn' ? 'সেকশন ব্যানার ও ছবি' : 'Section Banners'}</span>
        </button>

        <button
          onClick={() => setActiveTab('allNews')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'allNews'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>{language === 'bn' ? 'সকল সংবাদ ও পোস্ট তৈরি' : 'All News & Direct Post'}</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{language === 'bn' ? 'রিসেট ও ডেটা' : 'Reset & Settings'}</span>
        </button>
      </div>

      {/* TAB 1: PENDING POSTS APPROVAL QUEUE */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>{language === 'bn' ? 'নাগরিকদের পাঠানো সংবাদ অনুমোদন সারি' : 'Citizen Submissions Queue'}</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {pendingNews.length} {language === 'bn' ? 'টি অপেক্ষমাণ' : 'pending'}
              </span>
            </h2>
          </div>

          {pendingNews.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                {language === 'bn' ? 'কোনো অপেক্ষমাণ সংবাদ নেই!' : 'No Pending Submissions!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {language === 'bn'
                  ? 'নাগরিকরা যখন হোমপেজ বা সংবাদ পাতা থেকে কোনো সংবাদ পাঠাবেন, তা এডমিনের পর্যালোচনার জন্য এখানে জমা হবে।'
                  : 'When citizens submit news reports via the public modal, they will show up here for your verification and approval.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingNews.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-amber-300/60 dark:border-amber-600/40 shadow-lg space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        {item.categoryLabel?.bn || item.category}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.date}</span>
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                      {item.titleBn || item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.summaryBn || item.summary}
                    </p>

                    {/* Image Preview if provided */}
                    {item.imageUrl && (
                      <div className="rounded-2xl overflow-hidden h-44 bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <img
                          src={item.imageUrl}
                          alt="Submitted media"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Author Meta */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                        <User className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{language === 'bn' ? 'প্রতিবেদক:' : 'Author:'} {item.authorName || 'নামহীন নাগরিক'}</span>
                      </div>
                      {item.authorContact && (
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{item.authorContact}</span>
                        </div>
                      )}
                      {item.upazilaId && (
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'উপজেলা:' : 'Upazila:'} {item.upazilaId}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Approve / Reject Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => rejectNews(item.id)}
                      className="px-3.5 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      <span>{language === 'bn' ? 'বাতিল করুন' : 'Reject'}</span>
                    </button>
                    <button
                      onClick={() => approveNews(item.id)}
                      className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-md hover:shadow-lg"
                    >
                      <Check className="w-4 h-4" />
                      <span>{language === 'bn' ? 'অনুমোদন দিন ও প্রকাশ করুন' : 'Approve & Publish Live'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PLACES & PHOTO GALLERY MANAGER */}
      {activeTab === 'places' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  {language === 'bn' ? 'ফটো গ্যালারি ও দর্শনীয় স্থান' : 'Gallery & Visited Spots'}
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {language === 'bn' ? 'স্থান নির্বাচন ও নতুন ছবি আপলোড' : 'Select Place & Upload Multiple Photos'}
                </h2>
              </div>

              {/* Select Place Dropdown */}
              <div className="w-full sm:w-72">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'bn' ? 'দর্শনীয় স্থান বেছে নিন:' : 'Choose Place:'}
                </label>
                <select
                  value={selectedPlaceId}
                  onChange={(e) => setSelectedPlaceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {places.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nameBn} ({p.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Current Place Info & Cover */}
            {currentPlace && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  {/* Current Cover Photo */}
                  <div className="md:col-span-1 space-y-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                      {language === 'bn' ? 'বর্তমান প্রধান কভার ছবি:' : 'Current Main Cover:'}
                    </span>
                    <div className="rounded-2xl overflow-hidden h-48 bg-slate-950 border border-slate-200 dark:border-slate-800 relative group">
                      <img
                        src={currentPlace.image}
                        alt={currentPlace.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center text-xs text-white font-bold">
                        {currentPlace.nameBn}
                      </div>
                    </div>
                  </div>

                  {/* Add New Photo Form (Device Upload or URL) */}
                  <div className="md:col-span-2 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Upload className="w-4 h-4 text-emerald-600" />
                        <span>{language === 'bn' ? 'এই স্থানের জন্য নতুন ছবি আপলোড করুন' : 'Add New Photo for this Place'}</span>
                      </h4>
                      <div className="flex items-center gap-1 text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => setPlaceImageMode('upload')}
                          className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                            placeImageMode === 'upload' ? 'bg-emerald-700 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          ডিভাইস থেকে
                        </button>
                        <button
                          type="button"
                          onClick={() => setPlaceImageMode('url')}
                          className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                            placeImageMode === 'url' ? 'bg-emerald-700 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          ইমেজ লিংক
                        </button>
                      </div>
                    </div>

                    {placeImageMode === 'upload' ? (
                      <label className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-emerald-500 rounded-xl p-4 text-center cursor-pointer transition-colors block bg-white dark:bg-slate-900">
                        <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                          কম্পিউটার বা মোবাইল থেকে ছবি সিলেক্ট করুন
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePlaceImageFile}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <input
                        type="url"
                        value={placeNewImageUrl}
                        onChange={(e) => {
                          setPlaceNewImageUrl(e.target.value);
                          setPlaceImagePreview(e.target.value);
                        }}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    )}

                    {/* Preview of the newly selected image */}
                    {placeImagePreview && (
                      <div className="space-y-3">
                        <div className="relative rounded-xl overflow-hidden h-40 bg-slate-950 border border-slate-300 dark:border-slate-700">
                          <img
                            src={placeImagePreview}
                            alt="Upload preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPlaceImagePreview(null);
                              setPlaceNewImageUrl('');
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 cursor-pointer shadow-md"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleAddGalleryPhoto}
                            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Plus className="w-4 h-4" />
                            <span>{language === 'bn' ? 'গ্যালারিতে যুক্ত করুন' : 'Add to Visited Gallery'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleSetCoverPhoto}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <ImageIcon className="w-4 h-4" />
                            <span>{language === 'bn' ? 'কভার ছবি হিসেবে সেট করুন' : 'Set as Main Cover'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Visited Places Gallery Grid with Delete option */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span>{language === 'bn' ? 'এই স্থানের দর্শনার্থীদের ছবি ও গ্যালারি' : 'Visited Spot Photo Gallery'}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {currentPlace.galleryImages?.length || 0} টি ছবি
                      </span>
                    </h3>
                  </div>

                  {(!currentPlace.galleryImages || currentPlace.galleryImages.length === 0) ? (
                    <p className="text-xs text-slate-400 py-4 italic">
                      {language === 'bn' ? 'এই স্থানের জন্য এখনো কোনো অতিরিক্ত ছবি যোগ করা হয়নি।' : 'No additional gallery images for this place yet.'}
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {currentPlace.galleryImages.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative rounded-2xl overflow-hidden h-28 bg-slate-900 border border-slate-200 dark:border-slate-800 group shadow-xs hover:shadow-md transition-shadow"
                        >
                          <img
                            src={imgUrl}
                            alt={`Gallery photo ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                            <button
                              type="button"
                              onClick={() => removePlaceGalleryImage(currentPlace.id, idx)}
                              title={language === 'bn' ? 'ছবিটি ডিলিট করুন' : 'Delete photo'}
                              className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setPlaceCoverImage(currentPlace.id, imgUrl)}
                              title={language === 'bn' ? 'কভার ছবি হিসেবে সেট করুন' : 'Set as cover'}
                              className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SECTION BANNERS & IMAGES */}
      {activeTab === 'sections' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                {language === 'bn' ? 'ওয়েবসাইট ডিজাইন ও থিম' : 'Website Sections'}
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {language === 'bn' ? 'বিভিন্ন সেকশনের ছবি ও ব্যানার আপলোড' : 'Upload Images for Website Sections'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'bn'
                  ? 'হোমপেজের মূল হিরো ব্যানার, খাবার সেকশন, ভ্রমণ গাইড ও অন্যান্য সেকশনের ছবি পরিবর্তন করুন।'
                  : 'Customize background images across major homepage sections.'}
              </p>
            </div>

            {sectionSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{sectionSuccessMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Section Select */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {language === 'bn' ? 'সেকশন নির্বাচন করুন:' : 'Select Section:'}
                </label>
                <div className="space-y-1.5">
                  {[
                    { key: 'heroBanner', label: language === 'bn' ? 'মূল হিরো সেকশন ব্যানার (Hero)' : 'Main Hero Banner' },
                    { key: 'foodBanner', label: language === 'bn' ? 'ঐতিহ্যবাহী খাবার সেকশন (Food)' : 'Famous Food Section' },
                    { key: 'travelBanner', label: language === 'bn' ? 'যাতায়াত ও ভ্রমণ গাইড (Travel)' : 'Travel Guide Section' },
                    { key: 'educationBanner', label: language === 'bn' ? 'শিক্ষা ও প্রতিষ্ঠান সেকশন (Education)' : 'Education Showcase' },
                    { key: 'businessBanner', label: language === 'bn' ? 'ব্যবসা ও হাওর অর্থনীতি (Agro & Business)' : 'Agro & Haor Economy' },
                  ].map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => {
                        setSelectedSectionKey(s.key);
                        setSectionImageUrl('');
                        setSectionImagePreview(null);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        selectedSectionKey === s.key
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{s.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Preview & Upload */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {language === 'bn' ? 'বর্তমান ব্যানার প্রিভিউ:' : 'Current Banner Preview:'}
                  </span>
                  <button
                    type="button"
                    onClick={resetSectionImages}
                    className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{language === 'bn' ? 'ডিফল্ট ব্যানারে ফিরুন' : 'Reset Banners'}</span>
                  </button>
                </div>

                <div className="relative rounded-2xl overflow-hidden h-52 bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner">
                  <img
                    src={sectionImagePreview || sectionImages[selectedSectionKey] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'}
                    alt="Section banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <span className="text-white text-xs font-bold bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md">
                      সেকশন: {selectedSectionKey}
                    </span>
                  </div>
                </div>

                {/* Upload or URL input */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-emerald-500 rounded-xl p-3 text-center cursor-pointer transition-colors block bg-white dark:bg-slate-900">
                      <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                        ফাইল আপলোড করুন
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSectionImageFile}
                        className="hidden"
                      />
                    </label>

                    <div className="flex flex-col justify-center space-y-1.5">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        {language === 'bn' ? 'বা ইমেজ লিংক পেস্ট করুন:' : 'Or Paste Image URL:'}
                      </span>
                      <input
                        type="url"
                        value={sectionImageUrl}
                        onChange={(e) => {
                          setSectionImageUrl(e.target.value);
                          setSectionImagePreview(e.target.value);
                        }}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleSaveSectionImage}
                      disabled={!sectionImageUrl.trim()}
                      className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        sectionImageUrl.trim()
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{language === 'bn' ? 'এই ব্যানার সেভ করুন' : 'Save Section Banner'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ALL NEWS & DIRECT POST */}
      {activeTab === 'allNews' && (
        <div className="space-y-8">
          {/* Create Direct News Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                {language === 'bn' ? 'সরাসরি সংবাদ প্রকাশ' : 'Direct Publishing'}
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {language === 'bn' ? 'নতুন নোটিশ বা সংবাদ তৈরি করুন' : 'Create New News Notice'}
              </h2>
            </div>

            {directSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{directSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateDirectNews} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'সংবাদের শিরোনাম (বাংলায়) *' : 'Title (Bangla) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={directTitleBn}
                    onChange={(e) => setDirectTitleBn(e.target.value)}
                    placeholder={language === 'bn' ? 'শিরোনাম লিখুন...' : 'Bangla Title...'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                  </label>
                  <select
                    value={directCategory}
                    onChange={(e) => setDirectCategory(e.target.value as NewsNotice['category'])}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
                  >
                    <option value="district">জেলা সংবাদ</option>
                    <option value="tourism">দর্শনীয় স্থান ও পর্যটন</option>
                    <option value="weather">আবহাওয়া ও বন্যা</option>
                    <option value="education">শিক্ষা ও প্রতিষ্ঠান</option>
                    <option value="agriculture">কৃষি ও অর্থনীতি</option>
                    <option value="fisheries">মৎস্য সম্পদ</option>
                    <option value="health">স্বাস্থ্য সেবা</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'বিস্তারিত বিবরণ *' : 'Summary / Details *'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={directSummaryBn}
                  onChange={(e) => setDirectSummaryBn(e.target.value)}
                  placeholder={language === 'bn' ? 'সংবাদের বিস্তারিত বর্ণনা...' : 'Write details...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'ছবি লিংক (ঐচ্ছিক)' : 'Image URL (Optional)'}
                  </label>
                  <input
                    type="url"
                    value={directImageUrl}
                    onChange={(e) => setDirectImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="urgentCheck"
                    checked={directUrgent}
                    onChange={(e) => setDirectUrgent(e.target.checked)}
                    className="w-4 h-4 rounded-sm text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="urgentCheck" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    {language === 'bn' ? 'জরুরি সতর্কতা হিসেবে চিহ্নিত করুন (Urgent Alert)' : 'Mark as Urgent Notice'}
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'bn' ? 'সরাসরি প্রকাশ করুন' : 'Publish Directly'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* List of Existing News */}
          <div className="space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center justify-between">
              <span>{language === 'bn' ? 'সকল বিদ্যমান নোটিশ ও পোস্ট' : 'All Existing Posts'}</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{news.length} টি মোট</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {news.map((n) => (
                <div
                  key={n.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                          n.status === 'pending'
                            ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                            : n.status === 'rejected'
                            ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300'
                            : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                        }`}
                      >
                        {n.status === 'pending' ? 'অপেক্ষমাণ' : n.status === 'rejected' ? 'বাতিলকৃত' : 'অনুমোদিত'}
                      </span>
                      <span className="text-[10px] text-slate-400">{n.date}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                      {n.titleBn || n.title}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {n.summaryBn || n.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                      {n.authorName || n.source}
                    </span>
                    <button
                      onClick={() => deleteNews(n.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                      title={language === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: RESET & SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {language === 'bn' ? 'ডেটাবেজ ও স্টোরেজ রিসেট' : 'Storage & Reset Options'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'bn'
                ? 'আপনার সমস্ত সংরক্ষিত তথ্য ব্রাউজারের লোকাল স্টোরেজে সুরক্ষিত আছে। চাইলে যেকোনো সময় ডিফল্ট অবস্থায় ফিরিয়ে নেওয়া যাবে।'
                : 'All dynamic place photos, submitted news, and section banners are persisted locally in browser storage.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 space-y-3">
            <h4 className="text-sm font-black text-red-800 dark:text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>{language === 'bn' ? 'সমস্ত পরিবর্তন মুছে ডিফল্ট ডেটায় ফিরে যান' : 'Reset All Dynamic Data to Factory Defaults'}</span>
            </h4>
            <p className="text-xs text-red-700 dark:text-red-400">
              {language === 'bn'
                ? 'এটি ক্লিক করলে সমস্ত নতুন ছবি, পেন্ডিং বা তৈরি করা সংবাদ মুছে গিয়ে ওয়েবসাইটের মূল প্রাথমিক ডেটা পুনরুদ্ধার হবে।'
                : 'This will purge all locally saved posts, galleries, and section banners and revert to the static defaults.'}
            </p>
            <div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(language === 'bn' ? 'আপনি কি নিশ্চিত যে সমস্ত ডেটা রিসেট করতে চান?' : 'Are you sure you want to reset all dynamic data?')) {
                    resetAllData();
                    alert(language === 'bn' ? 'সফলভাবে রিসেট সম্পন্ন হয়েছে!' : 'Reset successful!');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-md"
              >
                {language === 'bn' ? 'সম্পূর্ণ রিসেট করুন' : 'Confirm Full Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

