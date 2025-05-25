import React from "react";
import { PencilIcon } from "lucide-react";

export const DrawingQuoteForm = ({ 
  data, 
  handleChange,
  errors = {} 
}) => (
  <div className="p-4 bg-gray-50 rounded-xl font-regular-text">
    <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
      <PencilIcon className="w-5 h-5 text-primary" />
      Cotización para Dibujo
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Columna 1: Detalles técnicos */}
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
        </div>

        <div className="mb-3">
          <label className="block text-sm font-bold mb-1">
            Dimensiones:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                name="width"
                type="number"
                min="0"
                value={data.width || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Ancho (cm)"
                required
              />
            </div>
            <div>
              <input
                name="height"
                type="number"
                min="0"
                value={data.height || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Alto (cm)"
                required
              />
            </div>
          </div>
          <span className="text-xs text-gray-500 mt-1 block">
            Área total: {((data.width || 0) * (data.height || 0)).toFixed(2)} cm²
          </span>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-bold mb-1">
            Técnica:
          </label>
          <select
            name="technique"
            value={data.technique || ""}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Seleccionar técnica</option>
            <option value="lapiz">Lápiz grafito</option>
            <option value="carbon">Carboncillo</option>
            <option value="lapices-color">Lápices de color</option>
            <option value="tinta">Tinta</option>
            <option value="mixta">Técnica mixta</option>
          </select>
        </div>
      </div>

      {/* Columna 2: Opciones adicionales */}
      <div>
        <div className="mb-3">
          <label className="block text-sm font-bold mb-1">
            Revisiones adicionales:
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
                  Porcentaje extra:
                </label>
                <input
                  type="number"
                  name="commercialPercentage"
                  min="0"
                  max="100"
                  value={data.commercialPercentage ?? ""}
                  onChange={handleChange}
                  className="input input-bordered input-xs w-20"
                  placeholder="Ej: 30"
                />
                <span className="text-xs">%</span>
              </>
            )}
          </div>
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
                  Porcentaje extra:
                </label>
                <input
                  type="number"
                  name="rapidDeliveryPercentage"
                  min="0"
                  max="100"
                  value={data.rapidDeliveryPercentage ?? ""}
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
  </div>
);