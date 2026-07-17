import { api } from "./api"

export type Card = {
    id: string, 
    title: string, 
    position?: number,
};

export const postCard = async (name: string): Promise<Card> => {
  return api.post<Card>("/api/board/card", { name });
};

export const getCardById = async (id: string): Promise<Card> => {
  return api.get<Card>(`/api/board/card/g/${id}`);
};

export const getCardList = async (boardId: string): Promise<Card[]> => {
  return api.get<Card[]>(`/api/board/card/g/${boardId}`);
};

export const deleteBoard = async (id: string, body: Card): Promise<Card> => {
  return api.put<Card>(`/api/board/card${id}`, body);
};

export const updateBoard = async (id: string): Promise<Card> => {
  return api.delete<Card>(`/api/board/card${id}`);
};

export const getInBox = async (id: string): Promise<Card> => {
  return api.get<Card>(`/api/board/card/gi/${id}`);
};
