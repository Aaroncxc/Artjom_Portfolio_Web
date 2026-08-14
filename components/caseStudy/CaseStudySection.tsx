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
        <motion.section {...reveal} className="mx-auto max-w-3xl px-4 sm:px-6">
          {textBlock}
        </motion.section>
      );
    }
    return (
      <motion.section
        {...reveal}
        className="mx-auto grid max-w-7xl items-start gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12"
      >
        <div className={clsx(textFirst ? 'lg:order-1' : 'lg:order-2')}>{textBlock}</div>
        <div className={clsx('space-y-4', textFirst ? 'lg:order-2' : 'lg:order-1')}>
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

  if (layout === 'full-media') {
    return (
      <motion.section {...reveal} className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        {textBlock}
        {media.slice(0, 1).map((m) => (
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
