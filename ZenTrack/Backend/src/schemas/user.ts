import { z } from "zod";

export const createUserSchema = z.object({
  email: z
    .string({ message: "email es requerido" })
    .email("email no válido"),
  password: z
    .string({ message: "password es requerido" })
    .min(6, "password debe tener al menos 6 caracteres")
    .max(100, "password demasiado largo"),
  name: z
    .string()
    .min(1, "name no puede estar vacío")
    .max(100, "name demasiado largo")
    .optional()
    .nullable()
    .default(null),
});

export const updateUserSchema = z.object({
  email: z
    .string()
    .email("email no válido")
    .optional(),
  password: z
    .string()
    .min(6, "password debe tener al menos 6 caracteres")
    .max(100, "password demasiado largo")
    .optional(),
  name: z
    .string()
    .min(1, "name no puede estar vacío")
    .max(100, "name demasiado largo")
    .optional()
    .nullable(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
