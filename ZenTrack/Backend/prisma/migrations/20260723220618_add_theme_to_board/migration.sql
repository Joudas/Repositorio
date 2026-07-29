/*
  Warnings:

  - You are about to drop the column `theme` on the `Board` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('COLOR', 'IMAGE');

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "theme";

-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL,
    "mode" "Mode" NOT NULL DEFAULT 'COLOR',
    "color_one" TEXT,
    "color_two" TEXT,
    "image" TEXT,
    "boardId" TEXT NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Theme_boardId_key" ON "Theme"("boardId");

-- AddForeignKey
ALTER TABLE "Theme" ADD CONSTRAINT "Theme_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
