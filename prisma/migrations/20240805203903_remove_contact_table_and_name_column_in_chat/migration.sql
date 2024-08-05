/*
  Warnings:

  - You are about to drop the `contacts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_target_id_fkey";

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "name" TEXT;

-- DropTable
DROP TABLE "contacts";
