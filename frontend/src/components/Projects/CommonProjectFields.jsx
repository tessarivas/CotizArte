export const CommonProjectFields = ({ formData, handleChange }) => {
  return (
    <>
      <label className="block text-sm font-bold mb-2">Título:</label>
      <input
        name="title"
        placeholder="Ingresa un título para tu proyecto"
        type="text"
        value={formData.title}
        onChange={handleChange}
        required
        className="input input-bordered w-full mb-3"
      />
      <label className="block text-sm font-bold mb-2">Descripción:</label>
      <textarea
        name="description"
        placeholder="Ingresa una frase que describa tu proyecto"
        value={formData.description}
        onChange={handleChange}
        required
        className="textarea textarea-bordered w-full mb-3"
      />

      {/* Fila con Nivel de Detalle y Horas Trabajadas */}
      <div className="flex gap-4 mb-3">
        {/* Nivel de Detalle */}
        <div className="flex-1">
          <label className="block text-sm font-bold mb-2">
            Nivel de Detalle:
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                type="button"
                className={`btn btn-md ${
                  Number(formData.detailLevel) === level
                    ? "btn-primary"
                    : ""
                }`}
                onClick={() =>
                  handleChange({
                    target: { name: "detailLevel", value: level },
                  })
                }
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        {/* Horas Trabajadas */}
        <div className="flex-1">
          <label className="block text-sm font-bold mb-2">
            Horas Trabajadas:
          </label>
          <input
            name="hoursWorked"
            type="number"
            placeholder="Ingresa una cantidad"
            value={formData.hoursWorked}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>
      </div>
    </>
  );
};