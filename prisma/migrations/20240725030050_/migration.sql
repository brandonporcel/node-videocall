/*
  Warnings:

  - A unique constraint covering the columns `[phone_number,owner_id]` on the table `contacts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "contacts_phone_number_owner_id_key" ON "contacts"("phone_number", "owner_id");
