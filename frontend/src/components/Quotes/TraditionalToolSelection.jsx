import React, { useState, useEffect } from "react";
import api from "@/api/axios";

export default function TraditionalToolSelection({ onSelect }) {
  const [traditionalToolList, setTraditionalToolList] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);

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

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Seleccione Herramientas Tradicionales</h3>
      <ul>
        {traditionalToolList.map((tool) => (
          <li key={tool.id}>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedTools.some((t) => t.id === tool.id)}
                onChange={() => toggleTool(tool)}
                className="mr-2"
              />
              {tool.name} - ${tool.averageCost}, Vida útil: {tool.averageLifespan} meses
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}