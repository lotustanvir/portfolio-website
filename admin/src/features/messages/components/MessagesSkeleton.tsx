import { Skeleton } from "@/components/ui/skeleton";

export default function MessagesSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-36" /><Skeleton className="h-4 w-52 mt-1" />
      <div className="flex gap-2"><Skeleton className="h-9 w-64" /><Skeleton className="h-9 w-[130px]" /><Skeleton className="h-9 w-[130px]" /></div>
      <div className="rounded-xl border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b px-6 py-4 last:border-0">
            <Skeleton className="h-4 w-4" /><Skeleton className="h-4 w-28" /><Skeleton className="h-4 w-48" /><Skeleton className="h-5 w-16 rounded-full" /><Skeleton className="h-4 w-24" />
            <div className="flex gap-1 ml-auto"><Skeleton className="h-8 w-8 rounded" /><Skeleton className="h-8 w-8 rounded" /><Skeleton className="h-8 w-8 rounded" /><Skeleton className="h-8 w-8 rounded" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
