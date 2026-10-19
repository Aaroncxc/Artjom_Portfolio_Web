'use client';

import { V3WorkflowDiagram } from '@/components/V3WorkflowDiagram';
import type { Locale, Media } from '@/lib/v3Content';

export function V3CaseMedia({ m, locale }: { m: Media; locale: Locale }) {
  if (m.kind === 'workflow') return <V3WorkflowDiagram variant={m.variant} locale={locale} />;
  if (m.kind === 'video')
    return (
      <video
        className="aspect-video w-full rounded-lg border border-neutral-200 object-cover dark:border-neutral-700"
        src={m.src}
        poster={m.poster}
        muted
        loop
        playsInline
        autoPlay
        aria-label={m.alt}
      />
    );
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      className="aspect-video w-full rounded-lg border border-neutral-200 object-cover dark:border-neutral-700"
      src={m.src}
      alt={m.alt}
      loading="lazy"
    />
  );
}
