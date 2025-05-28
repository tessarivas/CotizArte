import React from "react";
import { SparklesText } from "@/components/magicui/sparkles-text-variant";
import { useClients } from "@/hooks/useClients";
import {
  UserIcon,
  BuildingIcon,
  MailIcon,
  FileTextIcon,
  PhoneIcon,
  Edit2Icon,
  Trash2Icon,
  EyeIcon,
  SearchIcon,
  FilterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserPlusIcon,
} from "lucide-react";
import EditClientModal from "@/components/EditClientModal";
import AddClientModal from "@/components/AddClientModal";
import ClientQuotesModal from "@/components/ClientsQuotesModal"; // ✅ Importar el nuevo modal
import DeleteButton from "@/components/DeleteButton";

export default function Clients() {
  const {
    // Estados y funciones CRUD existentes
    selectedClient,
    isModalOpen,
    openModal,
    closeModal,
    handleFieldChange,
    handleSave,
    handleDelete,
    handleViewQuotes,
    editSuccessMessage, // ✅ Agregar mensaje de éxito

    // Estados y funciones de paginación
    currentPage,
    rowsPerPage,
    setRowsPerPage,
    paginate,
    totalPages,
    currentClients,
    filteredClients,
    indexOfFirstClient,
    indexOfLastClient,

    // Estados y funciones de búsqueda y filtros
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    showFilters,
    toggleFilters,

    // ✅ Nuevos estados y funciones para agregar cliente
    showAddModal,
    openAddModal,
    closeAddModal,
    handleAddClient,

    // ✅ Estados y funciones para el modal de cotizaciones
    showQuotesModal,
    selectedClientForQuotes,
    closeQuotesModal,
  } = useClients();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Encabezado de la página */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent h-[30vh] flex items-center justify-center relative">
        <div className="mt-22">
          <SparklesText text="Mis Clientes" />
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="w-[80vw] mx-auto p-8 flex-1 overflow-visible">
        {/* Barra superior: búsqueda, filtros y botón de agregar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          {/* Búsqueda y filtros (lado izquierdo) - mantener igual */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:w-auto">
            {/* Campo de búsqueda */}
            <div className="relative w-full sm:w-120">
              <input
                type="text"
                placeholder="Buscar cliente por nombre, correo o teléfono..."
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
                      filterType === "withCompany"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setFilterType("withCompany")}
                  >
                    Con empresa
                  </a>
                </li>
                <li>
                  <a
                    className={
                      filterType === "withoutCompany"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setFilterType("withoutCompany")}
                  >
                    Sin empresa
                  </a>
                </li>
                <li>
                  <a
                    className={
                      filterType === "withNotes"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setFilterType("withNotes")}
                  >
                    Con notas
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

          {/* ✅ Botón actualizado para abrir modal en lugar de navegar */}
          <button
            onClick={openAddModal}
            className="cursor-pointer border-2 border-white bg-gradient-to-br from-[#f28da9] to-[#f2b78d] font-bold font-regular-text text-white px-4 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center"
          >
            <UserPlusIcon className="w-6 h-6 mr-2" /> Agregar Cliente
          </button>
        </div>

        {/* Tabla de clientes - mantener igual */}
        <div className="w-full">
          <div className="overflow-x-auto rounded-lg shadow-sm">
            <table className="w-full divide-y divide-gray-200 shadow-lg rounded-lg">
              <thead className="bg-gradient-to-r from-teal-300 via-pink-300 to-orange-300 text-neutral">
                <tr>
                  <th className="px-6 py-3 text-left text-xl font-bold font-title-text uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <UserIcon className="w-5 h-5" /> Nombre
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xl font-bold font-title-text uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <MailIcon className="w-5 h-5" /> Email
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xl font-bold font-title-text uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <PhoneIcon className="w-5 h-5" /> Teléfono
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xl font-bold font-title-text uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <BuildingIcon className="w-5 h-5" /> Empresa
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xl font-bold font-title-text uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <FileTextIcon className="w-5 h-5" /> Notas
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xl font-bold font-title-text uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentClients.length > 0 ? (
                  currentClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {client.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {client.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {client.phone || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {client.company || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {client.notes || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex flex-wrap gap-2 justify-center">
                          <button
                            onClick={() => openModal(client)}
                            className="flex items-center gap-1 cursor-pointer btn btn-secondary btn-sm font-bold font-regular-text px-3 py-1 rounded-lg shadow-md"
                          >
                            <Edit2Icon className="w-4 h-4" /> Editar
                          </button>
                          <button
                            onClick={() => handleViewQuotes(client)}
                            className="flex items-center gap-1 cursor-pointer btn btn-primary btn-sm font-bold font-regular-text px-3 py-1 rounded-lg shadow-md"
                          >
                            <EyeIcon className="w-4 h-4" /> Cotizaciones
                          </button>
                          <DeleteButton onConfirm={() => handleDelete(client.id)} className="btn-sm font-bold font-regular-text rounded-lg shadow-md" />
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
                      {filteredClients.length === 0
                        ? "No se encontraron clientes con los filtros actuales."
                        : "Aún no tienes clientes registrados."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginación - mantener igual */}
        {filteredClients.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500 font-regular-text font-semibold">
              Mostrando {indexOfFirstClient + 1} -{" "}
              {Math.min(indexOfLastClient, filteredClients.length)} de{" "}
              {filteredClients.length} clientes
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
                    <span key={pageNumber} className="px-3 py-1 text-gray-400">
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
      </div>

      {/* Modal de edición */}
      {isModalOpen && selectedClient && (
        <EditClientModal
          client={selectedClient}
          onClose={closeModal}
          onSave={handleSave}
          successMessage={editSuccessMessage} // ✅ Pasar mensaje de éxito
        />
      )}

      {/* Modal para agregar cliente */}
      {showAddModal && (
        <AddClientModal
          onClose={closeAddModal}
          onSave={handleAddClient}
        />
      )}

      {/* ✅ Modal para ver cotizaciones del cliente */}
      {showQuotesModal && selectedClientForQuotes && (
        <ClientQuotesModal
          client={selectedClientForQuotes}
          onClose={closeQuotesModal}
        />
      )}
    </div>
  );
}
