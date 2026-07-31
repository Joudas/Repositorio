'use client'

import { motion } from 'framer-motion'
import { Check, Loader2, ShoppingBag, UtensilsCrossed } from 'lucide-react'
import type { KitchenOrder } from '../types'

type Props = {
  order: KitchenOrder
  onMarkReady: (id: string) => void
  mutating: boolean
}

function formatTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const minutes = Math.floor((Date.now() - date.getTime()) / 60_000)
  if (minutes < 1) return 'hace unos segundos'
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours} h`
  return `hace ${Math.floor(hours / 24)} d`
}

const money = (n: number) => `$${Number(n).toFixed(2)}`

export function OrderCard({ order, onMarkReady, mutating }: Props) {
  const isTakeaway = order.order_type === 'TAKEAWAY'
  const isReady = order.status === 'READY'

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`bg-white rounded-2xl border shadow-sm p-4 ${
        isReady ? 'border-emerald-200 opacity-75' : 'border-amber-100/60'
      }`}
    >
      {/* Badge tipo + hora */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {isTakeaway ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-900">
              <ShoppingBag className="h-3.5 w-3.5" aria-hidden />
              Para llevar
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-semibold text-rose-900">
              <UtensilsCrossed className="h-3.5 w-3.5" aria-hidden />
              En salón
            </span>
          )}
          {!isTakeaway && order.table_number !== null && (
            <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-700">
              Mesa {order.table_number}
            </span>
          )}
        </div>
        <time className="shrink-0 font-sans text-xs text-stone-400 tabular-nums">
          {formatTime(order.created_at)} · {formatRelativeTime(order.created_at)}
        </time>
      </div>

      {/* Items */}
      <ul className="mt-3 space-y-2">
        {order.order_items.map((item) => (
          <li
            key={item.id}
            className="flex items-baseline justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="font-sans text-sm font-semibold leading-tight text-amber-950">
                {item.products.name}
                <span className="font-medium text-stone-400">
                  {' '}
                  ×{item.quantity}
                </span>
              </p>
              {item.products.ingredients && (
                <p className="truncate font-sans text-[11px] text-stone-500">
                  Ingredientes: {item.products.ingredients}
                </p>
              )}
            </div>
            <span className="shrink-0 font-sans text-sm text-amber-950 tabular-nums">
              {money(item.quantity * item.unit_price)}
            </span>
          </li>
        ))}
      </ul>

      {/* Total */}
      <div className="mt-3 flex items-center justify-between border-t border-amber-100/60 pt-3">
        <span className="font-sans text-xs uppercase tracking-wide text-stone-400">
          Total
        </span>
        <span className="font-sans font-bold text-amber-950 tabular-nums">
          {money(order.total_amount)}
        </span>
      </div>

      {/* Acción: solo PENDING */}
      {!isReady && (
        <button
          type="button"
          onClick={() => onMarkReady(order.id)}
          disabled={mutating}
          className="mt-4 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-400 font-outfit text-sm font-semibold text-cacao transition-colors duration-150 hover:bg-emerald-500 active:scale-[0.99] disabled:cursor-wait disabled:opacity-70 sm:text-base"
        >
          {mutating ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          ) : (
            <Check className="h-5 w-5" aria-hidden />
          )}
          Listo para entregar
        </button>
      )}
    </motion.article>
  )
}
