'use client'
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { saveUserProfile } from "@/actions/saveProfile";

export function registerUser() {
    const router = useRouter();

    const SignUp = async (formData: FormData) => {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // const isUnique = await findUnique(email)
        // if(isUnique) return alert("Email already used");

        const {data, error} = await authClient.signUp.email({
            email, // user email address
            password, // user password -> min 8 characters by default
            name, // user display name
            callbackURL: `${origin}/dashboard` // go to verifyEmail
        });

        if (error) {
            return;
        }
        if(data?.user){
            await saveUserProfile(data.user.id, data.user.name, data.user.email);
            router.push("/login")
        }

    }
    return { SignUp }
}
