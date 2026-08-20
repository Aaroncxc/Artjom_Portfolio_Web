'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { CaseSection, Project } from '@/lib/types';
import { RichParagraphs } from '@/lib/formatRichText';
import { CaseStudyMedia } from './CaseStudyMedia';

interface CaseStudySectionProps {
  section: CaseSection;
  index: number;
  project: Project;
  onOpenLightbox: (src: string) => void;
}

export function CaseStudySectionBlock({
  section,
  index,
  project,
  onOpenLightbox,
}: CaseStudySectionProps) {
  const layout = section.layout ?? (section.media?.length ? 'gallery' : 'text-left');
  const media = section.media ?? [];
  const hasText = Boolean(section.heading || section.body);

  const reveal = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-8% 0px' },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.03, 0.18) },
  };

  const textBlock = hasText ? (
    <div className="space-y-4">
      {section.heading ? (
        <h2 className="brand-tight text-2xl font-semibold tracking-tight text-mk-text sm:text-3xl">
          {section.heading}
        </h2>
      ) : null}
      {section.body ? (
        <RichParagraphs
          text={section.body}
          className="space-y-4"
          paragraphClassName="text-base leading-relaxed text-mk-text-secondary md:text-lg md:leading-[1.65]"
        />
      ) : null}
    </div>
  ) : null;

  if (layout === 'text-left' || layout === 'text-right') {
    const textFirst = layout === 'text-left';
    if (!media.length) {
      return (
        <motion.section {...reveal} className="mx-auto max-w-7xl px-4 sm:px-6">
          {textBlock}
        </motion.section>
      );
    }

    // Never stack images beside short text — that leaves a tall empty column.
    // Multiple assets: text on top (full content width), images side-by-side.
    if (media.length > 1) {
      return (
        <motion.section {...reveal} className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6">
          {textBlock}
          <div
            className={clsx(
              'grid gap-3 sm:gap-4',
              media.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
            )}
          >
            {media.map((m) => (
              <CaseStudyMedia
                key={m.src}
                media={m}
                onOpenLightbox={onOpenLightbox}
                projectTitle={project.title}
                model3dRotationX={project.model3dRotationX}
                model3dMaterialColor={project.model3dMaterialColor}
                model3dOffsetY={project.model3dOffsetY}
                model3dPoster={project.thumbnail}
                model3dAnimationProgress={project.model3dAnimationProgress}
              />
            ))}
          </div>
        </motion.section>
      );
    }

    return (
      <motion.section
        {...reveal}
        className="mx-auto grid max-w-7xl items-start gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12"
      >
        <div className={clsx('self-start', textFirst ? 'lg:order-1' : 'lg:order-2')}>{textBlock}</div>
        <div className={clsx('self-start', textFirst ? 'lg:order-2' : 'lg:order-1')}>
          <CaseStudyMedia
            media={media[0]}
            align={textFirst ? 'start' : 'end'}
            onOpenLightbox={onOpenLightbox}
            projectTitle={project.title}
            model3dRotationX={project.model3dRotationX}
            model3dMaterialColor={project.model3dMaterialColor}
            model3dOffsetY={project.model3dOffsetY}
            model3dPoster={project.thumbnail}
            model3dAnimationProgress={project.model3dAnimationProgress}
          />
        </div>
      </motion.section>
    );
  }

  if (layout === 'full-media') {
    const first = media[0];
    const centeredSquare = Boolean(first?.portrait || first?.autoplay);
    return (
      <motion.section {...reveal} className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        {textBlock}
        {media.slice(0, 1).map((m) => (
          <div key={m.src} className={clsx(centeredSquare && 'mx-auto max-w-md sm:max-w-lg')}>
            <CaseStudyMedia
              media={m}
              tall={!centeredSquare}
              onOpenLightbox={onOpenLightbox}
              projectTitle={project.title}
              model3dRotationX={project.model3dRotationX}
              model3dMaterialColor={project.model3dMaterialColor}
              model3dOffsetY={project.model3dOffsetY}
              model3dPoster={project.thumbnail}
              model3dAnimationProgress={project.model3dAnimationProgress}
            />
          </div>
        ))}
      </motion.section>
    );
  }

  if (layout === 'live-embed') {
    return (
      <motion.section {...reveal} className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        {textBlock}
        <div className="grid gap-6">
          {media.map((m) => (
            <CaseStudyMedia
              key={m.src}
              media={m}
              tall
              onOpenLightbox={onOpenLightbox}
              projectTitle={project.title}
              model3dRotationX={project.model3dRotationX}
              model3dMaterialColor={project.model3dMaterialColor}
              model3dOffsetY={project.model3dOffsetY}
              model3dPoster={project.thumbnail}
              model3dAnimationProgress={project.model3dAnimationProgress}
            />
          ))}
        </div>
      </motion.section>
    );
  }

  if (layout === 'portrait-split') {
    const primary = media[0];
    const overflow = media.slice(1);
    return (
      <motion.section {...reveal} className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
          <div className="self-start lg:order-1">{textBlock}</div>
          {primary ? (
            <div className="self-start lg:order-2">
              <CaseStudyMedia
                media={{ ...primary, portrait: primary.portrait ?? true }}
                align="start"
                onOpenLightbox={onOpenLightbox}
                projectTitle={project.title}
                model3dRotationX={project.model3dRotationX}
                model3dMaterialColor={project.model3dMaterialColor}
                model3dOffsetY={project.model3dOffsetY}
                model3dPoster={project.thumbnail}
                model3dAnimationProgress={project.model3dAnimationProgress}
              />
            </div>
          ) : null}
        </div>
        {overflow.length ? (
          <div
            className={clsx(
              'grid gap-3 sm:gap-4',
              overflow.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2',
            )}
          >
            {overflow.map((m) => (
              <CaseStudyMedia
                key={m.src}
                media={{ ...m, portrait: m.portrait ?? true }}
                onOpenLightbox={onOpenLightbox}
                projectTitle={project.title}
                model3dRotationX={project.model3dRotationX}
                model3dMaterialColor={project.model3dMaterialColor}
                model3dOffsetY={project.model3dOffsetY}
                model3dPoster={project.thumbnail}
                model3dAnimationProgress={project.model3dAnimationProgress}
              />
            ))}
          </div>
        ) : null}
      </motion.section>
    );
  }

  // gallery
  return (
    <motion.section {...reveal} className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6">
      {textBlock}
      <div
        className={clsx(
          'grid gap-3 sm:gap-4',
          media.length === 1
            ? 'grid-cols-1'
            : media.length === 2
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {media.map((m) => (
          <CaseStudyMedia
            key={m.src}
            media={m}
            onOpenLightbox={onOpenLightbox}
            projectTitle={project.title}
            model3dRotationX={project.model3dRotationX}
            model3dMaterialColor={project.model3dMaterialColor}
            model3dOffsetY={project.model3dOffsetY}
            model3dPoster={project.thumbnail}
            model3dAnimationProgress={project.model3dAnimationProgress}
          />
        ))}
      </div>
    </motion.section>
  );
}
