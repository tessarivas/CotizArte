import { PaintbrushVerticalIcon } from "lucide-react";
import React from "react";

export const DigitalIllustrationQuoteForm = ({
  data,
  handleChange,
  handleQuoteFieldChange,
  errors = {},
  pricingProfile, // <-- AGREGA ESTO EN LOS PROPS
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded-xl font-regular-text">
      <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
        <PaintbrushVerticalIcon className="w-5 h-5 text-yellow-400" />
        Cotización para Ilustración Digital
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
                    onChange={handleQuoteFieldChange}
                    className="input input-bordered input-xs w-20"
                    placeholder="Ej: 30"
                  />
                  <span className="text-xs">%</span>
                </>
              )}
            </div>
              {/* Muestra el valor por defecto del perfil */}
              {pricingProfile && (
                <span className="text-xs text-gray-500 ml-2">
                  (No lo modifiques si deseas uasar el valor del perfil:{" "}
                  {pricingProfile.defaultCommercialLicensePercentage ?? 30}
                  %)
                </span>
              )}
          </div>
        </div>
        {/* Columna 2 */}
        <div>
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
              {/* Muestra el valor por defecto del perfil */}
              {pricingProfile && (
                <span className="text-xs text-gray-500 ml-2">
                  (No lo modifiques si deseas uasar el valor del perfil: {pricingProfile.defaultUrgencyPercentage ?? 20}%)
                </span>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
