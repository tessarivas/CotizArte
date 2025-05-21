import React from "react";
import { FileTextIcon } from "lucide-react";

export const ProjectInfoSection = ({ project }) => (
  <div className="p-4 bg-gray-50 rounded-xl font-regular-text">
    <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
      <FileTextIcon className="w-5 h-5 text-secondary" />
      Información del Proyecto
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div>
        {/* PROJECT ART TYPE NAME */}
        <p className="text-sm text-gray-500">Tipo de Arte</p>
        <p className="italic">
          {project.artType?.name || "No especificado"}
        </p>
      </div>
      {project.description && (
        <div className="col-span-1 md:col-span-2">
          {/* PROJECT DESCRIPTION */}
          <p className="text-sm text-gray-500">Descripción</p>
          <p className="italic">{project.description}</p>
        </div>
      )}
    </div>
  </div>
);