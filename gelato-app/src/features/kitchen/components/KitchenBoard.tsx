'use client'

import { useState } from 'react'
import { LayoutGroup, MotionConfig } from 'framer-motion'
import { CheckCircle2, Clock } from 'lucide-react'
import { useKitchenOrders } from '../hooks/useKitchenOrders'
import { useMarkReady } from '../hooks/useMarkReady'
import type { KitchenOrder } from '../types'
import { KitchenHeader } from './KitchenHeader'
import { OrderCard } from './OrderCard'
import { OrderCardSkeleton } from './OrderCardSkeleton'

type ColumnHeadingProps = {
  title: string
  count: number
  tone: 'amber' | 'emerald'
}

function ColumnHeading({ title, count, tone }: ColumnHeadingProps) {
  return (
    <h2 className="flex items-center gap-2 font-outfit text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">
      {title}
      <span
        className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 font-sans text-xs font-bold tabular-nums ${
          tone === 'emerald'
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-amber-100 text-amber-900'
        }`}
      >
        {count}
      </span>
    </h2>
  )
}

type EmptyStateProps = {
  icon: typeof Clock
  label: string
}

function EmptyState({ icon: Icon, label }: EmptyStateProps) {
  return (
    <div className="mt-3 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-stone-200 bg-white/50 py-10 text-center">
      <Icon className="h-6 w-6 text-stone-300" aria-hidden />
      <p className="font-sans text-sm text-stone-400">{label}</p>
    </div>
  )
}

type ColumnProps = {
  title: string
  tone: ColumnHeadingProps['tone']
  orders: KitchenOrder[]
  emptyIcon: typeof Clock
  emptyLabel: string
  markingId: string | null
  onMarkReady: (id: string) => void
}

function Column({
  title,
  tone,
  orders,
  emptyIcon,
  emptyLabel,
  markingId,
  onMarkReady,
}: ColumnProps) {
  return (
    <section aria-label={title} className="md:min-h-[50vh]">
      <ColumnHeading title={title} count={orders.length} tone={tone} />
      {orders.length === 0 ? (
        <EmptyState icon={emptyIcon} label={emptyLabel} />
      ) : (
        <ul className="mt-3 space-y-4">
          {orders.map((order) => (
            <li key={order.id}>
              <OrderCard
                order={order}
                onMarkReady={onMarkReady}
                mutating={markingId === order.id}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

type MobileTab = 'pending' | 'ready'

function MobileTabs({
  activeTab,
  pendingCount,
  readyCount,
  onChange,
}: {
  activeTab: MobileTab
  pendingCount: number
  readyCount: number
  onChange: (tab: MobileTab) => void
}) {
  return (
    <div
      role="tablist"
      aria-label="Pedidos de cocina"
      className="sticky top-0 z-10 grid grid-cols-2 gap-2 bg-cream/95 py-2 backdrop-blur-sm md:hidden"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'pending'}
        onClick={() => onChange('pending')}
        className={`flex h-11 items-center justify-center gap-2 rounded-xl px-3 font-sans text-sm font-bold transition-colors ${
          activeTab === 'pending'
            ? 'bg-amber-100 text-amber-900 shadow-sm'
            : 'border border-stone-200 bg-white text-stone-400'
        }`}
      >
        En espera
        <span
          className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 font-sans text-xs font-bold tabular-nums ${
            activeTab === 'pending'
              ? 'bg-white/80 text-amber-900'
              : 'bg-stone-100 text-stone-500'
          }`}
        >
          {pendingCount}
        </span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'ready'}
        onClick={() => onChange('ready')}
        className={`flex h-11 items-center justify-center gap-2 rounded-xl px-3 font-sans text-sm font-bold transition-colors ${
          activeTab === 'ready'
            ? 'bg-emerald-100 text-emerald-800 shadow-sm'
            : 'border border-stone-200 bg-white text-stone-400'
        }`}
      >
        Listos
        <span
          className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 font-sans text-xs font-bold tabular-nums ${
            activeTab === 'ready'
              ? 'bg-white/80 text-emerald-800'
              : 'bg-stone-100 text-stone-500'
          }`}
        >
          {readyCount}
        </span>
      </button>
    </div>
  )
}

export function KitchenBoard() {
  const {
    data: orders = [],
    isLoading,
    isError,
    isFetching,
    isSuccess,
  } = useKitchenOrders()
  const markReady = useMarkReady()
  const [mobileTab, setMobileTab] = useState<MobileTab>('pending')

  const pending = orders.filter((o) => o.status === 'PENDING')
  const ready = orders.filter((o) => o.status === 'READY')
  const markingId = markReady.isPending ? markReady.variables : null

  return (
    <MotionConfig reducedMotion="user">
      <div className="space-y-6">
        <KitchenHeader
          pendingCount={pending.length}
          isError={isError}
          isFetching={isFetching}
          isSuccess={isSuccess}
        />

        <MobileTabs
          activeTab={mobileTab}
          pendingCount={pending.length}
          readyCount={ready.length}
          onChange={setMobileTab}
        />

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 md:items-start">
            {Array.from({ length: 4 }).map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <LayoutGroup>
            <div className="grid gap-8 md:grid-cols-2 md:items-start md:gap-6">
              <div className={mobileTab === 'pending' ? '' : 'hidden md:block'}>
                <Column
                  title="En espera"
                  tone="amber"
                  orders={pending}
                  emptyIcon={Clock}
                  emptyLabel="No hay pedidos en espera"
                  markingId={markingId}
                  onMarkReady={markReady.mutate}
                />
              </div>
              <div className={mobileTab === 'ready' ? '' : 'hidden md:block'}>
                <Column
                  title="Listos"
                  tone="emerald"
                  orders={ready}
                  emptyIcon={CheckCircle2}
                  emptyLabel="No hay pedidos listos"
                  markingId={markingId}
                  onMarkReady={markReady.mutate}
                />
              </div>
            </div>
          </LayoutGroup>
        )}
      </div>
    </MotionConfig>
  )
}
