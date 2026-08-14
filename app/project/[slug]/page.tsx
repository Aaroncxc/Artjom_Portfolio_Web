import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudyPage } from '@/components/caseStudy/CaseStudyPage';
import { SkyhavenCaseStudyPage } from '@/components/highlights/SkyhavenCaseStudyPage';
import {
  getAdjacentProjects,
  getAllCaseStudySlugs,
  getProjectBySlug,
} from '@/lib/postsServer';
import { stripBoldMarkers } from '@/lib/formatRichText';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: 'Project not found' };
  const description = stripBoldMarkers(project.description).slice(0, 160);
  return {
    title: `${project.title} | Artjom Naninjan`,
    description,
    openGraph: {
      title: project.title,
      description,
      images: project.thumbnail ? [{ url: project.thumbnail }] : undefined,
    },
  };
}

export default async function ProjectCaseStudyRoute({ params }: PageProps) {
  const { current, prev, next } = await getAdjacentProjects(params.slug);
  if (!current) notFound();
  const project = (await getProjectBySlug(params.slug)) ?? current;

  if (params.slug === 'skyhaven') {
    return <SkyhavenCaseStudyPage project={project} prev={prev} next={next} />;
  }

  return <CaseStudyPage project={project} prev={prev} next={next} />;
}
