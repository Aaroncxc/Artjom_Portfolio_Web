'use client';

import { Project } from '@/lib/types';
import { ProjectSlidePult } from './projectSlide/ProjectSlidePult';
import { ProjectSlideVideo } from './projectSlide/ProjectSlideVideo';
import { ProjectSlideHtml } from './projectSlide/ProjectSlideHtml';
import { ProjectSlideImage } from './projectSlide/ProjectSlideImage';
import { ProjectSlideDefault } from './projectSlide/ProjectSlideDefault';

interface ProjectSlideProps {
  project: Project;
  isActive: boolean;
}

/**
 * Routes to the appropriate slide layout by project type and slug.
 * Kept small to reduce LSP/AI context load; layout logic lives in projectSlide/*.
 */
export function ProjectSlide({ project, isActive }: ProjectSlideProps) {
  if (project.type === 'video' && project.slug === 'pult-vacuum') {
    return <ProjectSlidePult project={project} isActive={isActive} />;
  }
  if (project.type === 'video') {
    return <ProjectSlideVideo project={project} isActive={isActive} />;
  }
  if (project.type === 'html') {
    return <ProjectSlideHtml project={project} isActive={isActive} />;
  }
  if (project.type === 'image') {
    return <ProjectSlideImage project={project} isActive={isActive} />;
  }
  return <ProjectSlideDefault project={project} isActive={isActive} />;
}
