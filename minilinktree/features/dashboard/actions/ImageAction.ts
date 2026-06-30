"use server"

import sharp from "sharp"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import crypto from "crypto"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const UploadImageAction = async (formData: FormData, fileType?: string) => {
  try {
    const file = formData.get("image") as File | null
    if (!file || file.size === 0) {
      return { success: false, error: "No se proporcionó ninguna imagen" }
    }

    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "La imagen es demasiado grande. El máximo es 5MB." }
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Formato de imagen no válido. Usa JPG, PNG, WebP o GIF." }
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${crypto.randomUUID()}.webp`
    const subDir = fileType ?? "uploads"
    const uploadDir = path.join(process.cwd(), `public/${subDir}`)

    await mkdir(uploadDir, { recursive: true })

    const processed = await sharp(buffer)
      .resize(800, 800, { fit: "cover", position: "center" })
      .webp({ quality: 80 })
      .toBuffer()

    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, processed)

    const imageUrl = `/${subDir}/${filename}`
    return { success: true, imageUrl }
  } catch (err) {
    console.error("Error al subir imagen:", err)
    return { success: false, error: "Error al procesar la imagen" }
  }
}
