'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Loader2, ShoppingBag, X } from 'lucide-react'
import { useState } from 'react'
import { generarFactura } from '../api/generarFactura'
import { useCancelOrder } from '../hooks/useCancelOrder'
import { useConfirmPayment } from '../hooks/useConfirmPayment'
import { getOrderIdentity } from '@/features/orders'
import type { CashierOrder, PaymentMethod } from '../types'
import { CancelOrderModal } from './CancelOrderModal'
import { PaymentMethodSelect } from './PaymentMethodSelect'
import { PaymentReferenceInput } from './PaymentReferenceInput'

type Props = {
  order: CashierOrder | null
  methods: PaymentMethod[]
  onClearSelection: () => void
}

// Billetes rápidos (Fast Cash Badges) — ajustables a las denominaciones del país
const FAST_CASH_AMOUNTS = [50, 100]

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <ShoppingBag className="h-8 w-8 text-stone-300" aria-hidden />
      <p className="max-w-[16rem] font-sans text-sm text-stone-400">
        Seleccioná una orden para ver el detalle y cobrar
      </p>
    </div>
  )
}

type DetailCardProps = {
  order: CashierOrder | null
  methods: PaymentMethod[]
  onClearSelection: () => void
  showClose: boolean
}

function DetailCard({ order, methods, onClearSelection, showClose }: DetailCardProps) {
  const [methodId, setMethodId] = useState('')
  const [reference, setReference] = useState('')
  // Modo Cobro Exacto: el remount por key (desktop) re-evalúa el inicializador
  // con la orden nueva → RECIBIDO se precarga con el total del pedido.
  const [received, setReceived] = useState(() =>
    order ? String(order.total_amount) : '',
  )
  const [cancelOpen, setCancelOpen] = useState(false)
  // Remount del modal en cada apertura para limpiar el motivo (sin setState en effects)
  const [cancelSession, setCancelSession] = useState(0)

  const confirmPayment = useConfirmPayment()
  const cancelOrder = useCancelOrder()

  if (!order) return <EmptyState />

  // Selección efectiva derivada (sin effects): si no hay método elegido,
  // preselecciona Efectivo (case-insensitive) o el primer método de la lista.
  const effectiveMethodId =
    methodId !== '' ? methodId : (methods.find((m) => m.name.toLowerCase() === 'efectivo')?.id ?? methods[0]?.id ?? '')
  const selectedMethod = methods.find((m) => m.id === effectiveMethodId)
  const isCash = selectedMethod?.name.toLowerCase() === 'efectivo'

  const isReady = order.kitchen_status === 'READY'
  const identity = getOrderIdentity(order)
  // El bloque de recibido/cambio es exclusivo de Efectivo; la referencia solo aplica a otros métodos.
  const needsReference = !isCash && (selectedMethod?.requires_reference ?? false)

  const receivedAmount = Number(received)
  const isInsufficient =
    isCash && (received.trim() === '' || Number.isNaN(receivedAmount) || receivedAmount < order.total_amount)
  const canConfirm =
    effectiveMethodId !== '' && (!needsReference || reference.trim().length > 0) && (!isCash || !isInsufficient)

  const orderTypeLabel =
    order.order_type === 'TAKEAWAY'
      ? 'Para Llevar'
      : 'En Mesa' // la mesa específica ya está en el identificador primario

  const handleConfirm = () => {
    const change = isCash && !isInsufficient ? receivedAmount - order.total_amount : undefined
    confirmPayment.mutate(
      {
        orderId: order.id,
        paymentMethodId: effectiveMethodId,
        paymentReference: needsReference ? reference.trim() : undefined,
      },
      {
        onSuccess: () => {
          // Factura con los valores del estado actual, ANTES de resetear.
          generarFactura({
            order,
            methodName: selectedMethod?.name ?? null,
            reference: needsReference ? reference.trim() : undefined,
            received: isCash ? receivedAmount : undefined,
            change,
          })
          setMethodId('')
          setReference('')
          setReceived('')
        },
      },
    )
  }

  const handleCancel = (reason: string) => {
    cancelOrder.mutate(
      { orderId: order.id, cancelReason: reason },
      { onSuccess: () => setCancelOpen(false) },
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-5">
      {showClose && (
        <div className="-mb-1 flex justify-end">
          <button
            type="button"
            onClick={onClearSelection}
            aria-label="Cerrar detalle"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors hover:text-stone-800"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}

      {/* Encabezado */}
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-outfit text-xl font-bold leading-tight text-cacao">
            {identity.primary}
          </p>
          {identity.secondary && (
            <p className="font-sans text-xs font-semibold text-stone-400">
              {identity.secondary}
            </p>
          )}
          <p className="font-sans text-xs font-semibold text-stone-400">
            {orderTypeLabel}
          </p>
          {order.users && (
            <p className="mt-0.5 font-sans text-xs text-stone-500">
              Atendido por: {order.users.name}
            </p>
          )}
        </div>
        {isReady ? (
          <span className="shrink-0 rounded-full bg-pistachio px-2.5 py-1 text-[11px] font-bold text-cacao">
            Listo para cobrar
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-stone-200/80 px-2.5 py-1 text-[11px] font-bold text-stone-600">
            En preparación
          </span>
        )}
      </header>

      {/* Desglose de productos */}
      <ul className="divide-y divide-stone-100 rounded-xl border border-stone-100 bg-white">
        {order.order_items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 px-3.5 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate font-sans text-sm font-semibold text-cacao">
                {item.products.name}
              </p>
              <p className="font-sans text-xs text-stone-400 tabular-nums">
                {item.quantity} × ${Number(item.unit_price).toFixed(2)}
              </p>
            </div>
            <span className="shrink-0 font-sans text-sm font-bold tabular-nums text-cacao">
              ${(item.quantity * Number(item.unit_price)).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      {/* Total */}
      <div className="flex items-center justify-between rounded-xl bg-stone-100 px-3.5 py-3">
        <span className="font-sans text-sm font-semibold text-stone-500">Total</span>
        <span className="font-sans text-xl font-bold tabular-nums text-cacao">
          ${Number(order.total_amount).toFixed(2)}
        </span>
      </div>

      {/* Método de pago */}
      <PaymentMethodSelect methods={methods} value={effectiveMethodId} onChange={setMethodId} />

      {needsReference && (
        <PaymentReferenceInput value={reference} onChange={setReference} />
      )}

      {/* Efectivo: input "Recibido" + span de cambio / pago insuficiente (solo visual, no se persiste) */}
      {isCash && (
        <div className="block">
          <span className="font-outfit text-xs font-semibold uppercase tracking-wider text-stone-500">
            Recibido
          </span>

          {/* Fast Cash Badges: píldoras de valores rápidos ajustadas al total */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setReceived(String(order.total_amount))}
              className="cursor-pointer rounded-full border border-emerald-500 bg-emerald-50 px-3 py-1.5 font-sans text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
            >
              Exacto ${Number(order.total_amount).toFixed(2)}
            </button>
            {FAST_CASH_AMOUNTS.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setReceived(String(amount))}
                className="cursor-pointer rounded-full border border-stone-300 bg-white px-3 py-1.5 font-sans text-xs font-semibold text-stone-600 transition-colors hover:border-stone-400 hover:bg-stone-50"
              >
                ${amount}
              </button>
            ))}
          </div>

          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={received}
            onChange={(e) => setReceived(e.target.value)}
            placeholder="$0.00"
            className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white px-3.5 font-sans text-sm text-cacao outline-none transition-colors placeholder:text-stone-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
          <span
            className={`mt-1 block font-sans text-xs font-semibold ${
              isInsufficient ? 'text-red-600' : 'text-emerald-700'
            }`}
          >
            {isInsufficient
              ? 'Pago Insuficiente'
              : `Cambio: $${(receivedAmount - order.total_amount).toFixed(2)}`}
          </span>
        </div>
      )}

      {confirmPayment.isError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 font-sans text-xs font-semibold text-red-700">
          {confirmPayment.error.message}
        </p>
      )}

      {/* Acciones */}
      <div className="mt-1 space-y-2.5">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!canConfirm || confirmPayment.isPending}
          className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl font-sans text-base font-bold transition-colors duration-150 active:scale-[0.99] ${
            confirmPayment.isPending
              ? 'cursor-wait bg-emerald-500 text-white opacity-70'
              : canConfirm
                ? 'bg-emerald-500 text-white shadow-md hover:bg-emerald-600'
                : 'cursor-not-allowed bg-stone-200 text-stone-400'
          }`}
        >
          {confirmPayment.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          ) : (
            <CheckCircle2 className="h-5 w-5" aria-hidden />
          )}
          Confirmar Pago
        </button>
        <button
          type="button"
          onClick={() => {
            setCancelSession((n) => n + 1)
            setCancelOpen(true)
          }}
          disabled={cancelOrder.isPending}
          className="h-11 w-full rounded-xl border border-stone-200 bg-white font-sans text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-50 disabled:opacity-60"
        >
          Cancelar Pedido
        </button>
      </div>

      <CancelOrderModal
        key={cancelSession}
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
        submitting={cancelOrder.isPending}
        error={cancelOrder.isError ? cancelOrder.error.message : null}
      />
    </div>
  )
}

export function OrderDetailPanel({ order, methods, onClearSelection }: Props) {
  return (
    <>
      {/* Desktop: columna estática (derecha) — key remonta el estado del cobro al cambiar de orden */}
      <aside
        aria-label="Detalle y cobro del pedido"
        className="hidden rounded-2xl border border-stone-200 bg-card shadow-sm lg:block"
      >
        <DetailCard
          key={order?.id ?? 'empty'}
          order={order}
          methods={methods}
          onClearSelection={onClearSelection}
          showClose={false}
        />
      </aside>

      {/* Mobile: panel inferior slide-up (patrón ProductDetailModal) */}
      <AnimatePresence>
        {order && (
          <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={onClearSelection}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative max-h-[90dvh] w-full overflow-y-auto rounded-t-3xl bg-card shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <DetailCard
                order={order}
                methods={methods}
                onClearSelection={onClearSelection}
                showClose
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
