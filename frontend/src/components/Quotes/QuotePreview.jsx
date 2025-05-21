import React from "react";
import { useQuotePreview } from "@/hooks/useQuotePreview";

export const QuotePreview = (props) => {
  const breakdown = useQuotePreview(props);

  const discountPct = Number(props.quoteData.discountPercentage) || 0;
  const { specializedData, selectedArtType } = props;

  // Conceptos dinámicos por tipo de arte
  const concepts = [];

  // Siempre mostrar precio base
  concepts.push({
    label: "Precio base",
    value: breakdown.basePrice,
  });

  // Extras por tipo de arte (solo si aplican)
  if (breakdown.commercialFee > 0) {
    concepts.push({
      label: `+ Licencia comercial (${
        specializedData.commercialPercentage ?? 30
      }% de $${breakdown.basePrice.toFixed(2)})`,
      value: breakdown.commercialFee,
    });
  }
  if (breakdown.urgencyFee > 0) {
    concepts.push({
      label: `+ Entrega urgente (${
        specializedData.rapidDeliveryPercentage ?? 20
      }% de $${breakdown.basePrice.toFixed(2)})`,
      value: breakdown.urgencyFee,
    });
  }

  // Otros extras según tipo de arte
  if ([1, 2].includes(selectedArtType) && breakdown.toolsCost > 0) {
    concepts.push({
      label: "+ Herramientas digitales",
      value: breakdown.toolsCost,
    });
  }
  if ([3, 4].includes(selectedArtType) && breakdown.toolsCost > 0) {
    concepts.push({
      label: "+ Herramientas tradicionales",
      value: breakdown.toolsCost,
    });
  }
  if ([1, 2].includes(selectedArtType) && breakdown.materialsCost > 0) {
    concepts.push({
      label: "+ Materiales digitales",
      value: breakdown.materialsCost,
    });
  }
  if ([3, 4].includes(selectedArtType) && breakdown.materialsCost > 0) {
    concepts.push({
      label: "+ Materiales tradicionales",
      value: breakdown.materialsCost,
    });
  }

  // Envío y certificado para pintura
  if (
    selectedArtType === 3 &&
    specializedData.includeShipping &&
    breakdown.shippingFee > 0
  ) {
    concepts.push({
      label: "+ Envío",
      value: breakdown.shippingFee,
    });
  }
  if (
    selectedArtType === 3 &&
    specializedData.includeCertificate &&
    breakdown.certificateFee > 0
  ) {
    concepts.push({
      label: "+ Certificado",
      value: breakdown.certificateFee,
    });
  }

  let baseDetail = null;
  if (Number(selectedArtType) === 1) {
    const hw = Number(specializedData.hoursWorked) || 0;
    const standardHourlyRate =
      props.selectedPricingProfile?.standardHourlyRate ||
      props.pricingProfile?.standardHourlyRate ||
      0;
    const softwareCost =
      props.selectedSoftware?.reduce(
        (acc, s) => acc + (Number(s.monthlyCost) || 0),
        0
      ) || 0;
    const digitalToolsCost =
      props.selectedDigitalTools?.reduce(
        (acc, t) =>
          acc +
          (t.averageCost && t.averageLifespan
            ? Number(t.averageCost) / Number(t.averageLifespan)
            : 0),
        0
      ) || 0;
    const projectsPerMonth =
      props.selectedPricingProfile?.projectsPerMonth ||
      props.pricingProfile?.projectsPerMonth ||
      1;
    const detail = Number(specializedData.detailLevel) || 0;
    const modsCount = Number(specializedData.additionalModifications) || 0;
    const modsUnit =
      specializedData.customModificationExtra !== undefined &&
      specializedData.customModificationExtra !== null &&
      specializedData.customModificationExtra !== ""
        ? Number(specializedData.customModificationExtra)
        : props.selectedPricingProfile?.modificationExtra ||
          props.pricingProfile?.modificationExtra ||
          10;
    const modsCost = modsCount * modsUnit;

    const baseSinDetalle =
      hw * standardHourlyRate +
      (softwareCost + digitalToolsCost) / projectsPerMonth;
    const incrementoDetalle = baseSinDetalle * (detail * 0.05);
    const baseMasDetalle = baseSinDetalle + incrementoDetalle;
    const baseFinal = baseMasDetalle + modsCost;

    baseDetail = (
      <div className="p-4 bg-white rounded-xl shadow border border-gray-200 text-xs text-gray-700 w-full max-w-xs">
        <div className="font-semibold text-neutral mb-2">
          Detalle del cálculo del precio base
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
              <td>+ (Software + Herramientas digitales):</td>
              <td className="text-right">
                ${softwareCost.toFixed(2)} + ${digitalToolsCost.toFixed(2)}
              </td>
              <td className="text-right font-bold">
                $
                {((softwareCost + digitalToolsCost) / projectsPerMonth).toFixed(
                  2
                )}
              </td>
            </tr>
            {/* Línea antes del primer subtotal */}
            <tr>
              <td colSpan={3}>
                <hr className="my-1 border-gray-300" />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>Subtotal:</td>
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
            {/* Línea antes del segundo subtotal */}
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
            {/* Línea antes del total */}
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

    // Console log para depuración
    console.log("Detalle cálculo base:", {
      hw,
      standardHourlyRate,
      softwareCost,
      digitalToolsCost,
      projectsPerMonth,
      detail,
      modsCount,
      modsUnit,
      modsCost,
      baseSinDetalle,
      incrementoDetalle,
      baseMasDetalle,
      baseFinal,
    });
  }
  console.log("breakdown", breakdown, "specializedData", specializedData);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 font-regular-text">
      <h3 className="font-bold text-xl mb-4 text-neutral">
        Resumen de la Cotización
      </h3>

      {/* Desglose dinámico */}
      <div className="space-y-3">
        {concepts.map((c, i) => (
          <div className="flex justify-between items-center" key={i}>
            <span className="font-medium flex items-center">
              {/* Solo para el precio base, muestra el botón que abre el modal */}
              {i === 0 && baseDetail && (
                <>
                  <button
                    className="btn btn-xs btn-circle btn-accent mr-2"
                    tabIndex={0}
                    onClick={() =>
                      document.getElementById("modal_base_detail").showModal()
                    }
                    style={{ minWidth: 0, width: 24, height: 24, padding: 0 }}
                    type="button"
                  >
                    ?
                  </button>
                  {/* Modal */}
                  <dialog id="modal_base_detail" className="modal">
                    <div className="modal-box w-[50vw]">
                      <h3 className="font-bold text-lg mb-2 text-accent-content">
                        ¿Cómo se cálculo el "Precio Base"?
                      </h3>
                      <div>{baseDetail}</div>
                      <div className="modal-action">
                        <form method="dialog">
                          <button className="btn btn-accent">Cerrar</button>
                        </form>
                      </div>
                    </div>
                  </dialog>
                </>
              )}
              {c.label}
            </span>
            <span>${isNaN(c.value) ? "0.00" : c.value.toFixed(2)}</span>
          </div>
        ))}

        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
          <span>Subtotal:</span>
          <span>
            $
            {isNaN(breakdown.subtotal) ? "0.00" : breakdown.subtotal.toFixed(2)}
          </span>
        </div>

        {discountPct > 0 && (
          <div className="flex justify-between text-red-500">
            <span>Descuento ({discountPct}%):</span>
            <span>
              - $
              {isNaN(breakdown.discountAmount)
                ? "0.00"
                : breakdown.discountAmount.toFixed(2)}
            </span>
          </div>
        )}

        <div className="border-t border-gray-300 pt-3 mt-3 flex justify-between font-bold text-lg text-primary">
          <span>Total a pagar:</span>
          <span>
            ${isNaN(breakdown.total) ? "0.00" : breakdown.total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
