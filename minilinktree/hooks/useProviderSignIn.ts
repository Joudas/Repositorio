import { authClient } from "@/lib/auth-client";

export function useProviderSignIn() {
    const gitHubSignUp = async () => {
        const { data, error } = await authClient.signIn.social({
            provider: 'github',
            callbackURL: '/dashboard'
        });

    }
    const googleSignUp = async () => {
        const { data, error } = await authClient.signIn.social({
            provider: 'google',
            callbackURL: '/dashboard'
        });
    }
    return {gitHubSignUp, googleSignUp};
}