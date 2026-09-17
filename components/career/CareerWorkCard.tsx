import Image from 'next/image';
import type { CareerWorkItem } from '@/lib/careerContent';

interface CareerWorkCardProps {
  item: CareerWorkItem;
}

export function CareerWorkCard({ item }: CareerWorkCardProps) {
  const imageSrc = item.image ?? item.thumb;
  const wide = item.span === 'wide';

  const body = (
    <>
      {imageSrc && (
        <div className={`career-work-card__media${wide ? ' career-work-card__media--wide' : ''}`}>
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes={
              wide
                ? '(max-width: 768px) 100vw, 72rem'
                : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            }
          />
        </div>
      )}

      <div className="career-work-card__body">
        <h4 className="career-work-card__title">{item.title}</h4>
        <p className="career-body-sm mb-[var(--space-3)]">{item.outcome}</p>

        {item.metric && <p className="career-work-card__metric">{item.metric}</p>}

        <ul className="flex flex-wrap gap-[var(--space-2)]">
          {item.tags.map((tag) => (
            <li key={tag} className="career-chip">
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  const className = `career-work-card career-card${wide ? ' career-work-card--wide' : ''}`;

  if (item.href) {
    return (
      <a
        href={item.href}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noopener noreferrer' : undefined}
        className={`${className} no-underline`}
        style={{ color: 'inherit' }}
      >
        {body}
      </a>
    );
  }

  return <article className={className}>{body}</article>;
}
