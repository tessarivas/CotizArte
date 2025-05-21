import { useMaterials, getTypeIcon } from "@/hooks/useMaterials";
import { SparklesText } from "@/components/magicui/sparkles-text-variant";
import {
  SearchIcon,
  Edit2Icon,
  FilterIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PackageIcon,
  CodesandboxIcon,
  PenToolIcon,
  ScissorsIcon,
  FolderPenIcon,
  TypeIcon,
  ReceiptTextIcon,
  ReceiptIcon
} from "lucide-react";
import AddMaterialModal from "@/components/AddMaterialModal";
import DeleteButton from "@/components/DeleteButton";

export default function Materials() {
  const {
    loading,
    showModal,
    setShowModal,
    selectedType,
    setSelectedType,
    handleAddMaterial,
    handleCloseModal,
    handleDelete,
    handleSave,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    filteredMaterials,
    currentMaterials,
    totalPages,
    indexOfFirstMaterial,
    indexOfLastMaterial,
    paginate,
  } = useMaterials();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Encabezado de la página */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent h-[30vh] flex items-center justify-center relative">
        <div className="mt-22">
          <SparklesText text="Gestión de Materiales" />
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
                placeholder="Buscar material por nombre..."
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
                      filterType === "software"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setFilterType("software")}
                  >
                    Software
                  </a>
                </li>
                <li>
                  <a
                    className={
                      filterType === "digitalTool"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setFilterType("digitalTool")}
                  >
                    Herramientas Digitales
                  </a>
                </li>
                <li>
                  <a
                    className={
                      filterType === "traditionalMaterial"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setFilterType("traditionalMaterial")}
                  >
                    Materiales Tradicionales
                  </a>
                </li>
                <li>
                  <a
                    className={
                      filterType === "traditionalTool"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setFilterType("traditionalTool")}
                  >
                    Herramientas Tradicionales
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

          {/* Botón para agregar nuevo material (lado derecho) */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              className="cursor-pointer border-2 border-white bg-gradient-to-br from-[#f28da9] to-[#f2b78d] font-bold font-regular-text text-white px-4 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center"
            >
              <PlusIcon className="w-6 h-6 mr-2" /> Agregar Material
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-64 p-2 shadow-md mt-2"
            >
              <li>
                <a
                  onClick={() => handleAddMaterial("software")}
                  className="flex items-center gap-2"
                >
                  <CodesandboxIcon className="w-5 h-5 text-blue-500" /> Software
                </a>
              </li>
              <li>
                <a
                  onClick={() => handleAddMaterial("digitalTool")}
                  className="flex items-center gap-2"
                >
                  <PenToolIcon className="w-5 h-5 text-purple-500" />{" "}
                  Herramienta Digital
                </a>
              </li>
              <li>
                <a
                  onClick={() => handleAddMaterial("traditionalMaterial")}
                  className="flex items-center gap-2"
                >
                  <PackageIcon className="w-5 h-5 text-orange-500" /> Material
                  Tradicional
                </a>
              </li>
              <li>
                <a
                  onClick={() => handleAddMaterial("traditionalTool")}
                  className="flex items-center gap-2"
                >
                  <ScissorsIcon className="w-5 h-5 text-green-500" />{" "}
                  Herramienta Tradicional
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Tabla de materiales */}
        <div className="w-full">
          <div className="overflow-x-auto rounded-lg shadow-sm">
            <table className="w-full divide-y divide-gray-200 shadow-lg rounded-lg">
              <thead className="bg-gradient-to-r from-teal-300 via-pink-300 to-orange-300 text-neutral">
                <tr>
                  <th className="px-6 py-3 text-left text-xl font-bold font-title-text uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <TypeIcon className="w-6 h-6" />
                      Tipo
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xl font-bold font-title-text uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FolderPenIcon className="w-6 h-6" />
                      Nombre
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xl font-bold font-title-text uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <ReceiptTextIcon className="w-6 h-6" />
                      Detalles
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xl font-bold font-title-text uppercase tracking-wider">
                    <div className="flex items-center gap-2 justify-center">
                      Acciones
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        <span className="ml-2">Cargando...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentMaterials.length > 0 ? (
                  currentMaterials.map((material) => (
                    <tr
                      key={`${material.type}-${material.id}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(material.type)}
                          <span
                            className={
                              material.type === "Software"
                                ? "text-blue-600"
                                : material.type === "Herramienta Digital"
                                ? "text-purple-600"
                                : material.type === "Material Tradicional"
                                ? "text-orange-600"
                                : "text-green-600"
                            }
                          >
                            {material.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                        {material.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {material.type === "Software" && (
                          <div className="flex flex-col">
                            {material.hasFreeVersion && (
                              <span className="text-green-600 font-semibold">
                                Versión gratuita
                              </span>
                            )}
                            {material.monthlyCost > 0 && (
                              <span>
                                Pago Mensual:{" "}
                                <span className="font-semibold">
                                  ${material.monthlyCost}
                                </span>
                              </span>
                            )}
                            {material.annualCost > 0 && (
                              <span>
                                Pago Anual:{" "}
                                <span className="font-semibold">
                                  ${material.annualCost}
                                </span>
                              </span>
                            )}
                          </div>
                        )}

                        {material.type === "Herramienta Digital" && (
                          <div className="flex flex-col">
                            <span>
                              Costo:{" "}
                              <span className="font-semibold">
                                ${material.averageCost}
                              </span>
                            </span>
                            <span>
                              Vida útil:{" "}
                              <span className="font-semibold">
                                {material.averageLifespan} meses
                              </span>
                            </span>
                          </div>
                        )}

                        {material.type === "Material Tradicional" && (
                          <div className="flex flex-col">
                            <span>
                              Categoría:{" "}
                              <span className="font-semibold">
                                {material.category}
                              </span>
                            </span>
                            {material.subCategory && (
                              <span>
                                Subcategoría:{" "}
                                <span className="font-semibold">
                                  {material.subCategory}
                                </span>
                              </span>
                            )}
                            {material.quality && (
                              <span>
                                Calidad:{" "}
                                <span className="font-semibold">
                                  {material.quality}
                                </span>
                              </span>
                            )}
                            <span>
                              Costo:{" "}
                              <span className="font-semibold">
                                ${material.averageCost} por {material.unit}
                              </span>
                            </span>
                          </div>
                        )}

                        {material.type === "Herramienta Tradicional" && (
                          <div className="flex flex-col">
                            <span>
                              Categoría:{" "}
                              <span className="font-semibold">
                                {material.category}
                              </span>
                            </span>
                            <span>
                              Costo:{" "}
                              <span className="font-semibold">
                                ${material.averageCost}
                              </span>
                            </span>
                            <span>
                              Vida útil:{" "}
                              <span className="font-semibold">
                                {material.averageLifespan} meses
                              </span>
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center gap-2">
                          {/* Botón Editar */}
                          <button
                            onClick={() => handleEdit(quote)}
                            className="flex items-center gap-1 cursor-pointer btn btn-secondary btn-sm font-bold font-regular-text px-3 py-1 rounded-lg shadow-md"
                          >
                            <Edit2Icon className="w-4 h-4" /> Editar
                          </button>
                          <DeleteButton
                            onConfirm={() =>
                              handleDelete(material.id, material.type)
                            }
                            className="btn-sm font-bold font-regular-text rounded-lg shadow-md"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                    >
                      {filteredMaterials.length === 0
                        ? "No se encontraron materiales con los filtros actuales."
                        : "Aún no tienes materiales registrados."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginación */}
        {filteredMaterials.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Información de paginación */}
            <div className="text-sm text-gray-500 font-regular-text font-semibold">
              Mostrando {indexOfFirstMaterial + 1} -{" "}
              {Math.min(indexOfLastMaterial, filteredMaterials.length)} de{" "}
              {filteredMaterials.length} materiales
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

      {/* Modal para agregar material */}
      {showModal && (
        <AddMaterialModal
          selectedType={selectedType}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
