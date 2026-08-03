export function CashierSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[3fr_2fr] lg:items-start animate-pulse">
      {/* Lista (izquierda) */}
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="space-y-3 rounded-2xl border border-stone-100 bg-white p-3.5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-10 rounded bg-stone-200" />
                <div className="h-7 w-20 rounded-full bg-stone-200" />
              </div>
              <div className="h-3 w-20 rounded bg-stone-200" />
            </div>
            <div className="h-3 w-32 rounded bg-stone-100" />
            <div className="flex items-center justify-between pt-1">
              <div className="h-3 w-16 rounded bg-stone-100" />
              <div className="h-4 w-20 rounded bg-stone-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Panel (derecha, desktop) */}
      <div className="hidden space-y-4 rounded-2xl border border-stone-100 bg-white p-4 shadow-sm lg:block">
        <div className="h-5 w-28 rounded bg-stone-200" />
        <div className="space-y-2">
          <div className="h-3.5 w-3/4 rounded bg-stone-100" />
          <div className="h-3.5 w-2/3 rounded bg-stone-100" />
          <div className="h-3.5 w-1/2 rounded bg-stone-100" />
        </div>
        <div className="h-5 w-24 rounded bg-stone-200" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-11 rounded-xl bg-stone-100" />
          <div className="h-11 rounded-xl bg-stone-100" />
        </div>
        <div className="h-12 rounded-xl bg-emerald-100" />
        <div className="h-11 rounded-xl bg-stone-100" />
      </div>
    </div>
  )
}
