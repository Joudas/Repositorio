import { ColumnDef } from '@tanstack/react-table'
import { CashierOrder } from '@/features/cashier/types'

export const Columns: ColumnDef<CashierOrder>[] = [
  {
    accessorKey: 'order_number',
    header: '# Orden',
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
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.original.status
      const isPaid = status === 'PAID'
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
            isPaid
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-stone-200 text-stone-600'
          }`}
        >
          {isPaid ? 'Pagado' : 'Anulado'}
        </span>
      )
    },
  },
]
