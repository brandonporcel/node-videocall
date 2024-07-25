/*
  Warnings:

  - A unique constraint covering the columns `[socket_id]` on the table `user_sockets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_sockets_socket_id_key" ON "user_sockets"("socket_id");
