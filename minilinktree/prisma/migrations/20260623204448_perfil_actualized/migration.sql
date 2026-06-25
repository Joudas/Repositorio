/*
  Warnings:

  - You are about to drop the column `slug` on the `Perfil` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Perfil` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Perfil` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Perfil` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Perfil_slug_key";

-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Perfil" DROP COLUMN "slug",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "theme" TEXT DEFAULT 'light',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Perfil_username_key" ON "Perfil"("username");
