import React, { useState, useEffect } from "react";
import api from "@/api/axios";
import { SparklesText } from "@/components/magicui/sparkles-text-variant";
import { useQuotes } from "@/hooks/useQuotes";
import {
  FilePenIcon,
  FileTextIcon,
  Edit2Icon,
  EyeIcon,
  SearchIcon,
  FilterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DollarSignIcon,
  CalendarIcon,
  CheckIcon,
  TagIcon,
  ShareIcon,
} from "lucide-react";
import ProjectSelectorModal from "@/components/ProjectSelectorModal";
import { QuoteDetailsModal } from "@/components/QuoteDetailsModal";
import { QuoteEditModal } from "@/components/QuoteEditModal";
import { ShareQuoteModal } from "@/components/ShareQuoteModal";

export default function Quotes() {
  const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [pricingProfile, setPricingProfile] = useState(null);

  useEffect(() => {
    async function fetchPricingProfile() {
      const token = localStorage.getItem("access_token");
      try {
        const response = await api.get("/pricing-profiles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(response.data) && response.data.length > 0) {
          setPricingProfile(response.data[0]);
        } else {
          setPricingProfile({
            defaultCommercialLicensePercentage: 0,
            defaultUrgencyPercentage: 0,
          });
        }
      } catch (error) {
        console.error("Error al cargar pricing profile:", error);
        // Asigna valores por defecto si no se pudo cargar
        setPricingProfile({
          defaultCommercialLicensePercentage: 0,
          defaultUrgencyPercentage: 0,
        });
      }
    }
    fetchPricingProfile();
  }, []);

  const {
    // Estados
    loading,
    currentPage,
    rowsPerPage,
    searchTerm,
    filterType,

    // Datos calculados para la UI
    currentQuotes,
    filteredQuotes,
    totalPages,
    indexOfFirstQuote,
    indexOfLastQuote,

    // Funciones de actualización de estado
    setRowsPerPage,
    setSearchTerm,
    setFilterType,

    // Funciones de acción
    paginate,
    handleViewDetails,
    handleEdit,
    handleCreateQuote,
    handleDelete,
    handlePrintQuote,
    handleShareQuote,
    handleDeleteQuote,
    handleSaveQuote,

    // Funciones de formateo y utilidades
    formatCurrency,
    formatDate,
    showShareModal,
    selectedQuoteForShare,
    closeShareModal,
  } = useQuotes();

  // Función para manejar la selección de un proyecto en el modal
  const handleProjectSelect = (project) => {
    setIsProjectSelectorOpen(false);
    // Pasamos el ID del proyecto seleccionado a la función handleCreateQuote
    if (project && project.id) {
      handleCreateQuote(project.id);
    }
  };

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

  const getBadgeClass = (status) => {
    switch ((status || "").toUpperCase()) {
      case "APPROVED":
        return "alert alert-success"; // Aquí usarías las clases de tu framework o Tailwind
      case "PENDING":
        return "alert alert-warning";
      case "REJECTED":
        return "alert alert-error text-white";
      default:
        return "alert alert-info";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Modal de selección de proyectos */}
      <ProjectSelectorModal
        isOpen={isProjectSelectorOpen}
        onClose={() => setIsProjectSelectorOpen(false)}
        onSelectProject={handleProjectSelect}
      />

      {/* Encabezado de la página */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent h-[30vh] flex items-center justify-center relative">
        <div className="mt-22">
          <SparklesText text="Mis Cotizaciones" />
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="w-[80vw] mx-auto p-8 flex-1 overflow-visible">
        {/* Barra superior: búsqueda, filtros y botón de agregar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          {/* Búsqueda y filtros (lado izquierdo) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:w-auto">
            {/* Campo de búsqueda */}
            <div className="relative w-full sm:w-120">
              <input
                type="text"
                placeholder="Buscar por proyecto, cliente o estado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-secondary pl-10 pr-4 py-2 w-full rounded-lg bg-white text-lg text-gray-700"
              />
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Dropdown de filtros con daisyUI */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                className="flex items-center gap-1 bg-pink-300 hover:bg-pink-400 cursor-pointer px-4 py-2 rounded-lg text-white font-bold font-regular-text transition m-1"
              >
                <FilterIcon className="w-4 h-4" />
                Filtros
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                <li>
                  <a
                    className={
                      filterType === "all"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setFilterType("all")}
                  >
                    Todas
                  </a>
                </li>
                <li>
                  <a
                    className={
                      filterType === "pending"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setFilterType("pending")}
                  >
                    Pendientes
                  </a>
                </li>
                <li>
                  <a
                    className={
                      filterType === "approved"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setFilterType("approved")}
                  >
                    Aprobadas
                  </a>
                </li>
                <li>
                  <a
                    className={
                      filterType === "rejected"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setFilterType("rejected")}
                  >
                    Rechazadas
                  </a>
                </li>
              </ul>
            </div>

            {/* Selector de filas por página */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-regular-text text-gray-600">
                Mostrar:
              </span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="select select-secondary w-20 text-sm font-bold font-regular-text cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          {/* Botón para agregar una nueva cotización (lado derecho) - MODIFICADO */}
          <button
            onClick={() => setIsProjectSelectorOpen(true)}
            className="cursor-pointer border-2 border-white bg-gradient-to-br from-[#f28da9] to-[#f2b78d] font-bold font-regular-text text-white px-4 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center"
          >
            <FilePenIcon className="w-6 h-6 mr-2" /> Nueva Cotización
          </button>
        </div>
        {/* Tabla de cotizaciones */}
        <div className="w-full">
          <div className="overflow-x-auto rounded-lg shadow-sm font-regular-text">
            <table className="w-full divide-y divide-gray-200 shadow-lg rounded-lg">
              <thead className="bg-gradient-to-r from-teal-300 via-pink-300 to-orange-300 text-neutral">
                <tr>
                  {/* Columna Proyecto con FileTextIcon */}
                  <th className="px-6 py-3 text-left text-xl font-bold font-title-text uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <FileTextIcon className="w-5 h-5" /> Proyecto
                    </div>
                  </th>
                  {/* Columna Cliente */}
                  <th className="px-6 py-3 text-left text-xl font-bold font-title-text uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <TagIcon className="w-5 h-5" /> Cliente
                    </div>
                  </th>
                  {/* Columna Monto con DollarSignIcon */}
                  <th className="px-6 py-3 text-left text-xl font-bold font-title-text uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <DollarSignIcon className="w-5 h-5" /> Precio
                    </div>
                  </th>
                  {/* Columna Fecha con CalendarIcon */}
                  <th className="px-6 py-3 text-left text-xl font-bold font-title-text uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-5 h-5" /> Fecha
                    </div>
                  </th>
                  {/* Columna Estado con CheckIcon */}
                  <th className="px-6 py-3 text-left text-xl font-bold font-title-text uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <CheckIcon className="w-5 h-5" /> Estado
                    </div>
                  </th>
                  {/* Columna Acciones */}
                  <th className="px-6 py-3 text-center text-xl font-bold font-title-text uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : currentQuotes.length > 0 ? (
                  currentQuotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-md font-semibold text-gray-900">
                        {quote.project?.title || "Sin título"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {quote.client?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                        {formatCurrency(quote.finalPriceAfterDiscount || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(quote.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 inline-flex text-sm leading-5 font-bold rounded-full ${getBadgeClass(
                            quote.status
                          )}`}
                        >
                          {translateStatus(quote.status)}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        {/* Botones de acciones en la misma fila - MODIFICADO (Quitado botón "Nueva") */}
                        <div className="flex flex-wrap gap-2 justify-center">
                          <button
                            onClick={() => {
                              setSelectedQuote(quote);
                              setShowDetailsModal(true);
                            }}
                            className="flex items-center gap-1 cursor-pointer btn btn-accent btn-sm font-bold font-regular-text px-3 py-1 rounded-lg shadow-md"
                          >
                            <EyeIcon className="w-4 h-4" /> Detalles
                          </button>
                          {/* Botón Editar */}
                          <button
                            onClick={() => {
                              setSelectedQuote(quote);
                              setShowEditModal(true);
                            }}
                            className="flex items-center gap-1 cursor-pointer btn btn-secondary btn-sm font-bold font-regular-text px-3 py-1 rounded-lg shadow-md"
                          >
                            <Edit2Icon className="w-4 h-4" /> Editar
                          </button>
                          {/* Botón Imprimir */}
                          <button
                            onClick={() => handleShareQuote(quote)} 
                            className="flex items-center gap-1 cursor-pointer btn btn-primary btn-sm font-bold font-regular-text px-3 py-1 rounded-lg shadow-md"
                          >
                            <ShareIcon className="w-4 h-4" /> Compartir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                    >
                      {filteredQuotes.length === 0
                        ? "No se encontraron cotizaciones con los filtros actuales."
                        : "Aún no tienes cotizaciones registradas."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginación */}
        {filteredQuotes.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Información de paginación */}
            <div className="text-sm text-gray-500 font-regular-text font-semibold">
              Mostrando {indexOfFirstQuote + 1} -{" "}
              {Math.min(indexOfLastQuote, filteredQuotes.length)} de{" "}
              {filteredQuotes.length} cotizaciones
            </div>

            {/* Controles de paginación */}
            <div className="flex items-center space-x-2">
              {/* Botón anterior */}
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`cursor-pointer px-1 py-1 rounded-md text-sm font-medium transition ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>

              {/* Números de página */}
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;

                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 &&
                    pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`cursor-pointer px-3 py-1 rounded-md text-sm font-medium transition ${
                        currentPage === pageNumber
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  (pageNumber === 2 && currentPage > 3) ||
                  (pageNumber === totalPages - 1 &&
                    currentPage < totalPages - 2)
                ) {
                  return (
                    <span key={pageNumber} className="px-3 py-1 text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              {/* Botón siguiente */}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`cursor-pointer px-1 py-1 rounded-md text-sm font-medium transition ${
                  currentPage === totalPages || totalPages === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
        <QuoteDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          quote={selectedQuote}
        />
        {showEditModal && selectedQuote && pricingProfile && (
          <QuoteEditModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            quote={selectedQuote}
            onSave={handleSaveQuote} // Tu función de actualización
            onDelete={handleDeleteQuote} // Tu función de eliminación
            pricingProfile={pricingProfile}
          />
        )}
        <ShareQuoteModal
          isOpen={showShareModal}
          onClose={closeShareModal}
          quote={selectedQuoteForShare}
          pricingProfile={pricingProfile}
        />
      </div>
    </div>
  );
}
