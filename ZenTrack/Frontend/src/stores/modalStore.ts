import { create } from "zustand";
import type { Todo } from "@/services/todo";

interface ModalState {
  todo: Todo | null;
  isOpen: boolean;
  open: (todo: Todo) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  todo: null,
  isOpen: false,
  open: (todo) => set({ todo, isOpen: true }),
  close: () => set({ isOpen: false }),
}));
