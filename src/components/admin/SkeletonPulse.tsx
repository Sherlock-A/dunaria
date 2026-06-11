export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-white/[0.06] ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 space-y-3">
      <SkeletonBlock className="h-2.5 w-24" />
      <SkeletonBlock className="h-10 w-20" />
      <SkeletonBlock className="h-2 w-16" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
      <div className="border-b border-white/[0.08] px-4 py-3 flex gap-6">
        <SkeletonBlock className="h-2 w-32" />
        <SkeletonBlock className="h-2 w-16" />
        <SkeletonBlock className="h-2 w-16" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b border-white/[0.04] last:border-0 px-4 py-3 flex gap-6 animate-pulse">
          <SkeletonBlock className="h-2 w-48" />
          <SkeletonBlock className="h-2 w-8" />
          <SkeletonBlock className="h-2 w-16" />
        </div>
      ))}
    </div>
  );
}
