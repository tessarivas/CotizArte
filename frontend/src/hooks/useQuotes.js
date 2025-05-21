// src/hooks/useQuotes.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

export const useQuotes = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Estados para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Estado para modal (si decides implementarlo)
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar cotizaciones
  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Sin token");
        return;
      }
      const response = await api.get("/quotes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuotes(response.data);
    } catch (error) {
      console.error("Error al cargar cotizaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ordenar cotizaciones de más recientes a más viejas
  const sortedQuotes = [...quotes].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const filteredQuotes = sortedQuotes.filter((quote) => {
    const searchLower = searchTerm.toLowerCase();

    // Buscar en: título del proyecto, nombre del cliente (en quote y en project), y estado
    const searchMatch =
      quote.project?.title?.toLowerCase().includes(searchLower) ||
      (quote.project?.client?.name &&
        quote.project?.client?.name.toLowerCase().includes(searchLower)) ||
      (quote.client?.name &&
        quote.client?.name.toLowerCase().includes(searchLower)) ||
      quote.status?.toLowerCase().includes(searchLower);

    // Filtro por estado
    let typeMatch = true;
    if (filterType === "PENDING") {
      typeMatch = quote.status === "Pendiente";
    } else if (filterType === "approved") {
      typeMatch = quote.status === "Aprobada";
    } else if (filterType === "rejected") {
      typeMatch = quote.status === "Rechazada";
    }

    return searchMatch && typeMatch;
  });

  // Calcular paginación
  const indexOfLastQuote = currentPage * rowsPerPage;
  const indexOfFirstQuote = indexOfLastQuote - rowsPerPage;
  const currentQuotes = filteredQuotes.slice(
    indexOfFirstQuote,
    indexOfLastQuote
  );
  const totalPages = Math.ceil(filteredQuotes.length / rowsPerPage);

  // Cambiar página
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Funciones de manejo de cotizaciones
  const handleViewDetails = (quote) => {
    navigate(`/quote/${quote.id}`);
  };

  const handleEdit = (quote) => {
    navigate(`/edit-quote/${quote.id}`);
  };

  // Modificada para manejar la selección del proyecto directamente
  const handleCreateQuote = (projectId) => {
    if (projectId) {
      navigate(`/create-quote/${projectId}`);
    } else {
      // Este caso no debería ocurrir ahora con nuestro nuevo flujo,
      // pero lo dejamos como respaldo por si se llama directamente sin ID
      navigate("/create-quote");
    }
  };

  const handleDelete = async (quoteId) => {
    try {
      const token = localStorage.getItem("access_token");
      await api.delete(`/quotes/${quoteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Actualizar el estado después de eliminar
      setQuotes(quotes.filter((quote) => quote.id !== quoteId));
    } catch (error) {
      console.error("Error al eliminar la cotización:", error);
    }
  };

  const handlePrintQuote = (quote) => {
    // Implementación de impresión
    window.open(`/print-quote/${quote.id}`, "_blank");
  };

  const handleShareQuote = (quote) => {
    // Implementación para compartir cotización
    // Podría abrir un modal con opciones para compartir
    console.log("Compartir cotización:", quote.id);
  };

  // Formatear dinero
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Estado del badge según el status
  const getBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "aprobada":
        return "bg-green-100 text-green-800 border border-green-200";
      case "rechazada":
        return "bg-red-100 text-red-800 border border-red-200";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Para modal si se implementa
  const openModal = (quote) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuote(null);
  };

  return {
    // Estados
    quotes,
    loading,
    selectedQuote,
    isModalOpen,
    currentPage,
    rowsPerPage,
    searchTerm,
    filterType,
    showFilters,

    // Datos calculados para la UI
    filteredQuotes,
    currentQuotes,
    totalPages,
    indexOfFirstQuote,
    indexOfLastQuote,

    // Funciones de actualización de estado
    setRowsPerPage,
    setSearchTerm,
    setFilterType,

    // Funciones de acción
    paginate,
    handleViewDetails,
    handleEdit,
    handleCreateQuote,
    handleDelete,
    handlePrintQuote,
    handleShareQuote,
    openModal,
    closeModal,

    // Funciones de formateo y utilidades
    formatCurrency,
    formatDate,
    getBadgeClass,
  };
};
