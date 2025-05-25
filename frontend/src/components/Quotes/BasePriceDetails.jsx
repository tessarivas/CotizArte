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

  if (parseInt(selectedArtType, 10) === 1) {
    // Ilustración Digital
    const hw = Number(specializedData.hoursWorked) || 0;
    const standardHourlyRate =
      Number(effectivePricingProfile?.standardHourlyRate) || 0;
    const softwareCost =
      selectedSoftware.reduce(
        (acc, s) => acc + (Number(s.monthlyCost) || 0),
        0
      ) || 0;
    const digitalToolsCost =
      selectedDigitalTools.reduce(
        (acc, t) =>
          acc +
          (t.averageCost && t.averageLifespan
            ? Number(t.averageCost) / Number(t.averageLifespan)
            : 0),
        0
      ) || 0;
    const projectsPerMonth =
      Number(effectivePricingProfile?.projectsPerMonth) || 1;
    const detail = Number(specializedData.detailLevel) || 0;
    const modsCount = Number(specializedData.additionalModifications) || 0;
    const modsUnit =
      (specializedData.customModificationExtra !== undefined &&
        specializedData.customModificationExtra !== null &&
        specializedData.customModificationExtra !== ""
        ? Number(specializedData.customModificationExtra)
        : Number(effectivePricingProfile?.modificationExtra)) || 10;
    const modsCost = modsCount * modsUnit;

    const baseSinDetalle =
      hw * standardHourlyRate +
      (softwareCost + digitalToolsCost) / projectsPerMonth;
    const incrementoDetalle = baseSinDetalle * (detail * 0.05);
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
              <td className="text-right">{detail} x 5%</td>
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
              <td className="text-right font-bold">
                ${modsCost.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={3}>
                <hr className="my-1 border-gray-400" />
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
    const duration = Number(specializedData.duration) || 0;
    const detail = Number(specializedData.detailLevel) || 1;
    const detailMultiplier = detail * 0.25; // 0%, 25%, 50%, 75%, 100%
    const hw = Number(specializedData.hoursWorked) || 0;
    const standardHourlyRate = Number(effectivePricingProfile.standardHourlyRate) || 50;
    const hourlyRatePerMinute = standardHourlyRate / 60;
    const softwareCost =
      selectedSoftware.reduce((acc, s) => acc + (Number(s.monthlyCost) || 0), 0) || 0;
    const digitalToolsCost = selectedDigitalTools.reduce(
      (acc, t) =>
        acc +
        (t.averageCost && t.averageLifespan
          ? Number(t.averageCost) / Number(t.averageLifespan)
          : 0),
      0
    ) || 0;
    const projectsPerMonth = Number(effectivePricingProfile.projectsPerMonth) || 1;
    const modsCount = Number(specializedData.additionalModifications) || 0;
    const modificationExtra =
      Number(specializedData.customModificationExtra) ||
      Number(effectivePricingProfile.modificationExtra) ||
      10;
    const modsCost = modsCount * modificationExtra;

    const partDuration = duration * hourlyRatePerMinute * (1 + detailMultiplier);
    const partHourly = hw * standardHourlyRate;
    const partSoftware = softwareCost / projectsPerMonth;
    const partTools = digitalToolsCost / projectsPerMonth;
    
    // Precio base total
    const basePrice = partDuration + partHourly + partSoftware + partTools + modsCost;

    detailContent = (
      <div className="p-4 bg-white rounded-xl shadow border border-gray-200 text-xs text-gray-700 w-full max-w-xs">
        <div className="font-semibold text-neutral mb-2">
          Detalle del cálculo del "Precio Base" (Edición de Video)
        </div>
        <table className="w-full text-left border-separate border-spacing-y-1">
          <tbody>
            <tr>
              <td>Duración:</td>
              <td className="text-right">
                {duration} min x ${hourlyRatePerMinute.toFixed(2)}/min
              </td>
              <td className="text-right font-bold">
                ${(duration * hourlyRatePerMinute).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td>+ Incremento detalle:</td>
              <td className="text-right">Nivel {detail} (+{(detailMultiplier * 100)}%)</td>
              <td className="text-right font-bold">
                ${((duration * hourlyRatePerMinute) * detailMultiplier).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td>Horas trabajadas:</td>
              <td className="text-right">
                {hw} x ${standardHourlyRate}
              </td>
              <td className="text-right font-bold">
                ${partHourly.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td>Software:</td>
              <td className="text-right">
                ${softwareCost.toFixed(2)} / {projectsPerMonth} proyectos
              </td>
              <td className="text-right font-bold">
                ${partSoftware.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td>Herramientas digitales:</td>
              <td className="text-right">
                ${digitalToolsCost.toFixed(2)} / {projectsPerMonth} proyectos
              </td>
              <td className="text-right font-bold">
                ${partTools.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="text-xs text-gray-500 italic pl-4">
                Los costos de software y herramientas se dividen entre {projectsPerMonth} proyectos al mes
              </td>
            </tr>
            <tr>
              <td>+ Modificaciones adicionales:</td>
              <td className="text-right">
                {modsCount} x ${modificationExtra}
              </td>
              <td className="text-right font-bold">
                ${modsCost.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={3}>
                <hr className="my-1 border-gray-400" />
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
  } else if (parseInt(selectedArtType, 10) === 3 || parseInt(selectedArtType, 10) === 4) {
    // Arte Tradicional (Pintura o Dibujo)
    const width = Number(specializedData.width) || 0;
    const height = Number(specializedData.height) || 0;
    const area = width * height;
    const hw = Number(specializedData.hoursWorked) || 0;
    const standardHourlyRate = Number(effectivePricingProfile.standardHourlyRate) || 50;
    const technique = specializedData.technique || '';
    const techniqueFactor = Number(effectivePricingProfile.techniqueFactor) || 0.1;
    const modsCount = Number(specializedData.additionalModifications) || 0;
    const modificationExtra = Number(effectivePricingProfile.modificationExtra) || 10;

    // Primero procesamos la lista de materiales
    const materialsList = selectedTraditionalMaterials.map(material => {
      // Aseguramos que todos los valores sean números
      const quantity = Number(material.quantity) || 0;
      const partialUse = Number(material.partialUse) || 0; // Agregar esta línea
      const averageCost = Number(material.averageCost) || 0;
      const containerSize = Number(material.containerSize);
      let cost = 0;

      if (material.category === 'Lápices') {
        const pencilLifespan = {
          'Estudiante': 15,
          'Profesional': 25,
          'Premium': 35
        }[material.quality] || 20;

        const usageRatio = Math.min(1, hw / pencilLifespan);
        cost = averageCost * usageRatio;
      } else if (material.unit === 'ml') {
        // Para pinturas, calculamos tanto contenedores completos como uso parcial
        const fullContainersCost = quantity > 0 ? averageCost * quantity : 0;
        const partialCost = partialUse > 0 ? (averageCost * (partialUse / containerSize)) : 0;
        cost = fullContainersCost + partialCost;
      } else {
        cost = averageCost * quantity;
      }

      return {
        name: material.name,
        category: material.category,
        containerSize,
        unit: material.unit,
        quantity,
        partialUse, // Agregar esta línea
        averageCost,
        cost
      };
    });

    // Procesar lista de herramientas
    const toolsList = selectedTraditionalTools.map(tool => {
      const averageCost = Number(tool.averageCost) || 0;
      const averageLifespan = Number(tool.averageLifespan) || 1;
      const projectsPerMonth = Number(effectivePricingProfile.projectsPerMonth) || 1;
      
      // Costo por proyecto = (Costo / Vida útil en meses) / Proyectos por mes
      const cost = (averageCost / averageLifespan) / projectsPerMonth;

      return {
        name: tool.name,
        averageCost,
        averageLifespan,
        cost
      };
    });

    // Calcula los componentes del precio
    const hourlyPart = hw * standardHourlyRate;
    
    // Ajusta el factor técnico según la técnica
    let currentTechniqueFactor = techniqueFactor;
    let techniqueMultiplier = 1;
    switch(technique) {
      case 'mixta': techniqueMultiplier = 1.3; break;
      case 'lapices-color':
      case 'oleo': techniqueMultiplier = 1.2; break;
      case 'acrilico':
      case 'tinta': techniqueMultiplier = 1.1; break;
    }
    
    const techniquePart = area * (currentTechniqueFactor * techniqueMultiplier);
    const modsPart = modsCount * modificationExtra;

    // Calcula el costo total de materiales usando la lista procesada
    const materialsCost = materialsList.reduce((sum, material) => sum + material.cost, 0);
    const toolsCost = toolsList.reduce((sum, tool) => sum + tool.cost, 0);

    // Calcula el precio base total incluyendo materiales y herramientas
    const totalBasePrice = hourlyPart + techniquePart + modsPart + materialsCost + toolsCost;

    detailContent = (
      <div className="p-4 bg-white rounded-xl shadow border border-gray-200 text-xs text-gray-700 w-full max-w-xs">
        <div className="font-semibold text-neutral mb-2">
          Detalle del cálculo del "Precio Base" ({parseInt(selectedArtType, 10) === 3 ? "Pintura" : "Dibujo"})
        </div>
        
        <table className="w-full text-left border-separate border-spacing-y-1">
          <tbody>
            <tr>
              <td>Dimensiones:</td>
              <td colSpan={2} className="text-right">
                {width} × {height} cm = {area} cm²
              </td>
            </tr>
            
            <tr>
              <td>Horas trabajadas:</td>
              <td className="text-right">
                {hw} hrs × ${standardHourlyRate}/hr
              </td>
              <td className="text-right font-bold">
                ${hourlyPart.toFixed(2)}
              </td>
            </tr>

            <tr>
              <td>Factor técnico:</td>
              <td className="text-right">
                {area} cm² × ${(currentTechniqueFactor * techniqueMultiplier).toFixed(3)}
                {techniqueMultiplier !== 1 && ` (${technique})`}
              </td>
              <td className="text-right font-bold">
                ${techniquePart.toFixed(2)}
              </td>
            </tr>

            {modsCount > 0 && (
              <tr>
                <td>Modificaciones:</td>
                <td className="text-right">
                  {modsCount} × ${modificationExtra}
                </td>
                <td className="text-right font-bold">
                  ${modsPart.toFixed(2)}
                </td>
              </tr>
            )}

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
                  let usageDisplay = '';
                  let costDisplay = material.cost; // Usar el costo ya calculado

                  if (material.category === 'Lápices') {
                    const pencilLifespan = {
                      'Estudiante': 15,
                      'Profesional': 25,
                      'Premium': 35
                    }[material.quality] || 20;

                    const usageRatio = Math.min(1, hw / pencilLifespan);
                    usageDisplay = `${(usageRatio * 100).toFixed(1)}% de uso`;
                    costDisplay = material.averageCost * usageRatio;
                  } else if (material.unit === 'ml') {
                    const fullContainers = Number(material.quantity) || 0;
                    const partialUse = Number(material.partialUse) || 0;
                    const containerSize = Number(material.containerSize);
                    const costPerContainer = Number(material.averageCost);

                    // Calcula costos
                    const fullContainersCost = fullContainers > 0 ? costPerContainer * fullContainers : 0;
                    const partialCost = partialUse > 0 && containerSize > 0 ? 
                      (costPerContainer * (partialUse / containerSize)) : 0;
                    
                    costDisplay = fullContainersCost + partialCost;

                    // Prepara el texto de visualización
                    const parts = [];
                    
                    if (fullContainers > 0) {
                      parts.push(`${fullContainers} contenedor${fullContainers > 1 ? 'es' : ''} de ${containerSize}ml`);
                    }
                    
                    if (partialUse > 0) {
                      parts.push(`${partialUse}ml (${((partialUse/containerSize) * 100).toFixed(1)}% de ${containerSize}ml)`);
                    }
                    
                    usageDisplay = parts.length > 0 ? parts.join(' + ') : 'No seleccionado';

                    // Debug
                    console.log('Material render:', {
                      name: material.name,
                      quantity: fullContainers,
                      partialUse,
                      parts,
                      display: usageDisplay,
                      cost: costDisplay
                    });
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
              </>
            )}

            {/* Agregar sección de herramientas */}
            {toolsList.length > 0 && (
              <>
                <tr>
                  <td colSpan={3} className="font-semibold pt-2">
                    Herramientas:
                  </td>
                </tr>
                {toolsList.map((tool, idx) => (
                  <tr key={idx} className="text-sm">
                    <td>{tool.name}</td>
                    <td className="text-right">
                      ${tool.averageCost.toFixed(2)} / {tool.averageLifespan} meses
                    </td>
                    <td className="text-right font-medium">
                      ${tool.cost.toFixed(2)}
                    </td>
                  </tr>
                ))}
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
              <td>Subtotal base:</td>
              <td className="text-right">
                Horas + Técnica + Mods
              </td>
              <td className="text-right font-medium">
                ${(hourlyPart + techniquePart + modsPart).toFixed(2)}
              </td>
            </tr>

            <tr>
              <td colSpan={2} className="font-semibold text-neutral">
                Total precio base:
              </td>
              <td className="text-right font-bold text-neutral">
                ${(hourlyPart + techniquePart + modsPart + materialsCost + toolsCost).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return <>{detailContent}</>;
};
