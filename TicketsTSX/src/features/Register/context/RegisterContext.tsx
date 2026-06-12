import React, { createContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import type { RegisterContextType } from '../types';
import { useRegisterData } from '../hooks/useRegisterData';

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

const RegisterProvider = ({children} : {children : ReactNode}) => {

    const {registerData, handleChangeData, submitRegister, isPending, error, isError} = useRegisterData();

    const [state, setState] = useState(1);

    const handleState = (value: number) => {
        setState(value);
    };
    

    const validatePassword = (newPassword:string, onError:Dispatch<SetStateAction<string>>): boolean => {
        if(newPassword === registerData.password) return true;
        onError('Las contraseñas no coinciden');
        return false;
    }

    const data = {
        state,
        registerData,
        handleState,
        validatePassword,
        handleChangeData,
        submitRegister, 
        isPending, 
        error,
        isError
    };

    return <RegisterContext.Provider value={data}>{children}</RegisterContext.Provider>;
};

export default RegisterContext;
export {RegisterProvider};

export const useRegister = (): RegisterContextType => {
    const ctx = React.useContext(RegisterContext);
    if (!ctx) throw new Error('useRegister must be used within RegisterProvider');
    return ctx;
};