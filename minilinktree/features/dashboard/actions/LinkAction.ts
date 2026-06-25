"use server"
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { AuthHelper } from "@/helpers/AuthHelper";
import { Link } from "@prisma/client";

const linkSchema = z.object({
  title: z.string().min(1, "El titulo es obligatorio"),
  url: z.string().url("Pon una url valida"),
});

const validateProfile = async () => {
    const {data: session} = await AuthHelper();
    const userId = session?.user.id;
    let profile = await prisma.perfil.findUnique({
        where: { userId }
    });
    return profile;
}

export const CreateLinkAction = async (body: {title:string, url:string}) => {
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
            }
        })
        // revalidatePath('/dashboard')
        return{success: true, data: create, error: null};
    }catch(err){
        return{success: false, data:null, error: err};
    }
}

export const UpdateLinkAction = async (body: {title:string, url:string}, id: string) =>  {
    try{
        const profile = await validateProfile();

        if(!profile){
            return { success: false, error: "No se encontró el perfil para este usuario." };
        }
        const data = linkSchema.parse(body);
        const updateLink: Link = await prisma.link.update({
            where:{id},
            data: {...data} // Peligro! Manda todo a la base de datos
        })
        // revalidatePath('/dashboard')
        return{success: true, data: updateLink, error: null};
    }catch(err){
        return{success: false, data:null, error: err};
    }
}

export const GetLinkAction = async () => {
    try{
        const profile = await validateProfile();

        if(!profile){
            return { success: false, error: "No se encontró el perfil para este usuario." };
        }
        const get = await prisma.link.findMany({
            where: { perfilId: profile.id }
        });
        return { success: true, data: get };

    }catch(err){
        return { success: false, error: err };
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
        return{success: true, data: deleteLink, error: null};
    }catch(err){
        return{success: false, data:null, error: err};
    }
}
