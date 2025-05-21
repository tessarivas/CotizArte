import React from "react";

export const VideoEditingQuoteForm = ({ data, handleChange, errors = {} }) => (
  <div className="p-4 bg-gray-50 rounded-xl font-regular-text">
    <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
      Cotización para Edición de Video
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            className="input input-bordered w-full"
          />
        </div>
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
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-bold mb-1">
            Número de revisiones adicionales:
          </label>
          <input
            name="additionalModifications"
            type="number"
            min="0"
            value={data.additionalModifications || ""}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-bold mb-1">
            Costo por revisión/modificación (opcional):
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
      </div>
      <div>
        <div className="mb-3 flex items-center gap-2">
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
                Porcentaje extra:
              </label>
              <input
                type="number"
                name="commercialPercentage"
                min="0"
                max="100"
                value={data.commercialPercentage ?? 30}
                onChange={handleChange}
                className="input input-bordered input-xs w-20"
                placeholder="Ej: 30"
              />
              <span className="text-xs">%</span>
            </>
          )}
        </div>
        <div className="mb-3 flex items-center gap-2">
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
                Porcentaje extra:
              </label>
              <input
                type="number"
                name="rapidDeliveryPercentage"
                min="0"
                max="100"
                value={data.rapidDeliveryPercentage ?? 20}
                onChange={handleChange}
                className="input input-bordered input-xs w-20"
                placeholder="Ej: 20"
              />
              <span className="text-xs">%</span>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);