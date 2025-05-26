import React from "react";
import { useQuotePreview } from "@/hooks/useQuotePreview";
import { BasePriceDetail } from "./BasePriceDetails";

export const QuotePreview = (props) => {
  const breakdown = useQuotePreview(props);
  const discountPct = Number(props.quoteData.discountPercentage) || 0;
  const { specializedData, selectedArtType } = props;

  // Get percentages from specializedData
  const commercialPct = specializedData.commercialPercentage || 30;
  const urgencyPct = specializedData.rapidDeliveryPercentage || 20;

  // Update concepts array with all fees
  const concepts = [
    {
      label: "Precio base",
      value: breakdown.basePrice // Ya incluye materiales y herramientas
    },
    // Cargo comercial con porcentaje
    ...(breakdown.commercialFee > 0 ? [{
      label: `Aplica cargo de uso comercial del ${specializedData.isCommercial ? '30' : '0'}%`,
      value: breakdown.commercialFee
    }] : []),
    // Cargo por urgencia con porcentaje
    ...(breakdown.urgencyFee > 0 ? [{
      label: `Aplica cargo por entrega urgente del ${specializedData.rapidDelivery ? '20' : '0'}%`,
      value: breakdown.urgencyFee
    }] : [])
  ];

  // Calculate subtotal correctly
  const subtotal = breakdown.basePrice + 
                  breakdown.commercialFee + 
                  breakdown.urgencyFee;

  // Debug logging
  console.log('QuotePreview final calculations:', {
    basePrice: breakdown.basePrice,
    materialsCost: breakdown.materialsCost,
    toolsCost: breakdown.toolsCost,
    commercialFee: breakdown.commercialFee,
    urgencyFee: breakdown.urgencyFee,
    subtotal,
    breakdown
  });

  // El subtotal debe incluir todos los costos
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 font-regular-text">
      <h3 className="font-bold text-xl mb-4 text-neutral">
        Resumen de la Cotización
      </h3>

      <div className="space-y-3">
        {/* Precio base con botón de detalle */}
        <div className="flex justify-between items-center">
          <span className="font-medium flex items-center">
            <button
              className="btn btn-xs btn-circle btn-accent mr-2"
              tabIndex={0}
              onClick={() => document.getElementById("modal_base_detail").showModal()}
              style={{ minWidth: 0, width: 24, height: 24, padding: 0 }}
              type="button"
            >
              ?
            </button>
            Precio base
          </span>
          <span>${isNaN(breakdown.basePrice) ? "0.00" : breakdown.basePrice.toFixed(2)}</span>
        </div>

        {/* Cargo comercial */}
        {breakdown.commercialFee > 0 && (
          <div className="flex justify-between text-blue-600">
            <span>Cargo comercial ({commercialPct}%):</span>
            <span>+ ${breakdown.commercialFee.toFixed(2)}</span>
          </div>
        )}

        {/* Cargo por urgencia */}
        {breakdown.urgencyFee > 0 && (
          <div className="flex justify-between text-amber-600">
            <span>Cargo por urgencia ({urgencyPct}%):</span>
            <span>+ ${breakdown.urgencyFee.toFixed(2)}</span>
          </div>
        )}

        {/* Subtotal */}
        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
          <span>Subtotal:</span>
          <span>${isNaN(subtotal) ? "0.00" : subtotal.toFixed(2)}</span>
        </div>

        {/* Descuento */}
        {discountPct > 0 && (
          <div className="flex justify-between text-red-500">
            <span>Descuento ({discountPct}%):</span>
            <span>- ${((subtotal * discountPct) / 100).toFixed(2)}</span>
          </div>
        )}

        {/* Total */}
        <div className="border-t border-gray-300 pt-3 mt-3 flex justify-between font-bold text-lg text-primary">
          <span>Total a pagar:</span>
          <span>${(subtotal * (1 - discountPct / 100)).toFixed(2)}</span>
        </div>
      </div>

      {/* Detalle del modal */}
      <dialog id="modal_base_detail" className="modal">
        <div className="modal-box w-[50vw]">
          <h3 className="font-bold text-lg mb-2 text-accent-content">
            ¿Cómo se calculó el "Precio Base"?
          </h3>
          <BasePriceDetail
            selectedArtType={props.selectedArtType}
            specializedData={props.specializedData}
            pricingProfile={props.pricingProfile}
            selectedPricingProfile={props.selectedPricingProfile}
            selectedSoftware={props.selectedSoftware}
            selectedDigitalTools={props.selectedDigitalTools}
            selectedTraditionalMaterials={
              props.selectedTraditionalMaterials
            }
            selectedTraditionalTools={
              props.selectedTraditionalTools
            }
            project={props.project}
          />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-accent">Cerrar</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};
