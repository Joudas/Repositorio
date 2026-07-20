import "dotenv/config";
import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "./utils/db.js";
import userRouter from "./apis/user.js";
import authRouter from "./apis/auth.js";
import boardRouter from "./apis/board.js";
import cardRouter from "./apis/card.js";
import todoRouter from "./apis/todo.js";
import commentRouter from "./apis/comment.js";

const app: Express = express();
const PORT = process.env["PORT"] ?? 3001;

// ─── Middleware global ─────────────────────────────────────
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}));

// ─── Rutas ────────────────────────────────────────────────

// Health check
app.get("/api/health", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown database error";
    res
      .status(503)
      .json({ status: "error", database: "disconnected", detail: message });
  }
});

// CRUD de usuarios: GET, POST, PUT, DELETE /api/users/**
app.use("/api/users", userRouter);

// Autenticación: register, login, logout, me
app.use("/api/auth", authRouter);

app.use("/api/board/card/todo/comment", commentRouter);
app.use("/api/board/card/todo", todoRouter);
app.use("/api/board/card", cardRouter);
app.use("/api/board", boardRouter);

// ─── Inicio del servidor ──────────────────────────────────

app.listen(PORT, () => {
  console.log(`🚀 ZenTrack API corriendo en http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});

export default app;
