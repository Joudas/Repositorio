'use client'

import { useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export default function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    // Pasamos los datos puros a la tabla de TanStack
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
        sorting,
        columnFilters,
        },
        initialState: {
        pagination: {
            pageSize: 10, // Muestra 10 registros por página por defecto
        },
        },
    })

    return (
    <div className="w-full space-y-4">
        {/* Barra Superior: Buscador Rápido y Filtro */}
        <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <Input
                placeholder="Buscar por # Orden o detalle..."
                value={(table.getColumn('order_number')?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                table.getColumn('order_number')?.setFilterValue(event.target.value)
                }
                className="pl-9 bg-white border-amber-200/80 focus-visible:ring-rose-400 text-amber-950 placeholder:text-stone-400"
            />
            </div>
        </div>

        {/* Tabla Principal Full Width (100%) */}
        <div className="rounded-xl border border-amber-200/60 bg-white overflow-hidden shadow-sm">
            <Table>
            <TableHeader className="bg-amber-100/50">
                {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-amber-200/60">
                    {headerGroup.headers.map((header) => (
                    <TableHead
                        key={header.id}
                        className="font-outfit font-bold text-amber-950 text-xs uppercase tracking-wider py-3"
                    >
                        {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                    ))}
                </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                    <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="border-b border-amber-100/60 hover:bg-amber-50/40 transition-colors"
                    >
                    {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3.5 text-sm text-stone-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                    ))}
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-stone-500 font-medium"
                    >
                    No se encontraron transacciones para los filtros seleccionados.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>

        {/* Paginación Inferior */}
        <div className="flex items-center justify-between px-2 text-xs text-stone-500">
            <div>
            Mostrando {table.getRowModel().rows.length} de {data.length} órdenes del día
            </div>
            <div className="flex items-center space-x-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-8 border-amber-200 text-amber-950 hover:bg-amber-100/50"
            >
                <ChevronLeft className="h-4 w-4" />
                Anterior
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-8 border-amber-200 text-amber-950 hover:bg-amber-100/50"
            >
                Siguiente
                <ChevronRight className="h-4 w-4" />
            </Button>
            </div>
        </div>
    </div>
    )
}
