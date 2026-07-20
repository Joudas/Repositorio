import { Router, type Request, type Response } from "express";
import { prisma } from "../utils/db.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createCommentSchema, updateCommentSchema } from "../schemas/comment.js";

const router: Router = Router();

// ─── POST / — Crear un comment ──────────────────────────────
router.post(
  "/",
  requireAuth,
  validate(createCommentSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { todoId, text } = req.body;

    // Verificar ownership: comment → todo → card → board → user
    const todo = await prisma.todo.findFirst({
      where: { id: todoId },
      include: { card: { select: { board: { select: { userId: true } } } } },
    });

    if (!todo || todo.card.board.userId !== req.userId) {
      res.status(404).json({ error: "Todo no encontrado" });
      return;
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        todoId,
      },
      select: {
        id: true, text: true, todoId: true,
      },
    });

    res.status(201).json(comment);
  }
);

// ─── GET /g/:todoId — Obtener comments de un todo ─────────
router.get(
  "/g/:todoId",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const todoId = String(req.params.todoId);

    // Verificar ownership: todo → card → board → user
    const todo = await prisma.todo.findFirst({
      where: { id: todoId },
      include: { card: { select: { board: { select: { userId: true } } } } },
    });

    if (!todo || todo.card.board.userId !== req.userId) {
      res.status(404).json({ error: "Todo no encontrado" });
      return;
    }

    const comments = await prisma.comment.findMany({
      where: { todoId },
      select: {
        id: true, text: true, todoId: true,
      },
      orderBy: { id: "asc" },
    });

    res.json(comments);
  }
);

// ─── PUT /:id — Actualizar un comment ─────────────────────
router.put(
  "/:id",
  requireAuth,
  validate(updateCommentSchema),
  async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);

    // Ownership: comment → todo → card → board → user
    const existing = await prisma.comment.findFirst({
      where: { id },
      include: { todo: { select: { card: { select: { board: { select: { userId: true } } } } } } },
    });

    if (!existing || existing.todo.card.board.userId !== req.userId) {
      res.status(404).json({ error: "Comment no encontrado" });
      return;
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: { text: req.body.text },
      select: { id: true, text: true, todoId: true },
    });

    res.json(updated);
  }
);

// ─── DELETE /:id — Eliminar un comment ────────────────────
router.delete(
  "/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);

    // Ownership: comment → todo → card → board → user
    const existing = await prisma.comment.findFirst({
      where: { id },
      include: { todo: { select: { card: { select: { board: { select: { userId: true } } } } } } },
    });

    if (!existing || existing.todo.card.board.userId !== req.userId) {
      res.status(404).json({ error: "Comment no encontrado" });
      return;
    }

    await prisma.comment.delete({ where: { id } });
    res.status(204).send();
  }
);

export default router;
