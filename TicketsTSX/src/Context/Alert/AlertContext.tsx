// context/AlertContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';

type AlertContextType = {
    isAlertOpen: boolean;
    message: string;
    openAlert: (message: string) => void;
    closeAlert: () => void;
};

const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [message, setMessage] = useState('');

    const openAlert = (msg: string) => {
        setMessage(msg);
        setIsAlertOpen(true);
    };
    const closeAlert = () => {
        setIsAlertOpen(false);
        setMessage('');
    };

    return (
        <AlertContext.Provider value={{ isAlertOpen, message, openAlert, closeAlert }}>
            {children}
        </AlertContext.Provider>
    );
}

export function useAlert() {
    const context = useContext(AlertContext);
    if (!context) throw new Error('useAlert debe usarse dentro de AlertProvider');
    return context;
}