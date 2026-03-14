import { Skeleton } from "@/components/ui/skeleton";

export const HeroProfileSkeleton = () => (
  <div className="mt-8 space-y-6 rounded-xl border p-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-6 w-8" />
        <Skeleton className="h-9 w-9" />
      </div>
    ))}
    <div className="flex items-center justify-between pt-4">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-10 w-20" />
    </div>
  </div>
);
