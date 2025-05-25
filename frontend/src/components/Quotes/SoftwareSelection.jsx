import React, { useState, useEffect } from "react";
import api from "@/api/axios";

export default function SoftwareSelection({ onSelect }) {
  const [softwareList, setSoftwareList] = useState([]);
  const [selectedSoftware, setSelectedSoftware] = useState([]);

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

  const toggleSoftware = (software) => {
    let updated;
    if (selectedSoftware.some((s) => s.id === software.id)) {
      updated = selectedSoftware.filter((s) => s.id !== software.id);
    } else {
      updated = [...selectedSoftware, software];
    }
    setSelectedSoftware(updated);
    // Propaga la selección al componente padre.
    onSelect(updated);
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Seleccione Software</h3>
      <ul>
        {softwareList.map((sw) => {
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

          console.log(
            `Software: ${sw.name} | isAnnual: ${isAnnual} | annualCost: ${annualCostNumber} | Monthly Cost: ${costPerMonth.toFixed(2)}`
          );

          return (
            <li key={sw.id}>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedSoftware.some((s) => s.id === sw.id)}
                  onChange={() =>
                    toggleSoftware({
                      ...sw,
                      monthlyCost: costPerMonth, // Guardar el costo mensual calculado
                    })
                  }
                  className="mr-2"
                />
                {sw.name} - ${costPerMonth.toFixed(2)} / mes{" "}
                {isAnnual && "(calculado desde costo anual)"}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
