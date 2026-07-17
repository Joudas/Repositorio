import { z } from "zod";

export const createCardSchema = z.object({
  boardId: z.string({ message: "boardId es requerido" }),
  title: z
    .string({ message: "title es requerido" })
    .min(1, "title no puede estar vacío")
    .max(100, "title demasiado largo"),
});

export const updateCardSchema = z.object({
  title: z
    .string()
    .min(1, "title no puede estar vacío")
    .max(100, "title demasiado largo")
    .optional(),
});

export const reorderCardsSchema = z.object({
  boardId: z.string({ message: "boardId es requerido" }),
  cards: z.array(
    z.object({
      id: z.string(),
      position: z.int(),
    })
  ),
});

export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type ReorderCardsInput = z.infer<typeof reorderCardsSchema>;
