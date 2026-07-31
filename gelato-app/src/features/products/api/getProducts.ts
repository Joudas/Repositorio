import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import type { Product, Category } from '@/features/products/types'

export type ProductWithCategory = Product & {
  categories: Pick<Category, 'name' | 'slug'>
}

export async function getProducts(): Promise<ProductWithCategory[]> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data } = await supabase
    .from('products')
    .select(
      `
      *,
      categories!inner(name, slug)
    `,
    )
    .order('name')

  return (data as ProductWithCategory[]) ?? []
}

export async function getCategories(): Promise<Category[]> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return data ?? []
}
