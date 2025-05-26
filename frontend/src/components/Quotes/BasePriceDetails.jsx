import React from "react";
import { FileTextIcon } from "lucide-react";

export const BasePriceDetail = (props) => {
  const {
    selectedArtType,
    specializedData,
    pricingProfile,
    selectedPricingProfile,
    selectedSoftware = [],
    selectedDigitalTools = [],
    selectedTraditionalMaterials = [],
    selectedTraditionalTools = [],
    project,
  } = props;

  const effectivePricingProfile = selectedPricingProfile || pricingProfile;
  let detailContent = null;

  const detail = Number(specializedData.detailLevel) || 1;
  const detailMultiplier = (detail - 1) * 0.25; // Nivel 1=0%, 2=25%, 3=50%, 4=75%, 5=100%

  if (parseInt(selectedArtType, 10) === 1) {
    // Ilustración Digital
    const hw = Number(specializedData.hoursWorked) || 0;
    const standardHourlyRate = Number(effectivePricingProfile?.standardHourlyRate) || 0;
    const softwareCost = selectedSoftware.reduce(
      (acc, s) => acc + (Number(s.monthlyCost) || 0),
      0
    ) || 0;
    const digitalToolsCost = selectedDigitalTools.reduce(
      (acc, t) =>
        acc +
        (t.averageCost && t.averageLifespan
          ? Number(t.averageCost) / Number(t.averageLifespan)
          : 0),
      0
    ) || 0;
    const projectsPerMonth = Number(effectivePricingProfile?.projectsPerMonth) || 1;
    const modsCount = Number(specializedData.additionalModifications) || 0;
    const modsUnit = (specializedData.customModificationExtra !== undefined &&
      specializedData.customModificationExtra !== null &&
      specializedData.customModificationExtra !== ""
        ? Number(specializedData.customModificationExtra)
        : Number(effectivePricingProfile?.modificationExtra)) || 10;
    const modsCost = modsCount * modsUnit;

    const baseSinDetalle = hw * standardHourlyRate + (softwareCost + digitalToolsCost) / projectsPerMonth;
    
    // ✅ CAMBIAR AQUÍ TAMBIÉN PARA USAR LA NUEVA FÓRMULA
    const incrementoDetalle = baseSinDetalle * detailMultiplier; // Usar detailMultiplier en lugar de (detail * 0.05)
    
    const baseMasDetalle = baseSinDetalle + incrementoDetalle;
    const baseFinal = baseMasDetalle + modsCost;

    detailContent = (
      <div className="p-4 bg-white rounded-xl shadow border border-gray-200 text-xs text-gray-700 w-full max-w-xs">
        <div className="font-semibold text-neutral mb-2">
          Detalle del cálculo del "Precio Base" (Ilustración Digital)
        </div>
        <table className="w-full text-left border-separate border-spacing-y-1">
          <tbody>
            <tr>
              <td>Horas trabajadas:</td>
              <td className="text-right">
                {hw} x ${standardHourlyRate}
              </td>
              <td className="text-right font-bold">
                ${(hw * standardHourlyRate).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td>Software:</td>
              <td className="text-right">
                ${softwareCost.toFixed(2)} / {projectsPerMonth} proyectos
              </td>
              <td className="text-right font-bold">
                ${(softwareCost / projectsPerMonth).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td>Herramientas digitales:</td>
              <td className="text-right">
                ${digitalToolsCost.toFixed(2)} / {projectsPerMonth} proyectos
              </td>
              <td className="text-right font-bold">
                ${(digitalToolsCost / projectsPerMonth).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="text-xs text-gray-500 italic pl-4">
                Los costos de software y herramientas se dividen entre{" "}
                {projectsPerMonth} proyectos al mes
              </td>
            </tr>
            <tr>
              <td colSpan={3}>
                <hr className="my-1 border-gray-300" />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>Subtotal sin detalle:</td>
              <td className="text-right font-bold">
                ${baseSinDetalle.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td>+ Incremento detalle:</td>
              <td className="text-right">Nivel {detail} (+{(detailMultiplier * 100)}%)</td>
              <td className="text-right font-bold">
                ${incrementoDetalle.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={3}>
                <hr className="my-1 border-gray-300" />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>Subtotal con detalle:</td>
              <td className="text-right font-bold">
                ${baseMasDetalle.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td>+ Modificaciones adicionales:</td>
              <td className="text-right">
                {modsCount} x ${modsUnit}
              </td>
              <td className="text-right font-bold">${modsCost.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={3}>
                <hr className="my-2 border-gray-400" />
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="font-semibold text-neutral">
                Total precio base:
              </td>
              <td className="text-right font-bold text-neutral">
                ${baseFinal.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );

  } else if (parseInt(selectedArtType, 10) === 2) {
    // Edición de Video
    const hw = Number(specializedData.hoursWorked) || 0;
    const standardHourlyRate = Number(effectivePricingProfile.standardHourlyRate) || 120;
    const projectsPerMonth = Number(effectivePricingProfile?.projectsPerMonth) || 1;
    const modsCount = Number(specializedData.additionalModifications) || 0;
    
    // ✅ CORREGIR PARA USAR EL VALOR PERSONALIZADO COMO EN USEQUOTEPREVIEW
    const customModExtra = (specializedData.customModificationExtra !== undefined &&
      specializedData.customModificationExtra !== null &&
      specializedData.customModificationExtra !== ""
        ? Number(specializedData.customModificationExtra)
        : Number(effectivePricingProfile?.modificationExtra)) || 10;

    const duration = Number(specializedData.duration) || 0;

    // AGREGAR CÁLCULOS DE SOFTWARE Y HERRAMIENTAS QUE FALTABAN
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

    // 1. Costo base por horas trabajadas con factor de complejidad
    const hourlyWork = hw * standardHourlyRate;
    const detailIncrease = hourlyWork * detailMultiplier;

    // 2. Costos fijos prorrateados
    const softwareShare = softwareCost / projectsPerMonth;
    const toolsShare = digitalToolsCost / projectsPerMonth;

    // 3. Costo de modificaciones ✅ USAR customModExtra EN LUGAR DE modificationExtra
    const modsCost = modsCount * customModExtra;

    // Precio base total
    const basePrice = hourlyWork + detailIncrease + softwareShare + toolsShare + modsCost;

    detailContent = (
      <div className="p-4 bg-white rounded-xl shadow border border-gray-200 text-xs text-gray-700 w-full max-w-xs">
        <div className="font-semibold text-neutral mb-2">
          Detalle del cálculo del "Precio Base" (Edición de Video)
        </div>
        <table className="w-full text-left border-separate border-spacing-y-1">
          <tbody>
            <tr>
              <td>Horas de trabajo:</td>
              <td className="text-right">
                {hw} hrs × ${standardHourlyRate}/hr
              </td>
              <td className="text-right font-bold">${hourlyWork.toFixed(2)}</td>
            </tr>

            <tr>
              <td>Factor de complejidad:</td>
              <td className="text-right">
                Nivel {detail} (+{(detailMultiplier * 100)}%)
              </td>
              <td className="text-right font-bold">
                ${detailIncrease.toFixed(2)}
              </td>
            </tr>

            <tr>
              <td>Software mensual:</td>
              <td className="text-right">
                ${softwareCost.toFixed(2)} / {projectsPerMonth} proyectos
              </td>
              <td className="text-right font-bold">
                ${softwareShare.toFixed(2)}
              </td>
            </tr>

            <tr>
              <td>Herramientas:</td>
              <td className="text-right">
                ${digitalToolsCost.toFixed(2)} / {projectsPerMonth} proyectos
              </td>
              <td className="text-right font-bold">${toolsShare.toFixed(2)}</td>
            </tr>

            {modsCount > 0 && (
              <tr>
                <td>Revisiones adicionales:</td>
                <td className="text-right">
                  {/* ✅ MOSTRAR EL VALOR CORRECTO */}
                  {modsCount} × ${customModExtra}
                </td>
                <td className="text-right font-bold">${modsCost.toFixed(2)}</td>
              </tr>
            )}

            <tr>
              <td colSpan={3}>
                <hr className="my-2 border-gray-400" />
              </td>
            </tr>

            <tr>
              <td colSpan={2} className="font-semibold text-neutral">
                Total precio base:
              </td>
              <td className="text-right font-bold text-neutral">
                ${basePrice.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );

  } else if (
    parseInt(selectedArtType, 10) === 3 ||
    parseInt(selectedArtType, 10) === 4
  ) {
    // ✅ REMOVER LA REDECLARACIÓN DE detail AQUÍ
    const hw = Number(specializedData.hoursWorked) || 0;
    const standardHourlyRate = Number(effectivePricingProfile?.standardHourlyRate) || 0;
    const modsCount = Number(specializedData.additionalModifications) || 0;
    const modificationExtra = Number(effectivePricingProfile?.modificationExtra) || 10;
    const width = Number(specializedData.width) || 0;
    const height = Number(specializedData.height) || 0;
    const area = width * height;
    const projectsPerMonth = Number(effectivePricingProfile?.projectsPerMonth) || 1;

    // Calculate hourly part
    const hourlyPart = hw * standardHourlyRate;

    // Factor por detalle = área × nivel de detalle × 0.25 (SIN factor hardcodeado)
    const detailPart = area * detailMultiplier;

    // Modificaciones
    const modsPart = modsCount * modificationExtra;

    // Calculate materials cost
    const materialsCost = selectedTraditionalMaterials.reduce((sum, material) => {
        let materialCost = 0;

        if (material.category === "Lápices") {
          const pencilLifespan = {
              Estudiante: 20,
              Profesional: 25,
              Premium: 35,
            }[material.quality] || 20;

          const usageRatio = Math.min(1, hw / pencilLifespan);
          materialCost = material.averageCost * usageRatio;
        } else if (material.unit === "ml") {
          const quantity = Number(material.quantity) || 0;
          const partialUse = Number(material.partialUse) || 0;
          const containerSize = Number(material.containerSize);
          const averageCost = Number(material.averageCost);

          const fullContainersCost = quantity > 0 ? averageCost * quantity : 0;
          const partialCost = partialUse > 0 ? averageCost * (partialUse / containerSize) : 0;

          materialCost = fullContainersCost + partialCost;
        } else {
          materialCost = material.averageCost * material.quantity;
        }

        return sum + materialCost;
      }, 0);

    // Calculate tools cost
    const toolsCost = selectedTraditionalTools.reduce((sum, tool) => {
      const averageCost = Number(tool.averageCost) || 0;
      const averageLifespan = Number(tool.averageLifespan) || 1;
      const toolCost = (averageCost / averageLifespan) / projectsPerMonth;
      return sum + toolCost;
    }, 0);

    // Calculate total base price to match useQuotePreview
    const baseWithoutMaterials = hourlyPart + detailPart + modsPart;
    const totalBasePrice = baseWithoutMaterials + materialsCost + toolsCost;

    // Create materials list for display
    const materialsList = selectedTraditionalMaterials || [];
    const toolsList = selectedTraditionalTools || [];

    detailContent = (
      <div className="p-4 bg-white rounded-xl shadow border border-gray-200 text-xs text-gray-700 w-full max-w-xs">
        <div className="font-semibold text-neutral mb-2">
          Detalle del cálculo del "Precio Base" (
          {parseInt(selectedArtType, 10) === 3 ? "Pintura" : "Dibujo"})
        </div>

        <table className="w-full text-left border-separate border-spacing-y-1">
          <tbody>
            <tr>
              <td>Dimensiones:</td>
              <td colSpan={1} className="text-right">
                {width} × {height} cm = {area} cm²
              </td>
            </tr>

            <tr>
              <td>Horas trabajadas:</td>
              <td className="text-right">
                {hw} hrs × ${standardHourlyRate}/hr
              </td>
              <td className="text-right font-bold">${hourlyPart.toFixed(2)}</td>
            </tr>

            <tr>
              <td>Factor por detalle:</td>
              <td className="text-right">
                {area} cm² × {detailMultiplier.toFixed(3)} (Nivel {detail})
              </td>
              <td className="text-right font-bold">
                ${detailPart.toFixed(2)}
              </td>
            </tr>

            {modsCount > 0 && (
              <tr>
                <td>Modificaciones:</td>
                <td className="text-right">
                  {modsCount} × ${modificationExtra}
                </td>
                <td className="text-right font-bold">${modsPart.toFixed(2)}</td>
              </tr>
            )}

            <tr>
              <td colSpan={2} className="text-right font-medium pt-2">
                Subtotal base:
              </td>
              <td className="text-right font-medium">
                ${baseWithoutMaterials.toFixed(2)}
              </td>
            </tr>

            <tr>
              <td colSpan={3}>
                <hr className="my-2 border-gray-300" />
              </td>
            </tr>

            {materialsList.length > 0 && (
              <>
                <tr>
                  <td colSpan={3} className="font-semibold pt-2">
                    Materiales necesarios:
                  </td>
                </tr>
                {materialsList.map((material, idx) => {
                  let usageDisplay = "";
                  let costDisplay = 0;

                  if (material.category === "Lápices") {
                    const pencilLifespan = {
                        Estudiante: 20,
                        Profesional: 25,
                        Premium: 35,
                      }[material.quality] || 20;

                    const usageRatio = Math.min(1, hw / pencilLifespan);
                    costDisplay = material.averageCost * usageRatio;
                    usageDisplay = `${(usageRatio * 100).toFixed(1)}% de uso`;
                  } else if (material.unit === "ml") {
                    const fullContainers = Number(material.quantity) || 0;
                    const partialUse = Number(material.partialUse) || 0;
                    const containerSize = Number(material.containerSize);
                    const costPerContainer = Number(material.averageCost);

                    const fullContainersCost = fullContainers > 0 ? costPerContainer * fullContainers : 0;
                    const partialCost = partialUse > 0 && containerSize > 0 ? costPerContainer * (partialUse / containerSize) : 0;

                    costDisplay = fullContainersCost + partialCost;

                    const parts = [];
                    if (fullContainers > 0) {
                      parts.push(`${fullContainers} contenedor${fullContainers > 1 ? "es" : ""} de ${containerSize}ml`);
                    }
                    if (partialUse > 0) {
                      parts.push(`${partialUse}ml (${((partialUse / containerSize) * 100).toFixed(1)}% de ${containerSize}ml)`);
                    }
                    usageDisplay = parts.length > 0 ? parts.join(" + ") : "No seleccionado";
                  } else {
                    usageDisplay = `${material.quantity} ${material.unit}`;
                    costDisplay = material.averageCost * material.quantity;
                  }

                  return (
                    <tr key={idx} className="text-sm">
                      <td>{material.name}</td>
                      <td className="text-right">{usageDisplay}</td>
                      <td className="text-right font-medium">
                        ${costDisplay.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan={2} className="text-right font-medium pt-2">
                    Subtotal materiales:
                  </td>
                  <td className="text-right font-medium">
                    ${materialsCost.toFixed(2)}
                  </td>
                </tr>

                <tr>
                  <td colSpan={3}>
                    <hr className="my-2 border-gray-300" />
                  </td>
                </tr>
              </>
            )}

            {toolsList.length > 0 && (
              <>
                <tr>
                  <td colSpan={3} className="font-semibold pt-2">
                    Herramientas:
                  </td>
                </tr>
                {toolsList.map((tool, idx) => {
                  const averageCost = Number(tool.averageCost) || 0;
                  const averageLifespan = Number(tool.averageLifespan) || 1;
                  const calculatedToolCost = (averageCost / averageLifespan) / projectsPerMonth;

                  return (
                    <tr key={idx} className="text-sm">
                      <td>{tool.name}</td>
                      <td className="text-right">
                        ${averageCost.toFixed(2)} / {averageLifespan} meses
                      </td>
                      <td className="text-right font-medium">
                        ${calculatedToolCost.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan={2} className="text-right font-medium">
                    Subtotal herramientas:
                  </td>
                  <td className="text-right font-medium">
                    ${toolsCost.toFixed(2)}
                  </td>
                </tr>
              </>
            )}

            <tr>
              <td colSpan={3}>
                <hr className="my-2 border-gray-400" />
              </td>
            </tr>

            <tr>
              <td colSpan={2} className="font-semibold text-neutral">
                Total precio base:
              </td>
              <td className="text-right font-bold text-neutral">
                ${totalBasePrice.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return <>{detailContent}</>;
};
