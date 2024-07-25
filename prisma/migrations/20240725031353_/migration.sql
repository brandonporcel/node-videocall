-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_target_id_fkey";

-- AlterTable
ALTER TABLE "contacts" ALTER COLUMN "target_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
