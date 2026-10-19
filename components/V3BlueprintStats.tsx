function CornerPlus({ className }: { className: string }) {
  return (
    <svg
      className={`pointer-events-none absolute h-3 w-3 text-neutral-300 dark:text-neutral-600 ${className}`}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="0.75" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="relative px-4 py-8 sm:px-5 sm:py-10 md:px-6 lg:px-8 xl:px-10">
      <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
      <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
      <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
      <CornerPlus className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
      <div className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-4xl">{value}</div>
      <div className="mt-2 max-w-xs text-xs leading-snug text-neutral-500 dark:text-neutral-400 sm:max-w-sm md:max-w-none">
        {label}
      </div>
    </div>
  );
}

export function V3BlueprintStats({ stats, className = 'mt-12' }: { stats: { value: string; label: string }[]; className?: string }) {
  return (
    <div className={`grid w-full grid-cols-2 md:grid-cols-4 ${className}`}>
      {stats.map((s) => (
        <StatCell key={s.label} value={s.value} label={s.label} />
      ))}
    </div>
  );
}
