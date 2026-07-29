import { Router, type Request, type Response } from "express";
import { prisma } from "../utils/db.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadThemeImage } from '../middleware/upload';

const router: Router = Router();

router.post(
  "/",
  requireAuth,
  uploadThemeImage.single('image'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, mode, color_one, color_two } = req.body;

      // Si se subió una imagen, construimos la ruta relativa
      let imagePath: string | null = "";
      if(mode == "IMAGE"){
        if (req.file) {
          imagePath = `/uploads/themes/${req.file.filename}`;
        }
      }

      const theme = await prisma.theme.create({
        data: {
          name,
          mode,
          color_one,
          color_two,
          image: imagePath, // Se guarda la URL o String ej: "/uploads/themes/theme-123.jpg"
        },
        select: { id: true, name: true },
      });

      res.status(201).json(theme);
    } catch (error) {
      console.error('Error creando el tema:', error);
      res.status(500).json({ error: 'Error interno al guardar el tema.' });
    }
  }
);

router.get(
  "/",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const themes = await prisma.theme.findMany({
      select: { id: true, mode: true, color_one: true, color_two: true, image: true },
    });
    res.status(200).json(themes);
  }
);

router.get(
  "/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const theme = await prisma.theme.findFirst({
      where: { id },
      select: { id: true, mode: true, color_one: true, color_two: true, image: true },
    });
    res.status(200).json(theme);
  }
);

router.put(
  "/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const userId = req.userId!;
    const { themeId } = req.body;

    const existing = await prisma.board.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({ error: "Board no encontrado" });
      return;
    }

    const board = await prisma.board.update({ 
      where: { id },
      data: { themeId },
      select: { 
          id: true,
          name: true,
          mode: true,
          color_one: true,
          color_two: true,
          image: true
      }, 
    });
    res.json(board);
  }
);



const validateBoard = async (name: string, userId: string) => {
  const existingBoard = await prisma.board.findMany({
      where: { name, userId },
      select: { id: true },
  });
  return existingBoard;
}

export default router;
