/*
  Warnings:

  - You are about to drop the column `borrowerId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `lenderId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `reciever_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_borrowerId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_lenderId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "borrowerId",
DROP COLUMN "lenderId",
ADD COLUMN     "reciever_id" UUID NOT NULL,
ADD COLUMN     "sender_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_reciever_id_fkey" FOREIGN KEY ("reciever_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
