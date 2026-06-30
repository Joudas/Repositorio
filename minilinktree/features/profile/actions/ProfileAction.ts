"use server"
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { validateProfile } from "./ValidateProfile";
import z from "zod";

const linkSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es obligatorio"),
  displayName: z.string().min(1, "El Url de usuario es obligatorio"),
  bio: z.string().optional(),
  avatarUrl: z.string().nullable().optional(),
});

const findUserName = async (username: string) => {
  try {
    const data = await prisma.perfil.findUnique({ where: { username } });
    return data;
  } catch {
    return null;
  }
};

export const UpdateProfileAction = async (body: {avatarUrl?: string | null | undefined, username: string, displayName: string, bio?: string}) => {
  try {
    const profile = await validateProfile();

    if (!profile) {
      return { success: false, error: "No se encontró el perfil para este usuario." };
    }

    const data = linkSchema.parse(body);

    if (profile.username !== data.username) {
      const existing = await findUserName(data.username);
      if (existing) return { success: false, error: "Nombre de usuario ya tomado." };
    }

    const updateData = {
      avatarUrl: data.avatarUrl,
      username: data.username,
      displayName: data.displayName,
      bio: data.bio,
    };

    const updateProfile = await prisma.perfil.update({
      where: { id: profile.id },
      data: updateData,
    });
    revalidatePath("/profile");

    return { success: true, data: updateProfile, error: null };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Error al actualizar el perfil" };
  }
};
