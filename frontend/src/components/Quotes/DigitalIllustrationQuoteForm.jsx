// src/components/Quotes/DigitalIllustrationQuoteForm.jsx
import React from "react";

export const DigitalIllustrationQuoteForm = ({ data, handleChange }) => {
  return (
    <div className="border p-3 rounded mb-3">
      <h2 className="font-bold mb-2">Cotización para Ilustración Digital</h2>
      {/* Aquí podrías incluir campos adicionales específicos para este tipo */}
      <label className="block text-sm font-bold mb-2">
        Modificaciones Adicionales (cantidad):
      </label>
      <input
        name="additionalModifications"
        type="number"
        value={data.additionalModifications || ""}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
      />
      {/* Otros campos si aplican */}
    </div>
  );
};
