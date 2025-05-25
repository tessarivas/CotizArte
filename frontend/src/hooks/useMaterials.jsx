import { useState, useEffect } from "react";
import api from "@/api/axios";
import {
  CodesandboxIcon,
  PenToolIcon,
  PackageIcon,
  ScissorsIcon,
} from "lucide-react";

export function useMaterials() {
  // Estados para cada categoría
  const [software, setSoftware] = useState([]);
  const [digitalTools, setDigitalTools] = useState([]);
  const [traditionalMaterials, setTraditionalMaterials] = useState([]);
  const [traditionalTools, setTraditionalTools] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal y formulario
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState(""); // "software", "digitalTool", etc.

  // Estados para búsqueda, filtrado y paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Cargar todos los materiales
  useEffect(() => {
    fetchAllMaterials();
    // eslint-disable-next-line
  }, []);

  const fetchAllMaterials = async () => {
    setLoading(true);
    const token = localStorage.getItem("access_token");
    try {
      const [
        softwareRes,
        digitalToolsRes,
        traditionalMaterialsRes,
        traditionalToolsRes,
      ] = await Promise.all([
        api.get("/software", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/digital-tools", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/traditional-materials", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/traditional-tools", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setSoftware(softwareRes.data);
      setDigitalTools(digitalToolsRes.data);
      setTraditionalMaterials(traditionalMaterialsRes.data);
      setTraditionalTools(traditionalToolsRes.data);
    } catch (err) {
      console.error("Error fetching materials", err);
    }
    setLoading(false);
  };

  // Modal handlers
  const handleAddMaterial = (type = "") => {
    setSelectedType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedType("");
  };

  // Eliminar material
  const handleDelete = async (id, type) => {
    const token = localStorage.getItem("access_token");
    let url = "";
    switch (type) {
      case "Software":
        url = `/software/${id}`;
        break;
      case "Herramienta Digital":
        url = `/digital-tools/${id}`;
        break;
      case "Material Tradicional":
        url = `/traditional-materials/${id}`;
        break;
      case "Herramienta Tradicional":
        url = `/traditional-tools/${id}`;
        break;
      default:
        return;
    }
    try {
      await api.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAllMaterials();
    } catch (err) {
      console.error("Error deleting material", err);
    }
  };

  // Guardar material
  const handleSave = async (formData, materialType) => {
    const token = localStorage.getItem("access_token");
    let payload = {};
    let url = "";

    switch (materialType) {
      case "software":
        url = "/software";
        payload = {
          name: formData.name,
          monthlyCost:
            formData.version === "monthly" ? Number(formData.monthlyCost) : 0,
          annualCost:
            formData.version === "annual" ? Number(formData.annualCost) : 0,
          hasFreeVersion: formData.version === "free" ? true : false,
        };
        break;
      case "digitalTool":
        url = "/digital-tools";
        payload = {
          name: formData.name,
          averageCost: Number(formData.averageCost),
          averageLifespan: Number(formData.averageLifespan),
        };
        break;
      // En el switch case de traditionalMaterial dentro de handleSave
      case "traditionalMaterial":
        url = "/traditional-materials";
        payload = {
          name: formData.name,
          category: formData.category,
          subCategory: formData.subCategory,
          quality: formData.quality,
          averageCost: Number(formData.averageCost),
          unit: formData.unit,
          containerSize:
            formData.unit === "ml" ? Number(formData.containerSize) : null,
        };
        break;
      case "traditionalTool":
        url = "/traditional-tools";
        payload = {
          name: formData.name,
          category: formData.category,
          averageCost: Number(formData.averageCost),
          averageLifespan: Number(formData.averageLifespan),
        };
        break;
      default:
        return;
    }

    try {
      await api.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAllMaterials();
      handleCloseModal();
    } catch (err) {
      const msg = err.response?.data?.message || "Error creando material";
      alert(msg);
      console.error("Error creating material", err);
    }
  };

  // Agrega todos los ítems en un solo array con su tipo
  // NO agregues icon: <CodesandboxIcon ... /> aquí
  const aggregatedMaterials = [
    ...software.map((item) => ({
      type: "Software",
      ...item,
    })),
    ...digitalTools.map((item) => ({
      type: "Herramienta Digital",
      ...item,
    })),
    ...traditionalMaterials.map((item) => ({
      type: "Material Tradicional",
      ...item,
    })),
    ...traditionalTools.map((item) => ({
      type: "Herramienta Tradicional",
      ...item,
    })),
  ];

  // Búsqueda y filtro
  const filteredMaterials = aggregatedMaterials.filter((material) => {
    const matchesSearch = material.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all"
        ? true
        : filterType === "software"
        ? material.type === "Software"
        : filterType === "digitalTool"
        ? material.type === "Herramienta Digital"
        : filterType === "traditionalMaterial"
        ? material.type === "Material Tradicional"
        : filterType === "traditionalTool"
        ? material.type === "Herramienta Tradicional"
        : true;

    return matchesSearch && matchesFilter;
  });

  // Paginación
  const indexOfLastMaterial = currentPage * rowsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - rowsPerPage;
  const currentMaterials = filteredMaterials.slice(
    indexOfFirstMaterial,
    indexOfLastMaterial
  );
  const totalPages = Math.ceil(filteredMaterials.length / rowsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return {
    // Estados y handlers principales
    loading,
    showModal,
    setShowModal,
    selectedType,
    setSelectedType,
    handleAddMaterial,
    handleCloseModal,
    handleDelete,
    handleSave,

    // Búsqueda, filtro y paginación
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
  };
}

export function getTypeIcon(type) {
  switch (type) {
    case "Software":
      return <CodesandboxIcon className="w-5 h-5 text-blue-500" />;
    case "Herramienta Digital":
      return <PenToolIcon className="w-5 h-5 text-purple-500" />;
    case "Material Tradicional":
      return <PackageIcon className="w-5 h-5 text-orange-500" />;
    case "Herramienta Tradicional":
      return <ScissorsIcon className="w-5 h-5 text-green-500" />;
    default:
      return null;
  }
}
