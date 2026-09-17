import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RoleLandingView } from '@/components/roleLanding/RoleLandingView';
import {
  getAllRoleLandingSlugs,
  getRoleLandingBySlug,
  roleLandingUrl,
} from '@/lib/roleLandings';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllRoleLandingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const landing = getRoleLandingBySlug(params.slug);
  if (!landing) return { title: 'Role landing not found' };

  const title = `${landing.roleTitle} · ${landing.company} | Artjom Naninjan`;
  const description = landing.headline;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: roleLandingUrl(landing.slug),
      type: 'website',
    },
  };
}

export default function RoleLandingPage({ params }: PageProps) {
  const landing = getRoleLandingBySlug(params.slug);
  if (!landing) notFound();

  return <RoleLandingView landing={landing} />;
}
