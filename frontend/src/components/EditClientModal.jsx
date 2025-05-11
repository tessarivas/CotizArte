import React from "react";
import { PencilIcon } from "lucide-react"; // Importamos el icono de edición
import GradientText from "../blocks/TextAnimations/GradientText/GradientText"; // Importamos el componente de texto con gradiente

const EditClientModal = ({ client, onFieldChange, onClose, onSave }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50 font-regular-text">
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-7 w-[400px]">
        {/* Título */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <GradientText className="text-5xl font-logo-text mb-2">
            Editar Cliente
          </GradientText>
        </div>

        {/* Inputs del formulario */}
        <div className="relative">
          <input
            type="text"
            value={client.name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            className="input input-bordered w-full mb-3 pr-10"
            placeholder="Nombre"
          />
          <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
        </div>
        <div className="relative">
          <input
            type="email"
            value={client.email}
            onChange={(e) => onFieldChange("email", e.target.value)}
            className="input input-bordered w-full mb-3"
            placeholder="Email"
          />
          <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
        </div>
        <div className="relative">
          <input
            type="text"
            value={client.phone || ""}
            onChange={(e) => onFieldChange("phone", e.target.value)}
            className="input input-bordered w-full mb-3"
            placeholder="Teléfono"
          />
          <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
        </div>
        <div className="relative">
          <input
            type="text"
            value={client.company || ""}
            onChange={(e) => onFieldChange("company", e.target.value)}
            className="input input-bordered w-full mb-3"
            placeholder="Empresa"
          />
          <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
        </div>
        <div className="relative">
          <textarea
            value={client.notes || ""}
            onChange={(e) => onFieldChange("notes", e.target.value)}
            className="textarea textarea-bordered w-full mb-3"
            placeholder="Notas"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 mt-3">
          <button onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button onClick={onSave} className="btn btn-primary">
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditClientModal;
