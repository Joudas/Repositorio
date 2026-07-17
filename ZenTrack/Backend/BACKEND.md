Estructura Base de datos.

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  boards    Board[]
  createdAt DateTime @default(now())
}

model Board {
  id        String   @id @default(uuid())
  name      String
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  lists   List[]
}

model List {
  id        String   @id @default(uuid())
  name      String   // Ej: "Por Hacer", "En Progreso", "Completado"
  position  Int      // Para mantener el orden de las columnas
  withdrawn boolean,
  listId   String
  list     list    @relation(fields: [listId], references: [id], onDelete: Cascade)
  cards     Card[]
}

model Card {
  id          String   @id @default(uuid())
  title       String
  description String?
  position    Int      // Para el ordenamiento al arrastrar y soltar
  energy      Energy   @default(MEDIA) // 
  
  comments

  color

  endDate // Proximamente


  Valor añadido: Sistema de energía
  listId    String
  list      List   @relation(fields: [listId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Energy {
  BAJA
  MEDIA
  ALTA
}