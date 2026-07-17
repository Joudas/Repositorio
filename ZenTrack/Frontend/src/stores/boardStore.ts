import { create } from "zustand";

interface BoardUIState {
  /** Panel de creación de board abierto/cerrado */
  formBoardOpen: boolean;
  setFormBoardOpen: (open: boolean) => void;
}

export const useBoardUIStore = create<BoardUIState>((set) => ({
  formBoardOpen: false,
  setFormBoardOpen: (open) => set({ formBoardOpen: open }),
}));
