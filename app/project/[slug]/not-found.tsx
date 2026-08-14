import Link from 'next/link';

export default function ProjectNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold text-mk-text">Project not found</h1>
      <p className="text-mk-text-secondary">This case study does not exist or was moved.</p>
      <Link href="/?skipHero=1#projects" className="text-sm font-semibold text-system-blue">
        ← Back to projects
      </Link>
    </main>
  );
}
