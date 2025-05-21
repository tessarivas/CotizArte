import React, { useState, useEffect } from "react";
import api from "@/api/axios";

export default function DigitalToolSelection({ onSelect }) {
  const [digitalToolList, setDigitalToolList] = useState([]);
  const [selectedDigitalTools, setSelectedDigitalTools] = useState([]);

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

  return (
    <div>
      <h3 className="mt-4 text-lg font-bold mb-2">Seleccione Herramientas Digitales</h3>
      <ul>
        {digitalToolList.map((tool) => (
          <li key={tool.id}>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedDigitalTools.some((t) => t.id === tool.id)}
                onChange={() => toggleDigitalTool(tool)}
                className="mr-2"
              />
              {tool.name} - ${tool.averageCost} (vida útil: {tool.averageLifespan} meses, ${ (tool.averageCost/tool.averageLifespan).toFixed(2) }/mes)
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}