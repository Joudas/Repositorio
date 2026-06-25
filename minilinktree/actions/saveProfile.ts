"use server"
import { createProfile } from "./createProfile";

export const saveUserProfile = async (userId: string, name: string, email: string) => {
    await createProfile({ userId, name, email });
    return { success: true };
}