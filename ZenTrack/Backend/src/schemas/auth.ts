import { z } from "zod";

export const registerSchema = z.object({
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

export const loginSchema = z.object({
  email: z
    .string({ message: "email es requerido" })
    .email("email no válido"),
  password: z
    .string({ message: "password es requerido" })
    .min(1, "password es requerido"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
