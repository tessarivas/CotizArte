// src/hooks/useClients.js
import { useState, useEffect } from "react";
import api from "@/api/axios";

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editSuccessMessage, setEditSuccessMessage] = useState("");

  const [showQuotesModal, setShowQuotesModal] = useState(false);
  const [selectedClientForQuotes, setSelectedClientForQuotes] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  // Función para obtener clientes
  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const response = await api.get("/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ordenar clientes por fecha de creación (más reciente primero)
      const sortedClients = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setClients(sortedClients);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  // Funciones para el modal de edición
  const openModal = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
    setEditSuccessMessage("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
    setEditSuccessMessage("");
  };

  // Función para actualizar cliente
  const handleSave = async (clientId, clientData) => {
    try {
      setEditSuccessMessage("");
      
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No hay token disponible");
      }

      const response = await api.patch(`/clients/${clientId}`, clientData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Actualizar el cliente en el estado
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === clientId ? response.data : client
        )
      );

      setEditSuccessMessage("Cliente actualizado correctamente");
      
      setTimeout(() => {
        closeModal();
      }, 1500);

      return response.data;
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      throw error;
    }
  };

  // Función para eliminar cliente
  const handleDelete = async (clientId) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      await api.delete(`/clients/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClients((prevClients) =>
        prevClients.filter((client) => client.id !== clientId)
      );
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  // Funciones para el modal de agregar
  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const handleAddClient = async (clientData) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No hay token disponible");
      }

      const response = await api.post("/clients", clientData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Agregar el nuevo cliente al principio de la lista
      setClients((prevClients) => [response.data, ...prevClients]);
      
      return response.data;
    } catch (error) {
      console.error("Error al agregar cliente:", error);
      throw error;
    }
  };

  const handleViewQuotes = (client) => {
    setSelectedClientForQuotes(client);
    setShowQuotesModal(true);
  };

  const closeQuotesModal = () => {
    setShowQuotesModal(false);
    setSelectedClientForQuotes(null);
  };

  // Función para cambio de campos (compatibilidad)
  const handleFieldChange = (field, value) => {
    setSelectedClient((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Función para alternar filtros
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Filtrar clientes
  const filteredClients = clients.filter((client) => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.phone && client.phone.includes(searchTerm));

    const matchesFilter = 
      filterType === "all" ? true :
      filterType === "withCompany" ? client.company :
      filterType === "withoutCompany" ? !client.company :
      filterType === "withNotes" ? client.notes :
      true;

    return matchesSearch && matchesFilter;
  });

  // Paginación
  const indexOfLastClient = currentPage * rowsPerPage;
  const indexOfFirstClient = indexOfLastClient - rowsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );
  const totalPages = Math.ceil(filteredClients.length / rowsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return {
    // Estados principales
    clients,
    selectedClient,
    isModalOpen,
    
    // Funciones CRUD
    openModal,
    closeModal,
    handleFieldChange,
    handleSave,
    handleDelete,
    fetchClients,
    
    // Modal de agregar
    showAddModal,
    openAddModal,
    closeAddModal,
    handleAddClient,
    
    // Modal de edición
    editSuccessMessage,
    
    handleViewQuotes,
    showQuotesModal,
    selectedClientForQuotes,
    closeQuotesModal,
    
    // Búsqueda, filtros y paginación
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    showFilters,
    toggleFilters,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    filteredClients,
    currentClients,
    totalPages,
    indexOfFirstClient,
    indexOfLastClient,
    paginate,
  };
};
