/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `user_chats` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "user_chats" DROP CONSTRAINT "user_chats_chat_id_fkey";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "user_chats" DROP COLUMN "deleted_at";

-- AddForeignKey
ALTER TABLE "user_chats" ADD CONSTRAINT "user_chats_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
