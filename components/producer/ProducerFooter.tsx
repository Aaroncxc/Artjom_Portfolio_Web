import Link from 'next/link';
import { CONTACT_MAILTO } from '@/lib/contact';
import { LINKEDIN_URL, REPO_SKYHAVEN, REPO_VFX_STUDIO, SKYHAVEN_LANDING } from '@/lib/producer/constants';

export function ProducerFooter() {
  return (
    <footer className="relative z-10 px-4 pb-12 pt-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="glass-panel p-6 sm:p-8">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="sm:col-span-2">
              <p className="text-sm leading-relaxed text-mk-text-secondary">
                Game Producer portfolio — scope locks, pipelines, and playable systems. English site copy;
                confirmed facts only.
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-mk-text-muted">
                Skyhaven
              </h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <a
                    href={SKYHAVEN_LANDING}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mk-text-secondary hover:text-accent-cyan"
                  >
                    Live landing
                  </a>
                </li>
                <li>
                  <a
                    href={REPO_SKYHAVEN}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mk-text-secondary hover:text-accent-cyan"
                  >
                    Coincraft_Skyhaven
                  </a>
                </li>
                <li>
                  <a
                    href={REPO_VFX_STUDIO}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mk-text-secondary hover:text-accent-cyan"
                  >
                    skyhaven-vfx-studio
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-mk-text-muted">
                Connect
              </h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href={CONTACT_MAILTO} className="text-mk-text-secondary hover:text-accent-cyan">
                    Email
                  </a>
                </li>
                <li>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mk-text-secondary hover:text-accent-cyan"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <Link href="/intro" className="text-mk-text-secondary hover:text-accent-cyan">
                    Full portfolio intro (legacy)
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <p className="mt-8 border-t border-[color:var(--surface-border)] pt-6 text-center text-xs text-mk-text-muted">
            © {new Date().getFullYear()} Artjom Naninjan
          </p>
        </div>
      </div>
    </footer>
  );
}
