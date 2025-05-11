// 4. Componente para Video Editing
export const VideoEditingForm = ({ data, handleChange, formData, handleFormChange }) => {
  return (
    <div className="border p-3 rounded mb-3">
      <h2 className="font-bold mb-2">Datos de Edición de Video</h2>
      <label className="block text-sm font-bold mb-2">Tipo de Edición:</label>
      <input
        name="editingType"
        type="text"
        value={data.editingType}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
        placeholder="Ej. Comercial, Educativo, etc."
      />
      <label className="block text-sm font-bold mb-2">Costo de Footage de Stock:</label>
      <input
        name="stockFootageCost"
        type="number"
        value={data.stockFootageCost}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
      />
      <label className="block text-sm font-bold mb-2">Costo de Música y Sonido:</label>
      <input
        name="musicSoundCost"
        type="number"
        value={data.musicSoundCost}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
      />
      <label className="block text-sm font-bold mb-2">Costo de Plugins:</label>
      <input
        name="pluginsCost"
        type="number"
        value={data.pluginsCost}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
      />
      <label className="block text-sm font-bold mb-2">Revisiones incluidas:</label>
      <input
        name="includedRevisions"
        type="number"
        value={data.includedRevisions}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
      />
      <label className="block text-sm font-bold mb-2">Revisiones adicionales:</label>
      <input
        name="additionalRevisions"
        type="number"
        value={data.additionalRevisions}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
      />
      <label className="block text-sm font-bold mb-2">Costo de revisión adicional:</label>
      <input
        name="revisionCost"
        type="number"
        value={data.revisionCost}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
      />
      <label className="block text-sm font-bold mb-2">Duración del Video (minutos):</label>
      <input
        name="duration"
        type="number"
        value={formData.duration || ""}
        onChange={handleFormChange}
        className="input input-bordered w-full mb-3"
        placeholder="Duración"
      />
    </div>
  );
};
