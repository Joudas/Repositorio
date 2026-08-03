import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const supabase = createClient(await cookies())

  const { data, error } = await supabase
    .from('payment_methods')
    .select('id, name, is_active, requires_reference')
    .eq('is_active', true)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // "Efectivo" primero (case-insensitive) y el resto alfabético por nombre ASC.
  const methods = [...(data ?? [])].sort((a, b) => {
    const aIsCash = a.name.toLowerCase() === 'efectivo' ? 0 : 1
    const bIsCash = b.name.toLowerCase() === 'efectivo' ? 0 : 1
    if (aIsCash !== bIsCash) return aIsCash - bIsCash
    return a.name.localeCompare(b.name)
  })

  return NextResponse.json({ methods })
}
