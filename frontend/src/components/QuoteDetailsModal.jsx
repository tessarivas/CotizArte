import React from "react";
import {
  FileTextIcon,
  UserIcon,
  BarChartIcon,
  DollarSignIcon,
} from "lucide-react";
import GradientText from "../blocks/TextAnimations/GradientText/GradientText";

export function QuoteDetailsModal({ isOpen, onClose, quote }) {
  if (!isOpen || !quote) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50 font-regular-text">
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-7 w-[600px] max-h-[90vh] overflow-y-auto">
        {/* Título */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <GradientText className="text-5xl font-logo-text mb-2">
            Detalles de Cotización
          </GradientText>
        </div>

        <div className="flex justify-center items-center font-bold -mt-4 mb-6">
          <p>- Información completa del presupuesto -</p>
        </div>

        {/* Contenido del detalle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna 1 */}
          <div className="space-y-4">
            {/* Proyecto */}
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileTextIcon className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-primary">
                  Detalles del Proyecto
                </h3>
              </div>
              <p className="text-sm mb-1 font-medium text-gray-700">Título:</p>
              <p className="mb-3 pl-2">
                {quote.project?.title || "Sin título"}
              </p>

              <p className="text-sm mb-1 font-medium text-gray-700">
                Tipo de Arte:
              </p>
              <p className="pl-2">{quote.artType?.name || "N/A"}</p>
            </div>

            {/* Cliente */}
            <div className="bg-secondary/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <UserIcon className="w-5 h-5 text-secondary" />
                <h3 className="font-bold text-secondary">Cliente</h3>
              </div>
              <p className="text-sm mb-1 font-medium text-gray-700">Nombre:</p>
              <p className="mb-3 pl-2">{quote.client?.name || "Sin cliente"}</p>

              <p className="text-sm mb-1 font-medium text-gray-700">Empresa:</p>
              <p className="pl-2">{quote.client?.company || "N/A"}</p>
            </div>
          </div>

          {/* Columna 2 */}
          <div className="space-y-4">
            {/* Detalles Técnicos */}
            <div className="bg-accent/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChartIcon className="w-5 h-5 text-accent" />
                <h3 className="font-bold text-accent">Especificaciones</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm mb-1 font-medium text-gray-700">
                    Nivel de detalle:
                  </p>
                  <p className="pl-2 mb-3">{quote.detailLevel || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm mb-1 font-medium text-gray-700">
                    Horas trabajadas:
                  </p>
                  <p className="pl-2 mb-3">{quote.hoursWorked || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm mb-1 font-medium text-gray-700">
                    Uso comercial:
                  </p>
                  <p className="pl-2">{quote.isCommercial ? "Sí" : "No"}</p>
                </div>
                <div>
                  <p className="text-sm mb-1 font-medium text-gray-700">
                    Descuento:
                  </p>
                  <p className="pl-2">{quote.discountPercentage || 0}%</p>
                </div>
              </div>
            </div>

            {/* Información de Precio */}
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSignIcon className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-primary">Precio</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm mb-1 font-medium text-gray-700">
                    Precio base:
                  </p>
                  <p className="pl-2 mb-3">${quote.finalPrice || 0}</p>
                </div>
                <div>
                  <p className="text-sm mb-1 font-medium text-gray-700">
                    Descuento:
                  </p>
                  <p className="pl-2 mb-3">-${quote.discountAmount || 0}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm mb-1 font-medium text-gray-700">
                    Precio final:
                  </p>
                  <p className="pl-2 text-xl font-bold text-primary">
                    ${quote.finalPriceAfterDiscount || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notas (ancho completo) */}
        <div className="mt-6 bg-gray-100/60 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileTextIcon className="w-5 h-5 text-gray-700" />
            <h3 className="font-bold text-gray-700">Notas</h3>
          </div>
          <p className="text-gray-800 whitespace-pre-wrap pl-2">
            {quote.notes || "Sin notas adicionales."}
          </p>
        </div>

        {/* Fechas */}
        <div className="mt-6 flex justify-between text-sm text-gray-500">
          <p>Creada: {new Date(quote.createdAt).toLocaleDateString()}</p>
          <p>
            Última actualización:{" "}
            {new Date(quote.updatedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Botón de cerrar */}
        <div className="flex justify-center mt-6">
          <button onClick={onClose} className="btn btn-secondary px-8">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
