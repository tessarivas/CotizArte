import React, { useState, useEffect } from "react";
import { WrenchIcon, ClockIcon, DollarSignIcon } from "lucide-react";
import api from "@/api/axios";

export default function TraditionalToolSelection({ onSelect, selectedItems = [] }) {
  const [traditionalToolList, setTraditionalToolList] = useState([]);
  const [selectedTools, setSelectedTools] = useState(selectedItems);

  useEffect(() => {
    const fetchTraditionalTools = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await api.get("/traditional-tools", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTraditionalToolList(response.data);
      } catch (error) {
        console.error("Error fetching traditional tools:", error);
      }
    };
    fetchTraditionalTools();
  }, []);

  // ✅ Sincronizar con selectedItems cuando cambie
  useEffect(() => {
    setSelectedTools(selectedItems);
  }, [selectedItems]);

  const toggleTool = (tool) => {
    let updated;
    if (selectedTools.some((t) => t.id === tool.id)) {
      updated = selectedTools.filter((t) => t.id !== tool.id);
    } else {
      updated = [...selectedTools, tool];
    }
    setSelectedTools(updated);
    onSelect(updated);
  };

  // ✅ Obtener icono según el tipo de herramienta (puedes personalizar)
  const getToolIcon = (toolName) => {
    // Personaliza según los nombres de tus herramientas
    return <WrenchIcon className="w-4 h-4 text-blue-500" />;
  };

  // ✅ Calcular costo mensual
  const getMonthlyCost = (tool) => {
    if (tool.averageCost && tool.averageLifespan) {
      return (tool.averageCost / tool.averageLifespan).toFixed(2);
    }
    return "0.00";
  };

  return (
    <div className="p-4 bg-gray-50 rounded-xl font-regular-text">
      <div className="flex items-center gap-2 mb-4">
        <WrenchIcon className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-bold text-gray-800">Herramientas Tradicionales</h3>
      </div>
      
      {/* ✅ Grid de dos columnas para herramientas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {traditionalToolList.map((tool) => {
          const isSelected = selectedTools.some((t) => t.id === tool.id);
          
          return (
            <div
              key={tool.id}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                ${isSelected 
                  ? 'border-blue-300 bg-blue-50 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm'
                }
              `}
              onClick={() => toggleTool(tool)}
            >
              {/* Header de la herramienta */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleTool(tool)}
                  className="checkbox checkbox-primary mt-1"
                  onClick={(e) => e.stopPropagation()}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getToolIcon(tool.name)}
                    <h4 className="font-medium text-gray-900 truncate">
                      {tool.name}
                    </h4>
                  </div>
                  
                  {/* Información de costos */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSignIcon className="w-3 h-3 text-green-600" />
                      <span className="font-semibold text-green-700">
                        ${tool.averageCost}
                      </span>
                      <span className="text-gray-600">costo inicial</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <ClockIcon className="w-3 h-3 text-orange-600" />
                      <span className="font-semibold text-orange-700">
                        {tool.averageLifespan} meses
                      </span>
                      <span className="text-gray-600">vida útil</span>
                    </div>
                    
                    {/* Costo mensual calculado */}
                    <div className="p-2 bg-gray-100 rounded-md">
                      <p className="text-xs text-gray-600">Costo mensual:</p>
                      <p className="text-sm font-bold text-gray-800">
                        ${getMonthlyCost(tool)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ Indicador de selección */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ✅ Resumen de selección */}
      {selectedTools.length > 0 && (
        <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-800">
            {selectedTools.length} herramienta{selectedTools.length !== 1 ? 's' : ''} seleccionada{selectedTools.length !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Costo mensual total: $
            {selectedTools.reduce((total, tool) => {
              return total + parseFloat(getMonthlyCost(tool));
            }, 0).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}