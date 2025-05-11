// \src\components\Projects\CommonProjectFields.jsx
// 1. Componente para campos comunes
export const CommonProjectFields = ({ formData, handleChange }) => {
  return (
    <>
      <label className="block text-sm font-bold mb-2">Título:</label>
      <input
        name="title"
        type="text"
        value={formData.title}
        onChange={handleChange}
        required
        className="input input-bordered w-full mb-3"
      />
      <label className="block text-sm font-bold mb-2">Descripción:</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        className="textarea textarea-bordered w-full mb-3"
      />
      <label className="block text-sm font-bold mb-2">
        Nivel de Detalle (1-5):
      </label>
      <input
        name="detailLevel"
        type="number"
        min="1"
        max="5"
        value={formData.detailLevel}
        onChange={handleChange}
        required
        className="input input-bordered w-full mb-3"
      />
      <label className="block text-sm font-bold mb-2">
        Horas Trabajadas:
      </label>
      <input
        name="hoursWorked"
        type="number"
        value={formData.hoursWorked}
        onChange={handleChange}
        required
        className="input input-bordered w-full mb-3"
      />
      <div className="flex items-center mb-3">
        <input
          name="isCommercial"
          type="checkbox"
          checked={formData.isCommercial}
          onChange={handleChange}
          className="checkbox checkbox-primary"
        />
        <label className="ml-2 text-sm">¿Es comercial?</label>
      </div>
      <div className="flex items-center mb-3">
        <input
          name="rapidDelivery"
          type="checkbox"
          checked={formData.rapidDelivery}
          onChange={handleChange}
          className="checkbox checkbox-primary"
        />
        <label className="ml-2 text-sm">¿Entrega rápida?</label>
      </div>
    </>
  );
};
