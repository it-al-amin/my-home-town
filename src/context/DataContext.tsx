import React, { createContext, useContext, useState, useEffect } from 'react';
import type { TouristPlace, NewsNotice, SectionImagesConfig } from '../types';
import { PLACES_DATA } from '../data/places';
import { NEWS_DATA } from '../data/news';

// Pre-seeded gallery images for rich initial display
const INITIAL_PLACES_DATA: TouristPlace[] = PLACES_DATA.map((place) => {
  if (place.id === 'birishiri-ceramic-hill') {
    return {
      ...place,
      galleryImages: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80',
      ],
    };
  }
  if (place.id === 'someshwari-river') {
    return {
      ...place,
      galleryImages: [
        'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      ],
    };
  }
  if (place.id === 'dingapota-haor') {
    return {
      ...place,
      galleryImages: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
      ],
    };
  }
  if (place.id === 'rani-khong-church') {
    return {
      ...place,
      galleryImages: [
        'https://images.unsplash.com/photo-1548625361-19597c55c707?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
      ],
    };
  }
  return {
    ...place,
    galleryImages: place.galleryImages || [place.image],
  };
});

const INITIAL_NEWS_DATA: NewsNotice[] = NEWS_DATA.map((n) => ({
  ...n,
  status: 'approved',
}));

// Default aesthetic section banners
const DEFAULT_SECTION_IMAGES: SectionImagesConfig = {
  heroBanner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85',
  foodBanner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  travelBanner: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
  educationBanner: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
  businessBanner: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
};

const STORAGE_KEYS = {
  PLACES: 'amar_netrokona_places_v2',
  NEWS: 'amar_netrokona_news_v2',
  SECTIONS: 'amar_netrokona_sections_v2',
  ADMIN_AUTH: 'amar_netrokona_admin_auth',
};

interface DataContextType {
  places: TouristPlace[];
  news: NewsNotice[];
  approvedNews: NewsNotice[];
  pendingNews: NewsNotice[];
  sectionImages: SectionImagesConfig;
  isAdmin: boolean;

  // News Actions
  submitCommunityPost: (postData: {
    title: string;
    titleBn: string;
    category: NewsNotice['category'];
    summaryBn: string;
    authorName: string;
    authorContact: string;
    imageUrl?: string;
    upazilaId?: string;
  }) => void;
  approveNews: (id: string) => void;
  rejectNews: (id: string) => void;
  deleteNews: (id: string) => void;
  createDirectNews: (item: Partial<NewsNotice> & { title: string; titleBn: string; summaryBn: string }) => void;

  // Places & Images Actions
  addPlaceGalleryImage: (placeId: string, imageUrl: string) => void;
  removePlaceGalleryImage: (placeId: string, imageIndex: number) => void;
  setPlaceCoverImage: (placeId: string, imageUrl: string) => void;
  updatePlace: (updated: TouristPlace) => void;

  // Section Banner Actions
  updateSectionImage: (sectionKey: string, imageUrl: string) => void;
  resetSectionImages: () => void;

  // Admin Auth
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;

