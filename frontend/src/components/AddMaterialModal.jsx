import React, { useState } from "react";
import { PencilIcon } from "lucide-react";
import GradientText from "../blocks/TextAnimations/GradientText/GradientText";

/**
 * Modal para agregar nuevos materiales al sistema
 * @param {Object} props Propiedades del componente
 * @param {string} props.selectedType Tipo de material a crear (software, digitalTool, traditionalMaterial, traditionalTool)
 * @param {Function} props.onClose Función para cerrar el modal
 * @param {Function} props.onSave Función para guardar el nuevo material
 */
const AddMaterialModal = ({ selectedType, onClose, onSave }) => {
  // Inicializa el estado del formulario con valores vacíos
  const [formData, setFormData] = useState({
    name: "",
    // Software
    version: "",
    monthlyCost: 0,
    annualCost: 0,
    hasFreeVersion: false,
    // Digital Tool
    averageCost: 0,
    averageLifespan: 0,
    // Traditional Material
    category: "",
    subCategory: "",
    quality: "",
    unit: "",
  });

  // Maneja cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Si es un checkbox, usar el valor de checked
    const finalValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: finalValue });
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, selectedType);
  };

  // Renderiza el título correcto según el tipo seleccionado
  const getModalTitle = () => {
    switch (selectedType) {
      case "software": return "Agregar Software";
      case "digitalTool": return "Agregar Herramienta Digital";
      case "traditionalMaterial": return "Agregar Material Tradicional";
      case "traditionalTool": return "Agregar Herramienta Tradicional";
      default: return "Seleccionar Tipo de Material";
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50 font-regular-text">
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-7 w-[500px] max-h-[90vh] overflow-y-auto">
        {/* Título */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <GradientText className="text-5xl font-logo-text mb-2">
            {getModalTitle()}
          </GradientText>
        </div>

        {/* Formulario según el tipo seleccionado */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Formulario para Software */}
          {selectedType === "software" && (
            <>
              <div className="relative">
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input input-bordered w-full mb-3 pr-10"
                  placeholder="Nombre del Software"
                  required
                />
                <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
              </div>
              
              <div className="mb-3">
                <p className="text-sm font-semibold mb-2">Tipo de Licencia</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="version"
                      value="free"
                      checked={formData.version === "free"}
                      onChange={handleInputChange}
                      className="radio radio-primary mr-2"
                      required
                    />
                    <span>Gratuita</span>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="version"
                      value="monthly"
                      checked={formData.version === "monthly"}
                      onChange={handleInputChange}
                      className="radio radio-primary mr-2"
                    />
                    <span>Mensual</span>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="version"
                      value="annual"
                      checked={formData.version === "annual"}
                      onChange={handleInputChange}
                      className="radio radio-primary mr-2"
                    />
                    <span>Anual</span>
                  </label>
                </div>
              </div>

              {formData.version === "monthly" && (
                <div className="relative">
                  <input
                    name="monthlyCost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.monthlyCost}
                    onChange={handleInputChange}
                    className="input input-bordered w-full mb-3 pr-10"
                    placeholder="Costo Mensual (USD)"
                    required
                  />
                  <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
                </div>
              )}

              {formData.version === "annual" && (
                <div className="relative">
                  <input
                    name="annualCost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.annualCost}
                    onChange={handleInputChange}
                    className="input input-bordered w-full mb-3 pr-10"
                    placeholder="Costo Anual (USD)"
                    required
                  />
                  <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
                </div>
              )}
            </>
          )}

          {/* Formulario para Herramienta Digital */}
          {selectedType === "digitalTool" && (
            <>
              <div className="relative">
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input input-bordered w-full mb-3 pr-10"
                  placeholder="Nombre de la Herramienta"
                  required
                />
                <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
              </div>

              <div className="relative">
                <input
                  name="averageCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.averageCost}
                  onChange={handleInputChange}
                  className="input input-bordered w-full mb-3 pr-10"
                  placeholder="Costo Promedio (USD)"
                  required
                />
                <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
              </div>

              <div className="relative">
                <input
                  name="averageLifespan"
                  type="number"
                  min="1"
                  value={formData.averageLifespan}
                  onChange={handleInputChange}
                  className="input input-bordered w-full mb-3 pr-10"
                  placeholder="Vida Útil (meses)"
                  required
                />
                <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
              </div>
            </>
          )}

          {/* Formulario para Material Tradicional */}
          {selectedType === "traditionalMaterial" && (
            <>
              <div className="relative">
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input input-bordered w-full mb-3 pr-10"
                  placeholder="Nombre del Material"
                  required
                />
                <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
              </div>

              <div className="relative">
                <input
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input input-bordered w-full mb-3 pr-10"
                  placeholder="Categoría"
                  required
                />
                <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
              </div>

              <div className="relative">
                <input
                  name="subCategory"
                  type="text"
                  value={formData.subCategory}
                  onChange={handleInputChange}
                  className="input input-bordered w-full mb-3 pr-10"
                  placeholder="Subcategoría"
                />
                <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
              </div>

              <div className="relative">
                <select
                  name="quality"
                  value={formData.quality}
                  onChange={handleInputChange}
                  className="select select-bordered w-full mb-3 pr-10"
                >
                  <option value="">Seleccionar calidad</option>
                  <option value="Económico">Económico</option>
                  <option value="Estándar">Estándar</option>
                  <option value="Profesional">Profesional</option>
                  <option value="Premium">Premium</option>
                </select>
                <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
              </div>

              <div className="relative">
                <input
                  name="averageCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.averageCost}
                  onChange={handleInputChange}
                  className="input input-bordered w-full mb-3 pr-10"
                  placeholder="Costo Promedio (USD)"
                  required
                />
                <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
              </div>

              <div className="relative">
                <input
                  name="unit"
                  type="text"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="input input-bordered w-full mb-3 pr-10"
                  placeholder="Unidad (ej: unidad, metro, litro)"
                  required
                />
                <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
              </div>
            </>
          )}

          {/* Formulario para Herramienta Tradicional */}
          {selectedType === "traditionalTool" && (
            <>
              <div className="relative">
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input input-bordered w-full mb-3 pr-10"
                  placeholder="Nombre de la Herramienta"
                  required
                />
                <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
              </div>

              <div className="relative">
                <input
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input input-bordered w-full mb-3 pr-10"
                  placeholder="Categoría"
                  required
                />
                <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
              </div>

              <div className="relative">
                <input
                  name="averageCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.averageCost}
                  onChange={handleInputChange}
                  className="input input-bordered w-full mb-3 pr-10"
                  placeholder="Costo Promedio (USD)"
                  required
                />
                <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
              </div>

              <div className="relative">
                <input
                  name="averageLifespan"
                  type="number"
                  min="1"
                  value={formData.averageLifespan}
                  onChange={handleInputChange}
                  className="input input-bordered w-full mb-3 pr-10"
                  placeholder="Vida Útil (meses)"
                  required
                />
                <PencilIcon className="w-5 h-5 text-error absolute right-4 top-5 transform -translate-y-1/2" />
              </div>
            </>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMaterialModal;