/*
  Warnings:

  - You are about to alter the column `defaultCommercialLicensePercentage` on the `PricingProfile` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `defaultUrgencyPercentage` on the `PricingProfile` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "PricingProfile" ALTER COLUMN "defaultCommercialLicensePercentage" DROP NOT NULL,
ALTER COLUMN "defaultCommercialLicensePercentage" DROP DEFAULT,
ALTER COLUMN "defaultCommercialLicensePercentage" SET DATA TYPE INTEGER,
ALTER COLUMN "defaultUrgencyPercentage" DROP NOT NULL,
ALTER COLUMN "defaultUrgencyPercentage" DROP DEFAULT,
ALTER COLUMN "defaultUrgencyPercentage" SET DATA TYPE INTEGER;
