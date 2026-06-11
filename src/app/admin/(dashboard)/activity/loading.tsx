import { SkeletonBlock, SkeletonTable } from "@/components/admin/SkeletonPulse";

export default function ActivityLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <SkeletonBlock className="h-7 w-40" />
        <SkeletonBlock className="h-3 w-56" />
      </div>
      <SkeletonTable rows={10} />
    </div>
  );
}
