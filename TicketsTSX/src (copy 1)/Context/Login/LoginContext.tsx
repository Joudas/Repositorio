import { createContext, useContext, useState, type ReactNode } from "react";
import { loginUser } from '../../services/authService';
import AuthContext from "../Auth/AuthContext";

type loginData = {
    email: string;
    password: string;
}
type LoginContextType = {
    loginData: loginData
    submitLogin: () => Promise<{
        ok: boolean;
        data: any;
        message?: undefined;
    }>,
    resetLoginForm: () => void,
    setLoginData: React.Dispatch<React.SetStateAction<loginData>>
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

const loginForm = {
    email: '',
    password: '',
};
const LoginProvider = ({ children } : {children : ReactNode}) => {

    const {loginAuth} = useContext(AuthContext);

    const [loginData, setLoginData] = useState(loginForm);
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const submitLogin = async (): Promise<{ ok: boolean; data: string; }> => {
        setLoginLoading(true);
        setLoginError('');

        try {
            const payload = {
                ...loginData,
            };

            const response = await loginUser(payload);
            setLoginData(loginForm);
            loginAuth(response.access_token);
            return { ok: true, data: response };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'No se pudo completar el inicio de sesión';
            setLoginError(message);
            return { ok: false, data: message };
        } finally {
            setLoginLoading(false);
        }
    };

    const resetLoginForm = ():void => {
        setLoginData(loginForm);
        setLoginError('');
    }

    const data: LoginContextType = {
        submitLogin, resetLoginForm,
        loginData, setLoginData
    }

    return <LoginContext.Provider value={data}>{children}</LoginContext.Provider>;
}

export default LoginContext;
export { LoginProvider };