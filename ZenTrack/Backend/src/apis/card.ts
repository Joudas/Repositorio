import { Router, type Request, type Response } from "express";
import { prisma } from "../utils/db.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createCardSchema, updateCardSchema, reorderCardsSchema } from "../schemas/card.js";

const router: Router = Router();

// ─── POST / — Crear una card ────────────────────────────────
router.post(
  "/",
  requireAuth,
  validate(createCardSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { boardId, title } = req.body;
    const userId = req.userId!;

    // Verificar que el board pertenece al usuario
    const board = await prisma.board.findFirst({
      where: { id: boardId, userId },
    });
    if (!board) {
      res.status(404).json({ error: "Board Dont Exist" });
      return;
    }

    //Validar que la card no existe en la board
    const cardExist = await prisma.card.findFirst({
      where: {title, boardId},
    })
    if(cardExist) res.status(422).json({message: "Card Already Exist"});

    // Asignar posición automática
    const lastCard = await prisma.card.findFirst({
      where: { boardId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    
    const position = (lastCard?.position ?? -1) + 1;

    const card = await prisma.card.create({
      data: {
        title,
        position,
        boardId,
      },
      select: {
        id: true, title: true,
      },
    });

    res.status(201).json(card);
  }
);

// ─── GET /:id — Obtener una card por su ID ──────────────────
router.get(
  "/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);

    const card = await prisma.card.findFirst({
      where: {id},
      select: {
        id: true, title: true, boardId: true,
      },
    });


    if (!card) {
      res.status(404).json({ error: "Card no encontrada" });
      return;
    }

    // Verificar ownership a través del board
    const board = await prisma.board.findFirst({
      where: { id: card.boardId, userId: req.userId! },
    });
    if (!board) {
      res.status(403).json({ error: "No autorizado" });
      return;
    }



    res.json(card);
  }
);

// ─── GET /g/:boardId — Obtener cards de un board ────────
router.get(
  "/g/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const boardId = String(req.params.id);
    const userId = req.userId!;

    // Verificar ownership del board
    const board = await prisma.board.findFirst({
      where: { id: boardId, userId },
      select: { id: true },
    });
    if (!board) {
      res.status(404).json({ error: "Board no encontrado" });
      return;
    }

    const cards = await prisma.card.findMany({
      where: { 
        boardId,
        title: { not: 'InBox' },
      },
      select: {
        id: true, title: true, position: true,
      },
      orderBy: { position: "asc" },
    });

    res.json(cards);
  }
);


// GET InBox

router.get(
  "/gi/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const boardId = String(req.params.id);

    const userId = req.userId!;

    // Verificar ownership del board
    const board = await prisma.board.findFirst({
      where: { id: boardId, userId },
    });
    if (!board) {
      res.status(404).json({ error: "Board no encontrado" });
      return;
    }

    const inBox = await prisma.card.findFirst({
      where: { 
          title: 'InBox',
          boardId,
       }
    });

    res.json(inBox);
  }
)

// ─── PUT /reorder — Reordenar cards (debe ir ANTES de /:id) ─
router.put(
  "/reorder",
  requireAuth,
  validate(reorderCardsSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { boardId, cards } = req.body;
    const userId = req.userId!;

    // Verificar ownership del board
    const board = await prisma.board.findFirst({
      where: { id: boardId, userId },
    });
    if (!board) {
      res.status(404).json({ error: "Board no encontrado" });
      return;
    }

    // Actualizar posiciones en una transacción
    await prisma.$transaction(
      cards.map((c: { id: string; position: number }) =>
        prisma.card.update({
          where: { id: c.id },
          data: { position: c.position },
        })
      )
    );

    const updated = await prisma.card.findMany({
      where: { boardId },
      select: {
        id: true, title: true,    
      },
      orderBy: { position: "asc" },
    });

    res.json(updated);
  }
);

// ─── PUT /:id — Actualizar una card ─────────────────────────
router.put(
  "/:id",
  requireAuth,
  validate(updateCardSchema),
  async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);

    // Ownership: card → board → user
    const existing = await prisma.card.findFirst({
      where: { id },
      include: { board: { select: { userId: true } } },
    });

    if (!existing) {
      res.status(404).json({ error: "Card no encontrada" });
      return;
    }
    if (existing.board.userId !== req.userId) {
      res.status(403).json({ error: "No autorizado" });
      return;
    }

    // Construir data dinámicamente con los campos que vienen en el body
    const updatableFields = [
      "title",
    ] as const;

    const data: Record<string, unknown> = {};
    for (const field of updatableFields) {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
      }
    }

    if (Object.keys(data).length === 0) {
      res.status(400).json({ error: "No hay campos para actualizar" });
      return;
    }

    const card = await prisma.card.update({
      where: { id },
      data,
      select: {
        id: true, title: true, position: true,
      },
    });

    res.json(card);
  }
);

// ─── DELETE /:id — Eliminar una card ────────────────────────
router.delete(
  "/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);

    // Ownership: card → board → user
    const existing = await prisma.card.findFirst({
      where: { id },
      include: { board: { select: { userId: true } } },
    });

    if (!existing) {
      res.status(404).json({ error: "Card no encontrada" });
      return;
    }
    if (existing.board.userId !== req.userId) {
      res.status(403).json({ error: "No autorizado" });
      return;
    }

    await prisma.card.delete({ where: { id } });
    res.status(204).send();
  }
);

export default router;
