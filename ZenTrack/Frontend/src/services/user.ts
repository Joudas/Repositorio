import { api } from "./api"

export type User = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
};

export type CreateUserPayload = {
  email: string;
  password: string;
  name?: string | null;
};

export const getUsers = async (): Promise<User[]> => {
  return api.get<User[]>("/api/users");
};

export const getUser = async (id: string): Promise<User> => {
  return api.get<User>(`/api/users/${id}`);
};