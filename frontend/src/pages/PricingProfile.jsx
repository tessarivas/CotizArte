import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { SparklesText } from "@/components/magicui/sparkles-text-variant";
import {
  PlusCircleIcon,
  Trash2Icon,
  AlertCircleIcon,
  DollarSignIcon,
  ClockIcon,
  PaletteIcon,
  PercentIcon,
  FileTextIcon,
  TagIcon,
  EditIcon,
  SearchIcon,
  FilterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ScissorsIcon,
} from "lucide-react";
import DeleteButton from "@/components/DeleteButton";
import EditPricingProfileModal from "@/components/EditPricingProfileModal"; // Importamos el nuevo modal

const ART_TYPES = [
  { id: 1, name: "Ilustración Digital" },
  { id: 2, name: "Edición de Video" },
  { id: 3, name: "Pintura" },
  { id: 4, name: "Dibujo" },
];

export default function PricingProfile() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Estado para el formulario del modal
  const [formData, setFormData] = useState({
    artTypeId: "",
    standardHourlyRate: "",
    preferredHourlyRate: "",
    projectsPerMonth: "",
    defaultCommercialLicensePercentage: "",
    defaultUrgencyPercentage: "",
    modificationExtra: "",
  });

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No hay token");
      const response = await api.get("/pricing-profiles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfiles(response.data);
    } catch (error) {
      console.error("Error al cargar los perfiles de precio:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar los cambios en los campos del formulario
  const handleFieldChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleEdit = (profile) => {
    setSelectedProfile(profile);
    setFormData({
      artTypeId: profile.artTypeId,
      standardHourlyRate: profile.standardHourlyRate,
      preferredHourlyRate: profile.preferredHourlyRate,
      projectsPerMonth: profile.projectsPerMonth,
      defaultCommercialLicensePercentage:
        profile.defaultCommercialLicensePercentage,
      defaultUrgencyPercentage: profile.defaultUrgencyPercentage,
      modificationExtra: profile.modificationExtra,
    });
    setIsModalOpen(true);
  };

  const handleNewProfile = () => {
    setSelectedProfile(null);
    setFormData({
      artTypeId: "",
      standardHourlyRate: "",
      preferredHourlyRate: "",
      projectsPerMonth: 10,
      defaultCommercialLicensePercentage: 30,
      defaultUrgencyPercentage: 20,
      modificationExtra: 10,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      await api.delete(`/pricing-profiles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProfiles(); // Actualizar lista
    } catch (error) {
      console.error("Error al eliminar el perfil:", error);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No hay token");

      const payload = {
        artTypeId: Number(formData.artTypeId),
        standardHourlyRate: Math.max(Number(formData.standardHourlyRate), 1),
        preferredHourlyRate: Math.max(Number(formData.preferredHourlyRate), 1),
        projectsPerMonth: Math.max(Number(formData.projectsPerMonth), 1),
        defaultCommercialLicensePercentage: Math.max(
          Number(formData.defaultCommercialLicensePercentage),
          1
        ),
        defaultUrgencyPercentage: Math.max(
          Number(formData.defaultUrgencyPercentage),
          1
        ),
        modificationExtra: Math.max(Number(formData.modificationExtra), 0),
      };

      if (selectedProfile) {
        await api.put(`/pricing-profiles/${selectedProfile.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/pricing-profiles", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setIsModalOpen(false);
      fetchProfiles(); // Actualizar la lista
      closeModal();
    } catch (error) {
      console.error("Error al guardar el perfil de precios:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
    setFormData({
      artTypeId: "",
      standardHourlyRate: "",
      preferredHourlyRate: "",
      projectsPerMonth: 10,
      defaultCommercialLicensePercentage: 30,
      defaultUrgencyPercentage: 20,
      modificationExtra: 10,
    });
  };

  // Filtrado de perfiles
  const filteredProfiles = profiles.filter((profile) => {
    const artTypeName =
      ART_TYPES.find((type) => type.id === profile.artTypeId)?.name || "";
    const matchesSearch =
      artTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.standardHourlyRate.toString().includes(searchTerm) ||
      profile.preferredHourlyRate.toString().includes(searchTerm);

    if (filterType === "all") return matchesSearch;
    if (filterType === "highRate" && profile.standardHourlyRate > 50)
      return matchesSearch;
    if (filterType === "lowRate" && profile.standardHourlyRate <= 50)
      return matchesSearch;
    if (filterType === "digital" && [1, 2].includes(profile.artTypeId))
      return matchesSearch;
    if (filterType === "traditional" && [3, 4].includes(profile.artTypeId))
      return matchesSearch;

    return false;
  });

  // Paginación
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

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="flex flex-col min-h-screen">
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
                      filterType === "digital"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setFilterType("digital")}
                  >
                    Arte Digital
                  </a>
                </li>
                <li>
                  <a
                    className={
                      filterType === "traditional"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setFilterType("traditional")}
                  >
                    Arte Tradicional
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

          {/* Botón para agregar un nuevo perfil (lado derecho) */}
          <button
            onClick={handleNewProfile}
            className="cursor-pointer border-2 border-white bg-gradient-to-br from-[#f28da9] to-[#f2b78d] font-bold font-regular-text text-white px-4 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center"
          >
            <PlusCircleIcon className="w-6 h-6 mr-2" /> Nuevo Perfil de Precio
          </button>
        </div>

        {/* Tabla de perfiles */}
        <div className="w-full">
          <div className="overflow-x-auto rounded-lg shadow-sm">
            <table className="w-full divide-y divide-gray-200 shadow-lg rounded-lg">
              <thead className="bg-gradient-to-r from-teal-300 via-pink-300 to-orange-300 text-neutral">
                <tr>
                  {/* Columna Tipo de Arte con PaletteIcon */}
                  <th className="px-6 py-3 text-left font-bold font-title-text uppercase tracking-wider whitespace-nowrap text-base">
                    <div className="flex items-center gap-1">
                      <PaletteIcon className="w-5 h-5" /> Tipo de Arte
                    </div>
                  </th>
                  {/* Columna Tarifa Estándar con DollarSignIcon */}
                  <th className="px-6 py-3 text-left font-bold font-title-text uppercase tracking-wider whitespace-nowrap text-base">
                    <div className="flex items-center gap-1">
                      <DollarSignIcon className="w-5 h-5" /> Tarifa Estándar
                    </div>
                  </th>
                  {/* Columna Tarifa Preferida con TagIcon */}
                  <th className="px-6 py-3 text-left font-bold font-title-text uppercase tracking-wider whitespace-nowrap text-base">
                    <div className="flex items-center gap-1">
                      <TagIcon className="w-5 h-5" /> Tarifa Preferida
                    </div>
                  </th>
                  {/* Columna Proyectos/mes con ClockIcon */}
                  <th className="px-6 py-3 text-left font-bold font-title-text uppercase tracking-wider whitespace-nowrap text-base">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-5 h-5" /> Proyectos/Mes
                    </div>
                  </th>
                  {/* Columna Extra por Modificación con ScissorsIcon */}
                  <th className="px-6 py-3 text-left font-bold font-title-text uppercase tracking-wider whitespace-nowrap text-base">
                    <div className="flex items-center gap-1">
                      <ScissorsIcon className="w-5 h-5" /> Extra Modificación
                    </div>
                  </th>
                  {/* Columna Acciones */}
                  <th className="px-6 py-3 text-center font-bold font-title-text uppercase tracking-wider whitespace-nowrap text-base">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-primary"></div>
                      </div>
                    </td>
                  </tr>
                ) : currentProfiles.length > 0 ? (
                  currentProfiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {ART_TYPES.find((type) => type.id === profile.artTypeId)
                          ?.name || "No especificado"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        ${profile.standardHourlyRate}/hora
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        ${profile.preferredHourlyRate}/hora
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {profile.projectsPerMonth}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        ${profile.modificationExtra}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        {/* Botones de acciones en la misma fila */}
                        <div className="flex flex-wrap gap-2 justify-center">
                          {/* Botón Editar */}
                          <button
                            onClick={() => handleEdit(profile)}
                            className="flex items-center gap-1 cursor-pointer btn btn-secondary btn-sm font-bold font-regular-text px-3 py-1 rounded-lg shadow-md"
                          >
                            <EditIcon className="w-4 h-4" /> Editar
                          </button>
                          {/* Botón Eliminar */}
                          <DeleteButton
                            onConfirm={() => handleDelete(profile.id)}
                            className="btn-sm font-bold font-regular-text rounded-lg shadow-md"
                          />
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
                      {filteredProfiles.length === 0
                        ? "No se encontraron perfiles con los filtros actuales."
                        : "Aún no tienes perfiles de precio registrados."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginación */}
        {filteredProfiles.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Información de paginación */}
            <div className="text-sm text-gray-500 font-regular-text font-semibold">
              Mostrando {indexOfFirstProfile + 1} -{" "}
              {Math.min(indexOfLastProfile, filteredProfiles.length)} de{" "}
              {filteredProfiles.length} perfiles
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
      </div>

      {/* Modal para crear/editar perfil de precio */}
      {isModalOpen && (
        <EditPricingProfileModal
          profile={formData}
          onFieldChange={handleFieldChange}
          onClose={closeModal}
          onSave={handleSave}
          isNew={!selectedProfile}
        />
      )}
    </div>
  );
}
