import Link from 'next/link';
import clsx from 'clsx';
import { GlassPanel } from '@/components/GlassPanel';

export function WorkCard({
  href,
  title,
  roleLine,
  statusLine,
  imageSrc,
  imageAlt,
  tags,
}: {
  href: string;
  title: string;
  roleLine: string;
  statusLine: string;
  imageSrc: string;
  imageAlt: string;
  tags?: string[];
}) {
  return (
    <Link href={href} className="group block h-full">
      <GlassPanel hover padding="none" rounded="2xl" className="flex h-full flex-col overflow-hidden">
        <div className="relative aspect-[16/10] overflow-hidden bg-[color:var(--surface-card)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-mk-text">{title}</h3>
          <p className="mt-1 text-sm text-mk-text-secondary">{roleLine}</p>
          <p className="mt-2 text-sm font-medium text-mk-text">{statusLine}</p>
          {tags?.length ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {tags.map((t) => (
                <li
                  key={t}
                  className="theme-chip rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-mk-text-muted"
                >
                  {t}
                </li>
              ))}
            </ul>
          ) : null}
          <span
            className={clsx(
              'mt-auto inline-flex pt-5 text-sm font-semibold text-accent-cyan',
              'transition-transform group-hover:translate-x-0.5',
            )}
          >
            View case →
          </span>
        </div>
      </GlassPanel>
    </Link>
  );
}
