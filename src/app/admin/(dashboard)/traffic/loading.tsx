import { SkeletonBlock, SkeletonTable } from "@/components/admin/SkeletonPulse";

export default function TrafficLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <SkeletonBlock className="h-7 w-40" />
        <SkeletonBlock className="h-3 w-56" />
      </div>
      <div className="rounded-2xl border border-white/[0.08] p-6">
        <SkeletonBlock className="h-2 w-32 mb-6" />
        <div className="flex items-end gap-1 h-32">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="flex-1 animate-pulse rounded-t bg-white/[0.06]" style={{ height: `${30 + Math.random() * 70}%` }} />
          ))}
        </div>
      </div>
      <SkeletonTable rows={7} />
    </div>
  );
}
