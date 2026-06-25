import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const AuthHelper = async () => {

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return { success: false, error: "No autorizado. Inicia sesión de nuevo." };
    }
  return {success: true, data: session};
}
