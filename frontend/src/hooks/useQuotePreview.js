import { useEffect, useState } from "react";

export function useQuotePreview({
  quoteData,
  specializedData,
  selectedArtType,
  project,
  pricingProfile,
  selectedPricingProfile,
  selectedSoftware = [],
  selectedDigitalTools = [],
  selectedTraditionalMaterials = [],
  selectedTraditionalTools = [],
}) {
  const effectivePricingProfile = selectedPricingProfile || pricingProfile;

  const [breakdown, setBreakdown] = useState({
    basePrice: 0,
    commercialFee: 0,
    urgencyFee: 0,
    materialsCost: 0,
    toolsCost: 0,
    shippingFee: 0,
    certificateFee: 0,
    subtotal: 0,
    discountAmount: 0,
    total: 0,
  });

  useEffect(() => {
    if (!project || !effectivePricingProfile) return;

    // Costos de insumos seleccionados
    const softwareCost = selectedSoftware.reduce(
      (sum, sw) => sum + (Number(sw.monthlyCost) || 0),
      0
    );
    const digitalToolsCost = selectedDigitalTools.reduce(
      (sum, t) =>
        sum +
        (t.averageCost && t.averageLifespan
          ? Number(t.averageCost) / Number(t.averageLifespan)
          : 0),
      0
    );
    const traditionalMaterialsCost = selectedTraditionalMaterials.reduce(
      (sum, m) => sum + (Number(m.unitCost) || 0),
      0
    );
    const traditionalToolsCost = selectedTraditionalTools.reduce(
      (sum, t) => sum + (Number(t.unitCost) || 0),
      0
    );

    // Variables de entrada
    const hw =
      Number(specializedData.hoursWorked) || Number(project.hoursWorked) || 0;
    const detail =
      Number(specializedData.detailLevel) || Number(project.detailLevel) || 1;
    const additionalMods = Number(specializedData.additionalModifications) || 0;
    const duration = Number(specializedData.duration) || 0;
    const size = Number(specializedData.size) || 0;

    // Perfil de precios
    const standardHourlyRate =
      Number(effectivePricingProfile.standardHourlyRate) || 50;
    const projectsPerMonth =
      Number(effectivePricingProfile.projectsPerMonth) || 1;
    const worksPerMonth = Number(effectivePricingProfile.worksPerMonth) || 1;
    const modificationExtra =
      Number(specializedData.customModificationExtra) ||
      Number(effectivePricingProfile.modificationExtra) ||
      10;
    const complexityFactor =
      Number(effectivePricingProfile.complexityFactor) || 1.5;
    const baseRatePerMinute =
      Number(effectivePricingProfile.baseRatePerMinute) || 2;
    const assetCost = Number(effectivePricingProfile.assetCost) || 50;
    const techniqueFactor =
      Number(effectivePricingProfile.techniqueFactor) || 0.1;
    const shippingFee = Number(effectivePricingProfile.shippingFee) || 20;
    const certificateFee = Number(effectivePricingProfile.certificateFee) || 30;
    const commercialPercentage =
      specializedData.commercialPercentage !== undefined &&
      specializedData.commercialPercentage !== null &&
      specializedData.commercialPercentage !== ""
        ? Number(specializedData.commercialPercentage)
        : Number(effectivePricingProfile.defaultCommercialLicensePercentage) ||
          30;

    const urgencyPercentage =
      specializedData.rapidDeliveryPercentage !== undefined &&
      specializedData.rapidDeliveryPercentage !== null &&
      specializedData.rapidDeliveryPercentage !== ""
        ? Number(specializedData.rapidDeliveryPercentage)
        : Number(effectivePricingProfile.defaultUrgencyPercentage) || 20;
    
    let basePrice = 0;
    let modsCost = additionalMods * modificationExtra;
    let finalShippingFee = 0;
    let finalCertificateFee = 0;
    let finalMaterialsCost = 0;
    let finalToolsCost = 0;

    // Cálculo según tipo de arte
    switch (parseInt(selectedArtType, 10)) {
      case 1: // Ilustración Digital
        basePrice =
          hw * standardHourlyRate +
          (softwareCost + digitalToolsCost) / (projectsPerMonth || 1);

        basePrice += basePrice * (detail * 0.05); // Aplica el % solo al base
        basePrice += modsCost; // Suma modificaciones al final
        
        // Para ilustración digital, incluimos costos de herramientas digitales
        finalToolsCost = digitalToolsCost / (projectsPerMonth || 1);
        break;
        
      case 2: // Edición de Video
        basePrice =
          duration * complexityFactor * baseRatePerMinute +
          hw * standardHourlyRate +
          softwareCost / (projectsPerMonth || 1) +
          assetCost +
          additionalMods * modificationExtra;
          
        // Para edición de video también usamos herramientas digitales  
        finalToolsCost = digitalToolsCost / (projectsPerMonth || 1);
        break;
        
      case 3: // Pintura
      case 4: // Dibujo
        basePrice =
          size * techniqueFactor +
          hw * standardHourlyRate +
          (additionalMods * modificationExtra);
          
        // En arte tradicional separamos estos costos
        finalMaterialsCost = traditionalMaterialsCost;
        finalToolsCost = traditionalToolsCost / (worksPerMonth || 1);
        
        // Incluye shipping y certificado que se muestran por separado
        finalShippingFee = specializedData.includeShipping ? shippingFee : 0;
        finalCertificateFee = specializedData.includeCertificate ? certificateFee : 0;
        
        // Agregamos shipping y certificate al precio base
        basePrice += finalShippingFee + finalCertificateFee;
        break;
        
      default:
        break;
    }

    // Extras
    const commercialFee = specializedData.isCommercial
      ? basePrice * (commercialPercentage / 100)
      : 0;
    const urgencyFee = specializedData.rapidDelivery
      ? basePrice * (urgencyPercentage / 100)
      : 0;

    // El subtotal NO incluye herramientas ni materiales - solo incluye:
    // precio base + cargo comercial + cargo de urgencia
    const subtotal = basePrice + commercialFee + urgencyFee;
    
    const discountPct = Number(quoteData.discountPercentage) || 0;
    const discountAmount = (subtotal * discountPct) / 100;
    const total = subtotal - discountAmount;

    // Imprimimos el desglose para verificar
    console.log("DESGLOSE COMPLETO:", {
      basePrice,
      commercialFee,
      urgencyFee,
      materialsCost: finalMaterialsCost,
      toolsCost: finalToolsCost,
      shippingFee: finalShippingFee,
      certificateFee: finalCertificateFee,
      subtotal,
      discountAmount,
      total
    });

    setBreakdown({
      basePrice,
      commercialFee,
      urgencyFee,
      materialsCost: finalMaterialsCost,
      toolsCost: finalToolsCost,
      shippingFee: finalShippingFee,
      certificateFee: finalCertificateFee,
      subtotal,
      discountAmount,
      total,
    });
  }, [
    quoteData,
    specializedData,
    selectedArtType,
    project,
    effectivePricingProfile,
    selectedSoftware,
    selectedDigitalTools,
    selectedTraditionalMaterials,
    selectedTraditionalTools,
  ]);

  return breakdown;
}