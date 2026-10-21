'use client';

import { V3CaseMedia } from '@/components/V3CaseMedia';
import type { Locale, Media } from '@/lib/v3Content';

export function V3CaseMediaBento({ media, locale, focusIndex }: { media: Media[]; locale: Locale; focusIndex: number }) {
  if (media.length === 0) return null;

  if (media.length === 1) {
    return (
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50/80 p-1 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/40">
        <V3CaseMedia m={media[0]!} locale={locale} />
      </div>
    );
  }

  const hero = media[focusIndex] ?? media[0]!;
  const rest = media.filter((_, i) => i !== focusIndex).slice(0, 2);

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50/80 p-1 shadow-sm sm:col-span-2 dark:border-neutral-700 dark:bg-neutral-900/40">
        <V3CaseMedia m={hero} locale={locale} />
      </div>
      {rest.map((m, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50/60 p-0.5 dark:border-neutral-700 dark:bg-neutral-900/30"
        >
          <V3CaseMedia m={m} locale={locale} />
        </div>
      ))}
    </div>
  );
}
