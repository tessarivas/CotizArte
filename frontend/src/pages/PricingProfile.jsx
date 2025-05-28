import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SparklesText } from "@/components/magicui/sparkles-text-variant";
import {
  PlusCircleIcon,
  DollarSignIcon,
  ClockIcon,
  FolderPenIcon,
  EditIcon,
  SearchIcon,
  FilterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ScissorsIcon,
  PercentIcon,
  TrendingUpIcon,
} from "lucide-react";
import DeleteButton from "@/components/DeleteButton";
import EditPricingProfileModal from "@/components/EditPricingProfileModal";
import { usePricingProfiles } from "@/hooks/usePricingProfiles";

const ART_TYPES = [
  { id: 1, name: "Ilustración Digital" },
  { id: 2, name: "Edición de Video" },
  { id: 3, name: "Pintura" },
  { id: 4, name: "Dibujo" },
];

export default function PricingProfile() {
  const navigate = useNavigate();

  // ✅ Usar el hook personalizado
  const {
    // Estados
    profiles,
    loading,
    isModalOpen,
    formData,
    errorMessages,
    successMessage,
    isNew, // ✅ Agregar isNew

    // Funciones
    saveProfile,
    deleteProfile,
    handleFieldChange,
    openEditModal,
    openNewModal,
    closeModal,
  } = usePricingProfiles();

  // Estados locales para UI (filtros, búsqueda, paginación)
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [artTypeFilter, setArtTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  // ✅ Funciones simplificadas que usan el hook
  const handleEdit = (profile) => {
    openEditModal(profile);
  };

  const handleNewProfile = () => {
    openNewModal();
  };

  const handleDelete = async (id) => {
    await deleteProfile(id);
  };

  const handleSave = async () => {
    await saveProfile();
  };

  // Filtrado de perfiles (lógica de UI, no de backend)
  const filteredProfiles = profiles.filter((profile) => {
    const artTypeName =
      ART_TYPES.find((type) => type.id === profile.artTypeId)?.name || "";
    const matchesSearch =
      artTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.standardHourlyRate.toString().includes(searchTerm);

    // Filtro por tipo de arte
    if (artTypeFilter !== "all" && artTypeName !== artTypeFilter) {
      return false;
    }

    // Filtros adicionales
    if (filterType === "all") return matchesSearch;
    if (filterType === "highRate" && profile.standardHourlyRate > 50)
      return matchesSearch;
    if (filterType === "lowRate" && profile.standardHourlyRate <= 50)
      return matchesSearch;
    if (
      filterType === "highCommission" &&
      profile.defaultCommercialLicensePercentage > 30
    )
      return matchesSearch;
    if (
      filterType === "lowCommission" &&
      profile.defaultCommercialLicensePercentage <= 30
    )
      return matchesSearch;

    return false;
  });

  // Paginación (lógica de UI)
  const indexOfLastProfile = currentPage * rowsPerPage;
  const indexOfFirstProfile = indexOfLastProfile - rowsPerPage;
  const currentProfiles = filteredProfiles.slice(
    indexOfFirstProfile,
    indexOfLastProfile
  );
  const totalPages = Math.ceil(filteredProfiles.length / rowsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-regular-text">
      {/* Encabezado de la página */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent h-[30vh] flex items-center justify-center relative">
        <div className="mt-22">
          <SparklesText text="Perfiles de Precios" />
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
                placeholder="Buscar por tipo de arte o tarifa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-secondary pl-10 pr-4 py-2 w-full rounded-lg bg-white text-lg text-gray-700"
              />
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Dropdown de filtros adicionales */}
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
                    Todos
                  </a>
                </li>
                <li>
                  <a
                    className={
                      filterType === "highRate"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setFilterType("highRate")}
                  >
                    Tarifa Alta ($50)
                  </a>
                </li>
                <li>
                  <a
                    className={
                      filterType === "lowRate"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setFilterType("lowRate")}
                  >
                    Tarifa Baja (≤$50)
                  </a>
                </li>
                <li>
                  <a
                    className={
                      filterType === "highCommission"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setFilterType("highCommission")}
                  >
                    Comisión Alta (+30%)
                  </a>
                </li>
                <li>
                  <a
                    className={
                      filterType === "lowCommission"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setFilterType("lowCommission")}
                  >
                    Comisión Baja (-30%)
                  </a>
                </li>
              </ul>
            </div>

            {/* Selector de perfiles por página */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-regular-text text-gray-600">
                Mostrar:
              </span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="select select-secondary w-20 text-sm font-bold font-regular-text cursor-pointer"
              >
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
              </select>
            </div>
          </div>

          {/* Botón para agregar un nuevo perfil */}
          <button
            onClick={handleNewProfile}
            className="cursor-pointer border-2 border-white bg-gradient-to-br from-[#f28da9] to-[#f2b78d] font-bold font-regular-text text-white px-4 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center"
          >
            <PlusCircleIcon className="w-6 h-6 mr-2" /> Nuevo Perfil
          </button>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Grid de perfiles de precios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentProfiles.length > 0 ? (
                currentProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 flex flex-col"
                  >
                    {/* Header del perfil */}
                    <div className="bg-gradient-to-r from-secondary to-accent p-4 font-regular-text">
                      <h3 className="text-xl font-bold text-neutral truncate flex items-center gap-2">
                        <FolderPenIcon className="w-5 h-5" />
                        {ART_TYPES.find((type) => type.id === profile.artTypeId)
                          ?.name || "Sin especificar"}
                      </h3>
                    </div>

                    {/* Cuerpo del perfil */}
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="space-y-3 flex-grow">
                        {/* Tarifa Estándar */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSignIcon className="w-5 h-5 text-emerald-500" />
                            <span className="text-sm font-semibold">
                              Tarifa por Hora:
                            </span>
                          </div>
                          <span className="text-lg font-bold text-emerald-500">
                            ${profile.standardHourlyRate}
                          </span>
                        </div>

                        {/* Proyectos por mes */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ClockIcon className="w-5 h-5 text-blue-500" />
                            <span className="text-sm">Proyectos/Mes:</span>
                          </div>
                          <span className="text-sm font-bold">
                            {profile.projectsPerMonth}
                          </span>
                        </div>

                        {/* Extra por modificación */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ScissorsIcon className="w-5 h-5 text-orange-500" />
                            <span className="text-sm">Extra Modificación:</span>
                          </div>
                          <span className="text-sm font-bold">
                            ${profile.modificationExtra}
                          </span>
                        </div>

                        {/* Porcentajes */}
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <PercentIcon className="w-4 h-4 text-purple-500" />
                              <span className="text-xs">
                                Licencia Comercial:
                              </span>
                            </div>
                            <span className="text-xs font-bold text-purple-600">
                              {profile.defaultCommercialLicensePercentage}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <TrendingUpIcon className="w-4 h-4 text-red-500" />
                              <span className="text-xs">Urgencia:</span>
                            </div>
                            <span className="text-xs font-bold text-red-600">
                              {profile.defaultUrgencyPercentage}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Acciones del perfil */}
                      <div className="flex justify-between gap-2 mt-5 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleEdit(profile)}
                          className="btn btn-secondary btn-sm flex rounded-lg text-sm font-regular-text items-center gap-2 flex-1"
                        >
                          <EditIcon className="w-4 h-4" /> Editar
                        </button>
                        <DeleteButton
                          onConfirm={() => handleDelete(profile.id)}
                          className="btn-sm font-bold font-regular-text rounded-lg shadow-md"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-lg">
                    {filteredProfiles.length === 0
                      ? "No se encontraron perfiles con los filtros actuales."
                      : "Aún no tienes perfiles de precio registrados."}
                  </p>
                </div>
              )}
            </div>

            {/* Paginación */}
            {filteredProfiles.length > 0 && (
              <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500 font-regular-text font-semibold">
                  Mostrando {indexOfFirstProfile + 1} -{" "}
                  {Math.min(indexOfLastProfile, filteredProfiles.length)} de{" "}
                  {filteredProfiles.length} perfiles
                </div>

                <div className="flex items-center space-x-2">
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
                        <span
                          key={pageNumber}
                          className="px-3 py-1 text-gray-400"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

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
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <EditPricingProfileModal
          profile={formData}
          onFieldChange={handleFieldChange}
          onClose={closeModal}
          onSave={handleSave}
          isNew={isNew} // ✅ Pasar isNew del hook
          errorMessages={errorMessages}
          successMessage={successMessage}
        />
      )}
    </div>
  );
}
