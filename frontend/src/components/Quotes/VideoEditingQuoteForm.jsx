// src/components/Quotes/VideoEditingQuoteForm.jsx
import React from "react";

export const VideoEditingQuoteForm = ({ data, handleChange }) => {
  return (
    <div className="border p-3 rounded mb-3">
      <h2 className="font-bold mb-2">Cotización para Edición de Video</h2>
      <label className="block text-sm font-bold mb-2">
        Número de Revisiones Adicionales:
      </label>
      <input
        name="additionalRevisions"
        type="number"
        value={data.additionalRevisions || ""}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
      />
      {/* Otros campos específicos */}
    </div>
  );
};
