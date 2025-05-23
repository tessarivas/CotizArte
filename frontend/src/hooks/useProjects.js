import { useState, useEffect } from "react";
import api from "@/api/axios";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination and filtering states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [searchTerm, setSearchTerm] = useState("");
  const [artTypeFilter, setArtTypeFilter] = useState("all");

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return console.error("No hay token disponible.");
      const response = await api.get("/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
    } catch (error) {
      console.error("Error al obtener proyectos:", error);
    }
  };

  // Modal handlers
  const openModal = (project) => {
    setSelectedProject({ ...project });
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  const handleFieldChange = (field, value) => {
    setSelectedProject((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return console.error("No hay token disponible.");
      await api.put(`/projects/${selectedProject.id}`, selectedProject, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProjects();
      closeModal();
    } catch (error) {
      console.error("Error al guardar el proyecto:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    if (window.confirm("¿Estás seguro de que deseas eliminar este proyecto?")) {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return console.error("No hay token disponible.");
        await api.delete(`/projects/${selectedProject.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProjects();
        closeModal();
      } catch (error) {
        console.error("Error al eliminar el proyecto:", error);
      }
    }
  };

  // Ordena los proyectos de más recientes a más viejos
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Filtering logic (solo búsqueda y tipo de arte)
  const filteredProjects = sortedProjects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (artTypeFilter === "all") return matchesSearch;
    return matchesSearch && project.artType.name === artTypeFilter;
  });

  // Pagination logic
  const indexOfLastProject = currentPage * rowsPerPage;
  const indexOfFirstProject = indexOfLastProject - rowsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );
  const totalPages = Math.ceil(filteredProjects.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return {
    projects,
    filteredProjects,
    currentProjects,
    totalPages,
    currentPage,
    rowsPerPage,
    setRowsPerPage,
    searchTerm,
    setSearchTerm,
    artTypeFilter,
    setArtTypeFilter,
    paginate,
    selectedProject,
    isModalOpen,
    openModal,
    closeModal,
    handleFieldChange,
    handleSave,
    handleDelete,
  };
}
