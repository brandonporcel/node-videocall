-- AddForeignKey
ALTER TABLE "user_sockets" ADD CONSTRAINT "user_sockets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
