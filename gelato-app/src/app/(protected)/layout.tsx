import { ProtectedHeader } from '@/features/auth'
import { getSessionUser } from '@/utils/supabase/session'

// Server Component: lee la sesión una sola vez (React.cache) y pasa al header
// únicamente el nombre (server-serialization: nada del objeto user llega al
// browser, solo la string).
export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser()

  return (
    <div className="min-h-dvh">
      <ProtectedHeader userName={user?.name ?? user?.email ?? 'Usuario'} />
      {children}
    </div>
  )
}
