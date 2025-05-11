// 6. Componente para Drawing
export const DrawingForm = ({ data, handleChange, formData, handleFormChange }) => {
  return (
    <div className="border p-3 rounded mb-3">
      <h2 className="font-bold mb-2">Datos de Dibujo</h2>
      <label className="block text-sm font-bold mb-2">Tamaño (cm²):</label>
      <input
        name="size"
        type="text"
        value={data.size || ""}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
        placeholder="Ej. 600"
      />
      <label className="block text-sm font-bold mb-2">Técnica de Dibujo:</label>
      <input
        name="technique"
        type="text"
        value={data.technique}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
        placeholder="Ej. Lápiz, Carboncillo, Pasteles"
      />
      <label className="block text-sm font-bold mb-2">Costo de Papel:</label>
      <input
        name="paperCost"
        type="number"
        value={data.paperCost}
        onChange={handleChange}
        className="input input-bordered w-full mb-3"
      />
      <label className="block text-sm font-bold mb-2">Costo de Materiales:</label>
      <input
        name="materialsCost"
        type="number"
        value={data.materialsCost}
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