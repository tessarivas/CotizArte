/*
  Warnings:

  - You are about to drop the `ProjectDigitalTool` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectSoftware` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectTraditionalMaterial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectTraditionalTool` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserDigitalTool` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSoftware` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserTraditionalMaterial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserTraditionalTool` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `DigitalTool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Software` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `TraditionalMaterial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `TraditionalTool` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectDigitalTool" DROP CONSTRAINT "ProjectDigitalTool_digitalToolId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectDigitalTool" DROP CONSTRAINT "ProjectDigitalTool_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectSoftware" DROP CONSTRAINT "ProjectSoftware_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectSoftware" DROP CONSTRAINT "ProjectSoftware_softwareId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectTraditionalMaterial" DROP CONSTRAINT "ProjectTraditionalMaterial_materialId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectTraditionalMaterial" DROP CONSTRAINT "ProjectTraditionalMaterial_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectTraditionalTool" DROP CONSTRAINT "ProjectTraditionalTool_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectTraditionalTool" DROP CONSTRAINT "ProjectTraditionalTool_toolId_fkey";

-- DropForeignKey
ALTER TABLE "UserDigitalTool" DROP CONSTRAINT "UserDigitalTool_digitalToolId_fkey";

-- DropForeignKey
ALTER TABLE "UserDigitalTool" DROP CONSTRAINT "UserDigitalTool_projectId_fkey";

-- DropForeignKey
ALTER TABLE "UserDigitalTool" DROP CONSTRAINT "UserDigitalTool_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSoftware" DROP CONSTRAINT "UserSoftware_projectId_fkey";

-- DropForeignKey
ALTER TABLE "UserSoftware" DROP CONSTRAINT "UserSoftware_softwareId_fkey";

-- DropForeignKey
ALTER TABLE "UserSoftware" DROP CONSTRAINT "UserSoftware_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserTraditionalMaterial" DROP CONSTRAINT "UserTraditionalMaterial_materialId_fkey";

-- DropForeignKey
ALTER TABLE "UserTraditionalMaterial" DROP CONSTRAINT "UserTraditionalMaterial_projectId_fkey";

-- DropForeignKey
ALTER TABLE "UserTraditionalMaterial" DROP CONSTRAINT "UserTraditionalMaterial_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserTraditionalTool" DROP CONSTRAINT "UserTraditionalTool_projectId_fkey";

-- DropForeignKey
ALTER TABLE "UserTraditionalTool" DROP CONSTRAINT "UserTraditionalTool_toolId_fkey";

-- DropForeignKey
ALTER TABLE "UserTraditionalTool" DROP CONSTRAINT "UserTraditionalTool_userId_fkey";

-- DropIndex
DROP INDEX "DigitalTool_name_key";

-- DropIndex
DROP INDEX "Software_name_key";

-- AlterTable
ALTER TABLE "DigitalTool" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Software" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TraditionalMaterial" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TraditionalTool" ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ProjectDigitalTool";

-- DropTable
DROP TABLE "ProjectSoftware";

-- DropTable
DROP TABLE "ProjectTraditionalMaterial";

-- DropTable
DROP TABLE "ProjectTraditionalTool";

-- DropTable
DROP TABLE "UserDigitalTool";

-- DropTable
DROP TABLE "UserSoftware";

-- DropTable
DROP TABLE "UserTraditionalMaterial";

-- DropTable
DROP TABLE "UserTraditionalTool";

-- AddForeignKey
ALTER TABLE "Software" ADD CONSTRAINT "Software_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalTool" ADD CONSTRAINT "DigitalTool_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TraditionalMaterial" ADD CONSTRAINT "TraditionalMaterial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TraditionalTool" ADD CONSTRAINT "TraditionalTool_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
