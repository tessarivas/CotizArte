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
    let basePrice = 0;
    let finalMaterialsCost = 0;
    let finalToolsCost = 0;

    // Define variables comunes primero
    const hw = Number(specializedData.hoursWorked) || 0;
    const standardHourlyRate =
      Number(effectivePricingProfile?.standardHourlyRate) || 0;
    const detail = Number(specializedData.detailLevel) || 0;
    const modsCount = Number(specializedData.additionalModifications) || 0;
    const modificationExtra = (specializedData.customModificationExtra !== undefined &&
      specializedData.customModificationExtra !== null &&
      specializedData.customModificationExtra !== ""
        ? Number(specializedData.customModificationExtra)
        : Number(effectivePricingProfile?.modificationExtra)) || 10;
    const projectsPerMonth =
      Number(effectivePricingProfile?.projectsPerMonth) || 1;
    const duration = Number(specializedData.duration) || 0;

    // Detail multiplier común para casos 2, 3 y 4
    const detailMultiplier = (detail - 1) * 0.25; // Nivel 1=0%, 2=25%, 3=50%, 4=75%, 5=100%

    switch (parseInt(selectedArtType, 10)) {
      case 1: // Ilustración Digital
        // Calculate software and tools costs
        const softwareCost = selectedSoftware.reduce(
          (acc, s) => acc + (Number(s.monthlyCost) || 0),
          0
        );
        const digitalToolsCost = selectedDigitalTools.reduce(
          (acc, t) =>
            acc +
            (t.averageCost && t.averageLifespan
              ? Number(t.averageCost) / Number(t.averageLifespan)
              : 0),
          0
        );

        const modsUnit =
          (specializedData.customModificationExtra !== undefined &&
          specializedData.customModificationExtra !== null &&
          specializedData.customModificationExtra !== ""
            ? Number(specializedData.customModificationExtra)
            : Number(effectivePricingProfile?.modificationExtra)) || 10;
        const modsCosts = modsCount * modsUnit; // Usar el modsCount global

        // Calculate base components IGUAL que BasePriceDetails
        const baseSinDetalle =
          hw * standardHourlyRate +
          (softwareCost + digitalToolsCost) / projectsPerMonth;

        const incrementoDetalle = baseSinDetalle * detailMultiplier;
        const baseMasDetalle = baseSinDetalle + incrementoDetalle;

        basePrice = baseMasDetalle + modsCosts;
        break;

      case 2: // Edición de Video
        const customModExtra =
          Number(specializedData.customModificationExtra) || modificationExtra;

        // Calculate software and tools costs
        const videoSoftwareCost = selectedSoftware.reduce(
          (acc, s) => acc + (Number(s.monthlyCost) || 0),
          0
        );
        const videoToolsCost = selectedDigitalTools.reduce(
          (acc, t) =>
            acc +
            (t.averageCost && t.averageLifespan
              ? Number(t.averageCost) / Number(t.averageLifespan)
              : 0),
          0
        );
        
        // Calcula el precio base
        const hourlyWork = hw * standardHourlyRate;
        const detailIncrease = hourlyWork * detailMultiplier;
        const softwareShare = videoSoftwareCost / projectsPerMonth;
        const toolsShare = videoToolsCost / projectsPerMonth;
        const modsCost = modsCount * customModExtra; 

        basePrice = hourlyWork + detailIncrease + softwareShare + toolsShare + modsCost;
        finalToolsCost = toolsShare;
        break;

      case 3: // Pintura
      case 4: // Dibujo
        // 1. Calcula el área total
        const area =
          (specializedData.width || 0) * (specializedData.height || 0);

        // 2. Calcula el precio base por tiempo
        const hourlyPart = hw * standardHourlyRate;

        // 3. Factor por detalle = área × nivel de detalle × 0.25
        const detailPart = area * detailMultiplier;

        // 4. Agrega costo por modificaciones adicionales
        const additionalMods = Number(specializedData.additionalModifications) || 0;
        const modsPart = additionalMods * modificationExtra;

        // 5. Precio base SIN materiales ni herramientas
        const baseWithoutMaterials = hourlyPart + detailPart + modsPart;

        // 6. Calcula el costo de materiales
        finalMaterialsCost = selectedTraditionalMaterials.reduce(
          (sum, material) => {
            let materialCost = 0;

            if (material.category === "Lápices") {
              // Asegurarse de usar el mismo cálculo en ambos lugares
              const pencilLifespan =
                {
                  Estudiante: 20, // Cambiar a 20 para mantener consistencia
                  Profesional: 25,
                  Premium: 35,
                }[material.quality] || 20;

              const usageRatio = Math.min(1, hw / pencilLifespan);
              materialCost = material.averageCost * usageRatio;

              console.log("Cálculo costo lápiz:", {
                nombre: material.name,
                costoTotal: material.averageCost,
                horasTrabajadas: hw,
                vidaUtil: pencilLifespan,
                porcentajeUso: (usageRatio * 100).toFixed(1) + "%",
                costoFinal: materialCost,
              });
            } else if (material.unit === "ml") {
              // Para pinturas, calculamos tanto contenedores completos como uso parcial
              const quantity = Number(material.quantity) || 0;
              const partialUse = Number(material.partialUse) || 0;
              const containerSize = Number(material.containerSize);
              const averageCost = Number(material.averageCost);

              const fullContainersCost =
                quantity > 0 ? averageCost * quantity : 0;
              const partialCost =
                partialUse > 0 ? averageCost * (partialUse / containerSize) : 0;

              materialCost = fullContainersCost + partialCost;
            } else {
              // Para otros tipos de materiales
              materialCost = material.averageCost * material.quantity;
            }

            console.log(`Material ${material.name}:`, {
              tipo: material.category,
              costo: materialCost,
              costoPorUnidad: material.averageCost,
            });

            return sum + materialCost;
          },
          0
        );

        // 7. Calcula el costo de herramientas tradicionales
        finalToolsCost = selectedTraditionalTools.reduce((sum, tool) => {
          const averageCost = Number(tool.averageCost) || 0;
          const averageLifespan = Number(tool.averageLifespan) || 1;
          const projectsPerMonth =
            Number(effectivePricingProfile.projectsPerMonth) || 1;

          // Costo por proyecto = (Costo / Vida útil en meses) / Proyectos por mes
          const toolCost = averageCost / averageLifespan / projectsPerMonth;

          console.log(`Herramienta ${tool.name}:`, {
            averageCost,
            averageLifespan,
            projectsPerMonth,
            toolCost,
          });

          return sum + toolCost;
        }, 0);

        // 8. PRECIO BASE TOTAL (incluyendo materiales y herramientas)
        basePrice = baseWithoutMaterials + finalMaterialsCost + finalToolsCost;
        break;

      default:
        break;
    }

    // Calculate additional fees
    const commercialFee = specializedData.isCommercial
      ? basePrice * (specializedData.commercialPercentage / 100)
      : 0;

    const urgencyFee = specializedData.rapidDelivery
      ? basePrice * (specializedData.rapidDeliveryPercentage / 100)
      : 0;

    // Calculate totals
    const totalBasePrice = basePrice;
    const subtotal = totalBasePrice + commercialFee + urgencyFee;
    const discountPct = Number(quoteData.discountPercentage) || 0;
    const discountAmount = (subtotal * discountPct) / 100;
    const total = subtotal - discountAmount;

    // Update breakdown
    setBreakdown({
      basePrice: totalBasePrice,
      commercialFee,
      urgencyFee,
      materialsCost: finalMaterialsCost,
      toolsCost: finalToolsCost,
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
