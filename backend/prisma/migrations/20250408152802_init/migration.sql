-- CreateTable
CREATE TABLE "ArtCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtType" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "baseFormula" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtTechnique" (
    "id" SERIAL NOT NULL,
    "artTypeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceMultiplier" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtTechnique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profileImageUrl" TEXT,
    "bio" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "artTypeId" INTEGER NOT NULL,
    "standardHourlyRate" DOUBLE PRECISION NOT NULL,
    "preferredHourlyRate" DOUBLE PRECISION NOT NULL,
    "projectsPerMonth" INTEGER NOT NULL,
    "defaultCommercialLicensePercentage" DOUBLE PRECISION NOT NULL DEFAULT 30,
    "defaultUrgencyPercentage" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "artTypeId" INTEGER NOT NULL,
    "artTechniqueId" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "detailLevel" INTEGER NOT NULL,
    "size" TEXT,
    "duration" INTEGER,
    "hoursWorked" DOUBLE PRECISION NOT NULL,
    "isCommercial" BOOLEAN NOT NULL DEFAULT false,
    "rapidDelivery" BOOLEAN NOT NULL DEFAULT false,
    "clientId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "commercialLicenseFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "urgencyFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "materialsCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "toolsCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "softwareCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "additionalFees" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "finalPrice" DOUBLE PRECISION NOT NULL,
    "discountPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "finalPriceAfterDiscount" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL,
    "shareableLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Software" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "monthlyCost" DOUBLE PRECISION NOT NULL,
    "annualCost" DOUBLE PRECISION NOT NULL,
    "hasFreeVersion" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Software_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSoftware" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "softwareId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "licenseType" TEXT NOT NULL,
    "actualCost" DOUBLE PRECISION NOT NULL,
    "projectId" INTEGER,
    "usageStartDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSoftware_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigitalTool" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "averageCost" DOUBLE PRECISION NOT NULL,
    "averageLifespan" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DigitalTool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDigitalTool" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "digitalToolId" INTEGER NOT NULL,
    "purchasePrice" DOUBLE PRECISION NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "projectId" INTEGER,

    CONSTRAINT "UserDigitalTool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TraditionalMaterial" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subCategory" TEXT NOT NULL,
    "quality" TEXT NOT NULL,
    "averageCost" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TraditionalMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTraditionalMaterial" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "actualCost" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "projectId" INTEGER,

    CONSTRAINT "UserTraditionalMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TraditionalTool" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "averageCost" DOUBLE PRECISION NOT NULL,
    "averageLifespan" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TraditionalTool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTraditionalTool" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "toolId" INTEGER NOT NULL,
    "purchasePrice" DOUBLE PRECISION NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "projectId" INTEGER,

    CONSTRAINT "UserTraditionalTool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigitalIllustration" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "illustrationType" TEXT NOT NULL,
    "additionalModifications" INTEGER NOT NULL DEFAULT 0,
    "modificationCost" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "DigitalIllustration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoEditing" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "editingType" TEXT NOT NULL,
    "stockFootageCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "musicSoundCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pluginsCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "includedRevisions" INTEGER NOT NULL DEFAULT 2,
    "additionalRevisions" INTEGER NOT NULL DEFAULT 0,
    "revisionCost" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "VideoEditing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Painting" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "technique" TEXT NOT NULL,
    "canvasPaperCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paintsCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "finishingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "framingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "shipping" BOOLEAN NOT NULL DEFAULT false,
    "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "authenticityCertificate" BOOLEAN NOT NULL DEFAULT false,
    "certificateCost" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Painting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drawing" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "technique" TEXT NOT NULL,
    "paperCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "materialsCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "finishingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "framingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "shipping" BOOLEAN NOT NULL DEFAULT false,
    "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "authenticityCertificate" BOOLEAN NOT NULL DEFAULT false,
    "certificateCost" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Drawing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discount" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validTo" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketComparison" (
    "id" SERIAL NOT NULL,
    "artTypeId" INTEGER NOT NULL,
    "artTechniqueId" INTEGER,
    "platformName" TEXT NOT NULL,
    "minPrice" DOUBLE PRECISION NOT NULL,
    "maxPrice" DOUBLE PRECISION NOT NULL,
    "averagePrice" DOUBLE PRECISION NOT NULL,
    "detailLevel" INTEGER,
    "comparisonDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketComparison_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommercialLicense" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "percentageIncrease" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommercialLicense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectSoftware" (
    "projectId" INTEGER NOT NULL,
    "softwareId" INTEGER NOT NULL,

    CONSTRAINT "ProjectSoftware_pkey" PRIMARY KEY ("projectId","softwareId")
);

