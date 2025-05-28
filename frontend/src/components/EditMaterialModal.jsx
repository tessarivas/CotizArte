import React, { useState, useEffect } from "react";
import { 
  DollarSignIcon, 
  PackageIcon, 
  CalendarIcon,
  TagIcon,
  SparklesIcon,
  InfoIcon
} from "lucide-react";
import GradientText from "../blocks/TextAnimations/GradientText/GradientText";

/**
 * Modal para editar materiales existentes
 * @param {Object} props Propiedades del componente
 * @param {Object} props.material Material a editar
 * @param {string} props.materialType Tipo de material (software, digitalTool, traditionalMaterial, traditionalTool)
 * @param {Function} props.onClose Función para cerrar el modal
 * @param {Function} props.onSave Función para guardar los cambios
 */
const EditMaterialModal = ({ material, materialType, onClose, onSave, successMessage = "" }) => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    name: "",
    // Software
    version: "",
    monthlyCost: "",
    annualCost: "",
    hasFreeVersion: false,
    // Digital Tool
    averageCost: "",
    averageLifespan: "",
    // Traditional Material
    category: "",
    subCategory: "",
    quality: "",
    unit: "",
    containerSize: "",
  });

  // Estados de validación
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos del material al montar el componente
  useEffect(() => {
    if (material) {
      const initialData = {
        name: material.name || "",
      };

      // Cargar datos específicos según el tipo
      switch (materialType) {
        case "software":
          // Determinar el tipo de versión basado en los datos existentes
          let versionType = "free";
          if (material.monthlyCost > 0 && material.annualCost === 0) {
            versionType = "monthly";
          } else if (material.annualCost > 0) {
            versionType = "annual";
          }

          initialData.version = versionType;
          initialData.monthlyCost = material.monthlyCost || "";
          initialData.annualCost = material.annualCost || "";
          initialData.hasFreeVersion = material.hasFreeVersion || false;
          break;

        case "digitalTool":
          initialData.averageCost = material.averageCost || "";
          initialData.averageLifespan = material.averageLifespan || "";
          break;

        case "traditionalMaterial":
          initialData.category = material.category || "";
          initialData.subCategory = material.subCategory || "";
          initialData.quality = material.quality || "";
          initialData.averageCost = material.averageCost || "";
          initialData.unit = material.unit || "";
          initialData.containerSize = material.containerSize || "";
          break;

        case "traditionalTool":
          initialData.category = material.category || "";
          initialData.averageCost = material.averageCost || "";
          initialData.averageLifespan = material.averageLifespan || "";
          break;
      }

      setFormData(initialData);
    }
  }, [material, materialType]);

  // Función de validación
  const validateForm = () => {
    const newErrors = {};

    // Validaciones comunes
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    // Validaciones específicas por tipo
    switch (materialType) {
      case "software":
        if (!formData.version) {
          newErrors.version = "Selecciona un tipo de licencia";
        }
        if (formData.version === "monthly" && (!formData.monthlyCost || Number(formData.monthlyCost) <= 0)) {
          newErrors.monthlyCost = "El costo mensual debe ser mayor a 0";
        }
        if (formData.version === "annual" && (!formData.annualCost || Number(formData.annualCost) <= 0)) {
          newErrors.annualCost = "El costo anual debe ser mayor a 0";
        }
        break;

      case "digitalTool":
        if (!formData.averageCost || Number(formData.averageCost) <= 0) {
          newErrors.averageCost = "El costo debe ser mayor a 0";
        }
        if (!formData.averageLifespan || Number(formData.averageLifespan) <= 0) {
          newErrors.averageLifespan = "La vida útil debe ser mayor a 0";
        }
        break;

      case "traditionalMaterial":
        if (!formData.category) {
          newErrors.category = "Selecciona una categoría";
        }
        if (!formData.subCategory) {
          newErrors.subCategory = "Selecciona una subcategoría";
        }
        if (!formData.quality) {
          newErrors.quality = "Selecciona una calidad";
        }
        if (!formData.averageCost || Number(formData.averageCost) <= 0) {
          newErrors.averageCost = "El costo debe ser mayor a 0";
        }
        if (!formData.unit) {
          newErrors.unit = "Selecciona una unidad";
        }
        if (formData.unit === "ml" && (!formData.containerSize || Number(formData.containerSize) <= 0)) {
          newErrors.containerSize = "El tamaño del contenedor debe ser mayor a 0";
        }
        break;

      case "traditionalTool":
        if (!formData.category.trim()) {
          newErrors.category = "La categoría es requerida";
        }
        if (!formData.averageCost || Number(formData.averageCost) <= 0) {
          newErrors.averageCost = "El costo debe ser mayor a 0";
        }
        if (!formData.averageLifespan || Number(formData.averageLifespan) <= 0) {
          newErrors.averageLifespan = "La vida útil debe ser mayor a 0";
        }
        break;
    }

    return newErrors;
  };

  // Maneja cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue;

    if (type === "checkbox") {
      finalValue = checked;
    } else if (type === "number") {
      finalValue = value;
    } else {
      finalValue = value;
    }

    setFormData({ ...formData, [name]: finalValue });

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

    let payload = {};

    switch (materialType) {
      case "software":
        let finalMonthlyCost = Number(formData.monthlyCost) || 0;
        if (formData.version === "annual") {
          finalMonthlyCost = Number(formData.annualCost) / 12;
        }

        payload = {
          name: formData.name.trim(),
          version: formData.version,
          monthlyCost: formData.version === "monthly" ? Number(formData.monthlyCost) : 
                      formData.version === "annual" ? finalMonthlyCost : 0,
          annualCost: formData.version === "annual" ? Number(formData.annualCost) : 0,
          hasFreeVersion: formData.version === "free",
        };
        break;

      case "digitalTool":
        payload = {
          name: formData.name.trim(),
          averageCost: Number(formData.averageCost),
          averageLifespan: Number(formData.averageLifespan),
        };
        break;

      case "traditionalMaterial":
        payload = {
          name: formData.name.trim(),
          category: formData.category.trim(),
          subCategory: formData.subCategory.trim(),
          quality: formData.quality.trim(),
          averageCost: Number(formData.averageCost),
          unit: formData.unit.trim(),
          containerSize: formData.unit === "ml" ? Number(formData.containerSize) : null,
        };
        break;

      case "traditionalTool":
        payload = {
          name: formData.name.trim(),
          category: formData.category.trim(),
          averageCost: Number(formData.averageCost),
          averageLifespan: Number(formData.averageLifespan),
        };
        break;

      default:
        console.error("Tipo de material no reconocido");
        setIsSubmitting(false);
        return;
    }

    try {
      await onSave(material.id, payload, materialType);
      // ✅ No cerrar modal aquí, se maneja desde el padre
    } catch (error) {
      console.error("Error al actualizar:", error);
      setErrors({ general: "Error al actualizar el material. Inténtalo de nuevo." });
      setIsSubmitting(false); // ✅ Solo reset isSubmitting en caso de error
    }
  };

  // Renderiza el título correcto según el tipo seleccionado
  const getModalTitle = () => {
    switch (materialType) {
      case "software":
        return "Software";
      case "digitalTool":
        return "Herramienta Digital";
      case "traditionalMaterial":
        return "Material Tradicional";
      case "traditionalTool":
        return "Herramienta Tradicional";
      default:
        return "Material";
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50 font-regular-text">
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-7 w-[600px] max-h-[90vh] overflow-y-auto">
        {/* Título */}
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-base-content mb-2">
            Editar
          </div>
          <GradientText className="text-4xl font-logo-text">
            {getModalTitle()}
          </GradientText>
        </div>

        {/* Información del material original */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <InfoIcon className="w-5 h-5 text-blue-500" />
            <p className="text-sm font-medium text-blue-800">
              Editando: <span className="font-bold">{material?.name}</span>
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo nombre (común para todos) */}
          <div className="relative">
            <label className="block text-base-content text-sm font-bold mb-1">
              *Nombre:
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className={`input validator input-bordered w-full ${errors.name ? "border-error" : ""}`}
              placeholder={`Ej: ${
                materialType === "software" ? "Adobe Photoshop" :
                materialType === "digitalTool" ? "Tableta Wacom" :
                materialType === "traditionalMaterial" ? "Pintura Acrílica Winsor" :
                "Pincel Sable No. 8"
              }`}
              required
            />
            {errors.name && (
              <p className="text-error text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Formulario para Software */}
          {materialType === "software" && (
            <>
              <div className="relative">
                <label className="block text-base-content text-sm font-bold mb-1">
                  *Tipo de Licencia:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {["free", "monthly", "annual"].map((type) => (
                    <label key={type} className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.version === type 
                        ? "border-primary bg-primary/10" 
                        : "border-gray-200 hover:border-primary/50"
                    }`}>
                      <input
                        type="radio"
                        name="version"
                        value={type}
                        checked={formData.version === type}
                        onChange={handleInputChange}
                        className="radio radio-primary mr-3"
                        required
                      />
                      <span className="font-medium">
                        {type === "free" ? "Gratuita" : type === "monthly" ? "Mensual" : "Anual"}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.version && (
                  <p className="text-error text-xs mt-1">{errors.version}</p>
                )}
              </div>

              {formData.version === "monthly" && (
                <div className="relative">
                  <label className="block text-base-content text-sm font-bold mb-1">
                    *Costo Mensual:
                  </label>
                  <div className="relative">
                    <DollarSignIcon className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
                    <input
                      name="monthlyCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.monthlyCost}
                      onChange={handleInputChange}
                      className={`input validator input-bordered w-full pl-10 ${errors.monthlyCost ? "border-error" : ""}`}
                      placeholder="250.00"
                      required
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">MX</span>
                  </div>
                  {errors.monthlyCost && (
                    <p className="text-error text-xs mt-1">{errors.monthlyCost}</p>
                  )}
                </div>
              )}

              {formData.version === "annual" && (
                <div className="relative">
                  <label className="block text-base-content text-sm font-bold mb-1">
                    *Costo Anual:
                  </label>
                  <div className="relative">
                    <DollarSignIcon className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
                    <input
                      name="annualCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.annualCost}
                      onChange={handleInputChange}
                      className={`input validator input-bordered w-full pl-10 ${errors.annualCost ? "border-error" : ""}`}
                      placeholder="2500.00"
                      required
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">MX</span>
                  </div>
                  {errors.annualCost && (
                    <p className="text-error text-xs mt-1">{errors.annualCost}</p>
                  )}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                    <p className="text-xs font-medium text-blue-800">
                      💡 Costo mensual calculado: ${formData.annualCost ? (Number(formData.annualCost) / 12).toFixed(2) : "0.00"} MX
                    </p>
                  </div>
                </div>
              )}

              {formData.version === "free" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-green-500" />
                    <p className="text-sm font-medium text-green-800">
                      ¡Perfecto! Este software no tendrá costo asociado.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Formulario para Herramienta Digital */}
          {materialType === "digitalTool" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <label className="block text-base-content text-sm font-bold mb-1">
                  *Costo Promedio:
                </label>
                <div className="relative">
                  <DollarSignIcon className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
                  <input
                    name="averageCost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.averageCost}
                    onChange={handleInputChange}
                    className={`input validator input-bordered w-full pl-10 ${errors.averageCost ? "border-error" : ""}`}
                    placeholder="1500.00"
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">MX</span>
                </div>
                {errors.averageCost && (
                  <p className="text-error text-xs mt-1">{errors.averageCost}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-base-content text-sm font-bold mb-1">
                  *Vida Útil:
                </label>
                <div className="relative">
                  <CalendarIcon className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
                  <input
                    name="averageLifespan"
                    type="number"
                    min="1"
                    value={formData.averageLifespan}
                    onChange={handleInputChange}
                    className={`input validator input-bordered w-full pl-10 ${errors.averageLifespan ? "border-error" : ""}`}
                    placeholder="36"
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">meses</span>
                </div>
                {errors.averageLifespan && (
                  <p className="text-error text-xs mt-1">{errors.averageLifespan}</p>
                )}
              </div>
            </div>
          )}

          {/* Formulario para Material Tradicional */}
          {materialType === "traditionalMaterial" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="block text-base-content text-sm font-bold mb-1">
                    *Categoría:
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`select validator select-bordered w-full ${errors.category ? "border-error" : ""}`}
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="Papel">Papel</option>
                    <option value="Lienzo">Lienzo</option>
                    <option value="Pintura">Pintura</option>
                    <option value="Lápices">Lápices</option>
                    <option value="Barnices">Barnices</option>
                  </select>
                  {errors.category && (
                    <p className="text-error text-xs mt-1">{errors.category}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-base-content text-sm font-bold mb-1">
                    *Subcategoría:
                  </label>
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    className={`select validator select-bordered w-full ${errors.subCategory ? "border-error" : ""}`}
                    required
                    disabled={!formData.category}
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
                    {formData.category === "Barnices" && (
                      <>
                        <option value="Brillante">Brillante</option>
                        <option value="Mate">Mate</option>
                        <option value="Satinado">Satinado</option>
                      </>
                    )}
                  </select>
                  {errors.subCategory && (
                    <p className="text-error text-xs mt-1">{errors.subCategory}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="block text-base-content text-sm font-bold mb-1">
                    *Calidad:
                  </label>
                  <select
                    name="quality"
                    value={formData.quality}
                    onChange={handleInputChange}
                    className={`select validator select-bordered w-full ${errors.quality ? "border-error" : ""}`}
                    required
                  >
                    <option value="">Seleccionar calidad</option>
                    <option value="Estudiante">Estudiante</option>
                    <option value="Profesional">Profesional</option>
                    <option value="Premium">Premium</option>
                  </select>
                  {errors.quality && (
                    <p className="text-error text-xs mt-1">{errors.quality}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-base-content text-sm font-bold mb-1">
                    *Unidad de Medida:
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className={`select validator select-bordered w-full ${errors.unit ? "border-error" : ""}`}
                    required
                  >
                    <option value="">Seleccionar unidad</option>
                    <option value="unidad">Unidad</option>
                    <option value="set">Set</option>
                    <option value="metro">Metro</option>
                    <option value="pliego">Pliego</option>
                    <option value="ml">Mililitro</option>
                  </select>
                  {errors.unit && (
                    <p className="text-error text-xs mt-1">{errors.unit}</p>
                  )}
                </div>
              </div>

              {/* Campo containerSize para ml */}
              {formData.unit === "ml" && (
                <div className="relative">
                  <label className="block text-base-content text-sm font-bold mb-1">
                    *Tamaño del Contenedor:
                  </label>
                  <div className="relative">
                    <PackageIcon className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
                    <input
                      name="containerSize"
                      type="number"
                      min="1"
                      step="1"
                      value={formData.containerSize}
                      onChange={handleInputChange}
                      className={`input validator input-bordered w-full pl-10 ${errors.containerSize ? "border-error" : ""}`}
                      placeholder="120"
                      required
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">ml</span>
                  </div>
                  {errors.containerSize && (
                    <p className="text-error text-xs mt-1">{errors.containerSize}</p>
                  )}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                    <p className="text-xs font-medium text-blue-800">
                      💡 Indica cuántos mililitros contiene el producto completo (ej: 120ml para un tubo de óleo)
                    </p>
                  </div>
                </div>
              )}

              <div className="relative">
                <label className="block text-base-content text-sm font-bold mb-1">
                  *Precio:
                </label>
                <div className="relative">
                  <DollarSignIcon className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
                  <input
                    name="averageCost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.averageCost}
                    onChange={handleInputChange}
                    className={`input validator input-bordered w-full pl-10 ${errors.averageCost ? "border-error" : ""}`}
                    placeholder="85.00"
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    MX/{formData.unit || "unidad"}
                  </span>
                </div>
                {errors.averageCost && (
                  <p className="text-error text-xs mt-1">{errors.averageCost}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.unit === "ml"
                    ? `Precio por contenedor completo de ${formData.containerSize || "0"}ml`
                    : "Precio por unidad"}
                </p>
              </div>
            </>
          )}

          {/* Formulario para Herramienta Tradicional */}
          {materialType === "traditionalTool" && (
            <>
              <div className="relative">
                <label className="block text-base-content text-sm font-bold mb-1">
                  *Categoría:
                </label>
                <div className="relative">
                  <TagIcon className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
                  <input
                    name="category"
                    type="text"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`input validator input-bordered w-full pl-10 ${errors.category ? "border-error" : ""}`}
                    placeholder="Ej: Pinceles, Espátulas, Caballetes"
                    required
                  />
                </div>
                {errors.category && (
                  <p className="text-error text-xs mt-1">{errors.category}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="block text-base-content text-sm font-bold mb-1">
                    *Costo Promedio:
                  </label>
                  <div className="relative">
                    <DollarSignIcon className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
                    <input
                      name="averageCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.averageCost}
                      onChange={handleInputChange}
                      className={`input validator input-bordered w-full pl-10 ${errors.averageCost ? "border-error" : ""}`}
                      placeholder="250.00"
                      required
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">MX</span>
                  </div>
                  {errors.averageCost && (
                    <p className="text-error text-xs mt-1">{errors.averageCost}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-base-content text-sm font-bold mb-1">
                    *Vida Útil:
                  </label>
                  <div className="relative">
                    <CalendarIcon className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
                    <input
                      name="averageLifespan"
                      type="number"
                      min="1"
                      value={formData.averageLifespan}
                      onChange={handleInputChange}
                      className={`input validator input-bordered w-full pl-10 ${errors.averageLifespan ? "border-error" : ""}`}
                      placeholder="24"
                      required
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">meses</span>
                  </div>
                  {errors.averageLifespan && (
                    <p className="text-error text-xs mt-1">{errors.averageLifespan}</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Mensaje de error general */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-error text-sm">{errors.general}</p>
            </div>
          )}

          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
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
              onClick={handleSubmit}
            >
              {successMessage 
                ? "¡Actualizado!" 
                : isSubmitting 
                  ? "Actualizando..." 
                  : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMaterialModal;