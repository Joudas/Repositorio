import type { UseMutateFunction } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";

export type loginData = {
    email: string;
    password: string;
}
export type LoginContextType = {
    loginData: loginData
    resetLoginForm: () => void,
    setLoginData: Dispatch<SetStateAction<loginData>>
    mutate:  UseMutateFunction<any, Error, any, unknown>;
    error: Error | null, 
    isError: boolean, 
    isPending: boolean,
}
