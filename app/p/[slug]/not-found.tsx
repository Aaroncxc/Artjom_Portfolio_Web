import Link from 'next/link';

export default function RoleLandingNotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mk-text-muted">
        Role landing
      </p>
      <h1 className="mt-3 text-2xl font-semibold text-mk-text">Page not found</h1>
      <p className="mt-3 text-sm text-mk-text-secondary">
        This role-specific portfolio slice does not exist yet.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-[color:var(--btn-solid-bg)] px-6 py-3 text-sm font-semibold text-[color:var(--btn-solid-fg)]"
      >
        Back to portfolio
      </Link>
    </main>
  );
}
