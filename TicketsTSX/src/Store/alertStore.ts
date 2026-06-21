import { create } from 'zustand';

type AlertStore = {
    isOpen: boolean;
    message: string;
    openAlert: (message: string) => void;
    closeAlert: () => void;
};

export const useAlertStore = create<AlertStore>((set) => ({
    isOpen: false,
    message: '',
    openAlert: (message) => set({ isOpen: true, message }),
    closeAlert: () => set({ isOpen: false, message: '' }),
}));