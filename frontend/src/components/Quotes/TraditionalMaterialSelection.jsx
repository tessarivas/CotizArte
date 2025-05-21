import React, { useState, useEffect } from "react";
import api from "@/api/axios";

export default function TraditionalMaterialSelection({ onSelect }) {
  const [materialList, setMaterialList] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await api.get("/traditional-materials", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMaterialList(response.data);
      } catch (error) {
        console.error("Error fetching traditional materials:", error);
      }
    };
    fetchMaterials();
  }, []);

  const toggleMaterial = (material) => {
    let updated;
    if (selectedMaterials.some((m) => m.id === material.id)) {
      updated = selectedMaterials.filter((m) => m.id !== material.id);
    } else {
      updated = [...selectedMaterials, material];
    }
    setSelectedMaterials(updated);
    onSelect(updated);
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Seleccione Material Tradicional</h3>
      <ul>
        {materialList.map((material) => (
          <li key={material.id}>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedMaterials.some((m) => m.id === material.id)}
                onChange={() => toggleMaterial(material)}
                className="mr-2"
              />
              {material.name} - ${material.averageCost} por {material.unit}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}