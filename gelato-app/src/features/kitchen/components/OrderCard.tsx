'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  Bike,
  Check,
  Loader2,
  TimerOff,
  UtensilsCrossed,
} from 'lucide-react'
import Image from 'next/image'
import { getOrderIdentity } from '@/features/orders'
import type { KitchenOrder, KitchenOrderItem } from '../types'

type Props = {
  order: KitchenOrder
  onMarkReady: (id: string) => void
  mutating: boolean
}

const DELAY_THRESHOLD_MINUTES = 15

// next/image construye un objeto URL con el src; si el string no es una URL
// válida (texto, path relativo, vacío) truena en el render con
// "Failed to construct 'URL': Invalid URL". Validamos antes de renderizar.
function isValidImageUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

// El menú no tiene un mapa categoría → emoji: ProductCard, ProductCardDelivery
// y ProductDetailModal usan este mismo fallback genérico de postre.
// Si más adelante se agrega el mapa en el menú, replicarlo acá.
const FALLBACK_EMOJI = '🍨'

function formatTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function elapsedMinutes(iso: string): number {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 0
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 60_000))
}

function formatRelativeTime(iso: string): string {
  const minutes = elapsedMinutes(iso)
  if (minutes < 1) return 'hace unos segundos'
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours} h`
  return `hace ${Math.floor(hours / 24)} d`
}

type OrderItemRowProps = {
  item: KitchenOrderItem
}

function OrderItemRow({ item }: OrderItemRowProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <li className="flex items-start gap-3">
      {/* Thumbnail */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-amber-50">
        {item.products.image && !imgError && isValidImageUrl(item.products.image) ? (
          <Image
            src={item.products.image}
            alt=""
            width={48}
            height={48}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="select-none text-2xl">{FALLBACK_EMOJI}</span>
        )}
      </div>
      {/* Nombre + ingredientes */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="font-sans text-sm font-semibold leading-tight text-amber-950">
            {item.products.name}
          </p>
          {item.quantity > 1 && (
            <span className="rounded-md bg-rose-500 px-2 py-1 font-sans text-sm font-bold leading-none text-white">
              ×{item.quantity}
            </span>
          )}
        </div>
        {item.products.ingredients && (
          <div className="mt-0.5 flex flex-wrap gap-1">
            {item.products.ingredients.split(' - ').map((ingredient) => (
              <span
                key={ingredient}
                className="bg-amber-100/80 text-amber-900 border border-amber-200/60 font-medium text-[11px] px-2 py-0.5 rounded-md"
              >
                {ingredient}
              </span>
            ))}
          </div>
        )}
      </div>
    </li>
  )
}

export function OrderCard({ order, onMarkReady, mutating }: Props) {
  const isTakeaway = order.order_type === 'TAKEAWAY'
  const identity = getOrderIdentity(order)
  const isReady = order.kitchen_status === 'READY'
  const isDelayed = !isReady && elapsedMinutes(order.created_at) > DELAY_THRESHOLD_MINUTES
  const observation = order.observation?.trim()

  const cardTone = isReady
    ? 'border-emerald-200 bg-white opacity-75'
    : isDelayed
      ? 'border-red-300 bg-red-50/50'
      : 'border-amber-100/60 bg-white'

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`rounded-2xl border shadow-sm p-3.5 ${cardTone}`}
    >
      {/* Badge tipo + identificador + hora */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {isTakeaway ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-400 px-3 py-1.5 text-xs font-bold text-amber-950">
              <Bike className="h-4 w-4" aria-hidden />
              Para Llevar · {identity.primary}
            </span>
          ) : (
            <>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500 px-3 py-1.5 text-xs font-bold text-white">
                <UtensilsCrossed className="h-4 w-4" aria-hidden />
                {identity.primary}
              </span>
              {identity.secondary && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500 px-3 py-1.5 text-xs font-bold text-white">
                  {identity.secondary}
                </span>
              )}
            </>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {isDelayed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
              <TimerOff className="h-3 w-3" aria-hidden />
              Demorado
            </span>
          )}
          <time className="font-sans text-xs text-stone-400 tabular-nums">
            {formatTime(order.created_at)} ·{' '}
            <span
              className={isDelayed ? 'font-semibold text-red-600' : undefined}
            >
              {formatRelativeTime(order.created_at)}
            </span>
          </time>
        </div>
      </div>

      {/* Nota del pedido */}
      {observation && (
        <div className="my-2 flex items-center gap-1.5 rounded-r-md border-l-4 border-amber-500 bg-amber-100 p-2 text-xs font-semibold text-amber-950">
          <span>⚠️ Nota:</span> {observation}
        </div>
      )}

      {/* Items */}
      <ul className="mt-3 space-y-2.5">
        {order.order_items.map((item) => (
          <OrderItemRow key={item.id} item={item} />
        ))}
      </ul>

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
