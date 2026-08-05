import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

// Proyección ampliada para caja: order_number, waiter_id, users(name),
// cancel_reason y payment_methods(name) además del anidado de items.
// `status` ya no existe en la DB (spliteado en kitchen_status + payment_status).
const ORDERS_SELECT = `
  id,
  order_number,
  order_type,
  kitchen_status,
  payment_status,
  table_number,
  total_amount,
  observation,
  waiter_id,
  cancel_reason,
  created_at,
  paid_at,
  users (name),
  payment_methods (name),
  order_items (
    id,
    quantity,
    unit_price,
    products (id, name, ingredients, image)
  )
`

// Escapa el término de búsqueda para usarlo dentro del filtro `.or()` de
// PostgREST: duplica comillas simples (sintaxis de string literal SQL) y
// escapa los comodines de ILIKE para que % y _ se traten como texto literal.
function sanitizeSearchTerm(term: string): string {
  return term.replace(/'/g, "''").replace(/%/g, '\\%').replace(/_/g, '\\_')
}

export async function GET(req: NextRequest) {
  const supabase = createClient(await cookies())

  // scope=active (default, no rompe la cocina) | scope=history (hoy)
  const scope = req.nextUrl.searchParams.get('scope') ?? 'active'
  // view=kitchen | view=cashier — qué necesita cada pantalla en el scope activo
  const view = req.nextUrl.searchParams.get('view') ?? 'cashier'

  let query = supabase.from('orders').select(ORDERS_SELECT)

  if (scope === 'history') {
    // Historial = ventas PAID + anulaciones CANCELED.
    // - PAID se filtra por paid_at (cuándo se vendió realmente; lo setea el
    //   trigger trg_orders_set_paid_at al pasar payment_status a PAID).
    // - CANCELED se filtra por created_at (cuándo se anuló; puede tener
    //   paid_at si se anuló un pedido ya cobrado).
    // Se ejecutan dos queries en paralelo y se combinan en el servidor;
    // un filtro `.or()` compuesto con timestamps ISO es frágil en PostgREST.
    const searchParams = req.nextUrl.searchParams
    const from = searchParams.get('from') // YYYY-MM-DD
    const to = searchParams.get('to') // YYYY-MM-DD
    const q = searchParams.get('q')?.trim()

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const fromIso = from
      ? new Date(`${from}T00:00:00`).toISOString()
      : startOfToday.toISOString()
    const toIso = to ? new Date(`${to}T23:59:59.999`).toISOString() : null

    const buildHistoryQuery = (paymentStatus: 'PAID' | 'CANCELED', dateColumn: 'paid_at' | 'created_at') => {
      let qry = supabase
        .from('orders')
        .select(ORDERS_SELECT)
        .eq('payment_status', paymentStatus)
        .gte(dateColumn, fromIso)
        .order('created_at', { ascending: false })

      if (toIso) qry = qry.lte(dateColumn, toIso)

      if (q) {
        const term = sanitizeSearchTerm(q)
        qry = qry.or(
          `order_number::text.ilike.%${term}%, users.name.ilike.%${term}%`,
        )
      }

      return qry
    }

    const paidQuery = buildHistoryQuery('PAID', 'paid_at')
    const canceledQuery = buildHistoryQuery('CANCELED', 'created_at')

    const [paidResult, canceledResult] = await Promise.all([paidQuery, canceledQuery])

    const error = paidResult.error ?? canceledResult.error
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Combina ambas listas y ordena por fecha desc (más reciente primero).
    const data = [...(paidResult.data ?? []), ...(canceledResult.data ?? [])]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )

    return NextResponse.json({ orders: data })
  } else if (view === 'kitchen') {
    // Cocina: todo lo que hay que preparar/entregar. PAGAR NO LO SACA:
    // payment_status puede ser UNPAID o PAID; solo se oculta lo CANCELED.
    query = query
      .in('kitchen_status', ['PENDING', 'IN_PREPARATION', 'READY'])
      .neq('payment_status', 'CANCELED')
      .order('created_at', { ascending: true })
  } else {
    // Caja — Por Cobrar: solo lo que sigue impago.
    query = query
      .eq('payment_status', 'UNPAID')
      .order('created_at', { ascending: true })
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ orders: data })
}
