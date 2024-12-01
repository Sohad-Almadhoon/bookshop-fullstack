/*
  Warnings:

  - The `text` column on the `chapter_content` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "chapter_content" DROP COLUMN "text",
ADD COLUMN     "text" TEXT[];
