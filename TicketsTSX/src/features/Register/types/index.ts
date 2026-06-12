import type { UseMutateFunction } from "@tanstack/react-query";

export type RegisterData = {
    id: string;
    name: string;
    lastname: string;
    rol: string;
    email: string;
    country: string;
    phone: string;
    password: string;
}
export type RegisterContextType = {
    state: number,
    handleState: (value: number) => void,
    registerData: RegisterData,
    handleChangeData: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void,
    validatePassword: (newPassword: string, onError:React.Dispatch<React.SetStateAction<string>>) => boolean,
    submitRegister: UseMutateFunction<any, Error, any, unknown>;
    isPending: boolean;
    isError: boolean;
    error: Error | null;
}