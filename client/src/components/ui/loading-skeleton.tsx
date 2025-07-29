import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-card rounded-xl shadow-lg border border-slate-200 dark:border-border overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Skeleton className="w-10 h-10 rounded-full mr-3" />
          <div className="flex-1">
            <Skeleton className="h-4 mb-2 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Skeleton className="h-4 mb-2 w-1/4" />
            <div className="flex gap-2">
              <Skeleton className="flex-1 h-20 rounded-lg" />
              <Skeleton className="flex-1 h-20 rounded-lg" />
            </div>
          </div>
          
          <Skeleton className="h-8 rounded-full" />
          
          <div>
            <Skeleton className="h-4 mb-2 w-1/4" />
            <div className="flex gap-2">
              <Skeleton className="flex-1 h-20 rounded-lg" />
            </div>
          </div>
        </div>
        
        <Skeleton className="h-12 rounded-lg mt-6" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-8 w-12" />
              </div>
              <Skeleton className="w-12 h-12 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-card rounded-lg border-2 border-slate-200 dark:border-border p-3">
            <Skeleton className="h-16 rounded-lg mb-3" />
            <Skeleton className="h-4 mb-1" />
            <Skeleton className="h-3 mb-1 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
