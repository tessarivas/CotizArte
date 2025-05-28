import React, { useState, useEffect } from "react";
import {
  FileTextIcon,
  EyeIcon,
  ShareIcon,
  CalendarIcon,
  DollarSignIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import GradientText from "../blocks/TextAnimations/GradientText/GradientText";
import api from "@/api/axios";

/**
 * Modal para mostrar las cotizaciones de un cliente específico
 * @param {Object} props Propiedades del componente
 * @param {Object} props.client Cliente del cual mostrar las cotizaciones
 * @param {Function} props.onClose Función para cerrar el modal
 */
const ClientQuotesModal = ({ client, onClose }) => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar cotizaciones del cliente
  useEffect(() => {
    if (client?.id) {
      fetchClientQuotes();
    }
  }, [client]);

  const fetchClientQuotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No hay token");

      const response = await api.get("/quotes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Debug: verificar estructura de las cotizaciones
      console.log("Todas las cotizaciones:", response.data);

      const clientQuotes = response.data.filter(
        (quote) => quote.client?.id === client.id
      );

      // ✅ Debug: verificar cotizaciones filtradas
      console.log("Cotizaciones del cliente:", clientQuotes);
      console.log("Ejemplo de shareableLink:", clientQuotes[0]?.shareableLink);

      const sortedQuotes = clientQuotes.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setQuotes(sortedQuotes);
    } catch (error) {
      console.error("Error al cargar cotizaciones del cliente:", error);
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  // Formatear dinero
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount || 0);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Traducir estado
  const translateStatus = (status) => {
    if (!status) return "SIN ESTADO";
    switch (status.toUpperCase()) {
      case "APPROVED":
        return "APROBADA";
      case "PENDING":
        return "PENDIENTE";
      case "REJECTED":
        return "RECHAZADA";
      default:
        return status;
    }
  };

  // Obtener clase del badge según el estado
  const getBadgeClass = (status) => {
    switch ((status || "").toUpperCase()) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Generar enlace compartible
  const generateShareableLink = (quote) => {
    const baseUrl = window.location.origin;
    // ✅ Usar shareableLink en lugar de quote.id
    return `${baseUrl}/shared-quote/${quote.shareableLink}`;
  };

  // Manejar clic en enlace compartible
  const handleShareableLink = (quote) => {
    const shareableLink = generateShareableLink(quote);
    // Abrir en nueva pestaña
    window.open(shareableLink, "_blank");
  };

  // Copiar enlace al portapapeles
  const copyToClipboard = async (quote) => {
    try {
      const shareableLink = generateShareableLink(quote);
      await navigator.clipboard.writeText(shareableLink);
      // Podrías agregar una notificación aquí
      alert("Enlace copiado al portapapeles");
    } catch (error) {
      console.error("Error al copiar enlace:", error);
      alert("Error al copiar enlace");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50 font-regular-text">
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-7 w-[900px] max-h-[90vh] overflow-y-auto">
        {/* Encabezado del modal */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <div className="text-3xl font-logo-text text-base-content mb-1">
              Cotizaciones de
            </div>
            <GradientText className="text-4xl font-logo-text">
              {client?.name}
            </GradientText>
          </div>
          <button onClick={onClose} className="btn btn-circle btn-ghost btn-sm">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido del modal */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Cargando cotizaciones...</span>
          </div>
        ) : quotes.length === 0 ? (
          <div className="text-center py-12">
            <FileTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No hay cotizaciones
            </h3>
            <p className="text-gray-500">
              Este cliente aún no tiene cotizaciones asociadas.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Lista de cotizaciones */}
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  {/* Información principal */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <FileTextIcon className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {quote.project?.title || "Sin título"}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getBadgeClass(
                          quote.status
                        )}`}
                      >
                        {translateStatus(quote.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 text-sm text-gray-600">
                      {/* Precio */}
                      <div className="flex items-center gap-2">
                        <DollarSignIcon className="w-4 h-4 text-green-600" />
                        <span className="font-medium">
                          {formatCurrency(quote.finalPriceAfterDiscount)}
                        </span>
                      </div>

                      {/* Fecha */}
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-blue-600" />
                        <span>{formatDate(quote.createdAt)}</span>
                      </div>

                      {/* Estado visual */}
                      <div className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-purple-600" />
                        <span>Tipo: {quote.project?.artType?.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => handleShareableLink(quote)}
                      className="flex items-center gap-2 btn btn-primary btn-sm font-bold font-regular-text px-3 py-1 rounded-lg shadow-md"
                      title="Ver cotización compartible"
                    >
                      <EyeIcon className="w-4 h-4" />
                      Ver
                    </button>
                    <button
                      onClick={() => copyToClipboard(quote)}
                      className="flex items-center gap-2 btn btn-secondary btn-sm font-bold font-regular-text px-3 py-1 rounded-lg shadow-md"
                      title="Copiar enlace"
                    >
                      <ShareIcon className="w-4 h-4" />
                      Copiar
                    </button>
                  </div>
                </div>

                {/* Descripción si existe */}
                {quote.project?.description && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {quote.project.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pie del modal */}
        <div className="flex justify-center mt-6">
          <button onClick={onClose} className="btn btn-primary px-6">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientQuotesModal;
