import React, { useState, useEffect } from "react";
import { MonitorIcon, CreditCardIcon, CalendarIcon } from "lucide-react";
import api from "@/api/axios";

export default function SoftwareSelection({ onSelect, selectedItems = [] }) {
  const [softwareList, setSoftwareList] = useState([]);
  const [selectedSoftware, setSelectedSoftware] = useState(selectedItems);

  useEffect(() => {
    const fetchSoftware = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await api.get("/software", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Software data:", response.data);
        setSoftwareList(response.data);
      } catch (error) {
        console.error("Error fetching software:", error);
      }
    };
    fetchSoftware();
  }, []);

  // Sincronizar con selectedItems cuando cambie
  useEffect(() => {
    setSelectedSoftware(selectedItems);
  }, [selectedItems]);

  const toggleSoftware = (software) => {
    let updated;
    if (selectedSoftware.some((s) => s.id === software.id)) {
      updated = selectedSoftware.filter((s) => s.id !== software.id);
    } else {
      updated = [...selectedSoftware, software];
    }
    setSelectedSoftware(updated);
    onSelect(updated);
  };

  // ✅ Obtener icono según el tipo de software
  const getSoftwareIcon = (softwareName) => {
    // Puedes personalizar según los nombres de tus software
    return <MonitorIcon className="w-4 h-4 text-indigo-500" />;
  };

  // ✅ Obtener badge de tipo de pago
  const getPaymentBadge = (isAnnual) => {
    return isAnnual ? (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 border border-orange-200">
        Anual
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
        Mensual
      </span>
    );
  };

  return (
    <div className="p-4 bg-gray-50 rounded-xl font-regular-text">
      <div className="flex items-center gap-2 mb-4">
        <MonitorIcon className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-bold text-gray-800">Software</h3>
      </div>
      
      {/* ✅ Grid de dos columnas para software */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {softwareList.map((sw) => {
          const isSelected = selectedSoftware.some((s) => s.id === sw.id);
          
          // Determinar si es anual basado en si tiene costo anual
          const isAnnual = Boolean(sw.annualCost && sw.annualCost > 0);

          // Calcular costo mensual
          const monthlyCostNumber =
            sw.monthlyCost && sw.monthlyCost !== ""
              ? Number(sw.monthlyCost)
              : 0;

          const annualCostNumber =
            sw.annualCost && sw.annualCost !== ""
              ? Number(sw.annualCost)
              : 0;

          // Si hay costo anual, convertirlo a mensual, sino usar costo mensual directo
          const costPerMonth = isAnnual
            ? annualCostNumber / 12
            : monthlyCostNumber;

          const softwareWithCalculatedCost = {
            ...sw,
            monthlyCost: costPerMonth,
          };

          return (
            <div
              key={sw.id}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                ${isSelected 
                  ? 'border-indigo-300 bg-indigo-50 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-indigo-200 hover:shadow-sm'
                }
              `}
              onClick={() => toggleSoftware(softwareWithCalculatedCost)}
            >
              {/* Header del software */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSoftware(softwareWithCalculatedCost)}
                  className="checkbox checkbox-primary mt-1"
                  onClick={(e) => e.stopPropagation()}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getSoftwareIcon(sw.name)}
                    <h4 className="font-medium text-gray-900 truncate">
                      {sw.name}
                    </h4>
                  </div>
                  
                  {/* Información de precios */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCardIcon className="w-3 h-3 text-green-600" />
                      <span className="font-bold text-green-700">
                        ${costPerMonth.toFixed(2)}
                      </span>
                      <span className="text-gray-600">por mes</span>
                    </div>
                    
                    {/* Mostrar costo original si es anual */}
                    {isAnnual && (
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="w-3 h-3 text-orange-600" />
                        <span className="text-orange-700 font-medium">
                          ${annualCostNumber}
                        </span>
                        <span className="text-gray-600">por año</span>
                      </div>
                    )}
                    
                    {/* Badge de tipo de pago */}
                    <div className="flex items-center gap-2">
                      {getPaymentBadge(isAnnual)}
                      {isAnnual && (
                        <span className="text-xs text-gray-500">
                          (calculado mensual)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ Indicador de selección */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ✅ Resumen de selección */}
      {selectedSoftware.length > 0 && (
        <div className="mt-4 p-3 bg-indigo-100 rounded-lg border border-indigo-200">
          <p className="text-sm font-medium text-indigo-800">
            {selectedSoftware.length} software{selectedSoftware.length !== 1 ? 's' : ''} seleccionado{selectedSoftware.length !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-indigo-600 mt-1">
            Costo mensual total: $
            {selectedSoftware.reduce((total, sw) => {
              return total + (sw.monthlyCost || 0);
            }, 0).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}
