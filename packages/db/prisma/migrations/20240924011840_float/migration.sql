/*
  Warnings:

  - The `date` column on the `HistoricalData` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "HistoricalData" DROP COLUMN "date",
ADD COLUMN     "date" DOUBLE PRECISION;
