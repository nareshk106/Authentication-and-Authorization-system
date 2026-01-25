/*
  Warnings:

  - Made the column `name` on table `Cat` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Cat" ALTER COLUMN "name" SET NOT NULL;
