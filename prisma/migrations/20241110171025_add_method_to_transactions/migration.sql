-- CreateEnum
CREATE TYPE "TransactionMethod" AS ENUM ('Cash', 'CreditCard', 'BankTransfer', 'DebitCard');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "method" "TransactionMethod";
