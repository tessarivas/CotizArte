import { useState, useEffect } from "react";
import api from "@/api/axios";

export function useQuoteForm() {
  // Estado general de la cotización (ej. descuento y notas)
  const [quoteData, setQuoteData] = useState({
    discountPercentage: 0,
    notes: "",
  });
  // Estado para datos específicos (según el tipo de arte)
  const [specializedData, setSpecializedData] = useState({});
  
  // Por ejemplo, si la cotización se genera basada en un proyecto, puedes tener:
  const [selectedProject, setSelectedProject] = useState("");
  const [projectOptions, setProjectOptions] = useState([]);
  // Supongamos que el proyecto seleccionado determina el tipo de arte
  const [selectedArtType, setSelectedArtType] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;
        const response = await api.get("/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjectOptions(response.data);
      } catch (error) {
        console.error("Error al cargar proyectos:", error);
      }
    };
    fetchProjects();
  }, []);

  // Si un proyecto es seleccionado, podrías extraer su artType y configurar valores predeterminados en specializedData
  useEffect(() => {
    if (selectedProject) {
      // Supón que cada proyecto trae un artType que indica 1,2,3 o 4.
      const project = projectOptions.find((p) => p.id === parseInt(selectedProject));
      if (project) {
        setSelectedArtType(project.artType.id.toString());
        // También podrías inicializar specializedData con valores por defecto según el tipo:
        setSpecializedData({});
      }
    }
  }, [selectedProject, projectOptions]);

  const handleQuoteFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuoteData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return {
    quoteData,
    setQuoteData,
    specializedData,
    setSpecializedData,
    selectedProject,
    setSelectedProject,
    projectOptions,
    selectedArtType, // Determinado por el proyecto seleccionado
    setSelectedArtType,
    handleQuoteFieldChange,
  };
}
