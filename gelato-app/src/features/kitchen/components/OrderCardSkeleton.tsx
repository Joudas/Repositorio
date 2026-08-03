export function OrderCardSkeleton() {
  return (
    <div className="space-y-3 rounded-2xl border border-amber-100/60 bg-white p-3.5 shadow-sm animate-pulse">
      {/* Badge tipo + hora */}
      <div className="flex items-start justify-between gap-2">
        <div className="h-7 w-28 rounded-full bg-stone-200" />
        <div className="h-3 w-24 rounded bg-stone-200" />
      </div>

      {/* Items */}
      <div className="space-y-2.5 pt-1">
        {[0, 1].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="h-12 w-12 shrink-0 rounded-lg bg-stone-200" />
            <div className="flex-1 space-y-1.5 pt-0.5">
              <div className="h-3.5 w-2/3 rounded bg-stone-200" />
              <div className="h-2.5 w-1/2 rounded bg-stone-100" />
            </div>
          </div>
        ))}
      </div>

      {/* Botón */}
      <div className="h-12 rounded-xl bg-stone-100" />
    </div>
  )
}
