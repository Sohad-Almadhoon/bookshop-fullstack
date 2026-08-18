-- AlterTable
ALTER TABLE "chapters" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "actor_id" INTEGER,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "book_id" INTEGER,
    "chapter_id" INTEGER,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_user_id_read_created_at_idx" ON "notifications"("user_id", "read", "created_at");

-- CreateIndex
CREATE INDEX "book_comments_book_id_created_at_idx" ON "book_comments"("book_id", "created_at");

-- CreateIndex
CREATE INDEX "chapters_book_id_position_idx" ON "chapters"("book_id", "position");

-- CreateIndex
CREATE INDEX "messages_conversationId_createdAt_idx" ON "messages"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "user_books_book_id_type_idx" ON "user_books"("book_id", "type");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill: existing chapters keep the order they were created in, so the new
-- position column is meaningful from the first request instead of all zeros.
UPDATE "chapters" AS c
SET "position" = ordered.rn
FROM (
  SELECT "id", ROW_NUMBER() OVER (PARTITION BY "book_id" ORDER BY "created_at", "id") AS rn
  FROM "chapters"
) AS ordered
WHERE c."id" = ordered."id";
