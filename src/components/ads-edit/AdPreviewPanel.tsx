import { KsText, KsSelect, KsButton } from '@byted-keystone/react';
import { KsIconFullScreen } from '@fe-infra/keystone-icons-react';

export function AdPreviewPanel() {
  return (
    <div className="w-[294px] shrink-0 [filter:blur(2px)]">
      <div className="bg-neutral-surface rounded-xl p-4 sticky top-4 flex flex-col gap-3">
        {/* App icon header row */}
        <div className="flex items-center justify-between h-10">
          <div className="flex flex-col items-start">
            <div className="w-8 h-8 rounded-[5px] overflow-hidden bg-neutral-fillHigh" />
            <div className="w-8 h-1 rounded bg-neutral-fillHigh mt-1" />
          </div>
          <div className="flex items-center pl-[13px] relative">
            <div className="absolute left-0 top-0 w-px h-8 bg-neutral-fillLow" />
            <button className="w-[34px] h-[34px] flex items-center justify-center rounded border border-neutral-fillLow bg-neutral-surface cursor-pointer">
              <KsIconFullScreen size={16} color="#121415" />
            </button>
          </div>
        </div>

        {/* Placement select */}
        <KsSelect
          size="sm"
          defaultValue="in-feed"
          options={[
            { value: 'in-feed', label: 'In feed' },
            { value: 'profile', label: 'Profile feed' },
            { value: 'search', label: 'Search feed' },
          ]}
        />

        {/* Phone mock */}
        <div className="w-full rounded-lg overflow-hidden border border-neutral-fillLow bg-neutral-fill aspect-[242/538] relative flex flex-col">
          {/* Status bar */}
          <div className="flex items-center justify-between px-4 pt-2">
            <span className="text-white text-[11px] font-medium">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 rounded-sm bg-white/80" />
              <div className="w-3 h-2 rounded-sm bg-white/80" />
              <div className="w-5 h-2 rounded-sm bg-white/80" />
            </div>
          </div>

          {/* For You tabs */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="text-white/60 text-[11px]">Following</span>
            <span className="text-white text-[11px] font-medium relative">
              For You
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-white" />
            </span>
          </div>

          {/* Center play icon */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[12px] border-l-white ml-1" />
            </div>
          </div>

          {/* Bottom ad info + CTA */}
          <div className="px-3 pb-4 flex flex-col gap-2">
            <span className="text-white text-[13px] font-medium">@advertiser</span>
            <span className="text-white/90 text-[12px] leading-4">
              Your ad caption preview shows up right here.
            </span>
            <KsButton variant="primary" size="sm" className="w-full">
              Learn more
            </KsButton>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <KsText variant="labelSm" color="neutral">
            Preview is for reference only
          </KsText>
        </div>
      </div>
    </div>
  );
}
