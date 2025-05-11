// src/components/Quotes/PaintingQuoteForm.jsx
import React from "react";

export const PaintingQuoteForm = ({ data, handleChange }) => {
  return (
    <div className="border p-3 rounded mb-3">
      <h2 className="font-bold mb-2">Cotización para Pintura</h2>
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
      {/* Otros campos específicos, como extras de envío o certificado */}
    </div>
  );
};
