export type Category = {
  id: string
  name: string
  slug: string
  created_at: string
}

export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  is_available: boolean
  category_id: string
  created_at: string
  ingredients: string | null
}
