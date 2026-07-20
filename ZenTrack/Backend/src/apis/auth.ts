import { Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/db.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema, type RegisterInput, type LoginInput } from "../schemas/auth.js";

const router: Router = Router();

const rawSecret = process.env["JWT_SECRET"];
if (!rawSecret) {
  throw new Error("JWT_SECRET environment variable is required");
}
const JWT_SECRET: string = rawSecret;

const SALT_ROUNDS = 10;
const COOKIE_MAX_AGE = 1000 * 60 * 15; // 15 minutes

// ─── Helpers ──────────────────────────────────────────────

function generateToken(user: { id: string; email: string }): string {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "15m",
  });
}

function setAuthCookie(res: Response, token: string): void {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

function clearAuthCookie(res: Response): void {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "strict",
    path: "/",
  });
}

// ─── POST /register — Crear cuenta ────────────────────────
router.post("/register", validate(registerSchema), async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body as RegisterInput;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    res.status(409).json({ error: "El email ya está registrado" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
    select: { id: true, email: true, name: true },
  });

  // Crear board por defecto con 3 cards
  const board = await prisma.board.create({
    data: {
      name: "Tutorial Board",
      userId: user.id,
      card: {
        create: [
          { title: "InBox", position: 0 },
          { title: "Doing", position: 1 },
          { title: "Done", position: 2 },
        ],
      },
    },
    select: { id: true, name: true },
  });

  const token = generateToken(user);
  setAuthCookie(res, token);

  res.status(201).json({ ...user, board });
});

// ─── POST /login — Iniciar sesión ─────────────────────────
router.post("/login", validate(loginSchema), async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as LoginInput;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true, name: true },
  });

  if (!user) {
    res.status(401).json({ error: "Credenciales inválidas" });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ error: "Credenciales inválidas" });
    return;
  }

  const token = generateToken(user);
  setAuthCookie(res, token);

  res.json({ id: user.id, email: user.email, name: user.name });
});

// ─── POST /logout — Cerrar sesión ─────────────────────────
router.post("/logout", (_req: Request, res: Response): void => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

// ─── GET /me — Obtener usuario actual ─────────────────────
router.get(
  "/me",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      res.status(401).json({ error: "Usuario no encontrado" });
      return;
    }

    res.json(user);
  }
);

export default router;
