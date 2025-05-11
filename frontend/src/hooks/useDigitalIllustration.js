// src/hooks/useDigitalIllustration.js
import { useState } from "react";

export function useDigitalIllustration() {
  const [digitalIllustrationData, setDigitalIllustrationData] = useState({
    illustrationType: "",
    additionalModifications: 0,
    modificationCost: 0,
  });

  const handleDigitalIllustrationChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setDigitalIllustrationData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  return { digitalIllustrationData, handleDigitalIllustrationChange };
}