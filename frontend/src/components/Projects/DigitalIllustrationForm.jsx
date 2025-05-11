// 3. Componente para Digital Illustration
export const DigitalIllustrationForm = ({ data, handleChange }) => {
  return (
    <div className="border p-3 rounded mb-3">
      <h2 className="font-bold mb-2">Datos de Ilustración Digital</h2>
      <label className="block text-sm font-bold mb-2">Tipo de Ilustración:</label>
      <input
        name="illustrationType"
        type="text"
        value={data.illustrationType}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
        placeholder="Ej. Retrato, Concept Art, etc."
      />
      <label className="block text-sm font-bold mb-2">Modificaciones adicionales:</label>
      <input
        name="additionalModifications"
        type="number"
        value={data.additionalModifications}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
      />
      <label className="block text-sm font-bold mb-2">Costo de modificaciones:</label>
      <input
        name="modificationCost"
        type="number"
        value={data.modificationCost}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
      />
    </div>
  );
};