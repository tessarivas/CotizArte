import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Download,
  FileTextIcon,
  UserIcon,
  DollarSignIcon,
  CalendarIcon,
  TagIcon,
  CheckIcon,
} from "lucide-react";
import api from "@/api/axios";
import { generateQuotePDF } from "@/services/pdfService";
import GradientText from "../blocks/TextAnimations/GradientText/GradientText";
import { SparklesText } from "@/components/magicui/sparkles-text-variant";

export default function SharedQuote() {
  const { shareableId } = useParams();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSharedQuote();
  }, [shareableId]);

  const fetchSharedQuote = async () => {
    try {
      const response = await api.get(`/quotes/shared/${shareableId}`);
      setQuote(response.data);
    } catch (error) {
      console.error("Error al cargar cotización compartida:", error);
      setError("Cotización no encontrada o enlace inválido");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    try {
      const pdf = generateQuotePDF(quote, null);
      pdf.download(`Cotización_${quote.project?.title || quote.id}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar el PDF");
    }
  };

  // ✅ FUNCIONES AUXILIARES (igual que en QuoteDetailsModal)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const translateStatus = (status) => {
    const translations = {
      PENDING: "Pendiente",
      APPROVED: "Aprobada",
      REJECTED: "Rechazada",
    };
    return translations[status] || status;
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const commercialPercentage =
    quote?.commercialPercentage ||
    (quote?.commercialLicenseFee && quote?.basePrice
      ? ((quote.commercialLicenseFee / quote.basePrice) * 100).toFixed(2)
      : "N/A");

  const urgencyPercentage =
    quote?.rapidDeliveryPercentage !== undefined &&
    quote?.rapidDeliveryPercentage !== null
      ? Number(quote.rapidDeliveryPercentage).toFixed(2)
      : quote?.urgencyFee && quote?.basePrice
      ? ((quote.urgencyFee / quote.basePrice) * 100).toFixed(2)
      : "N/A";

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white font-bold font-regular-text">
            Cargando cotización...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 via-pink-500 to-orange-500">
        <div className="text-center bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-8 max-w-md mx-4">
          <h1 className="text-3xl font-bold text-red-600 mb-4 font-logo-text">
            ¡Oops!
          </h1>
          <p className="text-gray-700 font-regular-text">{error}</p>
          <p className="text-sm text-gray-500 mt-2">ID: {shareableId}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="btn btn-primary mt-4"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen font-regular-text">
      <div className="bg-gradient-to-r from-primary via-secondary to-accent h-[30vh] flex items-center justify-center relative">
        <div className="text-center mt-25">
          <SparklesText text="Cotización Compartida" />
        </div>
      </div>

      <div className="w-[60vw] max-w-6xl mx-auto mt-12 relative">
        {/* Card principal */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200">
            <div className="flex-1">
              <GradientText className="text-4xl font-logo-text mb-2">
                {quote.project?.title || "Sin título"}
              </GradientText>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  {formatDate(quote.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <TagIcon className="w-4 h-4" />
                  {quote.project?.artType?.name || "N/A"}
                </div>
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getBadgeClass(
                    quote.status
                  )}`}
                >
                  <CheckIcon className="w-3 h-3 mr-1" />
                  {translateStatus(quote.status)}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleDownloadPDF}
                className="cursor-pointer border-2 border-white bg-gradient-to-br from-[#f28da9] to-[#f2b78d] font-bold font-regular-text text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
              >
                <Download size={20} />
                Descargar PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Columna 1: Proyecto y Cliente */}
            <div className="space-y-6">
              {/* Proyecto */}
              <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <FileTextIcon className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold text-primary font-title-text">
                    Detalles del Proyecto
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Descripción:
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {quote.project?.description ||
                        "Sin descripción disponible"}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Nivel de detalle:
                      </p>
                      <p className="text-gray-600">
                        {quote.project?.detailLevel ||
                          quote.detailLevel ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Horas estimadas:
                      </p>
                      <p className="text-gray-600">
                        {quote.project?.hoursWorked ||
                          quote.hoursWorked ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Descuento
                      </p>
                      <p className="text-gray-600">
                        {quote.discountPercentage || 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cliente */}
              <div className="bg-secondary/10 p-6 rounded-lg border border-secondary/20">
                <div className="flex items-center gap-2 mb-4">
                  <UserIcon className="w-6 h-6 text-secondary" />
                  <h3 className="text-xl font-bold text-secondary font-title-text">
                    Información del Cliente
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Nombre:
                    </p>
                    <p className="text-gray-600">
                      {quote.client?.name ||
                        quote.project?.client?.name ||
                        "Sin cliente"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Teléfono:
                    </p>
                    <p className="text-gray-600">
                      {quote.client?.phone ||
                        quote.project?.client?.phone ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Empresa:
                    </p>
                    <p className="text-gray-600">
                      {quote.client?.company ||
                        quote.project?.client?.company ||
                        "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna 2: Especificaciones y Precios */}
            <div className="space-y-6">
              {/* Desglose de Precios */}
              <div className="bg-accent/10 p-6 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSignIcon className="w-6 h-6 text-orange-300" />
                  <h3 className="text-xl font-bold text-orange-300 font-title-text">
                    Desglose de Precios
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">
                      Precio Base:
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(quote.basePrice)}
                    </span>
                  </div>

                  {quote.commercialLicenseFee > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">
                        Uso Comercial ({commercialPercentage}%):
                      </span>
                      <span className="font-semibold text-green-600">
                        +{formatCurrency(quote.commercialLicenseFee)}
                      </span>
                    </div>
                  )}

                  {quote.urgencyFee > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">
                        Urgencia ({urgencyPercentage}%):
                      </span>
                      <span className="font-semibold text-blue-600">
                        +{formatCurrency(quote.urgencyFee)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-3 font-bold">
                    <span className="text-gray-800">Subtotal:</span>
                    <span className="text-md">
                      {formatCurrency(quote.finalPrice)}
                    </span>
                  </div>

                  {quote.discountPercentage > 0 && (
                    <div className="flex justify-between items-center text-red-600">
                      <span className="font-medium">
                        Descuento ({quote.discountPercentage}%):
                      </span>
                      <span className="font-semibold">
                        -
                        {formatCurrency(
                          (quote.discountPercentage / 100) *
                            (quote.finalPrice || 0)
                        )}
                      </span>
                    </div>
                  )}

                  <hr className="my-4 border-t border-gray-300" />
                  <div className="flex justify-between items-center text-orange-400">
                    <span className="text-xl font-bold">TOTAL:</span>
                    <span className="text-2xl font-bold">
                      {formatCurrency(quote.finalPriceAfterDiscount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {quote.notes && (
            <div className="bg-gray-100/60 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <FileTextIcon className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-bold text-gray-700 font-title-text">
                  Notas Adicionales
                </h3>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {quote.notes}
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between text-sm text-gray-500">
            <p className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              Creada: {formatDate(quote.createdAt)}
            </p>
            <p className="flex items-center gap-1 mt-2 md:mt-0">
              <CalendarIcon className="w-4 h-4" />
              Última actualización: {formatDate(quote.updatedAt)}
            </p>
          </div>
        </div>

        <div className="text-center pb-8">
          <p className="text-gray-500 text-sm">
            Cotización generada por{" "}
            <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CotizArte
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
