export function OrderCardSkeleton() {
  return (
    <div className="space-y-3 rounded-2xl border border-amber-100/60 bg-white p-4 shadow-sm animate-pulse">
      {/* Badge tipo + hora */}
      <div className="flex items-start justify-between gap-2">
        <div className="h-6 w-28 rounded-full bg-stone-200" />
        <div className="h-3 w-24 rounded bg-stone-200" />
      </div>

      {/* Items */}
      <div className="space-y-2 pt-1">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex items-baseline justify-between gap-3"
          >
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-2/3 rounded bg-stone-200" />
              <div className="h-2.5 w-1/2 rounded bg-stone-100" />
            </div>
            <div className="h-3.5 w-12 rounded bg-stone-200" />
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between border-t border-amber-100/60 pt-3">
        <div className="h-3 w-10 rounded bg-stone-200" />
        <div className="h-4 w-16 rounded bg-stone-200" />
      </div>

      {/* Botón */}
      <div className="h-12 rounded-xl bg-stone-100" />
    </div>
  )
}
