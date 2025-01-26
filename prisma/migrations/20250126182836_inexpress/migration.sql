-- CreateEnum
CREATE TYPE "mode" AS ENUM ('Bank', 'UPI');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "number" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Balance" (
    "id" SERIAL NOT NULL,
    "userid" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "totalTransation" BIGINT NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transation" (
    "id" SERIAL NOT NULL,
    "amount" BIGINT NOT NULL,
    "senderid" TEXT NOT NULL,
    "recieverid" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "mode" "mode" NOT NULL,

    CONSTRAINT "Transation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_number_key" ON "User"("number");
