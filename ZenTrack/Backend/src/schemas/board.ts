import { z } from "zod";

export const createBoardSchema = z.object({
  name: z
    .string({ message: "name es requerido" })
    .min(1, "name no puede estar vacío")
    .max(100, "name demasiado largo"),
  themeId: z
    .string({})
    .optional(),
});

export const updateBoardSchema = z.object({
  name: z
    .string()
    .min(1, "name no puede estar vacío")
    .max(100, "name demasiado largo")
    .optional(),
  themeId: z
    .string({})
    .optional(),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
