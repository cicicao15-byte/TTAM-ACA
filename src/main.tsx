import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import AdsDashboard from '@/pages/AdsDashboard';
import AdsCampaign from '@/pages/AdsCampaign';
import AdsEdit from '@/pages/AdsEdit';
import NotFoundPage from '@/pages/NotFound';
import { installKeystoneOverlayCompat } from '@/infra/keystoneOverlayCompat';

if (import.meta.env.DEV) {
  installKeystoneOverlayCompat();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<AdsDashboard />} />
          <Route path="campaigns" element={<AdsCampaign />} />
          <Route
            path="ads/edit"
            element={(
              <AdsEdit
                initialDestinationUrl=""
                destinationUrlPlaceholder="Enter PDP/PHP URL starting with http:// or https://"
                deferInitialEmptyUrlError
              />
            )}
          />
          <Route path="ads/edit-2" element={<AdsEdit persistAcaUrlEditConsent />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
