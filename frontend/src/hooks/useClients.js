// src/hooks/useClients.js
import { useState, useEffect } from "react";
import api from "@/api/axios";

export const useClients = () => {
  // Estado original
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para paginación, búsqueda y filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Función para obtener la lista de clientes
  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No hay token disponible.");
        return;
      }
      const response = await api.get("/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(response.data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  // Se llama una vez al montar el componente
  useEffect(() => {
    fetchClients();
  }, []);

  // Reset de página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, rowsPerPage]);

  // Función para filtrar clientes
  const getFilteredClients = () => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.notes?.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterType === "all") return matchesSearch;
      if (filterType === "withCompany")
        return matchesSearch && client.company && client.company.trim() !== "";
      if (filterType === "withoutCompany")
        return (
          matchesSearch && (!client.company || client.company.trim() === "")
        );
      if (filterType === "withNotes")
        return matchesSearch && client.notes && client.notes.trim() !== "";

      return matchesSearch;
    });
  };

  // Obtener los clientes filtrados
  const filteredClients = getFilteredClients();

  // Obtener los clientes para la página actual
  const getCurrentPageClients = () => {
    const indexOfLastClient = currentPage * rowsPerPage;
    const indexOfFirstClient = indexOfLastClient - rowsPerPage;
    return filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  };

  // Calcular los clientes de la página actual y el total de páginas
  const currentClients = getCurrentPageClients();
  const totalPages = Math.ceil(filteredClients.length / rowsPerPage);

  // Cálculos para la información de paginación
  const indexOfLastClient = currentPage * rowsPerPage;
  const indexOfFirstClient = indexOfLastClient - rowsPerPage;

  // Función para abrir el modal de edición y asignar el cliente seleccionado
  const openModal = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal y limpiar el cliente seleccionado
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  // Actualizar un campo del cliente seleccionado
  const handleFieldChange = (field, value) => {
    setSelectedClient((prev) => ({ ...prev, [field]: value }));
  };

  // Guardar los cambios en el cliente (petición PUT)
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No hay token disponible.");
        return;
      }
      await api.patch(`/clients/${selectedClient.id}`, selectedClient, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Cliente actualizado:", selectedClient);
      setClients((prevClients) =>
        prevClients.map((c) =>
          c.id === selectedClient.id ? selectedClient : c
        )
      );
      closeModal();
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
    }
  };

  // Eliminar un cliente usando directamente el clientId
  const handleDelete = async (clientId) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No hay token disponible.");
        return;
      }

      await api.delete(`/clients/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClients((prevClients) => prevClients.filter((c) => c.id !== clientId));
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  // Función para ver cotizaciones (placeholder)
  const handleViewQuotes = (client) => {
    // Implementar redirección o lógica para ver cotizaciones
    console.log("Ver cotizaciones para:", client);
    // Por ejemplo: navigate(`/quotes/${client.id}`);
  };

  // Función para cambiar de página
  const paginate = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > totalPages) pageNumber = totalPages;
    setCurrentPage(pageNumber);
  };

  // Función para alternar la visibilidad de los filtros
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return {
    // Datos y estado original
    clients,
    selectedClient,
    isModalOpen,

    // Funciones CRUD originales
    openModal,
    closeModal,
    handleFieldChange,
    handleSave,
    handleDelete,
    fetchClients,
    handleViewQuotes,

    // Estado y funciones para paginación
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    paginate,
    totalPages,
    currentClients,
    filteredClients,
    indexOfFirstClient,
    indexOfLastClient,

    // Estado y funciones para búsqueda y filtros
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    showFilters,
    toggleFilters,
  };
};
