/*
  Warnings:

  - A unique constraint covering the columns `[chapter_id]` on the table `chapter_content` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "chapter_content_chapter_id_key" ON "chapter_content"("chapter_id");
