'use client'

import { useState } from 'react'
import { useSalesHistory } from '@/features/cashier/hooks/useSalesHistory'
import { Columns } from '@/features/cashier/components/Columns'
import DataTable from '@/features/cashier/components/DataTable'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { OrdersFilters } from '@/features/cashier/api/getOrders'

// Fecha local de hoy en formato YYYY-MM-DD (para inputs tipo date)
function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const today = toISODate(new Date())

export default function HistoryTable() {
  // Drafts del formulario (solo se aplican al pulsar Buscar)
  const [from, setFrom] = useState(today)
  const [to, setTo] = useState(today)
  const [q, setQ] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  // Filtros aplicados: solo cambian al hacer clic en Buscar
  const [appliedFilters, setAppliedFilters] = useState<OrdersFilters>({
    from: today,
    to: today,
  })

  const { data: orders, isLoading, isError } = useSalesHistory(appliedFilters)

  function handleSearch() {
    if (from && to && from > to) {
      setValidationError('La fecha de inicio no puede ser mayor que la de fin')
      return
    }
    setValidationError(null)
    setAppliedFilters({
      from: from || undefined,
      to: to || undefined,
      q: q.trim() || undefined,
    })
  }

  return (
    <div className="p-6 bg-amber-50/30 min-h-screen">
      <h1 className="text-2xl font-bold text-amber-950 font-outfit mb-4">
        Historial de Ventas
      </h1>

      {/* Barra de filtros */}
      <div className="mb-4 grid grid-cols-1 gap-3 items-end sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="font-outfit text-xs font-semibold uppercase tracking-wider text-stone-500">
            Fecha inicio
          </label>
          <Input
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value)
              if (validationError) setValidationError(null)
            }}
            className="mt-1 bg-white border-amber-200/80 text-amber-950 focus-visible:ring-amber-400"
          />
        </div>
        <div>
          <label className="font-outfit text-xs font-semibold uppercase tracking-wider text-stone-500">
            Fecha fin
          </label>
          <Input
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value)
              if (validationError) setValidationError(null)
            }}
            className="mt-1 bg-white border-amber-200/80 text-amber-950 focus-visible:ring-amber-400"
          />
        </div>
        <div>
          <label className="font-outfit text-xs font-semibold uppercase tracking-wider text-stone-500">
            Búsqueda
          </label>
          <Input
            type="text"
            placeholder="Buscar por #orden o mesero"
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              if (validationError) setValidationError(null)
            }}
            className="mt-1 bg-white border-amber-200/80 text-amber-950 placeholder:text-stone-400 focus-visible:ring-amber-400"
          />
        </div>
        <Button
          variant="default"
          onClick={handleSearch}
          className="bg-amber-900 hover:bg-amber-800 text-white"
        >
          Buscar
        </Button>
      </div>

      {validationError && (
        <p className="mb-4 text-sm text-rose-600">{validationError}</p>
      )}

      {isLoading ? (
        <p className="text-sm text-stone-500">Cargando...</p>
      ) : isError ? (
        <p className="text-sm text-rose-600">
          Ocurrió un error al cargar el historial. Inténtalo de nuevo.
        </p>
      ) : (
        <DataTable columns={Columns} data={orders ?? []} />
      )}
    </div>
  )
}
