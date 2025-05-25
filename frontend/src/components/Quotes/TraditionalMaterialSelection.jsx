import React, { useState, useEffect } from "react";
import api from "@/api/axios";

export default function TraditionalMaterialSelection({ onSelect }) {
  const [materialList, setMaterialList] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [quantities, setQuantities] = useState({}); // Para contenedores completos
  const [partialAmounts, setPartialAmounts] = useState({}); // Para uso parcial en ml

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

  const handleQuantityChange = (materialId, value, isPartial = false) => {
    const material = materialList.find((m) => m.id === materialId);
    if (!material) return;

    // Si el campo está vacío, mantenerlo vacío
    if (value === "") {
      if (isPartial) {
        setPartialAmounts((prev) => ({
          ...prev,
          [materialId]: "",
        }));
      } else {
        setQuantities((prev) => ({
          ...prev,
          [materialId]: "",
        }));
      }
      updateSelectedMaterials(); // Importante: actualizar después de cambiar el estado
      return;
    }

    // Convertir a número y validar
    let newValue = Number(value);

    // Asegurarse que sea un número positivo y no más de 2 dígitos
    newValue = Math.max(0, Math.min(newValue, 99));

    // Para uso parcial, limitar al tamaño del contenedor
    if (isPartial && material.containerSize) {
      newValue = Math.min(newValue, material.containerSize);
      console.log("Valor parcial actualizado:", {
        materialId,
        inputValue: value,
        parsedValue: newValue,
        containerSize: material.containerSize,
      });
    }

    // Actualizar el estado usando una función para garantizar el último valor
    if (isPartial) {
      setPartialAmounts((prev) => {
        const updated = {
          ...prev,
          [materialId]: newValue,
        };
        console.log("Nuevo estado partialAmounts:", updated);
        return updated;
      });
    } else {
      setQuantities((prev) => ({
        ...prev,
        [materialId]: newValue,
      }));
    }

    // Usar un pequeño delay para asegurar que el estado se haya actualizado
    setTimeout(() => {
      const updatedMaterials = selectedMaterials.map((material) => ({
        ...material,
        quantity: quantities[material.id] || 0,
        partialUse:
          material.id === materialId && isPartial
            ? newValue
            : partialAmounts[material.id] || 0,
        containerSize: Number(material.containerSize),
      }));

      console.log("Materiales actualizados:", updatedMaterials);
      onSelect(updatedMaterials);
    }, 0);
  };

  // Actualizar updateSelectedMaterials para usar los valores más recientes
  const updateSelectedMaterials = () => {
    const updatedMaterials = selectedMaterials.map((material) => {
      const quantity = quantities[material.id] || 0;
      const partialUse = partialAmounts[material.id] || 0;

      return {
        ...material,
        quantity,
        partialUse,
        containerSize: Number(material.containerSize),
      };
    });

    console.log("Materiales actualizados:", updatedMaterials);
    onSelect(updatedMaterials);
  };

  const toggleMaterial = (material) => {
    let updated;
    if (selectedMaterials.some((m) => m.id === material.id)) {
      updated = selectedMaterials.filter((m) => m.id !== material.id);
      // Limpiar cantidades al deseleccionar
      setQuantities((prev) => {
        const newQuantities = { ...prev };
        delete newQuantities[material.id];
        return newQuantities;
      });
      setPartialAmounts((prev) => {
        const newAmounts = { ...prev };
        delete newAmounts[material.id];
        return newAmounts;
      });
    } else {
      updated = [...selectedMaterials, material];
    }

    setSelectedMaterials(updated);
    updateSelectedMaterials();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Seleccionar Materiales</h3>
      <div className="grid gap-3">
        {materialList.map((material) => (
          <div
            key={material.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedMaterials.some((m) => m.id === material.id)}
                onChange={() => toggleMaterial(material)}
                className="checkbox checkbox-primary"
              />
              <div>
                <p className="font-medium">{material.name}</p>
                <p className="text-sm text-gray-600">
                  ${material.averageCost} por{" "}
                  {material.unit === "ml"
                    ? `contenedor de ${material.containerSize}ml`
                    : material.unit}
                </p>
                <p className="text-xs text-gray-500">
                  {material.category} - {material.quality}
                </p>
              </div>
            </div>

            {selectedMaterials.some((m) => m.id === material.id) && (
              <div className="flex items-center gap-4">
                {material.unit === "ml" ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">
                        Contenedores:
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={
                          quantities[material.id] === undefined
                            ? ""
                            : quantities[material.id]
                        }
                        onChange={(e) =>
                          handleQuantityChange(material.id, e.target.value)
                        }
                        className="input input-bordered input-sm w-20 text-center"
                        step="1"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">
                        Uso parcial:
                      </label>
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        max={material.containerSize}
                        value={
                          partialAmounts[material.id] === undefined
                            ? ""
                            : partialAmounts[material.id]
                        }
                        onChange={(e) =>
                          handleQuantityChange(
                            material.id,
                            e.target.value,
                            true
                          )
                        }
                        className="input input-bordered input-sm w-20 text-center"
                        step="1"
                      />
                      <span className="text-sm">ml</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Cantidad:</label>
                    <input
                      type="number"
                      min="0"
                      value={
                        quantities[material.id] === undefined
                          ? ""
                          : quantities[material.id]
                      }
                      onChange={(e) =>
                        handleQuantityChange(material.id, e.target.value)
                      }
                      className="input input-bordered input-sm w-20 text-center"
                      step="1"
                    />
                    <span className="text-sm">{material.unit}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
