-- DropForeignKey
ALTER TABLE "UserSoftware" DROP CONSTRAINT "UserSoftware_softwareId_fkey";

-- AlterTable
ALTER TABLE "UserSoftware" ADD COLUMN "customName" TEXT,
ADD COLUMN "isCustom" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "softwareId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserSoftware" ADD CONSTRAINT "UserSoftware_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE SET NULL ON UPDATE CASCADE;