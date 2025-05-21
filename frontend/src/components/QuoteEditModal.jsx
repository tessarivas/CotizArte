import React, { useState, useEffect } from "react";
import { FileTextIcon, DollarSignIcon, BarChartIcon, ClockIcon, TagIcon, CheckIcon } from "lucide-react";
import GradientText from "../blocks/TextAnimations/GradientText/GradientText";
import DeleteButton from "@/components/DeleteButton";

export function QuoteEditModal({ isOpen, onClose, quote, onSave }) {
  const [form, setForm] = useState({
    notes: "",
    discountPercentage: 0,
    detailLevel: "",
    hoursWorked: "",
    isCommercial: false,
    // Agrega aquí otros campos que necesites
  });

  // Actualizar el estado del formulario cuando cambia la cotización
  useEffect(() => {
    if (quote) {
      setForm({
        notes: quote.notes || "",
        discountPercentage: quote.discountPercentage || 0,
        detailLevel: quote.detailLevel || "",
        hoursWorked: quote.hoursWorked || "",
        isCommercial: quote.isCommercial || false,
        // Actualiza aquí otros campos que necesites
      });
    }
  }, [quote]);

  if (!isOpen || !quote) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50 font-regular-text">
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-7 w-[600px] max-h-[90vh] overflow-y-auto">
        {/* Título */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <GradientText className="text-5xl font-logo-text mb-2">
            Editar Cotización
          </GradientText>
        </div>
        
        <div className="flex justify-center items-center font-bold -mt-4 mb-4">
          <p>- Modifica los detalles de tu cotización -</p>
        </div>
        
        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Información no editable */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Columna 1 - Información del proyecto */}
            <div className="bg-gray-100/60 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileTextIcon className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-primary">Información del Proyecto</h3>
              </div>
              <p className="text-sm mb-1 font-medium text-gray-700">Proyecto:</p>
              <p className="mb-3 pl-2">{quote.project?.title || "Sin título"}</p>
              
              <p className="text-sm mb-1 font-medium text-gray-700">Tipo de Arte:</p>
              <p className="pl-2">{quote.artType?.name || "No especificado"}</p>
            </div>
            
            {/* Columna 2 - Información del cliente */}
            <div className="bg-gray-100/60 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TagIcon className="w-5 h-5 text-secondary" />
                <h3 className="font-bold text-secondary">Información del Cliente</h3>
              </div>
              <p className="text-sm mb-1 font-medium text-gray-700">Cliente:</p>
              <p className="mb-3 pl-2">{quote.client?.name || "Sin cliente"}</p>
              
              <p className="text-sm mb-1 font-medium text-gray-700">Empresa:</p>
              <p className="pl-2">{quote.client?.company || "No especificada"}</p>
            </div>
          </div>
          
          {/* Campos editables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna 1 */}
            <div className="space-y-4">
              {/* Descuento */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <DollarSignIcon className="w-4 h-4 text-primary" />
                  Descuento (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.discountPercentage}
                  onChange={(e) => handleChange("discountPercentage", e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
              
              {/* Nivel de detalle */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <BarChartIcon className="w-4 h-4 text-primary" />
                  Nivel de detalle
                </label>
                <select
                  value={form.detailLevel}
                  onChange={(e) => handleChange("detailLevel", e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="" disabled>Selecciona un nivel</option>
                  <option value="1">1 - Mínimo</option>
                  <option value="2">2 - Básico</option>
                  <option value="3">3 - Intermedio</option>
                  <option value="4">4 - Detallado</option>
                  <option value="5">5 - Muy detallado</option>
                </select>
              </div>
            </div>
            
            {/* Columna 2 */}
            <div className="space-y-4">
              {/* Horas trabajadas */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <ClockIcon className="w-4 h-4 text-secondary" />
                  Horas trabajadas
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.hoursWorked}
                  onChange={(e) => handleChange("hoursWorked", e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
              
              {/* Uso comercial */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <CheckIcon className="w-4 h-4 text-secondary" />
                  Uso comercial
                </label>
                <div className="flex items-center gap-2 pl-2">
                  <input
                    type="checkbox"
                    checked={form.isCommercial}
                    onChange={(e) => handleChange("isCommercial", e.target.checked)}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-sm">El cliente usará el arte con fines comerciales</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notas (ancho completo) */}
          <div className="mt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <FileTextIcon className="w-4 h-4 text-accent" />
              Notas adicionales
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="textarea textarea-bordered w-full h-32"
              placeholder="Agrega cualquier información relevante sobre esta cotización..."
            />
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-between mt-8">
            {/* Agregar botón de eliminar si es necesario */}
            <DeleteButton
              onClick={() => {/* Función para eliminar cotización */}}
              className="mr-2 text-sm"
            />
            
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar Cambios
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}