import { useEffect, useState } from "react";
import api from "@/api/axios";

export function useProjectForm() {
  // Estados para los campos comunes del proyecto
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    detailLevel: 1,
    hoursWorked: 0,
    isCommercial: false,
    rapidDelivery: false,
    duration: "",
    size: "",
  });

  // Estados para selecciones
  const [selectedArtType, setSelectedArtType] = useState("");
  const [selectedTechnique, setSelectedTechnique] = useState("");
  const [selectedClient, setSelectedClient] = useState("");

  // Estados para listados
  const [artTypes, setArtTypes] = useState([]);
  const [techniques, setTechniques] = useState([]);
  const [clients, setClients] = useState([]);

  // Cargar artTypes y clientes al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return console.error("No hay token disponible.");
        const [artTypesResponse, clientsResponse] = await Promise.all([
          api.get("/art-types", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/clients", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setArtTypes(artTypesResponse.data);
        setClients(clientsResponse.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    fetchData();
  }, []);

  // Cargar técnicas al seleccionar un tipo de arte
  useEffect(() => {
    if (selectedArtType) {
      const fetchTechniques = async () => {
        try {
          const response = await api.get(`/art-techniques/by-art-type/${selectedArtType}`);
          setTechniques(response.data);
        } catch (error) {
          console.error("Error al obtener técnicas:", error);
        }
      };
      fetchTechniques();
    }
  }, [selectedArtType]);

  // Handler para los campos comunes
  const handleCommonChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  // Validación solo de los campos generales
  const validateProjectData = (data) => {
    if (!data.title.trim()) return "El título es obligatorio.";
    if (!data.description.trim()) return "La descripción es obligatoria.";
    if (isNaN(data.detailLevel) || data.detailLevel < 1 || data.detailLevel > 5) {
      return "El nivel de detalle debe ser un número entre 1 y 5.";
    }
    if (isNaN(data.hoursWorked) || data.hoursWorked <= 0) {
      return "Las horas trabajadas deben ser un número positivo.";
    }
    return null;
  };

  // Solo envía los datos generales, tipo de arte, técnica y cliente
  const formatDataToSend = () => {
    return {
      ...formData,
      artTypeId: selectedArtType ? parseInt(selectedArtType) : null,
      artTechniqueId: selectedTechnique ? parseInt(selectedTechnique) : null,
      clientId: selectedClient ? parseInt(selectedClient) : null,
      detailLevel: parseInt(formData.detailLevel),
      hoursWorked: parseFloat(formData.hoursWorked),
      size: formData.size ? parseInt(formData.size) : null,
      duration: formData.duration ? parseInt(formData.duration) : null,
    };
  };

  return {
    formData,
    setFormData,
    selectedArtType,
    setSelectedArtType,
    selectedTechnique,
    setSelectedTechnique,
    selectedClient,
    setSelectedClient,
    artTypes,
    techniques,
    clients,
    handleCommonChange,
    validateProjectData,
    formatDataToSend,
  };
}