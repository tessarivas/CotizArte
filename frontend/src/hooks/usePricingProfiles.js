import { useState, useEffect } from "react";
import api from "@/api/axios";

export const usePricingProfiles = () => {
  // Estados principales
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Estados del formulario
  const [formData, setFormData] = useState({
    artTypeId: "",
    standardHourlyRate: "",
    projectsPerMonth: "",
    defaultCommercialLicensePercentage: "",
    defaultUrgencyPercentage: "",
    modificationExtra: "",
  });

  // Estados de mensajes
  const [errorMessages, setErrorMessages] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ Agregar estado para isNew
  const [isNew, setIsNew] = useState(false);

  // Cargar perfiles al montar el hook
  useEffect(() => {
    fetchProfiles();
  }, []);

  // ✅ Función para obtener todos los perfiles
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No hay token");

      const response = await api.get("/pricing-profiles", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Ordenar por fecha de creación (más nuevo primero)
      const sortedProfiles = response.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setProfiles(sortedProfiles);
    } catch (error) {
      console.error("Error al cargar los perfiles de precio:", error);
      setErrorMessages({ general: "Error al cargar los perfiles" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Función para crear o actualizar un perfil
  const saveProfile = async () => {
    try {
      // Reset mensajes
      setErrorMessages({});
      setSuccessMessage("");

      // Validaciones
      const errors = validateFormData(formData);
      if (Object.keys(errors).length > 0) {
        setErrorMessages(errors);
        return false;
      }

      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No hay token");

      const payload = {
        artTypeId: Number(formData.artTypeId),
        standardHourlyRate: Number(formData.standardHourlyRate),
        preferredHourlyRate: Number(formData.standardHourlyRate), // Mismo valor
        projectsPerMonth: Number(formData.projectsPerMonth),
        defaultCommercialLicensePercentage: Number(
          formData.defaultCommercialLicensePercentage
        ),
        defaultUrgencyPercentage: Number(formData.defaultUrgencyPercentage),
        modificationExtra: Number(formData.modificationExtra),
      };

      if (selectedProfile) {
        // Actualizar perfil existente
        await api.patch(`/pricing-profiles/${selectedProfile.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccessMessage("Perfil actualizado correctamente");
      } else {
        // Crear nuevo perfil
        await api.post("/pricing-profiles", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccessMessage("Perfil creado correctamente");
      }

      // Actualizar la lista inmediatamente
      await fetchProfiles();

      // Cerrar modal después de 1.5 segundos
      setTimeout(() => {
        closeModal();
      }, 1500);

      return true;
    } catch (error) {
      console.error("Error al guardar el perfil de precios:", error);

      if (error.response?.data?.message) {
        setErrorMessages({ general: error.response.data.message });
      } else if (error.response?.status === 400) {
        setErrorMessages({
          general: "Datos inválidos. Verifica todos los campos.",
        });
      } else {
        setErrorMessages({ general: "Error de conexión. Inténtalo de nuevo." });
      }
      return false;
    }
  };

  // ✅ Función para eliminar un perfil
  const deleteProfile = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No hay token");

      await api.delete(`/pricing-profiles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Actualizar la lista después de eliminar
      await fetchProfiles();
      return true;
    } catch (error) {
      console.error("Error al eliminar el perfil:", error);
      setErrorMessages({ general: "Error al eliminar el perfil" });
      return false;
    }
  };

  // ✅ Función para validar los datos del formulario
  const validateFormData = (data) => {
    const errors = {};

    if (!data.artTypeId) {
      errors.artTypeId = "Debes seleccionar un tipo de arte";
    }
    if (!data.standardHourlyRate || data.standardHourlyRate <= 0) {
      errors.standardHourlyRate = "La tarifa estándar debe ser mayor a 0";
    }
    if (!data.projectsPerMonth || data.projectsPerMonth <= 0) {
      errors.projectsPerMonth = "Los proyectos por mes deben ser mayor a 0";
    }
    if (data.modificationExtra === "" || data.modificationExtra < 0) {
      errors.modificationExtra =
        "El extra por modificación no puede ser negativo";
    }
    if (
      !data.defaultCommercialLicensePercentage ||
      data.defaultCommercialLicensePercentage < 0 ||
      data.defaultCommercialLicensePercentage > 100
    ) {
      errors.defaultCommercialLicensePercentage =
        "El porcentaje debe estar entre 0 y 100";
    }
    if (
      !data.defaultUrgencyPercentage ||
      data.defaultUrgencyPercentage < 0 ||
      data.defaultUrgencyPercentage > 100
    ) {
      errors.defaultUrgencyPercentage =
        "El porcentaje debe estar entre 0 y 100";
    }

    return errors;
  };

  // ✅ Función para manejar cambios en los campos del formulario
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ Función para abrir modal para editar
  const openEditModal = (profile) => {
    setSelectedProfile(profile);
    setIsNew(false); // ✅ Es edición, no nuevo
    setFormData({
      artTypeId: profile.artTypeId,
      standardHourlyRate: profile.standardHourlyRate,
      projectsPerMonth: profile.projectsPerMonth,
      defaultCommercialLicensePercentage:
        profile.defaultCommercialLicensePercentage,
      defaultUrgencyPercentage: profile.defaultUrgencyPercentage,
      modificationExtra: profile.modificationExtra,
    });
    setErrorMessages({});
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  // ✅ Función para abrir modal para crear nuevo
  const openNewModal = () => {
    setSelectedProfile(null);
    setIsNew(true); // ✅ Es nuevo perfil
    setFormData({
      artTypeId: "",
      standardHourlyRate: "",
      projectsPerMonth: "",
      defaultCommercialLicensePercentage: "",
      defaultUrgencyPercentage: "",
      modificationExtra: "",
    });
    setErrorMessages({});
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  // ✅ Función para cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
    setIsNew(false); // ✅ Reset isNew
    setErrorMessages({});
    setSuccessMessage("");
    setFormData({
      artTypeId: "",
      standardHourlyRate: "",
      projectsPerMonth: "",
      defaultCommercialLicensePercentage: "",
      defaultUrgencyPercentage: "",
      modificationExtra: "",
    });
  };

  // Retornar todos los estados y funciones
  return {
    // Estados
    profiles,
    loading,
    isModalOpen,
    selectedProfile,
    formData,
    errorMessages,
    successMessage,
    isNew, // ✅ Exportar isNew

    // Funciones de API
    fetchProfiles,
    saveProfile,
    deleteProfile,

    // Funciones de UI
    handleFieldChange,
    openEditModal,
    openNewModal,
    closeModal,
  };
};
