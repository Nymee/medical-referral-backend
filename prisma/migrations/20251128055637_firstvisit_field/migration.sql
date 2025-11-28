/*
  Warnings:

  - Added the required column `score` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstVisitDate` to the `Outcome` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "score" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Outcome" ADD COLUMN     "firstVisitDate" BIGINT NOT NULL;
