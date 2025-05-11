// src/components/Quotes/QuotePreview.jsx
import React, { useEffect, useState } from "react";
import {
  calculateDigitalIllustrationQuote,
  calculateVideoEditingQuote,
  calculatePaintingQuote,
  calculateDrawingQuote,
} from "@/utils/calculateQuote";

export const QuotePreview = ({
  quoteData,
  specializedData,
  selectedArtType,
  project,
  pricingProfile,
  additionalData,
}) => {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (!project || !pricingProfile) return; // Evitar cálculos si faltan datos
    let calculatedPrice = 0;
    switch (parseInt(selectedArtType)) {
      case 1:
        calculatedPrice = calculateDigitalIllustrationQuote(project, pricingProfile);
        break;
      case 2:
        calculatedPrice = calculateVideoEditingQuote(project, pricingProfile);
        break;
      case 3:
        calculatedPrice = calculatePaintingQuote(
          project,
          pricingProfile,
          additionalData.materialsCost,
          additionalData.toolsCost
        );
        break;
      case 4:
        calculatedPrice = calculateDrawingQuote(
          project,
          pricingProfile,
          additionalData.materialsCost,
          additionalData.toolsCost
        );
        break;
      default:
        calculatedPrice = 0;
        break;
    }
    setPrice(calculatedPrice);
  }, [quoteData, specializedData, selectedArtType, project, pricingProfile, additionalData]);

  return (
    <div className="mb-3">
      <h3 className="font-bold text-lg">
        Precio Calculado: ${price.toFixed(2)}
      </h3>
    </div>
  );
};
