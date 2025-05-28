import React, { useState, useEffect } from "react";
import { SearchIcon, ChevronRightIcon } from "lucide-react";
import GradientText from "../blocks/TextAnimations/GradientText/GradientText"; // Importamos el componente de texto con gradiente
import api from "@/api/axios";

const ProjectSelectorModal = ({ isOpen, onClose, onSelectProject }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await api.get("/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ordena los proyectos por fecha descendente antes de filtrar
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const filteredProjects = sortedProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.client?.name &&
        project.client.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50 font-regular-text">
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-7 w-[500px] max-h-[80vh] flex flex-col">
        {/* Título */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <GradientText className="text-5xl font-logo-text mb-2">
            Seleccionar Proyecto
          </GradientText>
        </div>

        {/* Búsqueda */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre de proyecto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered input-primary w-full pl-10"
          />
          <SearchIcon className="w-5 h-5 text-primary absolute left-4 top-1/2 transform -translate-y-1/2" />
        </div>

        {/* Lista de proyectos */}
        <div className="flex-1 overflow-auto mb-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-error"></div>
            </div>
          ) : filteredProjects.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <li
                  key={project.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer rounded-lg"
                  onClick={() => onSelectProject(project)}
                >
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      {project.artType?.name && (
                        <p className="text-sm text-orange-300 font-bold mt-1">
                          Tipo de Arte: {project.artType?.name}
                        </p>
                      )}
                    </div>
                    <ChevronRightIcon className="w-6 h-6 text-primary" />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <p>No se encontraron proyectos.</p>
              <p className="text-sm mt-2">
                {searchTerm
                  ? "Intenta con otra búsqueda."
                  : "Crea un proyecto primero."}
              </p>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 mt-3">
          <button onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSelectorModal;
