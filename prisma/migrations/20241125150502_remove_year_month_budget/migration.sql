/*
  Warnings:

  - You are about to drop the column `month` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Budget` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "month",
DROP COLUMN "year";
