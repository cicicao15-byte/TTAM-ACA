import { useCallback, useEffect, useRef, useState } from 'react';
import {
  KsText,
  KsInput,
  KsButton,
  KsIconButton,
  KsSwitch,
  KsTooltip,
  KsSelect,
  KsLink,
  KsStatusMessage,
  KsPopover,
  KsInlineAlert,
} from '@byted-keystone/react';
import {
  KsIconHelp,
  KsIconPreviewOpen,
  KsIconChevronUp,
  KsIconChevronDown,
  KsIconPlusSmall,
  KsIconEdit,
  KsIconDelete,
} from '@fe-infra/keystone-icons-react';
import {
  CreativeDrawer,
  type CreativeDrawerTab,
  type SelectedCreativeAsset,
} from './CreativeDrawer';
import { getAffiliateCreativeIdsForUrl } from './creativeLibrary';

const DEFAULT_DESTINATION_URL = 'PDP/PHP URL';
const ACA_REMOVED_NOTICE = 'Affiliate creative was removed because the previous affiliate creative may no longer be associated with the updated URL .';

// A destination URL is valid only when it points to a PDP or PHP page.
function isValidDestinationUrl(url: string): boolean {
  const u = url.trim().toUpperCase();
  return u.includes('PDP') || u.includes('PHP');
}

function normalizeDestinationUrl(url: string): string {
  return url.trim().toUpperCase();
}

function SectionHeader({ title, optional }: { title: string; optional?: boolean }) {
  return (
    <div className="flex items-center gap-2 px-6 pt-6 pb-4">
      <KsText variant="titleLg">{title}</KsText>
      {optional && (
        <KsText variant="bodySm" color="neutral">
          (Optional)
        </KsText>
      )}
      <KsTooltip content="Learn more about this setting">
        <span className="flex items-center text-neutral-lowOnSurface cursor-pointer">
          <KsIconHelp size={16} color="#87898b" />
        </span>
      </KsTooltip>
    </div>
  );
}

