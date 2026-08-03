import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const patchSchema = z.object({
  status: z.enum(['PAID', 'CANCELED', 'READY']),
  payment_method_id: z.uuid().optional(),
  payment_reference: z.string().optional(),
  cancel_reason: z.string().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const body = await req.json().catch(() => null)
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const { status, payment_method_id, payment_reference, cancel_reason } = parsed.data

  const supabase = createClient(await cookies())

  // 1. Leer el estado actual para validar la transición legal
  const { data: current, error: readError } = await supabase
    .from('orders')
    .select('id, status')
    .eq('id', id)
    .maybeSingle()

  if (readError) {
    return NextResponse.json({ error: readError.message }, { status: 500 })
  }
  if (!current) {
    return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
  }

  // 2. Validar transiciones
  if (status === 'READY' && current.status !== 'PENDING') {
    return NextResponse.json({ error: 'Transición inválida' }, { status: 400 })
  }

  if (status === 'PAID') {
    if (current.status !== 'PENDING' && current.status !== 'READY') {
      return NextResponse.json({ error: 'Transición inválida' }, { status: 400 })
    }
    if (!payment_method_id) {
      return NextResponse.json({ error: 'Método de pago obligatorio' }, { status: 400 })
    }

    const { data: method } = await supabase
      .from('payment_methods')
      .select('id, requires_reference')
      .eq('id', payment_method_id)
      .maybeSingle()

    if (!method) {
      return NextResponse.json({ error: 'Método de pago inválido' }, { status: 400 })
    }
    if (method.requires_reference && !payment_reference?.trim()) {
      return NextResponse.json(
        { error: 'Método de pago requiere referencia' },
        { status: 400 },
      )
    }
  }

  if (status === 'CANCELED') {
    if (!['PENDING', 'READY', 'PAID'].includes(current.status)) {
      return NextResponse.json({ error: 'Transición inválida' }, { status: 400 })
    }
    if (!cancel_reason || cancel_reason.trim().length < 3) {
      return NextResponse.json({ error: 'Motivo obligatorio' }, { status: 400 })
    }
  }

  // 3. Actualizar (sin tocar created_at)
  const updateData: Record<string, unknown> = { status }
  if (status === 'PAID') {
    updateData.payment_method_id = payment_method_id
    if (payment_reference?.trim()) {
      updateData.payment_reference = payment_reference.trim()
    }
    // Marca el momento real de la venta; el historial filtra por paid_at
    updateData.paid_at = new Date().toISOString()
  }
  if (status === 'CANCELED') {
    updateData.cancel_reason = cancel_reason!.trim()
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
