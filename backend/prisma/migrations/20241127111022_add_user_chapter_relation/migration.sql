/*
  Warnings:

  - The values [ILLUSTRATION] on the enum `ContentType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `author_id` on the `chapter_content` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `chapter_content` table. All the data in the column will be lost.
  - Added the required column `cover_image` to the `chapters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContentType_new" AS ENUM ('TEXT', 'AUDIO');
ALTER TABLE "chapter_content" ALTER COLUMN "type" TYPE "ContentType_new" USING ("type"::text::"ContentType_new");
ALTER TYPE "ContentType" RENAME TO "ContentType_old";
ALTER TYPE "ContentType_new" RENAME TO "ContentType";
DROP TYPE "ContentType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "chapter_content" DROP CONSTRAINT "chapter_content_author_id_fkey";

-- AlterTable
ALTER TABLE "chapter_content" DROP COLUMN "author_id",
DROP COLUMN "transaction_id",
ADD COLUMN     "user_id" INTEGER;

-- AlterTable
ALTER TABLE "chapters" ADD COLUMN     "cover_image" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "chapter_content" ADD CONSTRAINT "chapter_content_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
