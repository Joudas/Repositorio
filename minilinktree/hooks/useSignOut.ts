"use client"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation";

export const useSignOut = () => {

    const router = useRouter();

    const handleSignOut = async () => {
        const {error} = await authClient.signOut();
        if(error) alert("Error to close session");
        router.replace("/")
    }
    return {handleSignOut}
}