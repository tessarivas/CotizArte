// src/hooks/useProjectForm.js
import { useEffect, useState } from "react";
import api from "@/api/axios";
import { useDigitalIllustration } from "./useDigitalIllustration";
import { useVideoEditing } from "./useVideoEditing";
import { usePainting } from "./usePainting";
import { useDrawing } from "./useDrawing";

export function useProjectForm() {
  // Estados para los campos comunes del proyecto
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    detailLevel: 1,
    hoursWorked: 0,
    isCommercial: false,
    rapidDelivery: false,
    duration: "", // Opcional (por ejemplo, para video)
    size: "",     // Se usará según el tipo de arte
  });

  // Estados para selecciones
  const [selectedArtType, setSelectedArtType] = useState("");
  const [selectedTechnique, setSelectedTechnique] = useState("");
  const [selectedClient, setSelectedClient] = useState("");

  // Estados para listados
  const [artTypes, setArtTypes] = useState([]);
  const [techniques, setTechniques] = useState([]);
  const [clients, setClients] = useState([]);

  // Hooks especializados para cada tipo de arte
  const { digitalIllustrationData, handleDigitalIllustrationChange } =
    useDigitalIllustration();
  const { videoEditingData, handleVideoEditingChange } = useVideoEditing();
  const { paintingData, handlePaintingChange } = usePainting();
  const { drawingData, handleDrawingChange } = useDrawing();

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
    digitalIllustrationData,
    handleDigitalIllustrationChange,
    videoEditingData,
    handleVideoEditingChange,
    paintingData,
    handlePaintingChange,
    drawingData,
    handleDrawingChange,
  };
}