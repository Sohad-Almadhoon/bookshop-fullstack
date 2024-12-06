/*
  Warnings:

  - You are about to drop the column `stripeId` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_stripeId_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "stripeId";
