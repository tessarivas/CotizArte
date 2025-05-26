import React from "react";
import GradientText from "../blocks/TextAnimations/GradientText/GradientText";
import DeleteButton from "@/components/DeleteButton";

const EditProjectModal = ({ project, onFieldChange, onClose, onSave }) => {
  const handleSave = () => {
    // Prepare the update data from the current project state
    const updateData = {
      title: project.title,
      artTypeId: Number(project.artType?.id),
      detailLevel: Number(project.detailLevel),
      hoursWorked: Number(project.hoursWorked),
      description: project.description,
    };

    // Call onSave with the project ID and update data
    onSave(project.id, updateData);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50 font-regular-text">
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-7 w-[600px] max-h-[90vh] overflow-y-auto">
        {/* Título */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <GradientText className="text-5xl font-logo-text mb-2">
            Detalles del Proyecto
          </GradientText>
        </div>
        <div className="flex justify-center items-center font-bold -mt-4 mb-4">
          <p>- Puedes editar los campos si lo deseas -</p>
        </div>
        {/* Inputs del formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna 1 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={project.title || ""}
                onChange={(e) => onFieldChange("title", e.target.value)}
                className="input input-bordered w-full"
                placeholder="Título del proyecto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Arte
              </label>
              <select
                value={project.artType?.id || ""}
                onChange={(e) => onFieldChange("artTypeId", e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="" disabled>
                  Selecciona un tipo
                </option>
                <option value="1">Pintura</option>
                <option value="2">Dibujo</option>
                <option value="3">Ilustración</option>
                <option value="4">Edición de Video</option>
              </select>
            </div>
          </div>
          {/* Columna 2 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel de Detalle
              </label>
              <select
                value={project.detailLevel || ""}
                onChange={(e) => onFieldChange("detailLevel", e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="" disabled>
                  Selecciona un nivel
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horas Trabajadas
              </label>
              <input
                type="number"
                value={project.hoursWorked || 0}
                onChange={(e) => onFieldChange("hoursWorked", e.target.value)}
                className="input input-bordered w-full"
                placeholder="Horas trabajadas"
                min="0"
                step="0.5"
              />
            </div>
          </div>
        </div>

        {/* Descripción (debajo de los campos principales, ancho completo) */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={project.description || ""}
            onChange={(e) => onFieldChange("description", e.target.value)}
            className="textarea textarea-bordered w-full h-32"
            placeholder="Descripción del proyecto"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex justify-between mt-8">
          <DeleteButton
            onClick={() => onFieldChange("delete")}
            className="mr-2 text-sm"
          />
          <div className="flex gap-3">
            <button onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
