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
    // Dentro de useQuotePreview, al calcular softwareCost:
    const softwareCost = selectedSoftware.reduce((sum, sw) => {
      // Usar directamente el costo mensual que ya fue calculado
      return sum + (Number(sw.monthlyCost) || 0);
    }, 0);

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
        const hourlyRatePerMinute = standardHourlyRate / 60;
        const detailMultiplier = detail * 0.25; // Convierte nivel 1-5 a porcentaje (0%, 25%, 50%, 75%, 100%)

        // Calcula el precio base
        basePrice =
          duration * hourlyRatePerMinute * (1 + detailMultiplier) + // Duración * tarifa/min * factor detalle
          hw * standardHourlyRate + // Horas trabajadas
          softwareCost / projectsPerMonth + // Software prorrateado
          modsCost; // Costo de modificaciones

        // Para edición de video también usamos herramientas digitales
        finalToolsCost = digitalToolsCost / projectsPerMonth;
        break;

      case 3: // Pintura
      case 4: // Dibujo
        // 1. Calcula el área total
        const area =
          (specializedData.width || 0) * (specializedData.height || 0);

        // 2. Calcula el precio base por tiempo
        basePrice = hw * standardHourlyRate;

        // 3. Aplica factor por técnica seleccionada
        let currentTechniqueFactor = techniqueFactor;
        if (specializedData.technique) {
          switch (specializedData.technique) {
            case "mixta":
              currentTechniqueFactor *= 1.3;
              break;
            case "lapices-color":
            case "oleo":
              currentTechniqueFactor *= 1.2;
              break;
            case "acrilico":
            case "tinta":
              currentTechniqueFactor *= 1.1;
              break;
            // técnicas básicas mantienen el factor base
            case "lapiz":
            case "carbon":
              break;
          }
        }
        basePrice += area * currentTechniqueFactor;

        // 4. Agrega costo por modificaciones adicionales
        basePrice += additionalMods * modificationExtra;

        // 5. Calcula el costo de materiales
        finalMaterialsCost = selectedTraditionalMaterials.reduce((sum, material) => {
          let materialCost = 0;

          // Asegurarnos de tener todos los valores necesarios
          const quantity = Number(material.quantity) || 0;
          const partialUse = Number(material.partialUse) || 0;
          const averageCost = Number(material.averageCost) || 0;
          const containerSize = Number(material.containerSize);

          if (material.category === 'Lápices') {
            const pencilLifespan = {
              'Estudiante': 15,
              'Profesional': 25,
              'Premium': 35
            }[material.quality] || 20;

            const usageRatio = Math.min(1, hw / pencilLifespan);
            materialCost = averageCost * usageRatio;
          } else if (material.unit === 'ml' && containerSize > 0) {
            // Cálculo para contenedores completos
            const fullContainersCost = averageCost * quantity;
            
            // Cálculo para uso parcial
            const partialCost = partialUse > 0 ? 
              (averageCost * (partialUse / containerSize)) : 0;

            materialCost = fullContainersCost + partialCost;
            
            console.log(`Material ${material.name}:`, {
              fullContainers: quantity,
              containerSize,
              partialUse,
              averageCost,
              fullContainersCost,
              partialCost,
              totalCost: materialCost
            });
          } else {
            materialCost = averageCost * quantity;
          }

          return sum + materialCost;
        }, 0);

        // 6. Calcula el costo de herramientas tradicionales
        finalToolsCost = selectedTraditionalTools.reduce((sum, tool) => {
          const averageCost = Number(tool.averageCost) || 0;
          const averageLifespan = Number(tool.averageLifespan) || 1;
          const projectsPerMonth = Number(effectivePricingProfile.projectsPerMonth) || 1;
          
          // Costo por proyecto = (Costo / Vida útil en meses) / Proyectos por mes
          const toolCost = (averageCost / averageLifespan) / projectsPerMonth;
          
          console.log(`Herramienta ${tool.name}:`, {
            averageCost,
            averageLifespan,
            projectsPerMonth,
            toolCost
          });

          return sum + toolCost;
        }, 0);

        break;

      default:
        break;
    }

    // Primero calculamos el precio base total que incluye todo
    const totalBasePrice = basePrice + finalMaterialsCost + finalToolsCost;

    // Luego calculamos los cargos adicionales sobre el precio base
    const commercialFee = specializedData.isCommercial
      ? totalBasePrice * (commercialPercentage / 100)
      : 0;

    const urgencyFee = specializedData.rapidDelivery
      ? totalBasePrice * (urgencyPercentage / 100)
      : 0;

    // El subtotal ahora incluye todo
    const subtotal = totalBasePrice + commercialFee + urgencyFee;

    const discountPct = Number(quoteData.discountPercentage) || 0;
    const discountAmount = (subtotal * discountPct) / 100;
    const total = subtotal - discountAmount;

    // Debug para verificar valores
    console.log("DESGLOSE COMPLETO:", {
      basePrice,
      materialsCost: finalMaterialsCost,
      toolsCost: finalToolsCost,
      totalBasePrice,
      commercialFee,
      urgencyFee,
      subtotal,
      discountAmount,
      total,
    });

    // Actualizamos el breakdown con el precio base total
    setBreakdown({
      basePrice: totalBasePrice, // Aquí está el cambio principal
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
