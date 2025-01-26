/*
  Warnings:

  - A unique constraint covering the columns `[userid]` on the table `Balance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Balance_userid_key" ON "Balance"("userid");
