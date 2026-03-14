import { Skeleton } from "@/components/ui/skeleton";

export const HeroCardSkeleton = () => (
  <div className="flex w-36 flex-col items-center rounded-xl border-2 border-transparent p-4">
    <Skeleton className="aspect-square w-full rounded-lg" />
    <Skeleton className="mt-2 h-5 w-16" />
  </div>
);
