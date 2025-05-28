// src/hooks/useQuotes.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateQuotePDF } from '@/services/pdfService';

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

  // ✅ AGREGAR ESTADO PARA PRICING PROFILE
  const [pricingProfile, setPricingProfile] = useState(null);

  // ✅ AGREGAR ESTADOS PARA EL MODAL DE COMPARTIR
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedQuoteForShare, setSelectedQuoteForShare] = useState(null);

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

  // ✅ CARGAR PRICING PROFILE
  useEffect(() => {
    fetchPricingProfile();
  }, []);

  const fetchPricingProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await api.get("/pricing-profiles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        setPricingProfile(response.data[0]);
      }
    } catch (error) {
      console.error("Error al cargar pricing profile:", error);
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

    // ✅ CORREGIR: Filtro por estado usando los valores reales de la BD
    let typeMatch = true;
    if (filterType === "pending") {
      typeMatch = quote.status === "PENDING";
    } else if (filterType === "approved") {
      typeMatch = quote.status === "APPROVED";
    } else if (filterType === "rejected") {
      typeMatch = quote.status === "REJECTED";
    }
    // Si filterType === "all", typeMatch permanece true

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
      // Usar la actualización funcional para que React tenga el estado actual
      setQuotes((prevQuotes) => prevQuotes.filter((q) => q.id !== quoteId));
    } catch (error) {
      console.error("Error al eliminar la cotización:", error);
    }
  };

  const handleSaveQuote = async (quoteId, updateData) => {
    // Filtrar valores undefined
    const sanitizedData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    // Extraer forceRecalculate (u otros campos extra) si no se quieren enviar
    const { forceRecalculate, ...dataToSend } = sanitizedData;

    try {
      const token = localStorage.getItem("access_token");
      console.log("Datos enviados al backend:", updateData);
      console.log("Datos limpiados antes de enviar:", dataToSend);

      const response = await api.put(`/quotes/${quoteId}`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Respuesta de actualización:", response.data);

      // Actualiza el estado local reemplazando la cotización editada
      setQuotes((prevQuotes) =>
        prevQuotes.map((q) => (q.id === response.data.id ? response.data : q))
      );

      return response.data;
    } catch (error) {
      console.error("Error al actualizar:", error.response?.data || error);
    }
  };

  const handleDeleteQuote = async (quoteId) => {
    try {
      const token = localStorage.getItem("access_token");
      await api.delete(`/quotes/${quoteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update local state to remove the deleted quote
      setQuotes((prevQuotes) => prevQuotes.filter((q) => q.id !== quoteId));
    } catch (error) {
      console.error("Error al eliminar:", error);
      throw error;
    }
  };

  // ✅ CAMBIAR handlePrintQuote por handleShareQuote
  const handleShareQuote = (quote) => {
    setSelectedQuoteForShare(quote);
    setShowShareModal(true);
  };

  // ✅ FUNCIÓN PARA CERRAR MODAL
  const closeShareModal = () => {
    setShowShareModal(false);
    setSelectedQuoteForShare(null);
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

  // Para modal si se implementa
  const openModal = (quote) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuote(null);
  };

  // MANTENER handlePrintQuote SEPARADO (por si lo necesitas)
  const handlePrintQuote = async (quote) => {
    try {
      console.log('Generando PDF para:', quote);
      const pdf = generateQuotePDF(quote, pricingProfile);
      pdf.download(`Cotización_${quote.project?.title || quote.id}_${new Date().getFullYear()}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Verifica la consola para más detalles.');
    }
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
    handleDeleteQuote,
    handleSaveQuote,
    handlePrintQuote,
    handleShareQuote,
    openModal,
    closeModal,

    // Funciones de formateo y utilidades
    formatCurrency,
    formatDate,

    // NUEVOS ESTADOS Y FUNCIONES PARA EL MODAL DE COMPARTIR
    showShareModal,
    selectedQuoteForShare,
    pricingProfile,
    closeShareModal,
  };
};
