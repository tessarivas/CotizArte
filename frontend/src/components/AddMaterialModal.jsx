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
    containerSize: 0, // Nuevo campo
  });

  // Maneja cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue;

    if (type === "checkbox") {
      finalValue = checked;
    } else if (type === "number") {
      finalValue = value === "" ? 0 : Number(value);
    } else {
      finalValue = value;
    }

    setFormData({ ...formData, [name]: finalValue });
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    let payload = {};

    switch (selectedType) {
      case "software":
        // Calcula el costo mensual para software anual
        let finalMonthlyCost = formData.monthlyCost;
        if (formData.version === "annual") {
          finalMonthlyCost = Number(formData.annualCost) / 12;
        }

        payload = {
          name: formData.name,
          version: formData.version,
          monthlyCost:
            formData.version === "monthly"
              ? Number(formData.monthlyCost)
              : formData.version === "annual"
              ? finalMonthlyCost
              : 0,
          annualCost:
            formData.version === "annual" ? Number(formData.annualCost) : 0,
          hasFreeVersion: formData.version === "free",
        };
        break;

      case "digitalTool":
        payload = {
          name: formData.name,
          averageCost: Number(formData.averageCost),
          averageLifespan: Number(formData.averageLifespan),
        };
        break;

      // En el case "traditionalMaterial" del handleSubmit
      case "traditionalMaterial":
        payload = {
          name: String(formData.name).trim(),
          category: String(formData.category).trim(),
          subCategory: String(formData.subCategory).trim(),
          quality: String(formData.quality).trim(),
          averageCost: Number(formData.averageCost) || 0,
          unit: String(formData.unit).trim(),
          containerSize:
            formData.unit === "ml" ? Number(formData.containerSize) : null,
        };

        // Verificar campos requeridos según la unidad
        const requiredFields = [
          "name",
          "category",
          "subCategory",
          "quality",
          "averageCost",
          "unit",
        ];
        const hasEmptyRequiredFields = requiredFields.some(
          (field) => !payload[field] || payload[field] === ""
        );

        // Verificar containerSize solo si la unidad es ml
        const needsContainerSize =
          payload.unit === "ml" && !payload.containerSize;

        if (hasEmptyRequiredFields || needsContainerSize) {
          alert("Por favor completa todos los campos requeridos");
          return;
        }
        break;

      case "traditionalTool":
        payload = {
          name: formData.name,
          category: formData.category,
          averageCost: Number(formData.averageCost),
          averageLifespan: Number(formData.averageLifespan),
        };
        break;

      default:
        console.error("Tipo de material no reconocido");
        return;
    }

    // Modificar la verificación de campos vacíos
    const hasEmptyFields = (payload, type) => {
      if (type === "traditionalMaterial") {
        const requiredFields = [
          "name",
          "category",
          "subCategory",
          "quality",
          "averageCost",
          "unit",
        ];
        const hasEmpty = requiredFields.some(
          (field) => !payload[field] || payload[field] === ""
        );

        // Solo verificar containerSize si la unidad es ml
        if (payload.unit === "ml" && !payload.containerSize) {
          return true;
        }
        return hasEmpty;
      }

      // Para otros tipos de materiales
      return Object.entries(payload).some(
        ([key, value]) => value === "" || value === undefined || value === null
      );
    };

    // Y usar esta función antes de onSave
    if (hasEmptyFields(payload, selectedType)) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    onSave(payload, selectedType);
  };

  // Renderiza el título correcto según el tipo seleccionado
  const getModalTitle = () => {
    switch (selectedType) {
      case "software":
        return "Agregar Software";
      case "digitalTool":
        return "Agregar Herramienta Digital";
      case "traditionalMaterial":
        return "Agregar Material Tradicional";
      case "traditionalTool":
        return "Agregar Herramienta Tradicional";
      default:
        return "Seleccionar Tipo de Material";
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
                  value={formData.averageCost || 0} // Aseguramos que nunca sea undefined o null
                  onChange={handleInputChange}
                  className="input input-bordered w-full mb-3 pr-10"
                  placeholder="Costo del Material (USD)"
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
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="select select-bordered w-full mb-3 pr-10"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="Papel">Papel</option>
                  <option value="Lienzo">Lienzo</option>
                  <option value="Pintura">Pintura</option>
                  <option value="Lápices">Lápices</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div className="relative">
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleInputChange}
                  className="select select-bordered w-full mb-3 pr-10"
                  required
                >
                  <option value="">Seleccionar subcategoría</option>
                  {formData.category === "Papel" && (
                    <>
                      <option value="Acuarela">Acuarela</option>
                      <option value="Carboncillo">Carboncillo</option>
                      <option value="Dibujo">Dibujo</option>
                    </>
                  )}
                  {formData.category === "Lienzo" && (
                    <>
                      <option value="Algodón">Algodón</option>
                      <option value="Lino">Lino</option>
                      <option value="Sintético">Sintético</option>
                    </>
                  )}
                  {formData.category === "Pintura" && (
                    <>
                      <option value="Acrílico">Acrílico</option>
                      <option value="Óleo">Óleo</option>
                      <option value="Acuarela">Acuarela</option>
                    </>
                  )}
                  {formData.category === "Lápices" && (
                    <>
                      <option value="Grafito">Grafito</option>
                      <option value="Color">Color</option>
                      <option value="Carboncillo">Carboncillo</option>
                    </>
                  )}
                </select>
              </div>

              <div className="relative">
                <select
                  name="quality"
                  value={formData.quality}
                  onChange={handleInputChange}
                  className="select select-bordered w-full mb-3 pr-10"
                  required
                >
                  <option value="">Seleccionar calidad</option>
                  <option value="Estudiante">Estudiante</option>
                  <option value="Profesional">Profesional</option>
                  <option value="Premium">Premium</option>
                </select>
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
                  placeholder="Costo del Material (USD)"
                  required
                />
              </div>

              <div className="relative">
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="select select-bordered w-full mb-3 pr-10"
                  required
                >
                  <option value="">Seleccionar unidad</option>
                  <option value="unidad">Unidad</option>
                  <option value="set">Set</option>
                  <option value="metro">Metro</option>
                  <option value="pliego">Pliego</option>
                  <option value="ml">Mililitro</option>
                </select>
              </div>

              {/* Campo containerSize para ml con mejor explicación */}
              {formData.unit === "ml" && (
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      name="containerSize"
                      type="number"
                      min="1"
                      step="1"
                      value={formData.containerSize || ""}
                      onChange={handleInputChange}
                      className="input input-bordered w-full mb-1 pr-10"
                      placeholder="Mililitros por contenedor"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      ml
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      📝 Este campo indica cuántos mililitros contiene el
                      producto completo.
                    </p>
                    <p className="text-xs">
                      Ejemplo:
                      <ul className="list-disc list-inside ml-2">
                        <li>120 para un tubo de óleo de 120ml</li>
                        <li>500 para una botella de acrílico de 500ml</li>
                      </ul>
                    </p>
                  </div>
                </div>
              )}

              {/* Campo de precio con indicación de la unidad */}
              <div className="relative">
                <input
                  name="averageCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.averageCost}
                  onChange={handleInputChange}
                  className="input input-bordered w-full mb-1 pr-24"
                  placeholder="Precio"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  USD/{formData.unit || "unidad"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                {formData.unit === "ml"
                  ? `Precio por contenedor completo de ${
                      formData.containerSize || "0"
                    }ml`
                  : "Precio por unidad"}
              </p>
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
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMaterialModal;
