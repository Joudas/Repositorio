import { auth } from '@/lib/auth';

export const AuthHelper = async (headers: Headers) => {
    const session = await auth.api.getSession({
      headers,
    });

    if (!session || !session.user) {
      return { success: false, error: "No autorizado. Inicia sesión de nuevo." };
    }
  return {success: true, data: session};
}
