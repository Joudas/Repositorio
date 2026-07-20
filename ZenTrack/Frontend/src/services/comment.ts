import { api } from "./api"
import { type Comment } from "@/type/Comment";

export const postComment = async (todoId: string, text: string): Promise<Comment> => {
  return api.post<Comment>("/api/board/card/todo/comment/", { todoId, text });
};

export const getCommentById = async (id: string): Promise<Comment> => {
  return api.get<Comment>(`/api/board/card/todo/comment/${id}`);
};

export const getComments = async (todoId: string): Promise<Comment[]> => {
  return api.get<Comment[]>(`/api/board/card/todo/comment/g/${todoId}`);
};

export const updateComment = async (id: string, data: Partial<Comment>): Promise<Comment> => {
  return api.put<Comment>(`/api/board/card/todo/comment/${id}`, data);
};

export const deleteComment = async (id: string): Promise<void> => {
  return api.delete<void>(`/api/board/card/todo/comment/${id}`);
};
