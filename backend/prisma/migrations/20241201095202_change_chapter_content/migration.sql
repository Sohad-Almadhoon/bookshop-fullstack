/*
  Warnings:

  - You are about to drop the column `content` on the `chapter_content` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `chapter_content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chapter_content" DROP COLUMN "content",
DROP COLUMN "type",
ADD COLUMN     "audio" TEXT,
ADD COLUMN     "text" TEXT;

-- DropEnum
DROP TYPE "ContentType";
