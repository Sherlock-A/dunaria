import { SkeletonBlock, SkeletonTable } from "@/components/admin/SkeletonPulse";

export default function ContactsLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <SkeletonBlock className="h-7 w-40" />
          <SkeletonBlock className="h-3 w-56" />
        </div>
        <SkeletonBlock className="h-8 w-24 rounded-xl" />
      </div>
      <SkeletonBlock className="h-10 w-full rounded-xl" />
      <SkeletonTable rows={10} />
    </div>
  );
}
