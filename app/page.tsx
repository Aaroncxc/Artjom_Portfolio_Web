import { CASES, CONTACT, FEATURED, HERO, MORE, STATS, STRENGTHS, type CaseStudy, type Media } from '@/lib/v3Content';

function MediaItem({ m }: { m: Media }) {
  if (m.kind === 'placeholder')
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-amber-500/70 bg-amber-50 p-4 text-center text-xs font-medium text-amber-700">
        PLATZHALTER · {m.label}
      </div>
    );
  if (m.kind === 'video')
    return (
      <video className="aspect-video w-full rounded-lg border border-neutral-200 object-cover" src={m.src} poster={m.poster} muted loop playsInline autoPlay aria-label={m.alt} />
    );
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="aspect-video w-full rounded-lg border border-neutral-200 object-cover" src={m.src} alt={m.alt} loading="lazy" />;
}

function Case({ c, big }: { c: CaseStudy; big?: boolean }) {
  return (
    <article id={c.id} className="grid gap-8 border-t border-neutral-200 py-14 md:grid-cols-[1fr_1.2fr]">
      <div>
        <p className="font-mono text-xs text-neutral-400">{c.index} · {c.kicker}</p>
        <h3 className={`mt-3 font-semibold tracking-tight text-neutral-900 ${big ? 'text-3xl' : 'text-2xl'}`}>{c.title}</h3>
        <p className="mt-4 text-neutral-600">{c.summary}</p>
        <dl className="mt-6 space-y-4 text-sm">
          <div><dt className="font-mono text-xs uppercase text-neutral-400">What I did</dt>
            <dd><ul className="mt-1 list-disc space-y-1 pl-4 text-neutral-700">{c.action.map((a) => <li key={a}>{a}</li>)}</ul></dd></div>
          <div><dt className="font-mono text-xs uppercase text-neutral-400">Result</dt>
            <dd><ul className="mt-1 list-disc space-y-1 pl-4 text-neutral-900">{c.result.map((a) => <li key={a}>{a}</li>)}</ul></dd></div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-2">{c.tools.map((t) => <span key={t} className="rounded border border-neutral-200 px-2 py-0.5 font-mono text-xs text-neutral-500">{t}</span>)}</div>
        {c.links && <div className="mt-5 flex gap-4 text-sm">{c.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="text-neutral-900 underline underline-offset-4">{l.label} ↗</a>)}</div>}
        {c.note && <p className="mt-4 text-xs text-neutral-400">{c.note}</p>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">{c.media.map((m, i) => <div key={i} className={i === 0 ? 'sm:col-span-2' : ''}><MediaItem m={m} /></div>)}</div>
    </article>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-white font-sans text-neutral-900 antialiased">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-sm">
          <span className="font-semibold">{CONTACT.name}</span>
          <div className="flex gap-6 text-neutral-500">
            <a href="#work">Work</a><a href="#cases">Case studies</a><a href="#about">About</a>
            <a href="#contact" className="text-neutral-900">Contact</a>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-24">
        <p className="font-mono text-xs uppercase tracking-wider text-neutral-400">{HERO.eyebrow}</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight md:text-6xl">{HERO.headline}</h1>
        <p className="mt-6 max-w-2xl text-lg text-neutral-600">{HERO.sub}</p>
        <div className="mt-6 flex flex-wrap gap-2">{HERO.roles.map((r) => <span key={r} className="rounded-full border border-neutral-300 px-3 py-1 text-sm">{r}</span>)}</div>
        <div className="mt-8 flex gap-3 text-sm">
          <a href="#contact" className="rounded-md bg-neutral-900 px-4 py-2 text-white">Get in touch</a>
          <a href="#work" className="rounded-md border border-neutral-300 px-4 py-2">See the work</a>
        </div>
        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200 md:grid-cols-4">
          {STATS.map((s) => <div key={s.label} className="bg-white p-5"><div className="text-2xl font-semibold">{s.value}</div><div className="mt-1 text-xs text-neutral-500">{s.label}</div></div>)}
        </div>
      </section>

      <section id="work" className="mx-auto max-w-6xl px-6">
        <h2 className="font-mono text-xs uppercase tracking-wider text-neutral-400">Selected work</h2>
        {FEATURED.map((c) => <Case key={c.id} c={c} big />)}
      </section>

      <section id="cases" className="mx-auto max-w-6xl px-6 pt-10">
        <h2 className="font-mono text-xs uppercase tracking-wider text-neutral-400">Case studies · production leadership in e-learning</h2>
        {CASES.map((c) => <Case key={c.id} c={c} />)}
      </section>

      <section id="about" className="mx-auto grid max-w-6xl gap-10 border-t border-neutral-200 px-6 py-16 md:grid-cols-2">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-wider text-neutral-400">How I work</h2>
          <ul className="mt-4 space-y-3 text-neutral-700">{STRENGTHS.map((s) => <li key={s}>— {s}</li>)}</ul>
        </div>
        <div>
          <h2 className="font-mono text-xs uppercase tracking-wider text-neutral-400">Background</h2>
          <ul className="mt-4 space-y-2 text-neutral-700">
            <li>{CONTACT.education}</li><li>{CONTACT.cert}</li><li>{CONTACT.languages}</li>
            <li>Tools: Unreal Engine, Blender, Archicad, Adobe (AE, Premiere), Cursor</li>
          </ul>
          <h2 className="mt-8 font-mono text-xs uppercase tracking-wider text-neutral-400">Also building</h2>
          <ul className="mt-4 space-y-2 text-sm text-neutral-600">{MORE.map((m) => <li key={m.title}><span className="font-medium text-neutral-900">{m.href ? <a href={m.href} className="underline underline-offset-4" target="_blank" rel="noreferrer">{m.title}</a> : m.title}</span> — {m.text}</li>)}</ul>
        </div>
      </section>

      <footer id="contact" className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-semibold tracking-tight">Let’s build good products for learners.</h2>
          <div className="mt-6 flex flex-wrap gap-6 text-neutral-700">
            <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <span>{CONTACT.location}</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
