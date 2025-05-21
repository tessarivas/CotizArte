import React from "react";
import { PencilIcon } from "lucide-react"; 
import GradientText from "../blocks/TextAnimations/GradientText/GradientText"; 

const ART_TYPES = [
  { id: 1, name: "Ilustración Digital" },
  { id: 2, name: "Edición de Video" },
  { id: 3, name: "Pintura" },
  { id: 4, name: "Dibujo" },
];

const EditPricingProfileModal = ({ profile, onFieldChange, onClose, onSave, isNew = false }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50 font-regular-text">
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-7 w-[500px]">
        {/* Título */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <GradientText className="text-5xl font-logo-text mb-2">
            {isNew ? "Nuevo Perfil" : "Editar Perfil"}
          </GradientText>
        </div>

        {/* Inputs del formulario */}
        <div className="grid grid-cols-1 gap-3">
          {/* Tipo de Arte */}
          <div className="relative">
            <select
              value={profile.artTypeId}
              onChange={(e) => onFieldChange("artTypeId", e.target.value)}
              className="select select-bordered w-full mb-3"
              required
            >
              <option value="">Seleccione tipo de arte...</option>
              {ART_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
          </div>

          {/* Tarifas (2 columnas) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input
                type="number"
                min="1"
                value={profile.standardHourlyRate}
                onChange={(e) => onFieldChange("standardHourlyRate", e.target.value)}
                className="input input-bordered w-full mb-3"
                placeholder="Tarifa Estándar ($/hora)"
                required
              />
              <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
            </div>
            <div className="relative">
              <input
                type="number"
                min="1"
                value={profile.preferredHourlyRate}
                onChange={(e) => onFieldChange("preferredHourlyRate", e.target.value)}
                className="input input-bordered w-full mb-3"
                placeholder="Tarifa Preferida ($/hora)"
                required
              />
              <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Proyectos por mes y Extra por modificación (2 columnas) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input
                type="number"
                min="1"
                value={profile.projectsPerMonth}
                onChange={(e) => onFieldChange("projectsPerMonth", e.target.value)}
                className="input input-bordered w-full mb-3"
                placeholder="Proyectos / Mes"
                required
              />
              <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={profile.modificationExtra}
                onChange={(e) => onFieldChange("modificationExtra", e.target.value)}
                className="input input-bordered w-full mb-3"
                placeholder="Extra por Modificación ($)"
                required
              />
              <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Porcentajes (2 columnas) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={profile.defaultCommercialLicensePercentage}
                onChange={(e) => onFieldChange("defaultCommercialLicensePercentage", e.target.value)}
                className="input input-bordered w-full mb-3"
                placeholder="% Licencia Comercial"
                required
              />
              <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={profile.defaultUrgencyPercentage}
                onChange={(e) => onFieldChange("defaultUrgencyPercentage", e.target.value)}
                className="input input-bordered w-full mb-3"
                placeholder="% Urgencia"
                required
              />
              <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button onClick={onSave} className="btn btn-primary">
            {isNew ? "Crear Perfil" : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPricingProfileModal;