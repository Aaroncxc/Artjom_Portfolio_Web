type Variant = 'heygen' | 'ai-department' | 'virtual-production';

const STEPS: Record<Variant, { en: string[]; de: string[] }> = {
  heygen: {
    en: ['Editorial script', 'HeyGen avatar', 'Virtual Production', 'In course'],
    de: ['Redaktion & Skript', 'HeyGen-Avatar', 'Virtual Production', 'Im Kurs'],
  },
  'ai-department': {
    en: ['AI tooling', 'Team training', 'Editorial control', 'AI in production'],
    de: ['KI-Tools', 'Team-Training', 'Redaktion in-house', 'KI in Produktion'],
  },
  'virtual-production': {
    en: ['3D / Unreal scene', 'Virtual Production', 'Post (AE)', 'Learning clip'],
    de: ['3D / Unreal-Szene', 'Virtual Production', 'Post (AE)', 'Lernclip'],
  },
};

function StepCircle({ n }: { n: number }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-neutral-900 bg-white text-xs font-semibold text-neutral-900 md:h-10 md:w-10">
      {n}
    </div>
  );
}

function ConnectorHorizontal() {
  return <div className="h-px min-w-[0.75rem] flex-1 bg-neutral-300" aria-hidden />;
}

export function V3WorkflowDiagram({ variant, locale }: { variant: Variant; locale: 'en' | 'de' }) {
  const steps = STEPS[variant][locale];

  return (
    <div
      className="w-full rounded-lg border border-neutral-200 bg-gradient-to-br from-neutral-50 to-neutral-100 px-4 py-5 sm:px-6 sm:py-6"
      aria-hidden
    >
      {/* Desktop: equal-width columns, circle row + labels below */}
      <div className="hidden md:block">
        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
          {steps.map((label, i) => (
            <div key={`${label}-col`} className="flex min-w-0 flex-col items-center px-1">
              <div className="flex w-full items-center">
                {i > 0 ? <ConnectorHorizontal /> : <div className="flex-1" aria-hidden />}
                <StepCircle n={i + 1} />
                {i < steps.length - 1 ? <ConnectorHorizontal /> : <div className="flex-1" aria-hidden />}
              </div>
              <p className="mt-3 w-full text-center text-xs font-medium leading-snug text-neutral-700">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical list */}
      <ol className="space-y-0 md:hidden">
        {steps.map((label, i) => (
          <li key={label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <StepCircle n={i + 1} />
              {i < steps.length - 1 && <div className="my-1 w-px flex-1 min-h-[1.25rem] bg-neutral-300" aria-hidden />}
            </div>
            <p className="pb-4 pt-1.5 text-sm font-medium leading-snug text-neutral-800">{label}</p>
          </li>
        ))}
      </ol>

      {variant === 'heygen' && (
        <p className="mt-4 text-center text-xs font-medium text-neutral-500">
          {locale === 'de' ? 'Workflow · Sprecher → KI-Avatar' : 'Workflow · narrator → AI avatar'}
        </p>
      )}
    </div>
  );
}
