import React, { useState, useEffect } from "react";
import {
  FileTextIcon,
  DollarSignIcon,
  BarChartIcon,
  ClockIcon,
  TagIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as PendingIcon,
} from "lucide-react";
import GradientText from "../blocks/TextAnimations/GradientText/GradientText";
import DeleteButton from "../components/DeleteButton"; // Ajusta la ruta según tu estructura

export function QuoteEditModal({
  isOpen,
  onClose,
  quote,
  onSave,
  onDelete,
  pricingProfile,
}) {
  const [form, setForm] = useState({
    notes: "",
    discountPercentage: 0,
    detailLevel: "",
    hoursWorked: "",
    commercialPercentage: "",
    rapidDeliveryPercentage: "",
    includeShipping: false,
    includeCertificate: false,
    status: "PENDING",
  });

  useEffect(() => {
    if (quote) {
      setForm({
        notes: quote.notes || "",
        discountPercentage: quote.discountPercentage || 0,
        detailLevel: quote.project?.detailLevel || quote.detailLevel || "",
        hoursWorked: quote.project?.hoursWorked || quote.hoursWorked || "",
        commercialPercentage:
          quote.commercialPercentage !== undefined &&
          quote.commercialPercentage !== null
            ? quote.commercialPercentage
            : quote.commercialLicenseFee && quote.basePrice
            ? ((quote.commercialLicenseFee / quote.basePrice) * 100).toFixed(2)
            : 0,
        rapidDeliveryPercentage:
          quote.rapidDeliveryPercentage !== undefined &&
          quote.rapidDeliveryPercentage !== null
            ? quote.rapidDeliveryPercentage
            : quote.urgencyFee && quote.basePrice
            ? ((quote.urgencyFee / quote.basePrice) * 100).toFixed(2)
            : 0,
        includeShipping: quote.includeShipping || false,
        includeCertificate: quote.includeCertificate || false,
        status: quote.status || "PENDING",
      });
    }
  }, [quote, pricingProfile]);

  const recalculateQuote = () => {
    if (!quote || !pricingProfile) {
      return {
        basePrice: 0,
        commercialFee: 0,
        urgencyFee: 0,
        subtotal: 0,
        discountAmount: 0,
        total: 0,
        materialsCost: 0,
        toolsCost: 0,
      };
    }

    const originalBasePrice = quote.basePrice || 0;

    const newCommercialFee =
      form.commercialPercentage !== ""
        ? originalBasePrice * (Number(form.commercialPercentage) / 100)
        : quote.commercialLicenseFee || 0;

    const newUrgencyFee =
      form.rapidDeliveryPercentage !== ""
        ? originalBasePrice * (Number(form.rapidDeliveryPercentage) / 100)
        : quote.urgencyFee || 0;

    const newSubtotal = originalBasePrice + newCommercialFee + newUrgencyFee;
    const discountAmount =
      (newSubtotal * Number(form.discountPercentage)) / 100;
    const newTotal = newSubtotal - discountAmount;

    return {
      basePrice: originalBasePrice,
      commercialFee: newCommercialFee,
      urgencyFee: newUrgencyFee,
      subtotal: newSubtotal,
      discountAmount,
      total: newTotal,
      materialsCost: quote.materialsCost || 0,
      toolsCost: quote.toolsCost || 0,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recalculatedQuote = recalculateQuote();

    const updateData = {
      notes: form.notes,
      discountPercentage: Number(form.discountPercentage),
      basePrice: recalculatedQuote.basePrice,
      commercialLicenseFee: recalculatedQuote.commercialFee,
      urgencyFee: recalculatedQuote.urgencyFee,
      finalPrice: recalculatedQuote.subtotal,
      finalPriceAfterDiscount: recalculatedQuote.total,
      status: form.status,
    };

    console.log("Datos a enviar:", updateData);

    try {
      await onSave(quote.id, updateData);
      onClose();
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const handleDeleteQuote = async () => {
    await onDelete(quote.id);
    onClose();
  };

  if (!isOpen || !quote) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "APPROVED":
        return {
          label: "Aprobada",
          color: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircleIcon,
          iconColor: "text-green-600",
        };
      case "REJECTED":
        return {
          label: "Rechazada",
          color: "bg-red-100 text-red-800 border-red-200",
          icon: XCircleIcon,
          iconColor: "text-red-600",
        };
      default:
        return {
          label: "Pendiente",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: PendingIcon,
          iconColor: "text-yellow-600",
        };
    }
  };

  const previewCalculation = recalculateQuote();

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50 font-regular-text">
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-7 w-[700px] max-h-[90vh] overflow-y-auto">
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
                <h3 className="font-bold text-primary">
                  Información del Proyecto
                </h3>
              </div>
              <p className="text-sm mb-1 font-medium text-gray-700">
                Proyecto:
              </p>
              <p className="mb-3 pl-2">
                {quote.project?.title || "Sin título"}
              </p>

              <p className="text-sm mb-1 font-medium text-gray-700">
                Tipo de Arte:
              </p>
              <p className="pl-2">
                {quote.project.artType?.name || "No especificado"}
              </p>
            </div>

            {/* Columna 2 - Información del cliente */}
            <div className="bg-gray-100/60 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TagIcon className="w-5 h-5 text-secondary" />
                <h3 className="font-bold text-secondary">
                  Información del Cliente
                </h3>
              </div>
              <p className="text-sm mb-1 font-medium text-gray-700">Cliente:</p>
              <p className="mb-3 pl-2">{quote.client?.name || "Sin cliente"}</p>

              <p className="text-sm mb-1 font-medium text-gray-700">Empresa:</p>
              <p className="pl-2">
                {quote.client?.company || "No especificada"}
              </p>
            </div>
          </div>

          {/* Preview de cálculo */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-bold text-blue-800 mb-2">
              Vista Previa del Cálculo
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Precio Base:</span>
                <span className="font-semibold ml-2">
                  ${previewCalculation.basePrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cargo Comercial:</span>
                <span className="font-semibold ml-2">
                  ${previewCalculation.commercialFee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cargo Urgencia:</span>
                <span className="font-semibold ml-2">
                  ${previewCalculation.urgencyFee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold ml-2">
                  ${previewCalculation.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Descuento:</span>
                <span className="font-semibold ml-2">
                  -${previewCalculation.discountAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Final:</span>
                <span className="font-bold ml-2 text-blue-800">
                  ${previewCalculation.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Campos editables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                  step="0.1"
                  value={form.discountPercentage}
                  onChange={(e) =>
                    handleChange("discountPercentage", e.target.value)
                  }
                  className="input input-bordered w-full"
                />
              </div>

              {/* Comercial */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <BarChartIcon className="w-4 h-4 text-secondary" />
                  Porcentaje comercial (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={form.commercialPercentage}
                  onChange={(e) =>
                    handleChange("commercialPercentage", e.target.value)
                  }
                  className="input input-bordered w-full"
                  placeholder="Porcentaje de incremento por uso comercial"
                />
              </div>
            </div>

            {/* Columna 2 */}
            <div className="space-y-4">
              {/* Entrega Rápida */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <ClockIcon className="w-4 h-4 text-secondary" />
                  Entrega Rápida (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={form.rapidDeliveryPercentage}
                  onChange={(e) =>
                    handleChange("rapidDeliveryPercentage", e.target.value)
                  }
                  className="input input-bordered w-full"
                  placeholder="Porcentaje de incremento por entrega rápida"
                />
              </div>

              {/* Estado mejorado */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  {React.createElement(getStatusConfig(form.status).icon, {
                    className: `w-4 h-4 ${
                      getStatusConfig(form.status).iconColor
                    }`,
                  })}
                  Estado de la Cotización
                </label>
                <div className="relative">
                  <select
                    value={form.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="input input-bordered w-full appearance-none pr-10"
                  >
                    <option value="PENDING">Pendiente</option>
                    <option value="APPROVED">Aprobada</option>
                    <option value="REJECTED">Rechazada</option>
                  </select>
                  {/* Badge visual */}
                  <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        getStatusConfig(form.status).color
                      }`}
                    >
                      {getStatusConfig(form.status).label}
                    </span>
                  </div>
                  {/* Flecha del select */}
                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notas (ancho completo) */}
          <div className="mb-6">
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
            <DeleteButton
              onConfirm={() => handleDeleteQuote(quote.id)}
              message="¿Seguro que deseas eliminar esta cotización?"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
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
