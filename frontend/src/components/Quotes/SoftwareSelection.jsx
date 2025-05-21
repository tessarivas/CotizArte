// SoftwareSelection.jsx
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
        {softwareList.map((sw) => (
          <li key={sw.id}>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedSoftware.some((s) => s.id === sw.id)}
                onChange={() => toggleSoftware(sw)}
                className="mr-2"
              />
              {sw.name} - ${sw.monthlyCost} / mes
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
