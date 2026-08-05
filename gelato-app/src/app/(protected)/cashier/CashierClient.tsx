'use client'

import { useState } from 'react'
import {
  ActiveOrdersList,
  CashierSkeleton,
  CashierTabs,
  OrderDetailPanel,
  useActiveOrders,
  usePaymentMethods,
  type CashierOrder,
  type CashierTab,
} from '@/features/cashier'

export function CashierClient() {
  const [activeTab, setActiveTab] = useState<CashierTab>('collect')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  // "Cerrado a propósito" (mobile): al cerrar el sheet se marca dismissed para que
  // la derivada no re-seleccione orders[0]; el próximo click en una fila lo resetea.
  const [dismissed, setDismissed] = useState(false)

  const activeOrders = useActiveOrders()
  const paymentMethods = usePaymentMethods()

  const orders = activeOrders.data ?? []

  // Derivada: auto-selección de la primera orden (la más antigua, created_at ASC)
  // al cargar y cuando la seleccionada se paga/cancela. Sin effects ni setState.
  const selectedOrder: CashierOrder | null = dismissed
    ? null
    : selectedId !== null
      ? (orders.find((o) => o.id === selectedId) ?? orders[0] ?? null)
      : (orders[0] ?? null)

  const handleSelect = (order: CashierOrder) => {
    setDismissed(false)
    setSelectedId(order.id)
  }

  const handleClearSelection = () => {
    setSelectedId(null)
    setDismissed(true)
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-outfit text-2xl font-bold tracking-tight text-cacao">
          Caja
        </h1>
        <p className="mt-0.5 font-sans text-sm text-stone-500">
          Cobrá y anulá los pedidos activos
        </p>
      </header>

      <CashierTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        collectCount={orders.length}
      >
        {activeOrders.isLoading ? (
          <CashierSkeleton />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[3fr_2fr] lg:items-start">
            <ActiveOrdersList
              orders={orders}
              selectedId={selectedOrder?.id ?? null}
              onSelect={handleSelect}
            />
            <OrderDetailPanel
              order={selectedOrder}
              methods={paymentMethods.data ?? []}
              onClearSelection={handleClearSelection}
            />
          </div>
        )}
      </CashierTabs>
    </div>
  )
}
