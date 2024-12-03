/*
  Warnings:

  - A unique constraint covering the columns `[user_id,book_id,type]` on the table `user_books` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "chapter_content_chapter_id_key";

-- DropIndex
DROP INDEX "user_books_user_id_book_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "user_books_user_id_book_id_type_key" ON "user_books"("user_id", "book_id", "type");
