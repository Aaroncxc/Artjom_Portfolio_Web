type Variant = 'heygen' | 'ai-department' | 'virtual-production';

type WorkflowStep = {
  titleEn: string;
  titleDe: string;
  chips?: string[];
};

type PipelineDef = {
  steps: WorkflowStep[];
  footnote?: { en: string; de: string };
};

const PIPELINES: Record<Variant, PipelineDef> = {
  heygen: {
    steps: [
      { titleEn: 'Editorial script', titleDe: 'Redaktion & Skript' },
      { titleEn: 'HeyGen avatar', titleDe: 'HeyGen-Avatar', chips: ['HeyGen'] },
      { titleEn: 'Virtual Production', titleDe: 'Virtual Production' },
      { titleEn: 'In course', titleDe: 'Im Kurs' },
    ],
  },
  'ai-department': {
    steps: [
      { titleEn: 'Script & editorial (in-house)', titleDe: 'Skript & Redaktion (in-house)' },
      { titleEn: 'Voice', titleDe: 'Stimme', chips: ['ElevenLabs'] },
      { titleEn: 'Avatar / presenter', titleDe: 'Avatar / Presenter', chips: ['HeyGen', 'Synthesia'] },
      { titleEn: 'Editorial review (in-house)', titleDe: 'Review durch die Redaktion (in-house)' },
      { titleEn: 'Finished course video', titleDe: 'Fertiges Kursvideo' },
    ],
    footnote: {
      en: 'Team trained in AI · internal tools built with Cursor',
      de: 'Team in KI geschult · interne Tools mit Cursor gebaut',
    },
  },
  'virtual-production': {
    steps: [
      { titleEn: '3D / Unreal scene', titleDe: '3D / Unreal-Szene' },
      { titleEn: 'Virtual Production', titleDe: 'Virtual Production' },
      { titleEn: 'Post (AE)', titleDe: 'Post (AE)' },
      { titleEn: 'Learning clip', titleDe: 'Lernclip' },
    ],
  },
};

function StepCircle({ n }: { n: number }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-neutral-900 bg-white text-xs font-semibold text-neutral-900 md:h-10 md:w-10">
      {n}
    </div>
  );
}

function ToolChip({ label }: { label: string }) {
  return (
    <span className="inline-block rounded border border-neutral-300 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-neutral-700 md:text-[11px]">
      {label}
    </span>
  );
}

function StepLabel({ title, chips }: { title: string; chips?: string[] }) {
  return (
    <div className="mt-3 flex w-full min-w-0 flex-col items-center gap-1.5 px-0.5">
      <p className="w-full text-center text-[10px] font-medium leading-snug text-neutral-700 md:text-xs">{title}</p>
      {chips && chips.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1">
          {chips.map((c) => (
            <ToolChip key={c} label={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function ConnectorHorizontal() {
  return <div className="h-px min-w-[0.35rem] flex-1 bg-neutral-300" aria-hidden />;
}

export function V3WorkflowDiagram({ variant, locale }: { variant: Variant; locale: 'en' | 'de' }) {
  const { steps, footnote } = PIPELINES[variant];
  const isDe = locale === 'de';

  return (
    <div
      className="w-full rounded-lg border border-neutral-200 bg-gradient-to-br from-neutral-50 to-neutral-100 px-3 py-5 sm:px-5 sm:py-6"
      aria-hidden
    >
      <div className="hidden md:block">
        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
          {steps.map((step, i) => {
            const title = isDe ? step.titleDe : step.titleEn;
            return (
              <div key={`${variant}-${i}`} className="flex min-w-0 flex-col items-center">
                <div className="flex w-full items-center">
                  {i > 0 ? <ConnectorHorizontal /> : <div className="flex-1" aria-hidden />}
                  <StepCircle n={i + 1} />
                  {i < steps.length - 1 ? <ConnectorHorizontal /> : <div className="flex-1" aria-hidden />}
                </div>
                <StepLabel title={title} chips={step.chips} />
              </div>
            );
          })}
        </div>
      </div>

      <ol className="space-y-0 md:hidden">
        {steps.map((step, i) => {
          const title = isDe ? step.titleDe : step.titleEn;
          return (
            <li key={`${variant}-m-${i}`} className="flex gap-3">
              <div className="flex flex-col items-center">
                <StepCircle n={i + 1} />
                {i < steps.length - 1 && <div className="my-1 min-h-[1.25rem] w-px flex-1 bg-neutral-300" aria-hidden />}
              </div>
              <div className="pb-4 pt-1">
                <p className="text-sm font-medium leading-snug text-neutral-800">{title}</p>
                {step.chips && step.chips.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {step.chips.map((c) => (
                      <ToolChip key={c} label={c} />
                    ))}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {footnote && (
        <p className="mt-4 border-t border-neutral-200/80 pt-3 text-center text-[11px] font-medium text-neutral-500">
          {isDe ? footnote.de : footnote.en}
        </p>
      )}

      {variant === 'heygen' && !footnote && (
        <p className="mt-4 text-center text-xs font-medium text-neutral-500">
          {isDe ? 'Workflow · Sprecher → KI-Avatar' : 'Workflow · narrator → AI avatar'}
        </p>
      )}
    </div>
  );
}
