import { useAuth } from "@/Context/Auth/AuthContext";
import { loginUser } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { LoginContextType } from "../types";
import { useNavigate } from "react-router";

const LoginContext = createContext<LoginContextType | undefined>(undefined);

const loginForm = {
    email: '',
    password: '',
};
const LoginProvider = ({ children } : {children : ReactNode}) => {
    const navigate = useNavigate();
    const {loginAuth} = useAuth();
    const [loginData, setLoginData] = useState(loginForm);

    const {mutate, error, isError, isPending} = useMutation({
        mutationFn: () => loginUser(loginData),
        onSuccess: (response) => {
            loginAuth(response.access_token);
            resetLoginForm();
            navigate('/dashboard', { replace: true });
        }
    })

    const resetLoginForm = ():void => {
        setLoginData(loginForm);
    }

    const data: LoginContextType = {
        mutate, error, isError, isPending,
        resetLoginForm, loginData, setLoginData
    }

    return <LoginContext.Provider value={data}>{children}</LoginContext.Provider>;
}

export default LoginContext;
export { LoginProvider };

export const useLogin = (): LoginContextType => {
    const ctx = useContext(LoginContext);
    if (!ctx) throw new Error('useLogin must be used within LoginProvider');
    return ctx;
};
