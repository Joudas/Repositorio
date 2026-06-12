import React, { useState, type ChangeEvent } from 'react'
import type { RegisterData } from '../types';
import { registerUser } from '@/services/authService';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

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
export function useRegisterData(onSuccess?: () => void) {

    const [registerData, setRegisterData] = useState<RegisterData>(registerForm);
    const navigate = useNavigate();

    const handleChangeData = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        setRegisterData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const { mutate:submitRegister, isPending, error, isError } = useMutation({
        mutationFn: () => registerUser(registerData),
        onSuccess: () => {
            setRegisterData(registerForm);
            navigate('/login', { replace: true });
            onSuccess?.();
        },
        onError: () => {
            console.log("error");
        }
    })

    const data = {
        registerData,
        handleChangeData,
        submitRegister,
        isPending,
        error,
        isError
    }
  return data
}
