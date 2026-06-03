import React, { createContext, useEffect, useState } from 'react';
import { registerUser } from '../../services/authService';

const RegisterContext = createContext();

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
const RegisterProvider = ({children}) => {

    const [state, setState] = useState(1);
    const [registerData, setRegisterData] = useState(registerForm);
    const [password, setPassword] = useState('');
    const [registerLoading, setRegisterLoading] = useState(false);
    const [registerError, setRegisterError] = useState('');

    const handleState = (value) => {
        setState(value);
    };

    const handleChangeData = (e) => {
        const { name, value } = e.target;
        setRegisterData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const submitRegister = async (confirmPassword) => {
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

    const resetRegisterForm = () => {
        setRegisterData(registerForm);
        setPassword('');
        setRegisterError('');
        setRegisterLoading(false);
        setState(1);
    };

    const data = {
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