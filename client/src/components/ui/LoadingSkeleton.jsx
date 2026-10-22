// ============================================================
// components/ui/LoadingSkeleton.jsx — Loading Skeleton
// ============================================================

export function SkeletonCard() {
  return (
    <div className="glass-card p-6 space-y-4 animate-pulse">
      <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-3/4" />
      <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-1/2" />
      <div className="space-y-2">
        <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded" />
        <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-5/6" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded-full w-20" />
        <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded-full w-16" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-10 bg-surface-200 dark:bg-surface-700 rounded-lg" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-surface-100 dark:bg-surface-800 rounded-lg" />
      ))}
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card p-6 animate-pulse">
          <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/2 mb-3" />
          <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonReport() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-2/3" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card p-6">
            <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/2 mb-3" />
            <div className="h-12 bg-surface-200 dark:bg-surface-700 rounded w-2/3" />
          </div>
        ))}
      </div>
      <div className="glass-card p-6 space-y-3">
        <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/4" />
        <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded" />
        <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-5/6" />
        <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-4/6" />
      </div>
    </div>
  );
}
