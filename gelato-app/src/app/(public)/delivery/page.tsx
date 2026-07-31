import { getProducts, getCategories } from '@/features/products/api/getProducts'
import { DeliveryClient } from './DeliveryClient'

export default async function DeliveryPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  return <DeliveryClient products={products} categories={categories} />
}
