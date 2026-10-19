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

export function V3WorkflowDiagram({ variant, locale }: { variant: Variant; locale: 'en' | 'de' }) {
  const steps = STEPS[variant][locale];
  return (
    <div
      className="aspect-video w-full rounded-lg border border-neutral-200 bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6"
      aria-hidden
    >
      <div className="flex h-full flex-col justify-center">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-0">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className="flex min-w-[4.5rem] max-w-[7rem] flex-col items-center sm:min-w-[5.5rem]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-neutral-900 bg-white text-xs font-semibold text-neutral-900 sm:h-10 sm:w-10">
                  {i + 1}
                </div>
                <p className="mt-2 text-center text-[10px] font-medium leading-tight text-neutral-700 sm:text-xs">{label}</p>
              </div>
              {i < steps.length - 1 && (
                <svg className="mx-1 hidden h-2 w-6 shrink-0 text-neutral-400 sm:mx-2 sm:block sm:w-8" viewBox="0 0 32 8" fill="none" aria-hidden>
                  <path d="M0 4h24M24 4l-4-4M24 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          ))}
        </div>
        {variant === 'heygen' && (
          <p className="mt-4 text-center text-xs font-medium text-neutral-500">
            {locale === 'de' ? 'Workflow · Narrator → KI-Avatar' : 'Workflow · narrator → AI avatar'}
          </p>
        )}
      </div>
    </div>
  );
}
