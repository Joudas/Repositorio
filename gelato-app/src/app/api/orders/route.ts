import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const supabase = createClient(await cookies())

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      id,
      order_type,
      status,
      table_number,
      total_amount,
      created_at,
      order_items (
        id,
        quantity,
        unit_price,
        products (id, name, ingredients)
      )
    `,
    )
    .in('status', ['PENDING', 'READY'])
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ orders: data })
}