function DestinationModule({
  url,
  placeholder,
  showUrlError,
  onUrlChange,
  urlEditPopoverOpen,
  shouldBlockUrlEdit,
  onBlockedUrlEditAttempt,
  onContinueUrlEdit,
  onCancelUrlEdit,
  urlFieldRef,
}: {
  url: string;
  placeholder: string;
  showUrlError: boolean;
  onUrlChange: (v: string) => void;
  urlEditPopoverOpen: boolean;
  shouldBlockUrlEdit: boolean;
  onBlockedUrlEditAttempt: () => void;
  onContinueUrlEdit: () => void;
  onCancelUrlEdit: () => void;
  urlFieldRef?: React.RefObject<HTMLDivElement>;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [urlParams, setUrlParams] = useState(false);
  const websiteUrlDescription = (
    <>
      By selecting a webpage, you are granting TikTok permission to scan, download, and
      modify images, videos, and other assets located on that webpage, and you are
      confirming that you own the necessary legal rights to the images, videos, and assets
      located on the webpage and have permission to share the assets with TikTok for use
      on your behalf in advertising or for other commercial purposes.
      <br />
      [TBD] A PDP/PHP URL is required.
      {' '}
      <a
        href="https://ads.tiktok.com/help/"
        target="_blank"
        rel="noreferrer"
        className="text-primary-onSurface no-underline"
      >
        Learn more
      </a>
    </>
  );

  const handleProtectedInteraction = (event: React.SyntheticEvent) => {
    if (!shouldBlockUrlEdit) return;
    event.preventDefault();
    event.stopPropagation();

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    onBlockedUrlEditAttempt();
  };

  return (
    <section className="bg-neutral-surface rounded-xl pb-2">
      {/* moduleHeader */}
      <div className="flex flex-col px-6 pt-6 pb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <KsText
              variant="headlineSm"
              style={{
                color: 'var(--ks-color-neutral-highOnSurface, #121415)',
                fontFamily: '"TikTok Sans Display"',
                fontSize: '20px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '28px',
                letterSpacing: '0.3px',
              }}
            >
              Destination
            </KsText>
            <KsTooltip content="Learn more about destination">
              <span className="flex shrink-0 items-center text-neutral-lowOnSurface cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 14.3454C11.5044 14.3454 14.3454 11.5044 14.3454 8C14.3454 4.49556 11.5044 1.65465 8 1.65465C4.49556 1.65465 1.65465 4.49556 1.65465 8C1.65465 11.5044 4.49556 14.3454 8 14.3454ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 -3.86258e-07 12.4183 0 8C3.86258e-07 3.58172 3.58172 -3.86258e-07 8 0C12.4183 3.86258e-07 16 3.58172 16 8Z"
                    fill="#87898B"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.88773 11.026C7.43081 11.026 7.0604 10.6556 7.0604 10.1987V8.92856C7.0604 7.82265 7.96732 7.14147 8.60071 6.84046C9.0945 6.60579 9.37885 6.16408 9.37885 5.70652C9.37885 5.06167 8.78289 4.4149 7.88773 4.4149C7.25531 4.4149 6.74974 4.75196 6.5273 5.17839C6.31597 5.5835 5.81625 5.7406 5.41114 5.52927C5.00602 5.31795 4.84893 4.81823 5.06025 4.41311C5.58319 3.41063 6.67271 2.76025 7.88773 2.76025C9.55344 2.76025 11.0335 4.01085 11.0335 5.70652C11.0335 6.88537 10.303 7.86345 9.31095 8.33492C9.11064 8.43011 8.94419 8.55134 8.83783 8.67278C8.7356 8.78953 8.71505 8.8732 8.71505 8.92856V10.1987C8.71505 10.6556 8.34465 11.026 7.88773 11.026Z"
                    fill="#87898B"
                  />
                  <path
                    d="M7.88673 13.2389C7.42981 13.2389 7.0594 12.8685 7.0594 12.4116C7.0594 11.9546 7.42981 11.5842 7.88673 11.5842C8.34365 11.5842 8.71405 11.9546 8.71405 12.4116C8.71405 12.8685 8.34365 13.2389 7.88673 13.2389Z"
                    fill="#87898B"
                  />
                </svg>
              </span>
            </KsTooltip>
          </div>
          <div className="flex items-center justify-center w-9">
            <KsIconButton
              size="md"
              variant="text"
              onClick={() => setCollapsed((c) => !c)}
            >
              {collapsed ? <KsIconChevronDown size={16} /> : <KsIconChevronUp size={16} />}
            </KsIconButton>
          </div>
        </div>
      </div>

      {/* section */}
      {!collapsed && (
        <div className="flex flex-col gap-6 px-6 py-4">
          {/* Destination URL */}
          <div ref={urlFieldRef} className="flex w-[484px] flex-col gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <KsText variant="titleSm">Website URL</KsText>
                <KsTooltip content="Learn more about website URL requirements">
                  <span className="flex shrink-0 items-center cursor-pointer text-neutral-lowOnSurface">
                    <KsIconHelp size={14} color="#87898b" />
                  </span>
                </KsTooltip>
              </div>
              <KsText
                variant="labelSm"
                style={{
                  color: 'var(--ks-color-neutral-onSurface, #6d6e70)',
                  fontFamily: '"TikTok Sans Text"',
                  fontSize: '12px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '16px',
                  letterSpacing: '0.161px',
                }}
              >
                {websiteUrlDescription}
              </KsText>
            </div>
            <div className="flex flex-col gap-2">
              <KsPopover
                trigger="manual"
                placement="top"
                gapOffset={4}
                popupWidth={320}
                noPadding
                partProps={{
                  content: {
                    style: {
                      boxShadow: '0 8px 20px 0 rgba(0, 0, 0, 0.12)',
                    },
                  },
                }}
                arrow
                open={urlEditPopoverOpen}
              >
                <div
                  className="w-full"
                  onMouseDownCapture={handleProtectedInteraction}
                  onFocusCapture={handleProtectedInteraction}
                >
                  <KsInput
                    placeholder={placeholder}
                    clearable
                    status={showUrlError ? 'error' : undefined}
                    value={url}
                    onChange={(value: string) => onUrlChange(value)}
                    onClear={() => onUrlChange('')}
                  />
                </div>
                <div
                  slot="content"
                  className="flex w-[320px] flex-col items-center gap-4 p-4"
                >
                  <div className="flex w-full self-stretch flex-col items-start gap-1">
                    <KsText
                      variant="labelLg"
                      style={{ color: 'var(--ks-color-neutral-highOnSurface, #121415)' }}
                    >
                      Editing this URL may affect selected affiliate creatives
                    </KsText>
                    <div className="flex w-full self-stretch flex-col items-start gap-1">
                      <KsText variant="bodySm">
                        Changing the TikTok Shop URL may remove your selected
                        affiliate creatives.
                      </KsText>
                    </div>
                  </div>
                  <div className="flex w-full justify-end gap-2 self-stretch">
                    <KsButton size="sm" variant="default" onClick={onCancelUrlEdit}>
                      Cancel
                    </KsButton>
                    <KsButton size="sm" variant="primary" onClick={onContinueUrlEdit}>
                      Continue Editing
                    </KsButton>
                  </div>
                </div>
              </KsPopover>
              {showUrlError && (
                <KsStatusMessage
                  variant="error"
                  richTextString="Enter PDP/PHP URL"
                />
              )}
            </div>
            <div className="flex items-start">
              <KsButton size="md" variant="default">
                <KsIconEdit size={16} />
                Build URL parameters
              </KsButton>
            </div>
          </div>

          {/* Added URL parameters */}
          <div className="flex items-center justify-between w-full [filter:blur(2px)]">
            <div className="flex flex-col gap-0.5">
              <KsText variant="titleSm">Added URL parameters</KsText>
              <KsText variant="bodySm" color="neutral">
                No URL parameters
              </KsText>
            </div>
            <KsSwitch
              checked={urlParams}
              onChange={(value: boolean) => setUrlParams(value)}
            />
          </div>
        </div>
      )}
    </section>
  );
}

function TextAndAddOnsModule() {
  const [collapsed, setCollapsed] = useState(false);
  const [cta, setCta] = useState(false);

  return (
    <section className="bg-neutral-surface rounded-xl pb-2 [filter:blur(2px)]">
      {/* moduleHeader */}
      <div className="flex flex-col px-6 pt-6 pb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <KsText variant="headlineSm">Text and add-ons</KsText>
            <KsTooltip content="Learn more about text and add-ons">
              <span className="flex items-center text-neutral-lowOnSurface cursor-pointer">
                <KsIconHelp size={16} color="#87898b" />
              </span>
            </KsTooltip>
          </div>
          <div className="flex items-center justify-center w-9">
            <KsIconButton
              size="md"
              variant="text"
              onClick={() => setCollapsed((c) => !c)}
            >
              {collapsed ? <KsIconChevronDown size={16} /> : <KsIconChevronUp size={16} />}
            </KsIconButton>
          </div>
        </div>
      </div>

      {/* section */}
      {!collapsed && (
        <div className="flex flex-col gap-8 px-6 pb-4">
          <div className="flex flex-col gap-2 w-full">
            {/* Call to action toggle row */}
            <div className="flex items-start gap-2 w-full">
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <KsText variant="titleSm">Call to action</KsText>
                  <KsTooltip content="Learn more about call to action">
                    <span className="flex items-center text-neutral-lowOnSurface cursor-pointer">
                      <KsIconHelp size={16} color="#87898b" />
                    </span>
                  </KsTooltip>
                </div>
              </div>
              <KsSwitch
                checked={cta}
                onChange={(value: boolean) => setCta(value)}
              />
            </div>
            <KsSelect
              clearable
              multiple
              placeholder="Select call to action"
              options={[
                { value: 1, label: 'Shop now' },
                { value: 2, label: 'Learn more' },
                { value: 3, label: 'Sign up' },
              ]}
            />
          </div>

          {/* Advanced settings link */}
          <div>
            <KsLink size="md">
              <span className="flex items-center gap-1">
                Advanced settings
                <KsIconChevronDown size={14} />
              </span>
            </KsLink>
          </div>
        </div>
      )}
    </section>
  );
}

function TrackingModule() {
  const [tracking, setTracking] = useState(true);

  return (
    <section className="bg-neutral-surface rounded-xl [filter:blur(2px)]">
      <SectionHeader title="Tracking" optional />
      <div className="px-6 pb-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <KsSwitch
            checked={tracking}
            onChange={(value: boolean) => setTracking(value)}
          >
            <KsText variant="labelLg">Use third-party tracking</KsText>
          </KsSwitch>
          <KsInput placeholder="Add tracking URLs" />
        </div>
        <div>
          <KsLink size="md">
            <span className="flex items-center gap-1">
              <KsIconPreviewOpen size={16} />
              View tracking guidelines
            </span>
          </KsLink>
        </div>
      </div>
    </section>
  );
}

function SelectedCreativeTile({
  asset,
  onDelete,
  showAffiliateAlert,
  onUpdateAffiliateCreatives,
}: {
  asset: SelectedCreativeAsset;
  onDelete: () => void;
  showAffiliateAlert: boolean;
  onUpdateAffiliateCreatives: () => void;
}) {
  const isAca = asset.kind === 'aca';

  return (
    <div
      className="group flex w-full flex-col gap-2 rounded-md bg-neutral-surface1 py-3 outline-0 hover:outline hover:outline-1 hover:outline-[#6d6e70]"
      data-creative-kind={asset.kind}
    >
      <div className="flex w-full items-center gap-2 px-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative size-16 shrink-0 overflow-hidden rounded border border-neutral-fillLow bg-neutral-surface1">
            <img
              src={asset.thumbnailUrl}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
            {!isAca && (
              <img
                src={asset.thumbnailUrl}
                alt=""
                className="absolute inset-0 size-full rounded object-cover opacity-80"
              />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="min-w-0">
              <KsText variant="bodySm" ellipsis>
                {asset.title}
              </KsText>
            </div>
            <div className="flex min-w-0 items-center gap-0.5">
              <img
                src="https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=small%20round%20profile%20avatar%20portrait%20for%20social%20media%2C%20realistic%2C%20clean%20background&image_size=square"
                alt=""
                className="size-4 shrink-0 rounded-full object-cover"
              />
              <KsText variant="labelSm" color="neutral" ellipsis>
                {asset.description}
              </KsText>
            </div>
          </div>
        </div>
        <div className="hidden shrink-0 items-center gap-2 group-hover:flex">
          <KsIconButton size="md" variant="text">
            <KsIconEdit size={18} />
          </KsIconButton>
          <KsIconButton size="md" variant="text" onClick={onDelete}>
            <KsIconDelete size={18} />
          </KsIconButton>
        </div>
      </div>
      {showAffiliateAlert && (
        <div className="px-3">
          <KsInlineAlert
            variant="info"
            size="sm"
            inverse
            closeable={false}
            title="Using non-affiliate creatives"
            content="Affiliate creatives are also available for this URL. Review additional creative options if needed."
          >
            <button
              slot="actions"
              type="button"
              className="tiktok-labelSm cursor-pointer border-0 bg-transparent p-0 text-left text-primary-onSurface"
              onClick={onUpdateAffiliateCreatives}
            >
              Update
            </button>
          </KsInlineAlert>
        </div>
      )}
    </div>
  );
}

function CreativeAssetModule({
  assets,
  showError,
  showAcaRemovalNotice,
  showAffiliateAlert,
  onAdd,
  onDeleteAsset,
  onUpdateAffiliateCreatives,
}: {
  assets: SelectedCreativeAsset[];
  showError: boolean;
  showAcaRemovalNotice: boolean;
  showAffiliateAlert: boolean;
  onAdd: () => void;
  onDeleteAsset: () => void;
  onUpdateAffiliateCreatives: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const hasAssets = assets.length > 0;

  return (
    <section className="bg-neutral-surface rounded-xl pb-2">
      {/* moduleHeader */}
      <div className="flex flex-col px-6 pt-6 pb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <KsText variant="headlineSm">Creative assets</KsText>
            <KsTooltip content="Learn more about creative assets">
              <span className="flex items-center text-neutral-lowOnSurface cursor-pointer">
                <KsIconHelp size={16} color="#87898b" />
              </span>
            </KsTooltip>
          </div>
          <div className="flex items-center justify-center w-9">
            <KsIconButton
              size="md"
              variant="text"
              onClick={() => setCollapsed((c) => !c)}
            >
              {collapsed ? <KsIconChevronDown size={16} /> : <KsIconChevronUp size={16} />}
            </KsIconButton>
          </div>
        </div>
        <KsText variant="bodySm" color="neutral">
          Creative assets will be combined with your text and add-ons to create
          high-performing, tailored ad variations.
        </KsText>
      </div>

      {/* section */}
      {!collapsed && (
        <div className="flex flex-col gap-8 px-6 pb-4">
          {hasAssets ? (
            <>
              <div className="flex w-full flex-col gap-2">
                {assets.map((asset) => (
                  <SelectedCreativeTile
                    key={`${asset.kind}-${asset.id}`}
                    asset={asset}
                    onDelete={onDeleteAsset}
                    showAffiliateAlert={showAffiliateAlert && asset.kind === 'non-aca'}
                    onUpdateAffiliateCreatives={onUpdateAffiliateCreatives}
                  />
                ))}
              </div>
              <div>
                <KsLink size="md">
                  <span className="flex items-center gap-1">
                    Advanced settings
                    <KsIconChevronDown size={14} />
                  </span>
                </KsLink>
              </div>
            </>
          ) : (
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-start gap-2 w-full">
                <KsButton size="md" variant="default" onClick={onAdd}>
                  <KsIconPlusSmall size={16} />
                  Add
                </KsButton>
                <KsButton size="md" variant="default">
                  <KsIconPlusSmall size={16} />
                  Create new videos
                </KsButton>
              </div>
              {showAcaRemovalNotice && (
                <KsStatusMessage
                  variant="error"
                  richTextString={ACA_REMOVED_NOTICE}
                />
              )}
              {showError && (
                <KsStatusMessage
                  variant="error"
                  richTextString="Upload creative for your ad"
                />
              )}
            </div>
          )}
          </div>
      )}
    </section>
  );
}

export function AdSettingsColumn({
  persistAcaUrlEditConsent = false,
  initialDestinationUrl = DEFAULT_DESTINATION_URL,
  destinationUrlPlaceholder = 'Enter PDP/PHP URL starting with http:// or https://',
  deferInitialEmptyUrlError = false,
}: {
  persistAcaUrlEditConsent?: boolean;
  initialDestinationUrl?: string;
  destinationUrlPlaceholder?: string;
  deferInitialEmptyUrlError?: boolean;
}) {
  const [url, setUrl] = useState(initialDestinationUrl);
  const [urlTouched, setUrlTouched] = useState(initialDestinationUrl.trim().length > 0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<CreativeDrawerTab>('recommended');
  const [creativeAssets, setCreativeAssets] = useState<SelectedCreativeAsset[]>([]);
  const [showCreativeAssetError, setShowCreativeAssetError] = useState(false);
  const [showAcaRemovalNotice, setShowAcaRemovalNotice] = useState(false);
  const [showAffiliateAlertOnValidUrl, setShowAffiliateAlertOnValidUrl] = useState(false);
  const [urlEditPopoverOpen, setUrlEditPopoverOpen] = useState(false);
  const [acaUrlEditEnabled, setAcaUrlEditEnabled] = useState(false);
  const [acaUrlEditAcknowledged, setAcaUrlEditAcknowledged] = useState(false);
  const [acaUrlEditPromptShown, setAcaUrlEditPromptShown] = useState(false);
  const [urlBeforeEdit, setUrlBeforeEdit] = useState(DEFAULT_DESTINATION_URL);
  const urlFieldRef = useRef<HTMLDivElement>(null);
  const hasAcaCreative = creativeAssets.some((asset) => asset.kind === 'aca');
  const currentAffiliateCreativeIds = getAffiliateCreativeIdsForUrl(url, 10);
  const hasCurrentUrlAcaCreative = creativeAssets.some(
    (asset) => asset.kind === 'aca' && currentAffiliateCreativeIds.includes(asset.id),
  );
  const hasNonAcaCreative = creativeAssets.some((asset) => asset.kind === 'non-aca');
  const hasValidDestinationUrl = isValidDestinationUrl(url);
  const isEmptyUrl = url.trim().length === 0;
  const showUrlError = (
    (!isEmptyUrl && !hasValidDestinationUrl)
    || (isEmptyUrl && (!deferInitialEmptyUrlError || urlTouched))
  );
  const showAffiliateCreativeAlert = (
    hasNonAcaCreative
    && hasValidDestinationUrl
    && showAffiliateAlertOnValidUrl
  );

  const focusUrlInput = () => {
    const inputHost = urlFieldRef.current?.querySelector('ks-input-1-1-11');
    const input = inputHost?.shadowRoot?.querySelector('input');
    if (!(input instanceof HTMLInputElement)) return;

    input.focus();
    const end = input.value.length;
    input.setSelectionRange(end, end);
  };

  const syncAcaCreativesForUrl = useCallback((nextUrl: string) => {
    const nextHasValidDestinationUrl = isValidDestinationUrl(nextUrl);
    if (!nextHasValidDestinationUrl) {
      setShowAcaRemovalNotice(false);
      return;
    }

    const nextAffiliateCreativeIds = getAffiliateCreativeIdsForUrl(nextUrl, 10);
    const nextCreativeAssets = creativeAssets.filter(
      (asset) => asset.kind !== 'aca' || nextAffiliateCreativeIds.includes(asset.id),
    );
    const hasRemovedAcaCreative = nextCreativeAssets.length !== creativeAssets.length;

    if (!hasRemovedAcaCreative) {
      setShowAcaRemovalNotice(false);
      return;
    }

    setCreativeAssets(nextCreativeAssets);
    setShowAcaRemovalNotice(true);
    setShowCreativeAssetError(false);
    setUrlEditPopoverOpen(false);
    setAcaUrlEditEnabled(false);
  }, [creativeAssets]);

  useEffect(() => {
    if (!hasAcaCreative) {
      setUrlEditPopoverOpen(false);
      setAcaUrlEditEnabled(false);
      setAcaUrlEditAcknowledged(false);
      setAcaUrlEditPromptShown(false);
    }
  }, [hasAcaCreative]);

  useEffect(() => {
    const inputHost = urlFieldRef.current?.querySelector('ks-input-1-1-11');
    const input = inputHost?.shadowRoot?.querySelector('input');
    if (!(input instanceof HTMLInputElement)) return undefined;

    const handleNativeBlur = () => {
      syncAcaCreativesForUrl(url);

      if (!hasAcaCreative) return;
      if (!persistAcaUrlEditConsent || !acaUrlEditAcknowledged) {
        setAcaUrlEditEnabled(false);
      }
    };

    input.addEventListener('blur', handleNativeBlur);

    return () => {
      input.removeEventListener('blur', handleNativeBlur);
    };
  }, [acaUrlEditAcknowledged, hasAcaCreative, persistAcaUrlEditConsent, syncAcaCreativesForUrl, url]);

  useEffect(() => {
    if (!urlEditPopoverOpen) return undefined;

    const handleDocumentPointerDown = (event: MouseEvent) => {
      const container = urlFieldRef.current;
      if (!container) return;
      if (container.contains(event.target as Node)) return;
      setUrlEditPopoverOpen(false);
    };

    document.addEventListener('mousedown', handleDocumentPointerDown, true);

    return () => {
      document.removeEventListener('mousedown', handleDocumentPointerDown, true);
    };
  }, [urlEditPopoverOpen]);

  const handleAdd = () => {
    // Valid URL = contains PDP or PHP → TikTok Shop affiliate (S2)
    // Otherwise (empty/invalid) → Recommended (S1)
    const isValid = isValidDestinationUrl(url);
    setDrawerTab(isValid ? 'affiliate' : 'recommended');
    setDrawerOpen(true);
  };

  const handleAddCreatives = (assets: SelectedCreativeAsset[]) => {
    setCreativeAssets(assets);
    setShowCreativeAssetError(false);
    setShowAcaRemovalNotice(false);
    setShowAffiliateAlertOnValidUrl(
      assets.some((asset) => asset.kind === 'non-aca') && !isValidDestinationUrl(url),
    );
    setUrlEditPopoverOpen(false);
    setAcaUrlEditEnabled(false);
    setAcaUrlEditAcknowledged(false);
    setAcaUrlEditPromptShown(false);
  };

  const handleDeleteCreativeAsset = () => {
    setCreativeAssets([]);
    setShowCreativeAssetError(true);
    setShowAcaRemovalNotice(false);
    setShowAffiliateAlertOnValidUrl(false);
    setUrlEditPopoverOpen(false);
    setAcaUrlEditEnabled(false);
    setAcaUrlEditAcknowledged(false);
    setAcaUrlEditPromptShown(false);
  };

  const handleUrlChange = (nextUrl: string) => {
    const currentNormalizedUrl = normalizeDestinationUrl(url);
    const nextNormalizedUrl = normalizeDestinationUrl(nextUrl);
    const changedBetweenValidUrls = (
      persistAcaUrlEditConsent
      && hasNonAcaCreative
      && isValidDestinationUrl(url)
      && isValidDestinationUrl(nextUrl)
      && currentNormalizedUrl !== nextNormalizedUrl
    );

    setUrl(nextUrl);
    setUrlTouched(true);
    setShowAcaRemovalNotice(false);
    if (changedBetweenValidUrls) {
      setShowAffiliateAlertOnValidUrl(true);
    }
  };

  const handleUpdateAffiliateCreatives = () => {
    setDrawerTab('affiliate');
    setDrawerOpen(true);
  };

  const handleBlockedUrlEditAttempt = () => {
    if (persistAcaUrlEditConsent && acaUrlEditPromptShown) {
      setAcaUrlEditEnabled(true);
      setAcaUrlEditAcknowledged(true);
      setUrlEditPopoverOpen(false);

      setTimeout(() => {
        focusUrlInput();
      }, 0);
      return;
    }

    setUrlBeforeEdit(url);
    setUrlEditPopoverOpen(true);
    if (persistAcaUrlEditConsent) {
      setAcaUrlEditPromptShown(true);
    }
  };

  const handleContinueUrlEdit = () => {
    setAcaUrlEditEnabled(true);
    setUrlEditPopoverOpen(false);
    if (persistAcaUrlEditConsent) {
      setAcaUrlEditAcknowledged(true);
      setAcaUrlEditPromptShown(true);
    }

    setTimeout(() => {
      focusUrlInput();
    }, 0);
  };

  const handleCancelUrlEdit = () => {
    setUrl(urlBeforeEdit);
    setAcaUrlEditEnabled(false);
    setUrlEditPopoverOpen(false);
  };

  // From the disabled-tab popover: close the drawer and scroll to the URL field.
  const handleAddUrl = () => {
    setDrawerOpen(false);
    // Wait for the drawer close animation before scrolling.
    setTimeout(() => {
      const container = urlFieldRef.current;
      if (!container) return;
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  };

  return (
    <div className="flex flex-col gap-4 w-[532px] shrink-0">
      <DestinationModule
        url={url}
        placeholder={destinationUrlPlaceholder}
        showUrlError={showUrlError}
        onUrlChange={handleUrlChange}
        urlEditPopoverOpen={urlEditPopoverOpen}
        shouldBlockUrlEdit={
          hasCurrentUrlAcaCreative
          && !acaUrlEditEnabled
          && !(persistAcaUrlEditConsent && acaUrlEditAcknowledged)
        }
        onBlockedUrlEditAttempt={handleBlockedUrlEditAttempt}
        onContinueUrlEdit={handleContinueUrlEdit}
        onCancelUrlEdit={handleCancelUrlEdit}
        urlFieldRef={urlFieldRef}
      />
      <CreativeAssetModule
        assets={creativeAssets}
        showError={showCreativeAssetError}
        showAcaRemovalNotice={showAcaRemovalNotice}
        showAffiliateAlert={showAffiliateCreativeAlert}
        onAdd={handleAdd}
        onDeleteAsset={handleDeleteCreativeAsset}
        onUpdateAffiliateCreatives={handleUpdateAffiliateCreatives}
      />
      <TextAndAddOnsModule />
      <TrackingModule />
      <CreativeDrawer
        open={drawerOpen}
        activeTab={drawerTab}
        destinationUrl={url}
        affiliateDisabled={drawerTab === 'recommended'}
        onClose={() => setDrawerOpen(false)}
        onAddUrl={handleAddUrl}
        onAddCreatives={handleAddCreatives}
      />
    </div>
  );
}
