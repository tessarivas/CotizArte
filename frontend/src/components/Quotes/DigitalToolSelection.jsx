import React, { useState, useEffect } from "react";
import { TabletIcon, DollarSignIcon, ClockIcon } from "lucide-react";
import api from "@/api/axios";

export default function DigitalToolSelection({ onSelect, selectedItems = [] }) {
  const [digitalToolList, setDigitalToolList] = useState([]);
  // ✅ Usar selectedItems como estado inicial
  const [selectedDigitalTools, setSelectedDigitalTools] = useState(selectedItems);

  // ✅ Sincronizar con selectedItems cuando cambie
  useEffect(() => {
    setSelectedDigitalTools(selectedItems);
  }, [selectedItems]);

  useEffect(() => {
    const fetchDigitalTools = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await api.get("/digital-tools", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDigitalToolList(response.data);
      } catch (error) {
        console.error("Error fetching digital tools:", error);
      }
    };
    fetchDigitalTools();
  }, []);

  const toggleDigitalTool = (tool) => {
    let updated;
    if (selectedDigitalTools.some((t) => t.id === tool.id)) {
      updated = selectedDigitalTools.filter((t) => t.id !== tool.id);
    } else {
      updated = [...selectedDigitalTools, tool];
    }
    setSelectedDigitalTools(updated);
    onSelect(updated);
  };

  // ✅ Obtener icono según el tipo de herramienta
  const getToolIcon = (toolName) => {
    // Puedes personalizar según los nombres de tus herramientas
    return <TabletIcon className="w-4 h-4 text-purple-500" />;
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
        <TabletIcon className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-bold text-gray-800">Herramientas Digitales</h3>
      </div>
      
      {/* ✅ Grid de dos columnas para herramientas digitales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {digitalToolList.map((tool) => {
          const isSelected = selectedDigitalTools.some((t) => t.id === tool.id);
          
          return (
            <div
              key={tool.id}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                ${isSelected 
                  ? 'border-purple-300 bg-purple-50 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-purple-200 hover:shadow-sm'
                }
              `}
              onClick={() => toggleDigitalTool(tool)}
            >
              {/* Header de la herramienta */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleDigitalTool(tool)}
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
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ✅ Resumen de selección */}
      {selectedDigitalTools.length > 0 && (
        <div className="mt-4 p-3 bg-purple-100 rounded-lg border border-purple-200">
          <p className="text-sm font-medium text-purple-800">
            {selectedDigitalTools.length} herramienta{selectedDigitalTools.length !== 1 ? 's' : ''} digital{selectedDigitalTools.length !== 1 ? 'es' : ''} seleccionada{selectedDigitalTools.length !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-purple-600 mt-1">
            Costo mensual total: $
            {selectedDigitalTools.reduce((total, tool) => {
              return total + parseFloat(getMonthlyCost(tool));
            }, 0).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}