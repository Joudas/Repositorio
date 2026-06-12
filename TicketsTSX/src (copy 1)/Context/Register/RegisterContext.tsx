import React, { createContext, useState, type ReactNode } from 'react';
import { registerUser } from '../../services/authService';

type RegisterData = {
    id: string;
    name: string;
    lastname: string;
    rol: string;
    email: string;
    country: string;
    phone: string;
    password: string;
}
type RegisterContextType = {
    state: number,
    handleState: (value: number) => void,
    registerData: RegisterData,
    handleChangeData: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void,
    password: string,
    setPassword: React.Dispatch<React.SetStateAction<string>>,
    submitRegister : (confirmPassword: string) => Promise<{
        ok: boolean;
        message: string;
        data?: undefined;
    } | {
        ok: boolean;
        data: any;
        message?: undefined;
    }>
    registerLoading: boolean,
    registerError: string,
    resetRegisterForm: () => void,
}
const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

const registerForm = {
    id: '',
    name: '',
    lastname: '',
    rol: '',
    email: '',
    country: 'Colombia',
    phone: '',
    password: '',
};

const RegisterProvider = ({children} : {children : ReactNode}) => {

    const [state, setState] = useState(1);
    const [registerData, setRegisterData] = useState<RegisterData>(registerForm);
    const [password, setPassword] = useState('');
    const [registerLoading, setRegisterLoading] = useState(false);
    const [registerError, setRegisterError] = useState('');

    const handleState = (value: number) => {
        setState(value);
    };

    const handleChangeData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        setRegisterData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const submitRegister = async (confirmPassword: string) => {
        if (password !== confirmPassword) {
            const message = 'Las contraseñas no coinciden';
            setRegisterError(message);
            return { ok: false, message };
        }

        setRegisterLoading(true);
        setRegisterError('');

        try {
            const payload = {
                ...registerData,
                password: confirmPassword,
            };

            const response = await registerUser(payload);
            setRegisterData(registerForm);
            setPassword('');
            return { ok: true, data: response };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'No se pudo completar el registro';
            setRegisterError(message);
            return { ok: false, message };
        } finally {
            setRegisterLoading(false);
        }
    };

    const resetRegisterForm = (): void => {
        setRegisterData(registerForm);
        setPassword('');
        setRegisterError('');
        setRegisterLoading(false);
        setState(1);
    };

    const data: RegisterContextType = {
        state,
        handleState,
        registerData,
        handleChangeData,
        password,
        setPassword,
        submitRegister,
        registerLoading,
        registerError,
        resetRegisterForm,
    };

    return <RegisterContext.Provider value={data}>{children}</RegisterContext.Provider>;
};

export default RegisterContext;
export {RegisterProvider};