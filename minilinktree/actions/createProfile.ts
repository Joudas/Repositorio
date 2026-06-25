"use server"
import { prisma } from "@/lib/prisma"

type CreateProfile = {
    userId: string
    name: string,
    email: string
}
export const createProfile = async ({userId, name, email}: CreateProfile) => {
    await prisma.perfil.create({
        data: {
            userId: userId,
            username: email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, ""),
            displayName: name,
            bio: "¡Bienvenido a mi nuevo Mini-Linktree!",
        }
    })
}