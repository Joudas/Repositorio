import { AuthHelper } from "@/_helpers/AuthHelper";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export const validateProfile = async () => {
    const {data: session} = await AuthHelper(await headers());
    const userId = session?.user.id;
    let profile = await prisma.perfil.findUnique({
        where: { userId }
    });
    return profile;
}