'use client'

import { Bike, Clock, Table2, TimerOff, UserRound } from 'lucide-react'
import type { CashierOrder } from '../types'

type Props = {
  orders: CashierOrder[]
  selectedId: string | null
  onSelect: (order: CashierOrder) => void
}

// Mismo umbral que la cocina (OrderCard)
const DELAY_THRESHOLD_MINUTES = 15

function elapsedMinutes(iso: string): number {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 0
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 60_000))
}

// Misma lógica de formato que OrderCard (cocina): hace unos segundos / hace N min / hace N h
function formatRelativeTime(iso: string): string {
  const minutes = elapsedMinutes(iso)
  if (minutes < 1) return 'hace unos segundos'
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours} h`
  return `hace ${Math.floor(hours / 24)} d`
}

function OrderTypeBadge({ order }: { order: CashierOrder }) {
  if (order.order_type === 'TAKEAWAY') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-400 px-2.5 py-1 text-[11px] font-bold text-amber-950">
        <Bike className="h-3.5 w-3.5" aria-hidden />
        Para Llevar
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500 px-2.5 py-1 text-[11px] font-bold text-white">
      <Table2 className="h-3.5 w-3.5" aria-hidden />
      {order.table_number !== null ? `Mesa ${order.table_number}` : 'En Mesa'}
    </span>
  )
}

export function ActiveOrdersList({ orders, selectedId, onSelect }: Props) {
  return (
    <section aria-label="Órdenes por cobrar">
      <h2 className="flex items-center gap-2 font-outfit text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">
        Por Cobrar
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-100 px-2 font-sans text-xs font-bold tabular-nums text-emerald-800">
          {orders.length}
        </span>
      </h2>

      {orders.length === 0 ? (
        <div className="mt-3 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-stone-200 bg-white/50 py-10 text-center">
          <Clock className="h-6 w-6 text-stone-300" aria-hidden />
          <p className="font-sans text-sm text-stone-400">
            No hay pedidos por cobrar
          </p>
        </div>
      ) : (
        <ul className="mt-3 space-y-3">
          {orders.map((order) => {
            const isReady = order.status === 'READY'
            const isDelayed =
              !isReady && elapsedMinutes(order.created_at) > DELAY_THRESHOLD_MINUTES
            const isSelected = order.id === selectedId

            return (
              <li key={order.id}>
                <button
                  type="button"
                  onClick={() => onSelect(order)}
                  aria-pressed={isSelected}
                  className={`w-full rounded-2xl border bg-white p-3.5 text-left shadow-sm transition-colors duration-150 active:scale-[0.99] ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {/* Fila superior: #Orden + badge tipo | tiempo */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-outfit text-base font-bold leading-none text-cacao">
                        {order.order_number !== null ? `#${order.order_number}` : '—'}
                      </span>
                      <OrderTypeBadge order={order} />
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {isDelayed && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                          <TimerOff className="h-3 w-3" aria-hidden />
                          Demorado
                        </span>
                      )}
                      <span className="font-sans text-xs text-stone-400 tabular-nums">
                        {formatRelativeTime(order.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Estado: READY pistacho / PENDING neutro */}
                  <div className="mt-2 flex items-center gap-1.5">
                    {isReady ? (
                      <span className="inline-flex items-center rounded-full bg-pistachio px-2.5 py-0.5 text-[11px] font-bold text-cacao">
                        Listo para cobrar
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-stone-200/80 px-2.5 py-0.5 text-[11px] font-bold text-stone-600">
                        En preparación
                      </span>
                    )}
                    {order.observation?.trim() && (
                      <span className="truncate font-sans text-[11px] text-stone-400">
                        ⚠️ {order.observation.trim()}
                      </span>
                    )}
                  </div>

                  {/* Atendido por: solo si users existe */}
                  {order.users && (
                    <p className="mt-1.5 flex items-center gap-1 font-sans text-xs text-stone-500">
                      <UserRound className="h-3.5 w-3.5" aria-hidden />
                      Atendido por: {order.users.name}
                    </p>
                  )}

                  {/* Fila inferior: total */}
                  <div className="mt-2 flex items-center justify-between border-t border-stone-100 pt-2">
                    <span className="font-sans text-xs text-stone-400">
                      {order.order_items.length}{' '}
                      {order.order_items.length === 1 ? 'ítem' : 'ítems'}
                    </span>
                    <span className="font-sans text-base font-bold tabular-nums text-cacao">
                      ${Number(order.total_amount).toFixed(2)}
                    </span>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
