import React, { useState, useEffect } from "react";
import { PaletteIcon, SparklesIcon } from "lucide-react";
import api from "@/api/axios";

export default function TraditionalMaterialSelection({ onSelect, selectedItems = [] }) {
  const [materialList, setMaterialList] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState(selectedItems);
  const [quantities, setQuantities] = useState({});
  const [partialAmounts, setPartialAmounts] = useState({});

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

  // ✅ Sincronizar con selectedItems cuando cambie
  useEffect(() => {
    setSelectedMaterials(selectedItems);
    
    // ✅ Extraer quantities y partialAmounts de selectedItems
    const newQuantities = {};
    const newPartialAmounts = {};
    
    selectedItems.forEach(item => {
      if (item.quantity !== undefined) {
        newQuantities[item.id] = item.quantity;
      }
      if (item.partialUse !== undefined) {
        newPartialAmounts[item.id] = item.partialUse;
      }
    });
    
    setQuantities(newQuantities);
    setPartialAmounts(newPartialAmounts);
  }, [selectedItems]);

  const handleQuantityChange = (materialId, value, isPartial = false) => {
    const material = materialList.find((m) => m.id === materialId);
    if (!material) return;

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
      // ✅ Llamar updateSelectedMaterials después de actualizar el estado
      setTimeout(() => updateSelectedMaterials(), 0);
      return;
    }

    let newValue = Number(value);
    newValue = Math.max(0, Math.min(newValue, 99));

    if (isPartial && material.containerSize) {
      newValue = Math.min(newValue, material.containerSize);
    }

    if (isPartial) {
      setPartialAmounts((prev) => {
        const updated = { ...prev, [materialId]: newValue };
        // ✅ Actualizar selectedMaterials con el nuevo valor
        setTimeout(() => {
          const updatedMaterials = selectedMaterials.map((material) => ({
            ...material,
            quantity: quantities[material.id] || 0,
            partialUse: material.id === materialId ? newValue : (updated[material.id] || 0),
            containerSize: Number(material.containerSize),
          }));
          onSelect(updatedMaterials);
        }, 0);
        return updated;
      });
    } else {
      setQuantities((prev) => {
        const updated = { ...prev, [materialId]: newValue };
        // ✅ Actualizar selectedMaterials con el nuevo valor
        setTimeout(() => {
          const updatedMaterials = selectedMaterials.map((material) => ({
            ...material,
            quantity: material.id === materialId ? newValue : (updated[material.id] || 0),
            partialUse: partialAmounts[material.id] || 0,
            containerSize: Number(material.containerSize),
          }));
          onSelect(updatedMaterials);
        }, 0);
        return updated;
      });
    }
  };

  const updateSelectedMaterials = () => {
    const updatedMaterials = selectedMaterials.map((material) => {
      if (material.unit !== "ml") {
        return {
          ...material,
          quantity: 1,
          partialUse: 0,
          containerSize: null,
        };
      }

      return {
        ...material,
        quantity: quantities[material.id] || 0,
        partialUse: partialAmounts[material.id] || 0,
        containerSize: Number(material.containerSize),
      };
    });

    onSelect(updatedMaterials);
  };

  const toggleMaterial = (material) => {
    let updated;
    if (selectedMaterials.some((m) => m.id === material.id)) {
      // ✅ Al deseleccionar, limpiar también quantities y partialAmounts
      updated = selectedMaterials.filter((m) => m.id !== material.id);
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
      // ✅ Al seleccionar, inicializar con valores por defecto
      updated = [...selectedMaterials, material];

      if (material.unit === "ml") {
        setQuantities((prev) => ({
          ...prev,
          [material.id]: 0,
        }));
        setPartialAmounts((prev) => ({
          ...prev,
          [material.id]: 0,
        }));
      } else {
        setQuantities((prev) => ({
          ...prev,
          [material.id]: 1,
        }));
      }
    }

    setSelectedMaterials(updated);

    // ✅ Actualizar con los valores correctos
    setTimeout(() => {
      const updatedMaterials = updated.map((mat) => {
        if (mat.unit === "ml") {
          return {
            ...mat,
            quantity: quantities[mat.id] || 0,
            partialUse: partialAmounts[mat.id] || 0,
            containerSize: Number(mat.containerSize),
          };
        } else {
          return {
            ...mat,
            quantity: 1,
            partialUse: 0,
            containerSize: null,
          };
        }
      });

      onSelect(updatedMaterials);
    }, 0);
  };

  // ✅ Obtener icono según categoría
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "paint":
      case "pintura":
        return <PaletteIcon className="w-4 h-4 text-pink-500" />;
      default:
        return <SparklesIcon className="w-4 h-4 text-purple-500" />;
    }
  };

  // ✅ Obtener color de badge según calidad
  const getQualityBadgeClass = (quality) => {
    switch (quality?.toLowerCase()) {
      case "alta":
      case "premium":
        return "bg-green-100 text-green-800 border-green-200";
      case "media":
      case "estándar":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "básica":
      case "económica":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-xl font-regular-text">
      <div className="flex items-center gap-2 mb-4">
        <PaletteIcon className="w-5 h-5 text-pink-500" />
        <h3 className="text-lg font-bold text-gray-800">
          Materiales Tradicionales
        </h3>
      </div>

      {/* ✅ Grid de dos columnas para materiales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {materialList.map((material) => {
          const isSelected = selectedMaterials.some((m) => m.id === material.id);

          return (
            <div
              key={material.id}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                ${isSelected
                  ? "border-pink-300 bg-pink-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-pink-200 hover:shadow-sm"
                }
              `}
              onClick={() => toggleMaterial(material)}
            >
              {/* Header del material */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleMaterial(material)}
                    className="checkbox checkbox-primary mt-1"
                    onClick={(e) => e.stopPropagation()}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getCategoryIcon(material.category)}
                      <h4 className="font-medium text-gray-900 truncate">
                        {material.name}
                      </h4>
                    </div>

                    {/* Precio y unidad */}
                    <p className="text-sm font-semibold text-green-700 mb-1">
                      ${material.averageCost}
                      <span className="text-gray-600 font-normal">
                        {material.unit === "ml"
                          ? ` por ${material.containerSize}ml`
                          : ` por ${material.unit}`
                        }
                      </span>
                    </p>

                    {/* Badges de categoría y calidad */}
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                        {material.category}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getQualityBadgeClass(material.quality)}`}>
                        {material.quality}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ Controles de cantidad (solo si está seleccionado) */}
              {isSelected && material.unit === "ml" && (
                <div className="mt-3 pt-3 border-t border-pink-200">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Contenedores completos */}
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-gray-700">
                        Contenedores
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={
                          quantities[material.id] === undefined
                            ? ""
                            : quantities[material.id]
                        }
                        onChange={(e) =>
                          handleQuantityChange(material.id, e.target.value)
                        }
                        className="input input-bordered input-sm w-full text-center"
                        placeholder="0"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Uso parcial */}
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-gray-700">
                        Parcial (ml)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={material.containerSize}
                        value={
                          partialAmounts[material.id] === undefined
                            ? ""
                            : partialAmounts[material.id]
                        }
                        onChange={(e) =>
                          handleQuantityChange(material.id, e.target.value, true)
                        }
                        className="input input-bordered input-sm w-full text-center"
                        placeholder="0"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Máx. parcial: {material.containerSize}ml
                  </p>
                </div>
              )}

              {/* ✅ Indicador de selección */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ✅ Resumen de selección */}
      {selectedMaterials.length > 0 && (
        <div className="mt-4 p-3 bg-pink-100 rounded-lg border border-pink-200">
          <p className="text-sm font-medium text-pink-800">
            {selectedMaterials.length} material{selectedMaterials.length !== 1 ? 'es' : ''} seleccionado{selectedMaterials.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
