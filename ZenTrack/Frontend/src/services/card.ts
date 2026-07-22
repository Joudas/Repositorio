import { api } from "./api"

export type Card = {
    id: string, 
    title: string, 
    position?: number,
};

export const postCard = async (boardId: string, title: string): Promise<Card> => {
  return api.post<Card>("/api/board/card", { boardId, title });
};

export const deleteCard = async (id: string): Promise<void> => {
  return api.delete<void>(`/api/board/card/${id}`);
};

export const getCardById = async (id: string): Promise<Card> => {
  return api.get<Card>(`/api/board/card/g/${id}`);
};

export const getCardList = async (boardId: string): Promise<Card[]> => {
  return api.get<Card[]>(`/api/board/card/g/${boardId}`);
};

export const getInBox = async (id: string): Promise<Card> => {
  return api.get<Card>(`/api/board/card/gi/${id}`);
};
