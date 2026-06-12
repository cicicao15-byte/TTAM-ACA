import { Header } from '@/layouts/Header';
import { AdEditSideNav } from '@/components/ads-edit/AdEditSideNav';
import { AdNameSection } from '@/components/ads-edit/AdNameSection';
import { AdSettingsColumn } from '@/components/ads-edit/AdSettingsColumn';
import { AdPreviewPanel } from '@/components/ads-edit/AdPreviewPanel';

export default function AdsEdit({
  persistAcaUrlEditConsent = false,
  initialDestinationUrl,
  destinationUrlPlaceholder,
  deferInitialEmptyUrlError = false,
}: {
  persistAcaUrlEditConsent?: boolean;
  initialDestinationUrl?: string;
  destinationUrlPlaceholder?: string;
  deferInitialEmptyUrlError?: boolean;
}) {
  return (
    <div className="min-h-screen bg-neutral-surface2 flex flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Left navigation */}
        <AdEditSideNav />

        {/* Content area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-[842px] mx-auto px-0 py-4 flex flex-col gap-4">
            <AdNameSection />

            <div className="flex gap-4">
              <AdSettingsColumn
                persistAcaUrlEditConsent={persistAcaUrlEditConsent}
                initialDestinationUrl={initialDestinationUrl}
                destinationUrlPlaceholder={destinationUrlPlaceholder}
                deferInitialEmptyUrlError={deferInitialEmptyUrlError}
              />
              <AdPreviewPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
