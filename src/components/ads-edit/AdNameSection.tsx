import { KsText, KsInput, KsInlineAlert } from '@byted-keystone/react';

/** Top-level "Ad name" block: inline alert + ad name input. */
export function AdNameSection() {
  return (
    <div className="flex flex-col gap-4 [filter:blur(2px)]">
      <KsInlineAlert
        variant="info"
        title="Set up your ad"
        content="Add an ad name, destination and tracking to finish setting up this ad. Changes are saved automatically and will apply to the ad preview on the right."
        collapsible
      />

      <section className="bg-neutral-surface rounded-xl">
        <div className="px-6 pt-6 pb-2">
          <KsText variant="headlineSm">Ad name</KsText>
        </div>
        <div className="px-6 pb-6 pt-2">
          <KsInput defaultValue="Ad name2026-" className="w-[500px]" />
        </div>
      </section>
    </div>
  );
}
