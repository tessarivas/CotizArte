// 5. Componente para Painting
export const PaintingForm = ({ data, handleChange, formData, handleFormChange }) => {
  return (
    <div className="border p-3 rounded mb-3">
      <h2 className="font-bold mb-2">Datos de Pintura</h2>
      <label className="block text-sm font-bold mb-2">Tamaño (cm²):</label>
      <input
        name="size"
        type="text"
        value={data.size || ""}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
        placeholder="Ej. 600"
      />
      <label className="block text-sm font-bold mb-2">Técnica de Pintura:</label>
      <input
        name="technique"
        type="text"
        value={data.technique}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
        placeholder="Ej. Acrílico, Óleo, Acuarela"
      />
      <label className="block text-sm font-bold mb-2">Costo de Lienzo/Papel:</label>
      <input
        name="canvasPaperCost"
        type="number"
        value={data.canvasPaperCost}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
      />
      <label className="block text-sm font-bold mb-2">Costo de Pinturas:</label>
      <input
        name="paintsCost"
        type="number"
        value={data.paintsCost}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
      />
      <label className="block text-sm font-bold mb-2">Costo de Acabado:</label>
      <input
        name="finishingCost"
        type="number"
        value={data.finishingCost}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
      />
      <label className="block text-sm font-bold mb-2">Costo de Enmarcado:</label>
      <input
        name="framingCost"
        type="number"
        value={data.framingCost}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
      />
      <div className="flex items-center mb-3">
        <input
          name="shipping"
          type="checkbox"
          checked={data.shipping}
          onChange={handleChange}
          className="checkbox checkbox-primary"
        />
        <label className="ml-2 text-sm">¿Incluye envío?</label>
      </div>
      {data.shipping && (
        <>
          <label className="block text-sm font-bold mb-2">Costo de Envío:</label>
          <input
            name="shippingCost"
            type="number"
            value={data.shippingCost}
            onChange={handleChange}
            className="input input-bordered w-full mb-3"
          />
        </>
      )}
      <div className="flex items-center mb-3">
        <input
          name="authenticityCertificate"
          type="checkbox"
          checked={data.authenticityCertificate}
          onChange={handleChange}
          className="checkbox checkbox-primary"
        />
        <label className="ml-2 text-sm">¿Incluye Certificado de Autenticidad?</label>
      </div>
      {data.authenticityCertificate && (
        <>
          <label className="block text-sm font-bold mb-2">Costo del Certificado:</label>
          <input
            name="certificateCost"
            type="number"
            value={data.certificateCost}
            onChange={handleChange}
            className="input input-bordered w-full mb-3"
          />
        </>
      )}
    </div>
  );
};
