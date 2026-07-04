import { Skeleton } from "@/components/ui/skeleton";

export default function CertificateSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-44" /><Skeleton className="h-4 w-60 mt-1" />
      <Skeleton className="h-9 w-64" />
      <div className="rounded-xl border">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b px-6 py-4 last:border-0">
            <Skeleton className="h-4 w-40" /><Skeleton className="h-4 w-28" /><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-4" /><Skeleton className="h-4 w-4" />
            <div className="flex gap-1 ml-auto"><Skeleton className="h-8 w-8 rounded" /><Skeleton className="h-8 w-8 rounded" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
