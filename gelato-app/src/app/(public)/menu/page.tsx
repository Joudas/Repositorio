import { getProducts, getCategories } from '@/features/products/api/getProducts'
import { MenuClient } from './MenuClient'

export default async function MenuPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  return <MenuClient products={products} categories={categories} />
}
