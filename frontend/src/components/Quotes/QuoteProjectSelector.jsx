// src/components/Quotes/QuoteProjectSelector.jsx
import React from "react";

export const QuoteProjectSelector = ({
  selectedProject,
  setSelectedProject,
  projectOptions,
}) => {
  return (
    <>
      <label className="block text-sm font-bold mb-2">Proyecto:</label>
      <select
        value={selectedProject}
        onChange={(e) => setSelectedProject(e.target.value)}
        className="select select-bordered w-full mb-3"
      >
        <option value="">Selecciona un proyecto</option>
        {projectOptions.map((project) => (
          <option key={project.id} value={project.id}>
            {project.title}
          </option>
        ))}
      </select>
    </>
  );
};
