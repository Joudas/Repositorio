import { createContext, useContext, useState } from "react";
import { loginUser } from '../../services/authService';
import AuthContext from "../Auth/AuthContext";

const LoginContext = createContext();

const loginForm = {
    email: '',
    password: '',
};
const LoginProvider = ({ children }) => {

    const {loginAuth} = useContext(AuthContext);

    const [loginData, setLoginData] = useState(loginForm);
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const submitLogin = async () => {
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
            return { ok: false, message };
        } finally {
            setLoginLoading(false);
        }
    };

    const resetLoginForm = () => {
        setLoginData(loginForm);
        setLoginError('');
    }

    const data = {
        submitLogin, resetLoginForm,
        loginData, setLoginData
    }

    return <LoginContext.Provider value={data}>{children}</LoginContext.Provider>;
}

export default LoginContext;
export { LoginProvider };