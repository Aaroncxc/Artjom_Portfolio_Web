'use client';

import {
  AFRICA_MARKET_COURSE_FLOW,
  AFRICA_SOLAR_PARTNERS,
  type AfricaPartnerLogo,
} from '@/lib/v3AfricaPartners';
import type { Locale } from '@/lib/v3Content';

function PartnerLogo({ partner }: { partner: AfricaPartnerLogo }) {
  if (partner.src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={partner.src}
        alt={partner.name}
        draggable={false}
        className={`max-h-10 w-auto max-w-[140px] object-contain md:max-h-12 ${partner.invertInDark ? 'dark:brightness-0 dark:invert' : ''}`}
      />
    );
  }
  return (
    <div
      className="flex min-h-[2.5rem] items-center justify-center rounded-md border border-dashed border-amber-400/70 bg-amber-50/50 px-3 py-2 dark:border-amber-600/60 dark:bg-amber-950/20"
      title="TODO: Fraunhofer logo asset missing in repo"
    >
      <span className="font-mono text-[10px] uppercase tracking-wider text-amber-800 dark:text-amber-300">
        TODO · {partner.name}
      </span>
    </div>
  );
}

export function V3CasePartnerPanel({ locale }: { locale: Locale }) {
  const lang = locale === 'de' ? 'de' : 'en';

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        {AFRICA_MARKET_COURSE_FLOW.map((step, i) => (
          <span key={step.label.en} className="flex items-center gap-2">
            {i > 0 && <span className="text-neutral-300 dark:text-neutral-600">→</span>}
            <span className="rounded border border-neutral-200 bg-white px-2 py-0.5 text-neutral-600 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
              {step.label[lang]}
            </span>
          </span>
        ))}
      </div>
      <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
        {AFRICA_MARKET_COURSE_FLOW.map((s) => s.detail[lang]).join(' ')}
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {AFRICA_SOLAR_PARTNERS.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white/90 p-4 shadow-sm dark:border-neutral-600 dark:bg-neutral-900/60"
          >
            <div className="flex min-h-[3rem] items-center justify-center">
              <PartnerLogo partner={p} />
            </div>
            <p className="text-center text-[11px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              {p.name}
            </p>
            <p className="text-center text-xs leading-snug text-neutral-600 dark:text-neutral-400">{p.role[lang]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
