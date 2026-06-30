"use server"
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthHelper } from "@/_helpers/AuthHelper";
import { Link } from "@prisma/client";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

const linkSchema = z.object({
  title: z.string().min(1, "El titulo es obligatorio"),
  url: z.string().url("Pon una url valida"),
  imageUrl: z.string().nullable().optional(),
});

const validateProfile = async () => {
    const {data: session} = await AuthHelper(await headers());
    const userId = session?.user.id;
    if (!userId) return null;

    let profile = await prisma.perfil.findUnique({
        where: { userId }
    });

    if (!profile) {
      profile = await prisma.perfil.create({
        data: {
          userId,
          username: session.user.email?.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") || `user_${userId.slice(0, 8)}`,
          displayName: session.user.name || "Usuario",
          bio: "¡Bienvenido a mi nuevo Mini-Linktree!",
        }
      });
    }

    return profile;
}

const toError = (err: unknown): string =>
  err instanceof Error ? err.message : typeof err === "string" ? err : "Error desconocido";

export const CreateLinkAction = async (body: {title:string, url:string, imageUrl?: string | null}) => {
    try{
        const profile = await validateProfile();

        if(!profile){
            return { success: false, error: "No se encontró el perfil para este usuario." };
        }

        const currentLinksCount = await prisma.link.count({
            where: { perfilId: profile?.id }
        });

        const dataParse = linkSchema.parse(body)
        const create = await prisma.link.create({
            data: {
                title: dataParse.title,
                url: dataParse.url,
                isActive: true,
                order: currentLinksCount,
                perfilId: profile?.id,
                imageUrl: dataParse.imageUrl
            }
        })

        const link = await prisma.link.findUnique({ where: { id: create.id } });
        revalidatePath("/dashboard");
        return{success: true, data: link, error: null};
    }catch(err){
        return{success: false, data:null, error: toError(err)};
    }
}

export const UpdateLinkAction = async (body: {title:string, url:string, imageUrl?: string | null}, id: string) =>  {
    try{
        const profile = await validateProfile();

        if(!profile){
            return { success: false, error: "No se encontró el perfil para este usuario." };
        }
        const data = linkSchema.parse(body);
        const updateData: { title: string; url: string, imageUrl?: string | null } = {
            title: data.title,
            url: data.url,
            imageUrl: data.imageUrl
        };

        const updateLink: Link = await prisma.link.update({
            where:{id},
            data: updateData
        })
        revalidatePath("/dashboard");

        return{success: true, data: updateLink, error: null};
    }catch(err){
        return{success: false, data:null, error: toError(err)};
    }
}

export const GetLinkAction = async () => {
    try{
        const profile = await validateProfile();

        if(!profile){
            return { success: false, error: "No se encontró el perfil para este usuario." };
        }
        const get = await prisma.link.findMany({
            where: { perfilId: profile.id },
            orderBy: { order: "asc" },
        });

        return { success: true, data: get };

    }catch(err){
        return { success: false, error: toError(err) };
    }
}

export const DeleteLinkAction = async (id: string) => {
    try{
        const profile = await validateProfile();

        if(!profile){
            return { success: false, error: "No se encontró el perfil para este usuario." };
        }
        const deleteLink: Link = await prisma.link.delete({
            where:{id}
        });
        revalidatePath("/dashboard");

        return{success: true, data: deleteLink, error: null};
    }catch(err){
        return{success: false, data:null, error: toError(err)};
    }
}
