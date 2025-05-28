import { VideoIcon } from "lucide-react";
import React from "react";

export const VideoEditingQuoteForm = ({
  data,
  handleChange,
  handleQuoteFieldChange,
  errors = {},
  pricingProfile,
}) => (
  <div className="p-4 bg-gray-50 rounded-xl font-regular-text">
    <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
      <VideoIcon className="w-5 h-5 text-blue-400" />
      Cotización para Edición de Video
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Columna 1 */}
      <div>
        <div className="mb-3">
          <label className="block text-sm font-bold mb-1">
            Horas trabajadas:
          </label>
          <input
            name="hoursWorked"
            type="number"
            min="0"
            step="0.5"
            value={data.hoursWorked || ""}
            onChange={handleChange}
            className={`input input-bordered w-full ${
              errors.hoursWorked ? "border-red-500" : ""
            }`}
            required
          />
          {errors.hoursWorked && (
            <p className="text-red-500 text-xs mt-1">{errors.hoursWorked}</p>
          )}
        </div>

        <div className="mb-3">
          <label className="block text-sm font-bold mb-1">
            Nivel de Detalle:
          </label>
          <select
            name="detailLevel"
            value={data.detailLevel || ""}
            onChange={handleChange}
            className={`select select-bordered w-full ${
              errors.detailLevel ? "border-red-500" : ""
            }`}
            required
          >
            <option value="">Seleccione...</option>
            <option value="1">Simple (+0%)</option>
            <option value="2">Básico (+25%)</option>
            <option value="3">Estándar (+50%)</option>
            <option value="4">Detallado (+75%)</option>
            <option value="5">Premium (+100%)</option>
          </select>
          {errors.detailLevel && (
            <p className="text-red-500 text-xs mt-1">{errors.detailLevel}</p>
          )}
        </div>

        {/* ✅ Agregar técnica de edición */}
        <div className="mb-3">
          <label className="block text-sm font-bold mb-1">
            Técnica de edición:
          </label>
          <div className="flex items-center gap-2 p-3 bg-white border border-gray-300 rounded-lg">
            <VideoIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span className="text-sm font-medium">
              {data.selectedTechnique?.name || "No especificada"}
            </span>
          </div>
          <span className="text-xs text-gray-500 mt-1 block">
            La técnica se seleccionó al crear el proyecto
          </span>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isCommercial"
              checked={data.isCommercial || false}
              onChange={handleChange}
              className="checkbox checkbox-primary"
            />
            <span>Uso comercial</span>
            {data.isCommercial && (
              <>
                <label className="text-xs font-semibold ml-2">
                  Modificar porcentaje:
                </label>
                <input
                  type="number"
                  name="commercialPercentage"
                  min="0"
                  max="100"
                  value={
                    data.commercialPercentage === undefined ||
                    data.commercialPercentage === null
                      ? ""
                      : data.commercialPercentage
                  }
                  onChange={handleQuoteFieldChange} // ✅ Corregir handler
                  className="input input-bordered input-xs w-20"
                  placeholder="Ej: 30"
                />
                <span className="text-xs">%</span>
              </>
            )}
          </div>
          {pricingProfile && (
            <span className="text-xs text-gray-500 ml-2 block">
              (No lo modifiques si deseas usar el valor del perfil:{" "}
              {pricingProfile.defaultCommercialLicensePercentage ?? 30}%)
            </span>
          )}
        </div>
      </div>

      {/* Columna 2 */}
      <div>
        <div className="mb-3">
          <label className="block text-sm font-bold mb-1">
            Duración del video (minutos):
          </label>
          <input
            name="duration"
            type="number"
            min="0"
            value={data.duration || ""}
            onChange={handleChange}
            className={`input input-bordered w-full ${
              errors.duration ? "border-red-500" : ""
            }`}
            required
          />
          {errors.duration && (
            <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
          )}
        </div>

        <div className="mb-3">
          <label className="block text-sm font-bold mb-1">
            Modificaciones adicionales:
          </label>
          <input
            name="additionalModifications"
            type="number"
            min="0"
            value={data.additionalModifications || 0}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Número de modificaciones"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-bold mb-1">
            Costo por modificación (opcional):
          </label>
          <input
            name="customModificationExtra"
            type="number"
            min="0"
            value={data.customModificationExtra || ""}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Usar valor del perfil si se deja vacío"
          />
          {/* ✅ Agregar valor del perfil como referencia */}
          {pricingProfile && (
            <span className="text-xs text-gray-500 mt-1 block">
              Valor del perfil: ${pricingProfile.modificationExtra || 0} por modificación
            </span>
          )}
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="rapidDelivery"
              checked={data.rapidDelivery || false}
              onChange={handleChange}
              className="checkbox checkbox-primary"
            />
            <span>Entrega urgente</span>
            {data.rapidDelivery && (
              <>
                <label className="text-xs font-semibold ml-2">
                  Modificar porcentaje:
                </label>
                <input
                  type="number"
                  name="rapidDeliveryPercentage"
                  min="0"
                  max="100"
                  value={
                    data.rapidDeliveryPercentage === undefined ||
                    data.rapidDeliveryPercentage === null
                      ? ""
                      : data.rapidDeliveryPercentage
                  }
                  onChange={handleQuoteFieldChange}
                  className="input input-bordered input-xs w-20"
                  placeholder="Ej: 20"
                />
                <span className="text-xs">%</span>
              </>
            )}
          </div>
          {pricingProfile && (
            <span className="text-xs text-gray-500 ml-2 block">
              (No lo modifiques si deseas usar el valor del perfil: {pricingProfile.defaultUrgencyPercentage ?? 20}%)
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);
