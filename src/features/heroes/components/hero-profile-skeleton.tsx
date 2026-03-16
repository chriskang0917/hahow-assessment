import { Skeleton } from "@/components/ui/skeleton";

export const HeroProfileSkeleton = () => (
  <div className="mt-8 rounded-xl border p-6">
    <div className="flex gap-8 justify-between flex-wrap">
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-6 w-8" />
            <Skeleton className="h-9 w-9" />
          </div>
        ))}
      </div>
      <div className="flex flex-col items-start justify-end space-y-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-30" />
      </div>
    </div>
  </div>
);
