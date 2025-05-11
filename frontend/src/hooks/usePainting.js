// src/hooks/usePainting.js
import { useState } from "react";

export function usePainting() {
  const [paintingData, setPaintingData] = useState({
    technique: "",
    canvasPaperCost: 0,
    paintsCost: 0,
    finishingCost: 0,
    framingCost: 0,
    shipping: false,
    shippingCost: 0,
    authenticityCertificate: false,
    certificateCost: 0,
    size: "",
  });

  const handlePaintingChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setPaintingData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  return { paintingData, handlePaintingChange };
}