-- CreateTable
CREATE TABLE "ProjectDigitalTool" (
    "projectId" INTEGER NOT NULL,
    "digitalToolId" INTEGER NOT NULL,

    CONSTRAINT "ProjectDigitalTool_pkey" PRIMARY KEY ("projectId","digitalToolId")
);

-- CreateTable
CREATE TABLE "ProjectTraditionalMaterial" (
    "projectId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ProjectTraditionalMaterial_pkey" PRIMARY KEY ("projectId","materialId")
);

-- CreateTable
CREATE TABLE "ProjectTraditionalTool" (
    "projectId" INTEGER NOT NULL,
    "toolId" INTEGER NOT NULL,

    CONSTRAINT "ProjectTraditionalTool_pkey" PRIMARY KEY ("projectId","toolId")
);

-- CreateTable
CREATE TABLE "QuoteMarketComparison" (
    "id" SERIAL NOT NULL,
    "quoteId" INTEGER NOT NULL,
    "platformName" TEXT NOT NULL,
    "comparablePrice" DOUBLE PRECISION NOT NULL,
    "url" TEXT NOT NULL,
    "comparisonDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteMarketComparison_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArtCategory_name_key" ON "ArtCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_shareableLink_key" ON "Quote"("shareableLink");

-- CreateIndex
CREATE UNIQUE INDEX "Software_name_key" ON "Software"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DigitalTool_name_key" ON "DigitalTool"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DigitalIllustration_projectId_key" ON "DigitalIllustration"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoEditing_projectId_key" ON "VideoEditing"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Painting_projectId_key" ON "Painting"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Drawing_projectId_key" ON "Drawing"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "CommercialLicense_name_key" ON "CommercialLicense"("name");

-- AddForeignKey
ALTER TABLE "ArtType" ADD CONSTRAINT "ArtType_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ArtCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtTechnique" ADD CONSTRAINT "ArtTechnique_artTypeId_fkey" FOREIGN KEY ("artTypeId") REFERENCES "ArtType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingProfile" ADD CONSTRAINT "PricingProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingProfile" ADD CONSTRAINT "PricingProfile_artTypeId_fkey" FOREIGN KEY ("artTypeId") REFERENCES "ArtType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_artTypeId_fkey" FOREIGN KEY ("artTypeId") REFERENCES "ArtType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_artTechniqueId_fkey" FOREIGN KEY ("artTechniqueId") REFERENCES "ArtTechnique"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSoftware" ADD CONSTRAINT "UserSoftware_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSoftware" ADD CONSTRAINT "UserSoftware_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSoftware" ADD CONSTRAINT "UserSoftware_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDigitalTool" ADD CONSTRAINT "UserDigitalTool_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDigitalTool" ADD CONSTRAINT "UserDigitalTool_digitalToolId_fkey" FOREIGN KEY ("digitalToolId") REFERENCES "DigitalTool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDigitalTool" ADD CONSTRAINT "UserDigitalTool_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTraditionalMaterial" ADD CONSTRAINT "UserTraditionalMaterial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTraditionalMaterial" ADD CONSTRAINT "UserTraditionalMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "TraditionalMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTraditionalMaterial" ADD CONSTRAINT "UserTraditionalMaterial_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTraditionalTool" ADD CONSTRAINT "UserTraditionalTool_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTraditionalTool" ADD CONSTRAINT "UserTraditionalTool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "TraditionalTool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTraditionalTool" ADD CONSTRAINT "UserTraditionalTool_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalIllustration" ADD CONSTRAINT "DigitalIllustration_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoEditing" ADD CONSTRAINT "VideoEditing_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Painting" ADD CONSTRAINT "Painting_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drawing" ADD CONSTRAINT "Drawing_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketComparison" ADD CONSTRAINT "MarketComparison_artTypeId_fkey" FOREIGN KEY ("artTypeId") REFERENCES "ArtType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketComparison" ADD CONSTRAINT "MarketComparison_artTechniqueId_fkey" FOREIGN KEY ("artTechniqueId") REFERENCES "ArtTechnique"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSoftware" ADD CONSTRAINT "ProjectSoftware_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSoftware" ADD CONSTRAINT "ProjectSoftware_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectDigitalTool" ADD CONSTRAINT "ProjectDigitalTool_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectDigitalTool" ADD CONSTRAINT "ProjectDigitalTool_digitalToolId_fkey" FOREIGN KEY ("digitalToolId") REFERENCES "DigitalTool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTraditionalMaterial" ADD CONSTRAINT "ProjectTraditionalMaterial_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTraditionalMaterial" ADD CONSTRAINT "ProjectTraditionalMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "TraditionalMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTraditionalTool" ADD CONSTRAINT "ProjectTraditionalTool_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTraditionalTool" ADD CONSTRAINT "ProjectTraditionalTool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "TraditionalTool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteMarketComparison" ADD CONSTRAINT "QuoteMarketComparison_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
