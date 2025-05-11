// src/components/Quotes/CommonQuoteFields.jsx
import React from "react";

export const CommonQuoteFields = ({ data, handleChange }) => {
  return (
    <>
      <label className="block text-sm font-bold mb-2">Descuento (%):</label>
      <input
        name="discountPercentage"
        type="number"
        value={data.discountPercentage}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
      />
      <label className="block text-sm font-bold mb-2">Notas:</label>
      <textarea
        name="notes"
        value={data.notes}
        onChange={handleChange}
        className="textarea textarea-bordered w-full mb-3"
        placeholder="Agrega comentarios o especificaciones..."
      />
    </>
  );
};