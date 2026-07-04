import { Skeleton } from "@/components/ui/skeleton";

export default function SkillsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-4 w-48 mt-1" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-[160px]" />
      </div>
      <div className="rounded-xl border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b px-6 py-4 last:border-0">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-2 w-24 rounded-full" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-4" />
            <div className="flex gap-1 ml-auto">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
