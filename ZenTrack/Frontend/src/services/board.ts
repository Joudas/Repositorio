import { api } from "./api"

export type Board = {
  id: string;
  name: string;
  themeId: string;
  modeZenCard?: string;
};

export const postBoard = async (name: string, themeId: string): Promise<Board> => {
  return api.post<Board>("/api/board", { name, themeId });
};

export const getBoardById = async (id: string): Promise<Board> => {
  return api.get<Board>(`/api/board/${id}`);
};

export const getBoardsList = async (): Promise<Board[]> => {
  return api.get<Board[]>("/api/board");
};

export const updateBoard = async (id: string, data: { name: string }): Promise<{ id: string; name: string }> => {
  return api.put(`/api/board/${id}`, data);
};

export const deleteBoard = async (id: string): Promise<void> => {
  return api.delete(`/api/board/${id}`);
};

export const updateModeZenCard = async (id: string, modeZenCard: string): Promise<{ id: string; modeZenCard: string }> => {
  return api.put(`/api/board/${id}/zen-card`, { modeZenCard });
};

export const updateBoardTheme = async (id: string, themeId: string): Promise<void> => {
  return api.put(`/api/board/theme/${id}`, { themeId });
};

import type { Theme } from "@/type/Theme";

export const getThemes = async (): Promise<Theme[]> => {
  return api.get<Theme[]>("/api/theme");
};
export const getThemeById = async (id: string): Promise<Theme> => {
  return api.get<Theme>(`/api/theme/${id}`);
};
