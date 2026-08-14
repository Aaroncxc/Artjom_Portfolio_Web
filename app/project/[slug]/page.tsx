import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudyPage } from '@/components/caseStudy/CaseStudyPage';
import {
  getAdjacentProjects,
  getProjectBySlug,
  loadPostsServer,
} from '@/lib/postsServer';
import { stripBoldMarkers } from '@/lib/formatRichText';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = await loadPostsServer();
  return posts.map((p) => ({ slug: p.slug }));
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
  // Ensure we use the found project (adjacent uses sorted list)
  const project = (await getProjectBySlug(params.slug)) ?? current;

  return <CaseStudyPage project={project} prev={prev} next={next} />;
}
