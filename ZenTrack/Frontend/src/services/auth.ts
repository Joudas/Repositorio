import { api } from "./api";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
};

export const registerUser = (
  email: string,
  password: string,
  name?: string
): Promise<AuthUser> => {
  return api.post<AuthUser>("/api/auth/register", { email, password, name });
}; 

export const loginUser = (
  email: string,
  password: string
): Promise<AuthUser> => {
  return api.post<AuthUser>("/api/auth/login", { email, password });
};

export const logoutUser = (): Promise<{ ok: boolean }> => {
  return api.post<{ ok: boolean }>("/api/auth/logout", {});
};

export const getMe = (): Promise<AuthUser> => {
  return api.get<AuthUser>("/api/auth/me");
};
