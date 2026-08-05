"use server"
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { CreateOrderInput } from '@/features/cart/types';

export const createOrder = async (data: CreateOrderInput) => {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_type: data.orderType,
      // kitchen_status y payment_status los setea la DB (defaults UNPAID/PENDING)
      total_amount: data.totalAmount,
      observation: data.observation,
    })
    .select('id')
    .single();

    if (orderError) throw new Error(orderError.message);

    // 2. Preparamos e insertamos los items en order_items
    const orderItems = data.items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

    if (itemsError) throw new Error(itemsError.message);

    return order;
}