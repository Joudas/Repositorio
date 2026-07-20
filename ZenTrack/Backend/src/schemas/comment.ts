import { z } from "zod";

export const createCommentSchema = z.object({
  todoId: z.string({ message: "todoId es requerido" }),
  text: z
    .string({ message: "text es requerido" })
    .min(1, "text no puede estar vacío")
    .max(500, "text demasiado largo"),
});

export const updateCommentSchema = z.object({
  text: z
    .string()
    .min(1, "text no puede estar vacío")
    .max(500, "text demasiado largo"),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
