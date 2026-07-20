import { Router, type Request, type Response } from "express";
import { prisma } from "../utils/db.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createTodoSchema, updateTodoSchema, reorderTodosSchema, moveTodoSchema } from "../schemas/todo.js";
import type { MoveTodoInput } from "../schemas/todo.js";

const router: Router = Router();

// ─── POST / — Crear un todo ─────────────────────────────────
router.post(
  "/",
  requireAuth,
  validate(createTodoSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { cardId, title, description, energy, comments: _comments, endDate } = req.body;

    // Verificar ownership: card → board → user
    const card = await prisma.card.findFirst({
      where: { id: cardId },
      include: { board: { select: { userId: true } } },
    });

    if (!card || card.board.userId !== req.userId) {
      res.status(404).json({ error: "Card no encontrada" });
      return;
    }

    // Posición automática
    const lastTodo = await prisma.todo.findFirst({
      where: { cardId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    const position = (lastTodo?.position ?? -1) + 1;

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        energy,
        endDate: endDate ? new Date(endDate) : undefined,
        position,
        cardId,
      },
      select: {
        id: true, title: true, description: true, position: true,
        check: true, energy: true, endDate: true,
      },
    });

    res.status(201).json(todo);
  }
);

// ─── GET /:id — Obtener un todo por ID ──────────────────────
router.get(
  "/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const todoId = String(req.params.id);

    const todo = await prisma.todo.findFirst({
      where: { id: todoId },
      select: {
        id: true, title: true, description: true, position: true,
        check: true, energy: true, endDate: true, cardId: true,
        card: { select: { board: { select: { userId: true } } } },
      },
    });

    if (!todo || todo.card.board.userId !== req.userId) {
      res.status(404).json({ error: "Todo no encontrado" });
      return;
    }

    res.json(todo);
  }
);

// ─── GET /g/:cardId — Obtener todos de una card ─────────────
router.get(
  "/g/:cardId",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const cardId = String(req.params.cardId);

    const todos = await prisma.todo.findMany({
      where: { cardId },
      select: {
        id: true, title: true, description: true, position: true,
        check: true, energy: true, endDate: true, cardId: true,
        comments: { select: { id: true, text: true } },
      },
      orderBy: { position: "asc" },
    });

    res.json(todos);
  }
);

// ─── PUT /reorder — Reordenar todos ─────────────────────────
router.put(
  "/reorder",
  requireAuth,
  validate(reorderTodosSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { cardId, todos } = req.body;

    // Verificar ownership: card → board → user
    const card = await prisma.card.findFirst({
      where: { id: cardId },
      include: { board: { select: { userId: true } } },
    });

    if (!card || card.board.userId !== req.userId) {
      res.status(404).json({ error: "Card no encontrada" });
      return;
    }

    // Actualizar posiciones en una transacción
    await prisma.$transaction(
      todos.map((t: { id: string; position: number }) =>
        prisma.todo.update({
          where: { id: t.id },
          data: { position: t.position },
        })
      )
    );

    const updated = await prisma.todo.findMany({
      where: { cardId },
      select: {
        id: true, title: true, description: true, position: true,
        check: true, energy: true, endDate: true,
        comments: { select: { id: true, text: true } },
      },
      orderBy: { position: "asc" },
    });

    res.json(updated);
  }
);

// ─── PUT /move/:id — Mover un todo entre cards ───────────────
router.put(
  "/move/:id",
  requireAuth,
  validate(moveTodoSchema),
  async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const { targetCardId, position } = req.body as MoveTodoInput;

    // Ownership: todo → sourceCard → board → user
    const existing = await prisma.todo.findFirst({
      where: { id },
      include: { card: { include: { board: { select: { userId: true } } } } },
    });

    if (!existing || existing.card.board.userId !== req.userId) {
      res.status(404).json({ error: "Todo no encontrado" });
      return;
    }

    // Ownership: targetCard → board → user
    const targetCard = await prisma.card.findFirst({
      where: { id: targetCardId },
      include: { board: { select: { userId: true } } },
    });

    if (!targetCard || targetCard.board.userId !== req.userId) {
      res.status(404).json({ error: "Card destino no encontrada" });
      return;
    }

    // Si position no se envía, asignar última posición + 1 en la card destino
    let newPosition = position;
    if (newPosition === undefined) {
      const lastTodo = await prisma.todo.findFirst({
        where: { cardId: targetCardId },
        orderBy: { position: "desc" },
        select: { position: true },
      });
      newPosition = (lastTodo?.position ?? -1) + 1;
    }

    const updated = await prisma.todo.update({
      where: { id },
      data: {
        cardId: targetCardId,
        position: newPosition,
      },
      select: {
        id: true, title: true, description: true, position: true,
        check: true, energy: true, endDate: true, cardId: true,
        comments: { select: { id: true, text: true } },
      },
    });

    res.json(updated);
  }
);

// ─── PUT /:id — Actualizar un todo ──────────────────────────
router.put(
  "/:id",
  requireAuth,
  validate(updateTodoSchema),
  async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);

    // Ownership: todo → card → board → user
    const existing = await prisma.todo.findFirst({
      where: { id },
      include: { card: { include: { board: { select: { userId: true } } } } },
    });

    if (!existing || existing.card.board.userId !== req.userId) {
      res.status(404).json({ error: "Todo no encontrado" });
      return;
    }

    // Construir data dinámicamente con los campos que vienen en el body
    const updatableFields = [
      "title", "description", "position", "check",
      "energy", "endDate",
    ] as const;

    const data: Record<string, unknown> = {};
    for (const field of updatableFields) {
      if (req.body[field] !== undefined) {
        data[field] = field === "endDate" ? new Date(req.body[field]) : req.body[field];
      }
    }

    if (Object.keys(data).length === 0) {
      res.status(400).json({ error: "No hay campos para actualizar" });
      return;
    }

    const updated = await prisma.todo.update({
      where: { id },
      data,
      select: {
        id: true, title: true, description: true, position: true,
        check: true, energy: true, endDate: true,
      },
    });

    res.json(updated);
  }
);

// ─── DELETE /:id — Eliminar un todo ─────────────────────────
router.delete(
  "/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);

    // Ownership: todo → card → board → user
    const existing = await prisma.todo.findFirst({
      where: { id },
      include: { card: { include: { board: { select: { userId: true } } } } },
    });

    if (!existing || existing.card.board.userId !== req.userId) {
      res.status(404).json({ error: "Todo no encontrado" });
      return;
    }

    await prisma.todo.delete({ where: { id } });
    res.status(204).send();
  }
);

export default router;
