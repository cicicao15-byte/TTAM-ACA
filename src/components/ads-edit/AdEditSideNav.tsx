import { useState } from 'react';
import { KsText, KsSwitch, KsDivider, KsIconButton, KsTooltip } from '@byted-keystone/react';
import {
  KsIconHelp,
  KsIconChevronRight,
  KsIconAdNav,
  KsIconCopyContent,
  KsIconMoreVertical,
} from '@fe-infra/keystone-icons-react';

export function AdEditSideNav() {
  const [campaignOn, setCampaignOn] = useState(true);

  return (
    <aside className="w-[272px] shrink-0 bg-neutral-surface self-stretch">
      <div className="w-[240px] mx-4 my-4 flex flex-col">
        {/* Campaign switch row */}
        <div className="h-10 flex items-center justify-between px-2">
          <KsSwitch
            size="sm"
            checked={campaignOn}
            onChange={(value: boolean) => setCampaignOn(value)}
          >
            <KsText variant="labelLg">Campaign turned on</KsText>
          </KsSwitch>
          <KsTooltip content="Turn the whole campaign on or off">
            <span className="flex items-center text-neutral-lowOnSurface cursor-pointer">
              <KsIconHelp size={16} color="#87898b" />
            </span>
          </KsTooltip>
        </div>

        <div className="py-[10px]">
          <KsDivider orientation="horizontal" />
        </div>

        {/* Nav tree */}
        <nav className="flex flex-col">
          {/* Campaign level */}
          <button className="h-11 flex items-center px-2 rounded border-0 cursor-pointer w-full text-left bg-transparent hover:bg-neutral-surfaceHover">
            <KsText variant="titleSm" ellipsis>
              Brand consideration2026
            </KsText>
          </button>

          {/* Ad group level */}
          <button className="h-[42px] flex items-center gap-1 pl-[3px] pr-2 rounded border-0 cursor-pointer w-full text-left bg-transparent hover:bg-neutral-surfaceHover">
            <span className="flex items-center text-neutral-highOnSurface">
              <KsIconChevronRight size={12} color="#121415" />
            </span>
            <KsText variant="labelMd" ellipsis>
              Ad group 20260527112709
            </KsText>
          </button>

          {/* Ad level (selected) */}
          <div className="h-[52px] flex items-center justify-between pl-9 pr-2 rounded bg-primary-surface2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-6 h-6 flex items-center justify-center rounded bg-primary-fillLow shrink-0">
                <KsIconAdNav size={14} color="#017976" />
              </span>
              <KsText variant="labelLg" color="primary" ellipsis>
                Ad name2026-
              </KsText>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <KsIconButton size="xs" variant="text">
                <KsIconCopyContent size={14} />
              </KsIconButton>
              <KsIconButton size="xs" variant="text">
                <KsIconMoreVertical size={14} />
              </KsIconButton>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}
