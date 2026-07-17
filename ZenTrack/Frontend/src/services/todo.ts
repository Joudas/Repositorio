import { api } from "./api"

export type Todo = {
  id: string;
  title: string;
  description: string | null;
  energy: "BAJA" | "MEDIA" | "ALTA" | null;
  comments: string | null;
  position: number;
  check: boolean;
  endDate: string | null;
};

export const postTodo = async (cardId: string, title: string): Promise<Todo> => {
  return api.post<Todo>("/api/board/card/todo", { cardId, title });
};

export const getTodoById = async (id: string): Promise<Todo> => {
  return api.get<Todo>(`/api/board/card/todo/${id}`);
};

export const getTodo = async (cardId: string): Promise<Todo[]> => {
  return api.get<Todo[]>(`/api/board/card/todo/g/${cardId}`);
};

export const updateTodo = async (id: string, data: Partial<Todo>): Promise<Todo> => {
  return api.put<Todo>(`/api/board/card/todo/${id}`, data);
};

export const deleteTodo = async (id: string): Promise<void> => {
  return api.delete<void>(`/api/board/card/todo/${id}`);
};
