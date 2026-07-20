import type { Todo } from "@/type/Todo";
import { create } from "zustand";

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
