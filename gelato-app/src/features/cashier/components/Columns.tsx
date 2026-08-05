import { ColumnDef } from '@tanstack/react-table'
import { getOrderIdentity } from '@/features/orders'
import { CashierOrder } from '@/features/cashier/types'

export const Columns: ColumnDef<CashierOrder>[] = [
  {
    accessorKey: 'order_number',
    header: '# Orden',
    cell: ({ row }) => {
      const identity = getOrderIdentity(row.original)
      return (
        <div className="flex flex-col leading-tight">
          <span className="font-semibold">{identity.primary}</span>
          {identity.secondary && (
            <span className="text-xs text-stone-400">{identity.secondary}</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Hora',
    cell: ({ row }) =>
      new Date(row.getValue('created_at')).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
  },
  {
    accessorKey: 'users',
    header: 'Mesero',
    cell: ({ row }) => row.original.users?.name ?? '—',
  },
  {
    accessorKey: 'payment_methods',
    header: 'Método',
    cell: ({ row }) => row.original.payment_methods?.name ?? '—',
  },
  {
    accessorKey: 'total_amount',
    header: 'Total',
    cell: ({ row }) => `$${Number(row.original.total_amount).toFixed(2)}`,
  },
  {
    accessorKey: 'payment_status',
    header: 'Estado',
    cell: ({ row }) => {
      const order = row.original
      // paid_at lo setea el trigger al cobrar y NO se limpia al devolver →
      // CANCELED con paid_at = devolución; sin paid_at = anulado antes de cobrar.
      const isRefunded =
        order.payment_status === 'CANCELED' && order.paid_at !== null
      const tone = isRefunded
        ? 'bg-amber-100 text-amber-800'
        : order.payment_status === 'PAID'
          ? 'bg-emerald-100 text-emerald-800'
          : 'bg-stone-200 text-stone-600'
      const label = isRefunded
        ? 'Devolución'
        : order.payment_status === 'PAID'
          ? 'Pagado'
          : 'Anulado'
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${tone}`}
        >
          {label}
        </span>
      )
    },
  },
]
