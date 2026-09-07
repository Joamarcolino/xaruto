/*
  Warnings:

  - Added the required column `createdByUserId` to the `RecurrenceRule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecurrenceRule" ADD COLUMN     "createdByUserId" TEXT NOT NULL;
