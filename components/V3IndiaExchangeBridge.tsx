'use client';

import { V3BlueprintCorners } from '@/components/V3BlueprintCorners';
import {
  EXCHANGE_ENTITY_LABELS,
  INDIA_EXCHANGE_COPY,
  INDIA_EXCHANGE_ID,
  exchangeList,
  exchangeT,
} from '@/lib/v3IndiaExchange';
import { V3_PAGE } from '@/lib/v3Layout';
import type { Locale } from '@/lib/v3Content';

function EntityChip({ label, todo }: { label: string; todo?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-neutral-200 bg-white/90 px-4 py-3 dark:border-neutral-600 dark:bg-neutral-900/60">
      <span className="text-center text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">{label}</span>
      {todo && (
        <span className="text-center font-mono text-[9px] uppercase leading-snug text-amber-700 dark:text-amber-400">{todo}</span>
      )}
    </div>
  );
}

function PartnerLogo() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-neutral-200 bg-white/90 px-4 py-3 dark:border-neutral-600 dark:bg-neutral-900/60">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/client-logos/hs-offenburg.svg"
        alt="Hochschule Offenburg"
        className="max-h-10 w-auto max-w-[140px] object-contain"
        draggable={false}
      />
      <span className="text-center text-[11px] font-semibold text-neutral-800 dark:text-neutral-200">Hochschule Offenburg</span>
    </div>
  );
}

type Props = { locale: Locale };

export function V3IndiaExchangeBridge({ locale }: Props) {
  const c = INDIA_EXCHANGE_COPY;
  const arc = exchangeList(locale, c.arc);
  const bullets = exchangeList(locale, c.bullets);
  return (
    <section
      id={INDIA_EXCHANGE_ID}
      className={`scroll-mt-28 border-t border-neutral-200 py-10 dark:border-neutral-800 md:py-12 ${V3_PAGE}`}
      aria-labelledby={`${INDIA_EXCHANGE_ID}-title`}
    >
      <article className="relative overflow-hidden rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/40 p-6 dark:border-indigo-900/50 dark:from-indigo-950/30 dark:via-neutral-950 dark:to-violet-950/20 md:p-10">
        <V3BlueprintCorners />

        <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">{exchangeT(locale, c.kicker)}</p>
        <h3 id={`${INDIA_EXCHANGE_ID}-title`} className="mt-2 text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-2xl">
          {exchangeT(locale, c.title)}
        </h3>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{exchangeT(locale, c.summary)}</p>

        <div className="mt-6 flex flex-wrap items-stretch justify-center gap-2 font-mono text-[10px] uppercase tracking-wider text-neutral-400">
          {arc.map((step, i) => (
            <span key={step} className="flex items-center gap-2">
              {i > 0 && <span className="text-neutral-300 dark:text-neutral-600">→</span>}
              <span className="max-w-[11rem] rounded border border-neutral-200 bg-white/80 px-2 py-1 text-center normal-case text-[11px] font-medium leading-snug text-neutral-700 dark:border-neutral-600 dark:bg-neutral-900/50 dark:text-neutral-300">
                {step}
              </span>
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <EntityChip label={exchangeT(locale, EXCHANGE_ENTITY_LABELS.india)} />
          <PartnerLogo />
          <EntityChip label={exchangeT(locale, EXCHANGE_ENTITY_LABELS.germany)} />
        </div>
        <p className="mt-3 text-center text-xs text-neutral-600 dark:text-neutral-400">{exchangeT(locale, c.partnerOffenburgRole)}</p>

        <ul className="mt-8 max-w-[65ch] list-disc space-y-2 pl-4 text-sm text-neutral-700 dark:text-neutral-300">
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <p className="rounded-lg border border-dashed border-amber-400/70 bg-amber-50/40 px-3 py-3 font-mono text-[11px] uppercase leading-snug text-amber-800 dark:border-amber-600/50 dark:bg-amber-950/20 dark:text-amber-300">
            {exchangeT(locale, c.roleTodo)}
          </p>
          <div className="flex aspect-[16/10] items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50/80 dark:border-neutral-600 dark:bg-neutral-900/40">
            <p className="max-w-xs px-4 text-center font-mono text-[11px] uppercase leading-snug text-neutral-500 dark:text-neutral-400">
              {exchangeT(locale, c.photoTodo)}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
