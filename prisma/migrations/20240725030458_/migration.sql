-- CreateIndex
CREATE INDEX "ownerId_phoneNumber_unique" ON "contacts"("owner_id", "phone_number");
