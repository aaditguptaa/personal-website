/** Small drawn artifacts shared across the atlas. */

export function Diamond({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="10"
      height="10"
      viewBox="0 0 10 10"
      aria-hidden="true"
    >
      <path
        d="M5 0.8 L9.2 5 L5 9.2 L0.8 5 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

/** Registration marks in the four corners of a plate. */
export function CornerTicks({ className = "" }: { className?: string }) {
  const tick = "absolute w-3 h-3 border-line-strong pointer-events-none";
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <span className={`${tick} top-0 left-0 border-t border-l`} />
      <span className={`${tick} top-0 right-0 border-t border-r`} />
      <span className={`${tick} bottom-0 left-0 border-b border-l`} />
      <span className={`${tick} bottom-0 right-0 border-b border-r`} />
    </div>
  );
}

/** Section header: figure number, kicker, editorial title, route rule. */
export function SectionHead({
  no,
  kicker,
  title,
  note,
}: {
  no: string;
  kicker: string;
  title: React.ReactNode;
  note?: string;
}) {
  return (
    <header className="mb-12 md:mb-16">
      <div className="flex items-baseline justify-between gap-4">
        <p className="anno">
          FIG. {no} — {kicker}
        </p>
        {note && <p className="anno hidden sm:block text-right">{note}</p>}
      </div>
      <h2 className="font-display font-semibold text-4xl sm:text-5xl md:text-6xl tracking-tight mt-3 mb-6">
        {title}
      </h2>
      <div className="flex items-center gap-3 text-ink">
        <Diamond className="shrink-0 text-orange" />
        <div className="route-rule flex-1" />
        <Diamond className="shrink-0 text-orange" />
      </div>
    </header>
  );
}
