import Image from 'next/image';
import type { CareerWorkItem } from '@/lib/careerContent';

interface CareerWorkCardProps {
  item: CareerWorkItem;
}

export function CareerWorkCard({ item }: CareerWorkCardProps) {
  const content = (
    <>
      {item.thumb && (
        <div
          className="relative mb-[var(--space-4)] aspect-[16/10] overflow-hidden rounded-[var(--radius)]"
          style={{ background: 'var(--bg-subtle)' }}
        >
          <Image
            src={item.thumb}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <h4
        className="mb-[var(--space-2)] font-medium"
        style={{ fontSize: 'var(--text-base)', color: 'var(--fg)' }}
      >
        {item.title}
      </h4>

      <p
        className="mb-[var(--space-3)]"
        style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-body)', color: 'var(--fg-muted)' }}
      >
        {item.outcome}
      </p>

      {item.metric && (
        <p
          className="career-eyebrow mb-[var(--space-3)] normal-case"
          style={{ letterSpacing: '0.04em', color: 'var(--accent)' }}
        >
          {item.metric}
        </p>
      )}

      <ul className="flex flex-wrap gap-[var(--space-2)]">
        {item.tags.map((tag) => (
          <li key={tag} className="career-chip">
            {tag}
          </li>
        ))}
      </ul>
    </>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noopener noreferrer' : undefined}
        className="career-card block p-[var(--space-5)] no-underline"
        style={{ color: 'inherit' }}
      >
        {content}
      </a>
    );
  }

  return <article className="career-card p-[var(--space-5)]">{content}</article>;
}
