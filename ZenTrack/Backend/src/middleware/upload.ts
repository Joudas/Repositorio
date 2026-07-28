import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento en disco local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/themes/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    // Generamos un nombre único para evitar colisiones de archivos
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `theme-${uniqueSuffix}${ext}`);
  }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen.'), false);
  }
};

export const uploadThemeImage = multer({ storage, fileFilter });