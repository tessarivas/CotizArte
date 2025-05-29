import React from "react";
import GradientText from "../blocks/TextAnimations/GradientText/GradientText";

const ART_TYPES = [
  { id: 1, name: "Ilustración Digital" },
  { id: 2, name: "Edición de Video" },
  { id: 3, name: "Pintura" },
  { id: 4, name: "Dibujo" },
];

const EditPricingProfileModal = ({
  profile,
  onFieldChange,
  onClose,
  onSave,
  isNew,
  errorMessages = {},
  successMessage = "",
}) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50 font-regular-text">
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-7 w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="text-4xl font-logo-text text-base-content mb-1">
            {isNew ? "- Nuevo -" : "- Editar -"}
          </div>
          <GradientText className="text-5xl font-logo-text">
            Perfil de Precios
          </GradientText>
        </div>

        {/* Inputs del formulario */}
        <div className="grid grid-cols-1 gap-4">
          {/* Tipo de Arte */}
          <div className="relative">
            <label className="block text-base-content text-sm font-bold mb-1">
              *Tipo de Arte:
            </label>
            <select
              value={profile.artTypeId || ""}
              onChange={(e) => onFieldChange("artTypeId", e.target.value)}
              className={`select validator select-bordered w-full ${
                errorMessages.artTypeId ? "border-error" : ""
              }`}
              required
            >
              <option value="">Ej: Ilustración Digital, Pintura...</option>
              {ART_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errorMessages.artTypeId && (
              <p className="text-error text-xs mt-1">
                {errorMessages.artTypeId}
              </p>
            )}
          </div>

          {/* Tarifa Estándar y Mensaje informativo */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <label className="block text-base-content text-sm font-bold mb-1">
                *Tarifa Estándar por Hora:
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={profile.standardHourlyRate || ""}
                onChange={(e) =>
                  onFieldChange("standardHourlyRate", e.target.value)
                }
                className={`input validator input-bordered w-full ${
                  errorMessages.standardHourlyRate ? "border-error" : ""
                }`}
                placeholder="Ej: 25.00"
                required
              />
              {errorMessages.standardHourlyRate && (
                <p className="text-error text-xs mt-1">
                  {errorMessages.standardHourlyRate}
                </p>
              )}
            </div>

            {/* Mensaje informativo */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-2 flex items-center">
              <div className="text-blue-600">
                <p className="text-xs font-medium text-blue-800">
                  💡 Esta tarifa se usará para calcular el costo de tus obras
                  basado en las horas invertidas
                </p>
              </div>
            </div>
          </div>

          {/* Proyectos por mes y Extra por modificación (2 columnas) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <label className="block text-base-content text-sm font-bold mb-1">
                *Proyectos por Mes:
              </label>
              <input
                type="number"
                min="1"
                value={profile.projectsPerMonth || ""}
                onChange={(e) =>
                  onFieldChange("projectsPerMonth", e.target.value)
                }
                className={`input validator input-bordered w-full ${
                  errorMessages.projectsPerMonth ? "border-error" : ""
                }`}
                placeholder="Ej: 8"
                required
              />
              {errorMessages.projectsPerMonth && (
                <p className="text-error text-xs mt-1">
                  {errorMessages.projectsPerMonth}
                </p>
              )}
            </div>
            <div className="relative">
              <label className="block text-base-content text-sm font-bold mb-1">
                *Extra por Modificación:
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={profile.modificationExtra || ""}
                onChange={(e) =>
                  onFieldChange("modificationExtra", e.target.value)
                }
                className={`input validator input-bordered w-full ${
                  errorMessages.modificationExtra ? "border-error" : ""
                }`}
                placeholder="Ej: 15.00"
                required
              />
              {errorMessages.modificationExtra && (
                <p className="text-error text-xs mt-1">
                  {errorMessages.modificationExtra}
                </p>
              )}
            </div>
          </div>

          {/* Porcentajes (2 columnas) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <label className="block text-base-content text-sm font-bold mb-1">
                *% Licencia Comercial:
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={profile.defaultCommercialLicensePercentage || ""}
                onChange={(e) =>
                  onFieldChange(
                    "defaultCommercialLicensePercentage",
                    e.target.value
                  )
                }
                className={`input validator input-bordered w-full ${
                  errorMessages.defaultCommercialLicensePercentage
                    ? "border-error"
                    : ""
                }`}
                placeholder="Ej: 30"
                required
              />
              {errorMessages.defaultCommercialLicensePercentage && (
                <p className="text-error text-xs mt-1">
                  {errorMessages.defaultCommercialLicensePercentage}
                </p>
              )}
            </div>
            <div className="relative">
              <label className="block text-base-content text-sm font-bold mb-1">
                *% Urgencia:
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={profile.defaultUrgencyPercentage || ""}
                onChange={(e) =>
                  onFieldChange("defaultUrgencyPercentage", e.target.value)
                }
                className={`input validator input-bordered w-full ${
                  errorMessages.defaultUrgencyPercentage ? "border-error" : ""
                }`}
                placeholder="Ej: 50"
                required
              />
              {errorMessages.defaultUrgencyPercentage && (
                <p className="text-error text-xs mt-1">
                  {errorMessages.defaultUrgencyPercentage}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mensajes de error y éxito */}
        {errorMessages.general && (
          <p className="text-error text-sm text-center mt-4">
            {errorMessages.general}
          </p>
        )}
        {successMessage && (
          <p className="text-success text-sm text-center mt-4">
            {successMessage}
          </p>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="btn btn-primary"
            disabled={!!successMessage}
          >
            {successMessage
              ? "Guardado..."
              : isNew
              ? "Crear Perfil"
              : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPricingProfileModal;
