/*
  Warnings:

  - Made the column `customerCity` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `customerCounty` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `customerPhone` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "customerCity" SET NOT NULL,
ALTER COLUMN "customerCounty" SET NOT NULL,
ALTER COLUMN "customerPhone" SET NOT NULL;
