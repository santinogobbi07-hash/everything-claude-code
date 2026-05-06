export function CardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[3/4]" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="flex gap-2">
          <div className="skeleton h-5 w-16" />
          <div className="skeleton h-5 w-16" />
        </div>
      </div>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="card flex items-center gap-4 p-4">
      <div className="skeleton w-10 h-10 rounded-full" />
      <div className="skeleton w-16 h-20 rounded-md" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton h-3 w-1/4" />
      </div>
      <div className="skeleton h-8 w-16" />
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="skeleton h-3 w-1/3" />
      <div className="skeleton h-8 w-1/2" />
    </div>
  );
}
