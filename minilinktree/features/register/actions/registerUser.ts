'use client'
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function registerUser() {
    const router = useRouter();

    const SignUp = async (formData: FormData) => {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const {data, error} = await authClient.signUp.email({
            email,
            password,
            name,
            callbackURL: `${origin}/dashboard`
        });

        if (error) {
            return;
        }
        if(data?.user){
            router.push("/login")
        }

    }
    return { SignUp }
}
