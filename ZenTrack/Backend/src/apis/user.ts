import { Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../utils/db.js";
import { validate } from "../middleware/validate.js";
import { createUserSchema, updateUserSchema, type CreateUserInput, type UpdateUserInput } from "../schemas/user.js";

const router: Router = Router();
const SALT_ROUNDS = 10;

// ─── GET / — Listar todos los usuarios ────────────────────
router.get("/", async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, createdAt: true },
  });
  res.json(users);
});

// ─── GET /:id — Obtener un usuario por ID ─────────────────
router.get("/:id", async (req: Request, res: Response) => {
  const id = String(req.params.id);

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  if (!user) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  res.json(user);
});

// ─── POST / — Crear un usuario ─────────────────────────────
router.post("/", validate(createUserSchema), async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body as CreateUserInput;

  const existe = await prisma.user.findUnique({ where: { email } });
  if (existe) {
    res.status(409).json({ error: "El email ya está registrado" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { 
      name,
      email, 
      password: hashedPassword, 
     },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  res.status(201).json(user);
});

// ─── PUT /:id — Actualizar un usuario ─────────────────────
router.put("/:id", validate(updateUserSchema), async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const data = req.body as UpdateUserInput;

  const existe = await prisma.user.findUnique({ where: { id } });
  if (!existe) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  // Si viene password, lo hasheamos antes de guardar
  if (data.password) {
    data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, name: true, createdAt: true },
  });

  res.json(user);
});

// ─── DELETE /:id — Eliminar un usuario ────────────────────
router.delete("/:id", async (req: Request, res: Response) => {
  const id = String(req.params.id);

  const existe = await prisma.user.findUnique({ where: { id } });
  if (!existe) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  await prisma.user.delete({ where: { id } });
  res.status(204).send();
});

export default router;
