// src/components/Quotes/DrawingQuoteForm.jsx
import React from "react";

export const DrawingQuoteForm = ({ data, handleChange }) => {
  return (
    <div className="border p-3 rounded mb-3">
      <h2 className="font-bold mb-2">Cotización para Dibujo</h2>
      <label className="block text-sm font-bold mb-2">
        Costo de Materiales (estimado):
      </label>
      <input
        name="materialsCost"
        type="number"
        value={data.materialsCost || ""}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
      />
      {/* Otros campos específicos */}
    </div>
  );
};
