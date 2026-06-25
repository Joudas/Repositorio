"use client"
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation"

export const useSubmit = () => {
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const { data, error } = await authClient.signIn.email({
            email, // user email address
            password, // user password -> min 8 characters by default
            callbackURL: "/dashboard" // go to verifyEmail
        }, {
            onRequest: () => {
            },
            onSuccess: (ctx) => {
                router.push("/")
            },
            onError: (ctx) => {
                // display the error message
                alert(ctx.error.message);
            },
        });
    }

    return { handleSubmit }
}