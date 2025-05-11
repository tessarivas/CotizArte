// src/hooks/useVideoEditing.js
import { useState } from "react";

export function useVideoEditing() {
  const [videoEditingData, setVideoEditingData] = useState({
    editingType: "",
    stockFootageCost: 0,
    musicSoundCost: 0,
    pluginsCost: 0,
    includedRevisions: 2,
    additionalRevisions: 0,
    revisionCost: 0,
  });

  const handleVideoEditingChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setVideoEditingData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  return { videoEditingData, handleVideoEditingChange };
}