import { z } from "zod";

export const createTodoSchema = z.object({
  cardId: z.string({ message: "cardID es requerido" }),
  title: z
    .string({ message: "title es requerido" })
    .min(1, "title no puede estar vacío")
    .max(100, "title demasiado largo"),
  description: z.string().optional(),
  energy: z.enum(["BAJA", "MEDIA", "ALTA"]).optional(),
  comments: z.string().optional(),
  endDate: z.string().datetime().optional(),
});

export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(1, "title no puede estar vacío")
    .max(100, "title demasiado largo")
    .optional(),
  description: z.string().optional(),
  position: z.int().optional(),
  check: z.boolean().optional(),
  energy: z.enum(["BAJA", "MEDIA", "ALTA"]).optional(),
  comments: z.string().optional(),
  endDate: z.string().datetime().optional(),
});

export const reorderTodosSchema = z.object({
  cardId: z.string({ message: "cardID es requerido" }),
  todos: z.array(
    z.object({
      id: z.string(),
      position: z.int(),
    })
  ),
});

export const moveTodoSchema = z.object({
  targetCardId: z.string(),
  position: z.number().int().optional(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type ReorderTodosInput = z.infer<typeof reorderTodosSchema>;
export type MoveTodoInput = z.infer<typeof moveTodoSchema>;
