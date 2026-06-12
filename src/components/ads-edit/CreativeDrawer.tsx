import { useState, useEffect } from 'react';
import {
  KsDrawer,
  KsText,
  KsButton,
  KsIconButton,
  KsInput,
  KsSelect,
  KsPopover,
  KsTabs,
  KsTabItem,
  KsCheckbox,
} from '@byted-keystone/react';
import {
  KsIconClose,
  KsIconSearch,
  KsIconStar,
  KsIconShop,
} from '@fe-infra/keystone-icons-react';
import { getAffiliateCreativeIdsForUrl } from './creativeLibrary';

export type CreativeDrawerTab = 'recommended' | 'posts' | 'affiliate' | 'library';
export type SelectedCreativeAssetKind = 'aca' | 'non-aca';

export interface SelectedCreativeAsset {
  id: number;
  kind: SelectedCreativeAssetKind;
  thumbnailUrl: string;
  title: string;
  description: string;
}

interface CreativeDrawerProps {
  open: boolean;
  activeTab: CreativeDrawerTab;
  destinationUrl?: string;
  /** When true (S1), the "TikTok Shop affiliate" tab is disabled and shows a
   * popover prompting the user to add a destination URL. */
  affiliateDisabled?: boolean;
  onClose: () => void;
  /** Called when the user clicks "Add URL" in the disabled-tab popover. */
  onAddUrl?: () => void;
  onAddCreatives?: (assets: SelectedCreativeAsset[]) => void;
}

const CREATIVE_COUNT = 10;
const TAB_THUMB_PROMPTS: Record<CreativeDrawerTab, string[]> = {
  recommended: [
    'cute small kitten sitting on a soft blanket, bright studio lighting, vertical social video cover',
    'playful orange kitten looking at camera, cozy home background, vertical social video cover',
    'fluffy white kitten close up portrait, clean daylight, vertical social video cover',
    'tiny gray kitten on couch, warm indoor light, vertical social video cover',
    'adorable black kitten with big eyes, soft focus, vertical social video cover',
  ],
  posts: [
    'cute small puppy playing indoors, bright studio lighting, vertical social video cover',
    'golden retriever puppy looking at camera, cozy home background, vertical social video cover',
    'fluffy white puppy portrait, clean daylight, vertical social video cover',
    'brown puppy sitting on floor, warm indoor light, vertical social video cover',
    'adorable small dog close up, soft focus, vertical social video cover',
  ],
  affiliate: [
    'fashion clothing flat lay, trendy outfit styling, clean ecommerce background, vertical social video cover',
    'stylish women clothing on hanger, soft studio light, vertical social video cover',
    'streetwear apparel product display, minimal background, vertical social video cover',
    'folded clothing stack for ecommerce, crisp detail, vertical social video cover',
    'modern outfit product showcase, fashion studio setup, vertical social video cover',
  ],
  library: [
    'modern smartphone product shot, clean studio background, vertical social video cover',
    'mobile phone close up on minimal surface, premium lighting, vertical social video cover',
    'smartphone ecommerce hero shot, bright clean background, vertical social video cover',
    'sleek phone device showcase, soft reflections, vertical social video cover',
    'new mobile phone product display, studio setup, vertical social video cover',
  ],
};

const AFFILIATE_YES_THUMB_PROMPTS = [
  'fashion clothing flat lay, trendy outfit styling, clean ecommerce background, vertical social video cover',
  'stylish women clothing on hanger, soft studio light, vertical social video cover',
  'premium fashion apparel arranged for ecommerce, bright minimal background, vertical social video cover',
  'chic clothing rack with modern styling pieces, clean studio setup, vertical social video cover',
  'designer outfit showcase with folded textures, premium ecommerce background, vertical social video cover',
];

const AFFILIATE_NO_THUMB_PROMPTS = [
  'premium essence water bottle product shot, clean skincare studio background, vertical social video cover',
  'hydrating essence toner bottle with water splash, bright ecommerce background, vertical social video cover',
  'minimal skincare essence water product display, soft blue studio light, vertical social video cover',
  'luxury facial essence bottle close up, clean beauty background, vertical social video cover',
  'glass essence water bottle on reflective surface, premium skincare studio setup, vertical social video cover',
];

