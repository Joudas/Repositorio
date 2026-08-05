'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

// Lógica pesada de la feature auth (separación Bulletproof): el componente de
// vista solo orquesta el estado del modal.
// `createClient()` de @supabase/ssr devuelve un singleton: `supabase` es
// estable entre renders y no hay que memoizarlo en las dependencias.
export function useLogout() {
  const [signingOut, setSigningOut] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const signOut = useCallback(async () => {
    setSigningOut(true)
    try {
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } finally {
      setSigningOut(false)
    }
  }, [router, supabase])

  return { signingOut, signOut }
}
