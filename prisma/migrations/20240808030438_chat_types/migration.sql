-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('group', 'direct');

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "type" "ChatType" NOT NULL DEFAULT 'direct';