function getAffiliateThumbPrompts(destinationUrl: string) {
  const normalizedUrl = destinationUrl.trim().toUpperCase();
  if (normalizedUrl === 'PDP/PHP URL-YES') {
    return AFFILIATE_YES_THUMB_PROMPTS;
  }
  if (normalizedUrl === 'PDP/PHP URL-NO') {
    return AFFILIATE_NO_THUMB_PROMPTS;
  }
  return TAB_THUMB_PROMPTS.affiliate;
}

function getCreativeThumbnailUrl(
  id: number,
  tab: CreativeDrawerTab,
  destinationUrl = '',
) {
  const prompts = tab === 'affiliate'
    ? getAffiliateThumbPrompts(destinationUrl)
    : TAB_THUMB_PROMPTS[tab];
  return thumbUrl(prompts[id % prompts.length]);
}

function thumbUrl(prompt: string) {
  return `https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=portrait_16_9`;
}

function DrawerHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-start justify-between px-6 py-5 border-b border-neutral-fillLow">
      <div className="flex flex-col gap-1">
        <KsText variant="headlineSm">Add creative assets</KsText>
        <KsText variant="bodySm" color="neutral">
          Select videos to combine with your text and add-ons.
        </KsText>
      </div>
      <KsIconButton size="md" variant="text" onClick={onClose}>
        <KsIconClose size={20} />
      </KsIconButton>
    </div>
  );
}

function FilterBar() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-[312px]">
        <KsInput placeholder="Search" clearable>
          <span slot="prefix" className="flex items-center text-neutral-lowOnSurface">
            <KsIconSearch size={16} />
          </span>
        </KsInput>
      </div>
      <div className="w-[160px]">
        <KsSelect
          placeholder="All formats"
          options={[
            { value: 'all', label: 'All formats' },
            { value: 'video', label: 'Video' },
            { value: 'image', label: 'Image' },
          ]}
        />
      </div>
      <div className="w-[160px]">
        <KsSelect
          placeholder="All sources"
          options={[
            { value: 'all', label: 'All sources' },
            { value: 'library', label: 'Video library' },
            { value: 'uploaded', label: 'Uploaded' },
          ]}
        />
      </div>
      <div className="w-[160px]">
        <KsSelect
          placeholder="Sort by"
          options={[
            { value: 'recent', label: 'Most recent' },
            { value: 'name', label: 'Name' },
          ]}
        />
      </div>
    </div>
  );
}

function CreativeTile({
  index,
  tab,
  destinationUrl,
  selected,
  onToggle,
}: {
  index: number;
  tab: CreativeDrawerTab;
  destinationUrl?: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex w-44 flex-col gap-3">
      <div
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle();
          }
        }}
        className={`relative size-44 overflow-hidden rounded bg-neutral-surface1 outline-none ${
          selected ? 'ring-2 ring-primary-base' : ''
        }`}
      >
        <img
          src={getCreativeThumbnailUrl(index, tab, destinationUrl)}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div
          className="absolute right-3 top-3"
          onClick={(event) => event.stopPropagation()}
        >
          <KsCheckbox checked={selected} onChange={onToggle} size="md" />
        </div>
        <div className="absolute bottom-3 right-3 flex items-center justify-end gap-1">
          <span
            className="rounded-[20px] border border-[var(--Primary-on-fill,#FFF)] bg-[var(--Neutral-fill-high,#262627)] px-2 py-1"
            style={{
              color: 'var(--Keystone-Neutral-on-fill, var(--Neutral-on-fill, #FFF))',
              fontFamily: '"TikTok Sans Text"',
              fontSize: '12px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '12px',
            }}
          >
            720x1280
          </span>
          <span
            className="rounded-[20px] border border-[var(--Primary-on-fill,#FFF)] bg-[var(--Neutral-fill-high,#262627)] px-2 py-1"
            style={{
              color: 'var(--Keystone-Neutral-on-fill, var(--Neutral-on-fill, #FFF))',
              fontFamily: '"TikTok Sans Text"',
              fontSize: '12px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '12px',
            }}
          >
            00:05
          </span>
        </div>
      </div>
      <KsText variant="bodySm" color="neutral" className="w-full truncate">
        Video name
      </KsText>
    </div>
  );
}