  // Reset
  resetAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [places, setPlaces] = useState<TouristPlace[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLACES);
      return saved ? JSON.parse(saved) : INITIAL_PLACES_DATA;
    } catch (e) {
      console.error('Error loading places from localStorage', e);
      return INITIAL_PLACES_DATA;
    }
  });

  const [news, setNews] = useState<NewsNotice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
      return saved ? JSON.parse(saved) : INITIAL_NEWS_DATA;
    } catch (e) {
      console.error('Error loading news from localStorage', e);
      return INITIAL_NEWS_DATA;
    }
  });

  const [sectionImages, setSectionImages] = useState<SectionImagesConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SECTIONS);
      return saved ? JSON.parse(saved) : DEFAULT_SECTION_IMAGES;
    } catch (e) {
      console.error('Error loading section images from localStorage', e);
      return DEFAULT_SECTION_IMAGES;
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(places));
    } catch (e) {
      console.warn('LocalStorage quota or serialization error on places', e);
    }
  }, [places]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
    } catch (e) {
      console.warn('LocalStorage quota or serialization error on news', e);
    }
  }, [news]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sectionImages));
    } catch (e) {
      console.warn('LocalStorage error on sections', e);
    }
  }, [sectionImages]);

  // Derived filtered news
  const approvedNews = news.filter((n) => n.status === 'approved' || !n.status);
  const pendingNews = news.filter((n) => n.status === 'pending');

  // Submit community post (Pending status)
  const submitCommunityPost: DataContextType['submitCommunityPost'] = (postData) => {
    const today = new Date().toISOString().split('T')[0];
    const categoryLabels: Record<NewsNotice['category'], { bn: string; en: string }> = {
      district: { bn: 'জেলা সংবাদ', en: 'District News' },
      tourism: { bn: 'পর্যটন ও বিনোদন', en: 'Tourism' },
      weather: { bn: 'আবহাওয়া ও বন্যা', en: 'Weather & Flood' },
      agriculture: { bn: 'কৃষি ও ফসল', en: 'Agriculture' },
      fisheries: { bn: 'মৎস্য সম্পদ', en: 'Fisheries' },
      education: { bn: 'শিক্ষা ও বিদ্যাপীঠ', en: 'Education' },
      health: { bn: 'স্বাস্থ্য ও চিকিৎসা', en: 'Health' },
      culture: { bn: 'সংস্কৃতি ও উৎসব', en: 'Culture' },
      government: { bn: 'সরকারি নোটিশ', en: 'Government' },
    };

    const newPost: NewsNotice = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: postData.title || postData.titleBn,
      titleBn: postData.titleBn,
      category: postData.category,
      categoryLabel: categoryLabels[postData.category] || { bn: 'নাগরিক সংবাদ', en: 'Community Post' },
      date: today,
      summary: postData.summaryBn,
      summaryBn: postData.summaryBn,
      source: `নাগরিক রিপোর্ট: ${postData.authorName || 'স্থানীয় বাসিন্দা'}`,
      sourceUrl: '#',
      upazilaId: postData.upazilaId,
      status: 'pending',
      authorName: postData.authorName,
      authorContact: postData.authorContact,
      imageUrl: postData.imageUrl,
      submittedAt: new Date().toISOString(),
      verified: false,
    };

    setNews((prev) => [newPost, ...prev]);
  };

  const approveNews = (id: string) => {
    setNews((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved', verified: true } : item))
    );
  };

  const rejectNews = (id: string) => {
    setNews((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    );
  };

  const deleteNews = (id: string) => {
    setNews((prev) => prev.filter((item) => item.id !== id));
  };

  const createDirectNews: DataContextType['createDirectNews'] = (item) => {
    const today = new Date().toISOString().split('T')[0];
    const categoryLabels: Record<NewsNotice['category'], { bn: string; en: string }> = {
      district: { bn: 'জেলা সংবাদ', en: 'District News' },
      tourism: { bn: 'পর্যটন ও বিনোদন', en: 'Tourism' },
      weather: { bn: 'আবহাওয়া ও বন্যা', en: 'Weather & Flood' },
      agriculture: { bn: 'কৃষি ও ফসল', en: 'Agriculture' },
      fisheries: { bn: 'মৎস্য সম্পদ', en: 'Fisheries' },
      education: { bn: 'শিক্ষা ও বিদ্যাপীঠ', en: 'Education' },
      health: { bn: 'স্বাস্থ্য ও চিকিৎসা', en: 'Health' },
      culture: { bn: 'সংস্কৃতি ও উৎসব', en: 'Culture' },
      government: { bn: 'সরকারি নোটিশ', en: 'Government' },
    };

    const cat = item.category || 'district';
    const newEntry: NewsNotice = {
      id: item.id || `news-${Date.now()}`,
      title: item.title,
      titleBn: item.titleBn,
      category: cat,
      categoryLabel: item.categoryLabel || categoryLabels[cat],
      date: item.date || today,
      summary: item.summary || item.summaryBn,
      summaryBn: item.summaryBn,
      source: item.source || 'নেত্রকোণা জেলা প্রশাসন ও অনলাইন তথ্যসেল',
      sourceUrl: item.sourceUrl || '#',
      upazilaId: item.upazilaId,
      urgent: item.urgent || false,
      status: 'approved',
      authorName: item.authorName || 'জেলা এডমিন',
      imageUrl: item.imageUrl,
      verified: true,
    };

    setNews((prev) => [newEntry, ...prev]);
  };

  // Places Actions
  const addPlaceGalleryImage = (placeId: string, imageUrl: string) => {
    if (!imageUrl) return;
    setPlaces((prev) =>
      prev.map((p) => {
        if (p.id === placeId || p.slug === placeId) {
          const gallery = p.galleryImages ? [...p.galleryImages, imageUrl] : [p.image, imageUrl];
          return { ...p, galleryImages: gallery };
        }
        return p;
      })
    );
  };

  const removePlaceGalleryImage = (placeId: string, imageIndex: number) => {
    setPlaces((prev) =>
      prev.map((p) => {
        if (p.id === placeId || p.slug === placeId) {
          const updated = [...(p.galleryImages || [])];
          updated.splice(imageIndex, 1);
          return { ...p, galleryImages: updated };
        }
        return p;
      })
    );
  };

  const setPlaceCoverImage = (placeId: string, imageUrl: string) => {
    if (!imageUrl) return;
    setPlaces((prev) =>
      prev.map((p) => {
        if (p.id === placeId || p.slug === placeId) {
          return { ...p, image: imageUrl };
        }
        return p;
      })
    );
  };

  const updatePlace = (updated: TouristPlace) => {
    setPlaces((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  // Section Images
  const updateSectionImage = (sectionKey: string, imageUrl: string) => {
    setSectionImages((prev) => ({
      ...prev,
      [sectionKey]: imageUrl,
    }));
  };

  const resetSectionImages = () => {
    setSectionImages(DEFAULT_SECTION_IMAGES);
    localStorage.removeItem(STORAGE_KEYS.SECTIONS);
  };

  // Admin Auth
  const loginAdmin = (passcode: string): boolean => {
    // Convenient admin login: passcode 'admin' or 'netrokona' or '123456'
    const trimmed = passcode.trim().toLowerCase();
    if (trimmed === 'admin' || trimmed === 'netrokona' || trimmed === '123456' || trimmed === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  };

  const resetAllData = () => {
    setPlaces(INITIAL_PLACES_DATA);
    setNews(INITIAL_NEWS_DATA);
    setSectionImages(DEFAULT_SECTION_IMAGES);
    localStorage.removeItem(STORAGE_KEYS.PLACES);
    localStorage.removeItem(STORAGE_KEYS.NEWS);
    localStorage.removeItem(STORAGE_KEYS.SECTIONS);
  };

  return (
    <DataContext.Provider
      value={{
        places,
        news,
        approvedNews,
        pendingNews,
        sectionImages,
        isAdmin,
        submitCommunityPost,
        approveNews,
        rejectNews,
        deleteNews,
        createDirectNews,
        addPlaceGalleryImage,
        removePlaceGalleryImage,
        setPlaceCoverImage,
        updatePlace,
        updateSectionImage,
        resetSectionImages,
        loginAdmin,
        logoutAdmin,
        resetAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

