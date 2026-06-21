import { create } from "zustand";

type AlertStoreType = {
    isOpen: boolean;
    message: string;
    isError: boolean;
    openAlert: (message: string, isError?: boolean) => void;
    closeAlert: () => void;
}

export const useAlertStore = create<AlertStoreType>((set) => ({
    isOpen: false,
    message: '',
    isError: false,
    openAlert: (message: string, isError = false) => set({ isOpen: true, message, isError:isError ?? false }),
    closeAlert: () => set({ isOpen: false, message: '', isError: false }),
}));