function VideoGrid({
  creativeIds,
  tab,
  destinationUrl,
  selectedIds,
  onToggle,
}: {
  creativeIds: number[];
  tab: CreativeDrawerTab;
  destinationUrl?: string;
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {creativeIds.map((creativeId) => (
        <CreativeTile
          key={creativeId}
          index={creativeId}
          tab={tab}
          destinationUrl={destinationUrl}
          selected={selectedIds.has(creativeId)}
          onToggle={() => onToggle(creativeId)}
        />
      ))}
    </div>
  );
}

function RecommendedView({
  creativeIds,
  selectedIds,
  onToggle,
}: {
  creativeIds: number[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Spark Ads benefits banner */}
      <div className="flex items-center gap-4 rounded-xl bg-primary-surface2 px-5 py-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-surface shrink-0">
          <KsIconStar size={20} />
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <KsText variant="titleSm">Benefits of Spark Ads</KsText>
          <KsText variant="bodySm" color="neutral">
            Based on historical data, Spark ads tend to drive better engagement
            and lower cost per result than non-Spark ads.
          </KsText>
        </div>
      </div>

      <FilterBar />
      <VideoGrid
        creativeIds={creativeIds}
        tab="recommended"
        selectedIds={selectedIds}
        onToggle={onToggle}
      />
    </div>
  );
}

function AffiliateView({
  selectedIds,
  creativeIds,
  destinationUrl,
  onToggle,
}: {
  selectedIds: Set<number>;
  creativeIds: number[];
  destinationUrl: string;
  onToggle: (id: number) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* TikTok Shop Affiliate banner */}
      <div className="flex items-center gap-4 rounded-xl bg-primary-surface2 px-5 py-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-surface shrink-0">
          <KsIconShop size={20} />
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <KsText variant="titleSm">TikTok Shop affiliate videos</KsText>
          <KsText variant="bodySm" color="neutral">
            These affiliate videos feature the product from your destination URL.
            Using them can help drive higher conversion.
          </KsText>
        </div>
      </div>

      <FilterBar />
      <VideoGrid
        creativeIds={creativeIds}
        tab="affiliate"
        destinationUrl={destinationUrl}
        selectedIds={selectedIds}
        onToggle={onToggle}
      />
    </div>
  );
}

function CreativeListView({
  creativeIds,
  tab,
  destinationUrl,
  selectedIds,
  onToggle,
}: {
  creativeIds: number[];
  tab: CreativeDrawerTab;
  destinationUrl?: string;
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <FilterBar />
      <VideoGrid
        creativeIds={creativeIds}
        tab={tab}
        destinationUrl={destinationUrl}
        selectedIds={selectedIds}
        onToggle={onToggle}
      />
    </div>
  );
}

function TabBar({
  active,
  onChange,
  affiliateDisabled,
  onAddUrl,
}: {
  active: CreativeDrawerTab;
  onChange: (t: CreativeDrawerTab) => void;
  affiliateDisabled?: boolean;
  onAddUrl?: () => void;
}) {
  const tabs: { id: CreativeDrawerTab; label: string }[] = [
    { id: 'recommended', label: 'Recommended' },
    { id: 'posts', label: 'TikTok posts' },
    { id: 'affiliate', label: 'TikTok shop affiliate' },
    { id: 'library', label: 'Creative library' },
  ];

  const handleActiveTabIdChange = (value: string | CustomEvent<string | [string]>) => {
    const nextTabId = typeof value === 'string'
      ? value
      : Array.isArray(value.detail)
        ? value.detail[0]
        : value.detail;

    if (
      nextTabId !== 'recommended'
      && nextTabId !== 'posts'
      && nextTabId !== 'affiliate'
      && nextTabId !== 'library'
    ) return;
    if (nextTabId === 'affiliate' && affiliateDisabled) return;

    onChange(nextTabId);
  };

  return (
    <div className="border-b border-neutral-fillLow">
      <KsTabs
        activeTabId={active}
        size="md"
        type="default"
        onActiveTabIdChange={handleActiveTabIdChange}
      >
        {tabs.map((t) => {
          const disabled = t.id === 'affiliate' && affiliateDisabled;

          if (!disabled) {
            return (
              <span key={t.id} slot={t.id}>
                {t.label}
              </span>
            );
          }

          return (
            <span key={t.id} slot={t.id}>
              <KsPopover trigger="hover" placement="bottom" arrow>
                <span className="cursor-not-allowed">{t.label}</span>
                <div slot="content" className="flex flex-col gap-6 w-[288px]">
                  <div className="flex flex-col gap-2">
                    <KsText variant="labelLg">No affiliate creatives available</KsText>
                    <KsText variant="bodySm">
                      Add or update a TikTok Shop product or shop URL to view
                      authorized affiliate creatives.
                    </KsText>
                  </div>
                  <div className="flex justify-end">
                    <KsButton size="sm" variant="default" onClick={onAddUrl}>
                      Add URL
                    </KsButton>
                  </div>
                </div>
              </KsPopover>
            </span>
          );
        })}
        {tabs.map((t) => {
          const disabled = t.id === 'affiliate' && affiliateDisabled;

          return (
            <KsTabItem key={`${t.id}-panel`} tabId={t.id} disabled={disabled} />
          );
        })}
      </KsTabs>
    </div>
  );
}

