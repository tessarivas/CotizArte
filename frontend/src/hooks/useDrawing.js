// src/hooks/useDrawing.js
import { useState } from "react";

export function useDrawing() {
  const [drawingData, setDrawingData] = useState({
    technique: "",
    paperCost: 0,
    materialsCost: 0,
    finishingCost: 0,
    framingCost: 0,
    shipping: false,
    shippingCost: 0,
    authenticityCertificate: false,
    certificateCost: 0,
    size: "",
  });

  const handleDrawingChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setDrawingData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  return { drawingData, handleDrawingChange };
}
