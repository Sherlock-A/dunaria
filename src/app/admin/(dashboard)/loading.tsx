import { SkeletonBlock, SkeletonCard } from "@/components/admin/SkeletonPulse";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <SkeletonBlock className="h-7 w-40" />
        <SkeletonBlock className="h-3 w-56" />
      </div>
      <div>
        <SkeletonBlock className="h-2 w-24 mb-3" />
        <div className="grid grid-cols-3 gap-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
      <div>
        <SkeletonBlock className="h-2 w-24 mb-3" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}
