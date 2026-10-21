export function V3BlueprintCorners({ className = '' }: { className?: string }) {
  const plus =
    'pointer-events-none absolute h-3 w-3 text-neutral-300 dark:text-neutral-600 [&>svg]:h-full [&>svg]:w-full';
  const mark = (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  );
  return (
    <>
      <span className={`${plus} left-0 top-0 -translate-x-1/2 -translate-y-1/2 ${className}`}>{mark}</span>
      <span className={`${plus} right-0 top-0 translate-x-1/2 -translate-y-1/2 ${className}`}>{mark}</span>
      <span className={`${plus} bottom-0 left-0 -translate-x-1/2 translate-y-1/2 ${className}`}>{mark}</span>
      <span className={`${plus} bottom-0 right-0 translate-x-1/2 translate-y-1/2 ${className}`}>{mark}</span>
    </>
  );
}
