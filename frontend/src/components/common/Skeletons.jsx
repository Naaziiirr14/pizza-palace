export function PizzaCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-44 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-2/3" />
        <div className="flex justify-between items-center pt-1">
          <div className="skeleton h-6 w-16" />
          <div className="skeleton h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex justify-between">
        <div className="skeleton h-5 w-28" />
        <div className="skeleton h-5 w-20 rounded-full" />
      </div>
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-1/2" />
    </div>
  );
}
