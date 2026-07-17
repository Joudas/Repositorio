import { api } from "./api"

export type Board = {
  id: string;
  name: string;
};

export const postBoard = async (name: string): Promise<Board> => {
  return api.post<Board>("/api/board", { name });
};

export const getBoardById = async (id: string): Promise<Board> => {
  return api.get<Board>(`/api/board/${id}`);
};

export const getBoardsList = async (): Promise<Board[]> => {
  return api.get<Board[]>("/api/board");
};

export const deleteBoard = async (id: string, body: Board): Promise<Board> => {
  return api.put<Board>(`/api/board/${id}`, body);
};

export const updateBoard = async (id: string): Promise<Board> => {
  return api.delete<Board>(`/api/board/${id}`);
};
