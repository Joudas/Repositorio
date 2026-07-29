/*
  Warnings:

  - You are about to drop the column `boardId` on the `Theme` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Theme" DROP CONSTRAINT "Theme_boardId_fkey";

-- DropIndex
DROP INDEX "Theme_boardId_key";

-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "themeId" TEXT;

-- AlterTable
ALTER TABLE "Theme" DROP COLUMN "boardId";

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;
