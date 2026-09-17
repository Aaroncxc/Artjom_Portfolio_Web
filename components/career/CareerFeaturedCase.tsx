import Image from 'next/image';
import Link from 'next/link';
import { CAREER_FEATURED_CASE } from '@/lib/careerContent';

export function CareerFeaturedCase() {
  return (
    <section className="career-section pt-0">
      <div className="career-container">
        <article className="career-featured-case">
          <div className="career-featured-case__media-grid">
            {CAREER_FEATURED_CASE.images.map((img) => (
              <figure key={img.src} className="career-featured-case__figure">
                <div className="career-featured-case__image-wrap">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
                <figcaption className="career-featured-case__caption">{img.caption}</figcaption>
              </figure>
            ))}
          </div>

          <div className="career-featured-case__body">
            <p className="career-eyebrow mb-[var(--space-2)]">{CAREER_FEATURED_CASE.eyebrow}</p>
            <h2 className="career-heading mb-[var(--space-3)]">{CAREER_FEATURED_CASE.title}</h2>
            <p className="career-body mb-[var(--space-4)] max-w-2xl">{CAREER_FEATURED_CASE.outcome}</p>

            <ul className="mb-[var(--space-4)] flex flex-wrap gap-[var(--space-2)]">
              {CAREER_FEATURED_CASE.metrics.map((m) => (
                <li key={m} className="career-chip">
                  {m}
                </li>
              ))}
            </ul>

            <ul className="mb-[var(--space-6)] flex flex-wrap gap-[var(--space-2)]">
              {CAREER_FEATURED_CASE.tags.map((tag) => (
                <li key={tag} className="career-chip career-chip--accent">
                  {tag}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-[var(--space-3)]">
              <Link href={CAREER_FEATURED_CASE.href} className="career-btn career-btn-primary">
                Case study
              </Link>
              <a
                href={CAREER_FEATURED_CASE.liveHref}
                target="_blank"
                rel="noopener noreferrer"
                className="career-btn career-btn-secondary"
              >
                Open live dashboard
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
