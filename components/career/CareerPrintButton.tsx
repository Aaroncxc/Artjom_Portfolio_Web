'use client';

export function CareerPrintButton() {
  return (
    <button type="button" className="career-one-pager__print no-print" onClick={() => window.print()}>
      Print
    </button>
  );
}
