import { cache } from 'react'
import { cookies } from 'next/headers'
import { createClient } from './server'

export type SessionUser = {
  name: string | null
  email: string | null
}

// React.cache() deduplica esta llamada dentro del mismo request (server-cache-react):
// si el layout y varios componentes piden la sesión, se ejecuta UNA sola vez.
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = createClient(await cookies())

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // async-cheap-condition-before-await: cortamos antes de la query a la DB.
  if (!user) return null

  const { data: dbUser } = await supabase
    .from('users')
    .select('name')
    .eq('id', user.id)
    .maybeSingle()

  return {
    name: dbUser?.name ?? null,
    email: user.email ?? null,
  }
})
