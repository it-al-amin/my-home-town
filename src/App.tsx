import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { ScrollToTop } from './components/common/ScrollToTop';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { UpazilasPage } from './pages/UpazilasPage';
import { UpazilaDetailPage } from './pages/UpazilaDetailPage';
import { PlacesPage } from './pages/PlacesPage';
import { PlaceDetailPage } from './pages/PlaceDetailPage';
import { MapExplorerPage } from './pages/MapExplorerPage';
import { EducationPage } from './pages/EducationPage';
import { HealthPage } from './pages/HealthPage';
import { ServicesPage } from './pages/ServicesPage';
import { FisheriesPage } from './pages/FisheriesPage';
import { AgriculturePage } from './pages/AgriculturePage';
import { LivestockPage } from './pages/LivestockPage';
import { PoliticsPage } from './pages/PoliticsPage';
import { PeoplePage } from './pages/PeoplePage';
import { CulturePage } from './pages/CulturePage';
import { HistoryPage } from './pages/HistoryPage';
import { UpazilaHistoryPage } from './pages/UpazilaHistoryPage';
import { TransportPage } from './pages/TransportPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { DirectoryPage } from './pages/DirectoryPage';
import { NewsPage } from './pages/NewsPage';
import { SourcesPage } from './pages/SourcesPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { ContributePage } from './pages/ContributePage';
import { TrackPage } from './pages/TrackPage';
import { RequireAuth } from './admin/RequireAuth';
import { AdminLayout, AdminDashboard } from './admin/AdminLayout';
import { ContentAdmin } from './admin/ContentAdmin';
import { SubmissionsAdmin } from './admin/SubmissionsAdmin';
import { MembersAdmin } from './admin/MembersAdmin';
import { AuditAdmin } from './admin/AuditAdmin';

export function App() {
  return (
    <DataProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<MainLayout />}> 
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="upazilas" element={<UpazilasPage />} />
                <Route path="upazilas/:slug" element={<UpazilaDetailPage />} />
                <Route path="places" element={<PlacesPage />} />
                <Route path="places/:id" element={<PlaceDetailPage />} />
                <Route path="map" element={<MapExplorerPage />} />
                <Route path="education" element={<EducationPage />} />
                <Route path="health" element={<HealthPage />} />
                <Route path="services" element={<ServicesPage />} />
                <Route path="fisheries" element={<FisheriesPage />} />
                <Route path="agriculture" element={<AgriculturePage />} />
                <Route path="livestock" element={<LivestockPage />} />
                <Route path="politics" element={<PoliticsPage />} />
                <Route path="representatives" element={<PoliticsPage />} />
                <Route path="people" element={<PeoplePage />} />
                <Route path="culture" element={<CulturePage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="history/:slug" element={<UpazilaHistoryPage />} />
                <Route path="transport" element={<TransportPage />} />
                <Route path="emergency" element={<EmergencyPage />} />
                <Route path="directory" element={<DirectoryPage />} />
                <Route path="news" element={<NewsPage />} />
                <Route path="sources" element={<SourcesPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="contribute" element={<ContributePage />} />
                <Route path="track" element={<TrackPage />} />
                <Route path="track/:code" element={<TrackPage />} />
                {/* Protected CMS: the API enforces auth + permissions; these guards are UX only. */}
                <Route path="admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="content" element={<RequireAuth permission="content.view"><ContentAdmin /></RequireAuth>} />
                  <Route path="submissions" element={<RequireAuth permission="submissions.view"><SubmissionsAdmin /></RequireAuth>} />
                  <Route path="members" element={<RequireAuth permission="members.manage"><MembersAdmin /></RequireAuth>} />
                  <Route path="audit" element={<RequireAuth permission="audit.view"><AuditAdmin /></RequireAuth>} />
                  {/* the previous browser-only admin tools, kept (now behind the real login) */}
                  <Route path="legacy" element={<AdminPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </DataProvider>
  );
}

export default App;
