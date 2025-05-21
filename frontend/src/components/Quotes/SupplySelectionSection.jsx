import React from "react";
import SoftwareSelection from "./SoftwareSelection";
import DigitalToolSelection from "./DigitalToolSelection";
import TraditionalMaterialSelection from "./TraditionalMaterialSelection";
import TraditionalToolSelection from "./TraditionalToolSelection";
import { CheckSquareIcon } from "lucide-react";

export const SupplySelectionSection = ({
  selectedArtType,
  setSelectedSoftware,
  setSelectedDigitalTools,
  setSelectedTraditionalMaterials,
  setSelectedTraditionalTools,
}) => (
  <div className="bg-gray-50 rounded-xl p-4 font-regular-text">
    <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
      <CheckSquareIcon className="w-5 h-5 text-teal-400" />
      Selección de Insumos
    </h3>
    {([1, 2].includes(Number(selectedArtType))) && (
      <>
        <SoftwareSelection onSelect={setSelectedSoftware} />
        <DigitalToolSelection onSelect={setSelectedDigitalTools} />
      </>
    )}
    {([3, 4].includes(Number(selectedArtType))) && (
      <>
        <TraditionalMaterialSelection onSelect={setSelectedTraditionalMaterials} />
        <TraditionalToolSelection onSelect={setSelectedTraditionalTools} />
      </>
    )}
  </div>
);