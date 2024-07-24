/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `calls` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `user_calls` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "calls" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "user_calls" DROP COLUMN "deleted_at";

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
