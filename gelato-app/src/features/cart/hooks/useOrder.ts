import { useCallback, useState } from "react";
import { createOrder } from '@/features/cart/api/createOrder'
import { CartItem } from "@/features/cart/types";


export const useOrder = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitOrder = useCallback(
        async (items: CartItem[], orderType: 'TAKEAWAY' | 'DINE_IN' = 'TAKEAWAY'): Promise<boolean> => {
        setIsLoading(true);
        setError(null)
        try{
            const totalAmount = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
            await createOrder({orderType, items, totalAmount});
            return true;
        }catch(err){
            console.error('Error al crear la orden:', err)
            setError('Error al pedir la orden. Intentá de nuevo.')
            return false;
        }finally{
            setIsLoading(false);
        }
        },[]
    )

    return {submitOrder, isLoading, error}
}