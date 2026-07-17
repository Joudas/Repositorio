import { Router, type Request, type Response } from "express";
import { prisma } from "../utils/db.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createBoardSchema } from "../schemas/board.js";

const router: Router = Router();

// ─── POST / — Crear un board ───────────────────────────────
router.post(
  "/",
  requireAuth,
  validate(createBoardSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { name } = req.body as { name: string };
    const userId = req.userId!;

    const existingBoard = await validateBoard(name, userId);
    if(existingBoard.length) {
      res.status(201).json({
        "response": "Dashboard already used"
      });
      return
    }

    const board = await prisma.board.create({
      data: { name, userId },
      select: { id: true, name: true, userId: true },
    });

    res.status(201).json(board);
  }
);

// ─── GET / — Listar boards del usuario autenticado ─────────
router.get(
  "/",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;

    const boards = await prisma.board.findMany({
      where: { userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    res.json(boards);
  }
);

// ─── GET /:id — Obtener un board por ID ────────────────────
router.get(
  "/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const userId = req.userId!;

    const board = await prisma.board.findFirst({
      where: { id, userId },
      select: { id: true, name: true },
    });

    if (!board) {
      res.status(404).json({ error: "Board no encontrado" });
      return;
    }

    res.json(board);
  }
);

router.get(
  "/:name",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const name = String(req.params.name);
    const userId = req.userId!;

    const board = await prisma.board.findMany({
      where: { 
        name: {
          contains: name,
          mode: "insensitive"
        },
         userId
      },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    if (!board) {
      res.status(404).json({ error: "Board no encontrado" });
      return;
    }

    res.json(board);
  }
);

router.get(
  "/:id/:name",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const userId = req.userId!;

    const board = await prisma.board.findFirst({
      where: { id, userId }
    });

    if (!board) {
      res.status(404).json({ error: "Board no encontrado" });
      return;
    }
    res.json(board);
  }
);

// ─── PUT /:id — Actualizar un board ────────────────────────
router.put(
  "/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const userId = req.userId!;
    const { name } = req.body;

    const existing = await prisma.board.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({ error: "Board no encontrado" });
      return;
    }

    const board = await prisma.board.update({
      where: { id },
      data: { name },
      select: { id: true, name: true },
    });

    res.json(board);
  }
);

// ─── DELETE /:id — Eliminar un board ───────────────────────
router.delete(
  "/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const userId = req.userId!;

    const existing = await prisma.board.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({ error: "Board no encontrado" });
      return;
    }

    await prisma.board.delete({ where: { id } });
    res.status(204).send();
  }
);

const validateBoard = async (name: string, userId: string) => {
  const existingBoard = await prisma.board.findMany({
      where: { name, userId},
  });
  return existingBoard;
}

export default router;