export function CreativeDrawer({
  open,
  activeTab,
  destinationUrl = '',
  affiliateDisabled,
  onClose,
  onAddUrl,
  onAddCreatives,
}: CreativeDrawerProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());
  const [tab, setTab] = useState<CreativeDrawerTab>(activeTab);
  const affiliateCreativeIds = getAffiliateCreativeIdsForUrl(destinationUrl, CREATIVE_COUNT);

  const toggleCreative = (id: number) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Sync internal tab with the requested tab whenever the drawer is (re)opened.
  useEffect(() => {
    if (open) {
      setTab(activeTab);
      setSelectedIds(new Set());
    }
  }, [open, activeTab]);

  const handleAdd = () => {
    if (selectedIds.size === 0) {
      onClose();
      return;
    }

    const kind: SelectedCreativeAssetKind = tab === 'affiliate' ? 'aca' : 'non-aca';
    const assets = Array.from(selectedIds).map((id) => ({
      id,
      kind,
      thumbnailUrl: getCreativeThumbnailUrl(id, tab, destinationUrl),
      title: '1111',
      description: 'name · TikTok post · 00:13',
    }));

    onAddCreatives?.(assets);
    onClose();
  };

  return (
    <KsDrawer
      open={open}
      width={980}
      backdrop
      onClose={onClose}
    >
      <div slot="header">
        <DrawerHeader onClose={onClose} />
      </div>

      <div slot="body" className="flex flex-col h-full">
        <div className="px-6 pt-4">
          <TabBar
            active={tab}
            onChange={setTab}
            affiliateDisabled={affiliateDisabled}
            onAddUrl={onAddUrl}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {tab === 'recommended' && (
            <RecommendedView
              creativeIds={Array.from({ length: CREATIVE_COUNT }, (_, index) => index)}
              selectedIds={selectedIds}
              onToggle={toggleCreative}
            />
          )}
          {tab === 'posts' && (
            <CreativeListView
              creativeIds={Array.from({ length: CREATIVE_COUNT }, (_, index) => index)}
              tab="posts"
              selectedIds={selectedIds}
              onToggle={toggleCreative}
            />
          )}
          {tab === 'affiliate' && (
            <AffiliateView
              creativeIds={affiliateCreativeIds}
              destinationUrl={destinationUrl}
              selectedIds={selectedIds}
              onToggle={toggleCreative}
            />
          )}
          {tab === 'library' && (
            <CreativeListView
              creativeIds={Array.from({ length: CREATIVE_COUNT }, (_, index) => index)}
              tab="library"
              selectedIds={selectedIds}
              onToggle={toggleCreative}
            />
          )}
        </div>
      </div>

      <div slot="footer" className="flex items-center justify-between w-full px-6 py-4 border-t border-neutral-fillLow">
        <KsText variant="bodySm" color="neutral">
          {selectedIds.size} selected
        </KsText>
        <div className="flex items-center gap-2">
          <KsButton variant="default" onClick={onClose}>
            Cancel
          </KsButton>
          <KsButton variant="primary" onClick={handleAdd}>
            Add
          </KsButton>
        </div>
      </div>
    </KsDrawer>
  );
}
