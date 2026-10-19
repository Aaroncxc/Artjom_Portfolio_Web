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
    <div className="relative px-5 py-8 sm:px-6 sm:py-10 md:px-8">
      <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
      <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
      <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
      <CornerPlus className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
      <div className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-4xl">{value}</div>
      <div className="mt-2 max-w-[14rem] text-xs leading-snug text-neutral-500 dark:text-neutral-400 md:max-w-none">{label}</div>
    </div>
  );
}

export function V3BlueprintStats({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <div className="mt-12 grid grid-cols-2 md:grid-cols-4">
      {stats.map((s) => (
        <StatCell key={s.label} value={s.value} label={s.label} />
      ))}
    </div>
  );
}
