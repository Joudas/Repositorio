'use client'

type Props = {
  pendingCount: number
  isError: boolean
  isFetching: boolean
  isSuccess: boolean
}

export function KitchenHeader({
  pendingCount,
  isError,
  isFetching,
  isSuccess,
}: Props) {
  const online = !isError && (isSuccess || isFetching)

  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <h1 className="font-outfit text-2xl font-semibold tracking-tight text-amber-950 md:text-3xl">
          Cocina
        </h1>
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 font-sans text-xs font-semibold text-emerald-800 tabular-nums">
          {pendingCount} en espera
        </span>
      </div>

      <div className="flex items-center gap-2">
        {online ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="font-sans text-xs text-stone-500">En línea</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="font-sans text-xs font-medium text-red-600">
              Reconectando…
            </span>
          </span>
        )}
      </div>
    </header>
  )
}
