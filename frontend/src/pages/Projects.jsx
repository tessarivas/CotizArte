import api from "@/api/axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import { SparklesText } from "@/components/magicui/sparkles-text-variant";
import {
  SquarePenIcon,
  FileTextIcon,
  PaletteIcon,
  CircleGaugeIcon,
  ClockIcon,
  TagIcon,
  EyeIcon,
  SearchIcon,
  FilterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import EditProjectModal from "@/components/EditProjectModal";

export default function Projects() {
  const {
    currentProjects,
    filteredProjects,
    totalPages,
    currentPage,
    rowsPerPage,
    setRowsPerPage,
    searchTerm,
    setSearchTerm,
    artTypeFilter, // ✅ Agregar este estado
    setArtTypeFilter, // ✅ Agregar esta función
    paginate,
    selectedProject,
    isModalOpen,
    openModal,
    closeModal,
    handleFieldChange,
    handleSave,
    handleDelete,
  } = useProjects();

  const navigate = useNavigate();

  // Pagination logic
  const indexOfLastProject = currentPage * rowsPerPage;
  const indexOfFirstProject = indexOfLastProject - rowsPerPage;

  return (
    <div className="flex flex-col min-h-screen font-regular-text">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent h-[30vh] flex items-center justify-center relative">
        <div className="mt-22">
          <SparklesText text="Mis Proyectos" />
        </div>
      </div>

      {/* Main Container */}
      <div className="w-[80vw] mx-auto p-8 flex-1 overflow-visible">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-120">
              <input
                type="text"
                placeholder="Buscar proyecto por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-secondary pl-10 pr-4 py-2 w-full rounded-lg bg-white text-lg text-gray-700"
              />
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* ✅ Dropdown de filtros por tipo de arte */}
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
                      artTypeFilter === "all"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setArtTypeFilter("all")}
                  >
                    Todos los tipos
                  </a>
                </li>
                <li>
                  <a
                    className={
                      artTypeFilter === "1"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setArtTypeFilter("1")}
                  >
                    Ilustración Digital
                  </a>
                </li>
                <li>
                  <a
                    className={
                      artTypeFilter === "2"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setArtTypeFilter("2")}
                  >
                    Edición de Video
                  </a>
                </li>
                <li>
                  <a
                    className={
                      artTypeFilter === "3"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setArtTypeFilter("3")}
                  >
                    Pintura
                  </a>
                </li>
                <li>
                  <a
                    className={
                      artTypeFilter === "4"
                        ? "active bg-pink-500 text-white"
                        : ""
                    }
                    onClick={() => setArtTypeFilter("4")}
                  >
                    Dibujo
                  </a>
                </li>
              </ul>
            </div>

            {/* Rows per Page Selector */}
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

          {/* Add Project Button */}
          <button
            onClick={() => navigate("/create-project")}
            className="cursor-pointer border-2 border-white bg-gradient-to-br from-[#f28da9] to-[#f2b78d] font-bold font-regular-text text-white px-4 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center"
          >
            <SquarePenIcon className="w-6 h-6 mr-2" /> Nuevo Proyecto
          </button>
        </div>

        {/* ✅ Indicador de filtro activo (opcional) */}
        {artTypeFilter !== "all" && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Filtrando por:</span>
            <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
              {artTypeFilter === "1" && "Ilustración Digital"}
              {artTypeFilter === "2" && "Edición de Video"}
              {artTypeFilter === "3" && "Pintura"}
              {artTypeFilter === "4" && "Dibujo"}
            </span>
            <button
              onClick={() => setArtTypeFilter("all")}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Limpiar filtro
            </button>
          </div>
        )}

        {/* Projects Grid - resto del código igual */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentProjects.length > 0 ? (
            currentProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 flex flex-col"
              >
                {/* Project Header */}
                <div className="bg-gradient-to-r from-secondary to-accent p-4 font-regular-text">
                  <h3 className="text-xl font-bold text-neutral truncate">
                    {project.title}
                  </h3>
                </div>

                {/* Project Body */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="space-y-3 flex-grow">
                    {/* Art Type */}
                    <div className="flex items-center gap-2">
                      <PaletteIcon className="w-5 h-5 text-pink-500" />
                      <span className="text-sm font-semibold">
                        Tipo de Arte: {project.artType.name}
                      </span>
                    </div>

                    {/* Detail Level */}
                    <div className="flex items-center gap-2">
                      <CircleGaugeIcon className="w-5 h-5 text-purple-500" />
                      <span className="text-sm">
                        Nivel de Detalle: {project.detailLevel}
                      </span>
                    </div>

                    {/* Hours Worked */}
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-5 h-5 text-green-500" />
                      <span className="text-sm">
                        Horas Trabajadas: {project.hoursWorked}
                      </span>
                    </div>
                  </div>

                  {/* Project Actions */}
                  <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => openModal(project)}
                      className="btn btn-accent btn-sm flex rounded-lg text-sm font-regular-text items-center gap-2"
                    >
                      <EyeIcon className="w-4 h-4" /> Detalles
                    </button>
                    <button
                      onClick={() => navigate(`/create-quote/${project.id}`)}
                      className="btn btn-primary btn-sm flex rounded-lg text-sm font-regular-text items-center gap-2"
                    >
                      <FileTextIcon className="w-4 h-4" /> Crear cotización
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">
                {filteredProjects.length === 0
                  ? "No se encontraron proyectos con los filtros actuales."
                  : "Aún no tienes proyectos creados."}
              </p>
            </div>
          )}
        </div>

        {/* Pagination - resto igual */}
        {filteredProjects.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Pagination Info */}
            <div className="text-sm text-gray-500 font-regular-text font-semibold">
              Mostrando {indexOfFirstProject + 1} -{" "}
              {Math.min(indexOfLastProject, filteredProjects.length)} de{" "}
              {filteredProjects.length} proyectos
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-1 py-1 rounded-md text-sm font-medium transition cursor-pointer ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>

              {/* Page Numbers */}
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
                      className={`px-3 py-1 rounded-md text-sm font-medium transition cursor-pointer ${
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
                      className="px-3 py-1 text-gray-400 cursor-pointer"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}

              {/* Next Button */}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-1 py-1 rounded-md text-sm font-medium transition cursor-pointer ${
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

      {/* Edit Project Modal */}
      {isModalOpen && selectedProject && (
        <EditProjectModal
          project={selectedProject}
          onFieldChange={handleFieldChange}
          onClose={closeModal}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
