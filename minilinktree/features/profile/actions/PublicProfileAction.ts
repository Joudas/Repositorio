import { prisma } from "@/lib/prisma";

export const getPublicProfile = async (username: string) => {
  try {
    const profile = await prisma.perfil.findUnique({
      where: { username },
      include: {
        links: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    });
    return profile
      ? { success: true as const, data: profile }
      : { success: false as const, error: "Usuario no encontrado" };
  } catch {
    return { success: false as const, error: "Error al cargar el perfil" };
  }
};
