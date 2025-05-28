import React, { useState } from "react";
import { UserPlusIcon, MailIcon, PhoneIcon, BuildingIcon, FileTextIcon, SparklesIcon } from "lucide-react";
import GradientText from "../blocks/TextAnimations/GradientText/GradientText";

/**
 * Modal para agregar nuevos clientes
 * @param {Object} props Propiedades del componente
 * @param {Function} props.onClose Función para cerrar el modal
 * @param {Function} props.onSave Función para guardar el nuevo cliente
 */
const AddClientModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Función de validación
  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    } else if (formData.name.trim().length > 30) {
      newErrors.name = "El nombre no puede tener más de 30 caracteres";
    } else if (!/^[A-Za-z][A-Za-z0-9\s\-]*$/.test(formData.name.trim())) {
      newErrors.name = "El nombre solo puede contener letras, números, espacios y guiones";
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "El correo electrónico no es válido";
    }

    // Validar teléfono (opcional)
    if (formData.phone.trim() && !/^[0-9]{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "El teléfono debe contener exactamente 10 dígitos";
    }

    return newErrors;
  };

  // Maneja cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      return;
    }

    // Limpiar datos antes de enviar
    const cleanedData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone?.trim() || null,
      company: formData.company?.trim() || null,
      notes: formData.notes?.trim() || null,
    };

    try {
      await onSave(cleanedData);
      setSuccessMessage("Cliente agregado exitosamente");
      
      // Cerrar modal después de un breve delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error al agregar cliente:", error);
      setErrors({ general: error.response?.data?.message || "Error al agregar el cliente" });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50 font-regular-text">
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-7 w-[600px] max-h-[90vh] overflow-y-auto">
        {/* Título */}
        <div className="text-center mb-6">
          <GradientText className="text-5xl font-logo-text">
            Nuevo Cliente
          </GradientText>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo nombre */}
          <div className="relative">
            <label className="block text-base-content text-sm font-bold mb-1">
              *Nombre:
            </label>
            <div className="relative">
              <UserPlusIcon className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className={`input validator input-bordered w-full pl-10 ${errors.name ? "border-error" : ""}`}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>
            {errors.name && (
              <p className="text-error text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Campo email */}
          <div className="relative">
            <label className="block text-base-content text-sm font-bold mb-1">
              *Correo Electrónico:
            </label>
            <div className="relative">
              <MailIcon className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`input validator input-bordered w-full pl-10 ${errors.email ? "border-error" : ""}`}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            {errors.email && (
              <p className="text-error text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Campo teléfono */}
          <div className="relative">
            <label className="block text-base-content text-sm font-bold mb-1">
              Teléfono (Opcional):
            </label>
            <div className="relative">
              <PhoneIcon className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className={`input validator tabular-nums input-bordered w-full pl-10 ${errors.phone ? "border-error" : ""}`}
                placeholder="5512345678"
                pattern="[0-9]*"
                maxLength="10"
              />
            </div>
            {errors.phone && (
              <p className="text-error text-xs mt-1">{errors.phone}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Formato: 10 dígitos sin espacios ni guiones
            </p>
          </div>

          {/* Campo empresa */}
          <div className="relative">
            <label className="block text-base-content text-sm font-bold mb-1">
              Empresa (Opcional):
            </label>
            <div className="relative">
              <BuildingIcon className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
              <input
                name="company"
                type="text"
                value={formData.company}
                onChange={handleInputChange}
                className="input input-bordered w-full pl-10"
                placeholder="Nombre de la empresa"
              />
            </div>
          </div>

          {/* Campo notas */}
          <div className="relative">
            <label className="block text-base-content text-sm font-bold mb-1">
              Notas (Opcional):
            </label>
            <div className="relative">
              <FileTextIcon className="w-5 h-5 text-neutral-400 absolute left-3 top-3 z-10" />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="textarea textarea-bordered w-full pl-10 h-24 resize-none"
                placeholder="Notas adicionales sobre el cliente..."
              />
            </div>
          </div>

          {/* Mensaje de error general */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-error text-sm">{errors.general}</p>
            </div>
          )}

          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-green-500" />
                <p className="text-green-800 text-sm font-medium">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSubmitting || successMessage}
            >
              {successMessage ? "Cerrando..." : "Cancelar"}
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting || successMessage}
            >
              {successMessage 
                ? "¡Agregado!" 
                : isSubmitting 
                  ? "Agregando..." 
                  : "Agregar Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;