import api from "@/api/axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectForm } from "@/hooks/useProjectForm";
import { SparklesText } from "@/components/magicui/sparkles-text-variant";
import {
  SquarePenIcon,
  PaletteIcon,
  FileTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
} from "lucide-react";

// Importar componentes específicos para cada tipo de arte
import { CommonProjectFields } from "@/components/Projects/CommonProjectFields";
import { ProjectSelectors } from "@/components/Projects/ProjectSelectors";

export default function CreateProject() {
  const navigate = useNavigate();

  // Extraer estados y handlers desde el hook global
  const {
    formData,
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
  } = useProjectForm();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) {
      setErrorMessage("Debes iniciar sesión.");
      return;
    }

    setIsSubmitting(true);

    const dataToSend = formatDataToSend();
    const validationError = validateProjectData(dataToSend);

    if (validationError) {
      setErrorMessage(validationError);
      setIsSubmitting(false);
      // Auto-scroll al mensaje de error
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      console.log("Datos a enviar:", dataToSend);
      const response = await api.post("/projects", dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("¡Proyecto creado exitosamente!");
      setErrorMessage("");
      console.log("Proyecto creado:", response.data);

      // Redirigir después de un breve delay para que el usuario vea el mensaje de éxito
      setTimeout(() => {
        navigate("/projects");
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error al crear el proyecto."
      );
      // Auto-scroll al mensaje de error
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtiene el nombre del tipo de arte actual para mostrarlo en el encabezado
  const getCurrentArtTypeName = () => {
    if (!selectedArtType) return "Nuevo Proyecto";

    const artTypeMap = {
      1: "Ilustración Digital",
      2: "Edición de Video",
      3: "Pintura",
      4: "Dibujo",
    };

    return artTypeMap[selectedArtType] || "Nuevo Proyecto";
  };

  const artTypeColors = {
    1: {
      bg: "from-purple-200 to-violet-300",
      text: "text-violet-500",
      icon: "text-violet-500",
    },
    2: {
      bg: "from-sky-100 to-blue-300",
      text: "text-blue-500",
      icon: "text-blue-500",
    },
    3: {
      bg: "from-pink-100 to-pink-300",
      text: "text-pink-500",
      icon: "text-pink-500",
    },
    4: {
      bg: "from-teal-100 to-teal-300",
      text: "text-teal-500",
      icon: "text-teal-500",
    },
    default: {
      bg: "from-orange-100 to-orange-200",
      text: "text-orange-500",
    },
  };

  const currentColors = artTypeColors[selectedArtType] || artTypeColors.default;

  return (
    <div className="flex flex-col min-h-screen font-regular-text">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent h-[30vh] flex items-center justify-center relative">
        <div className="mt-22">
          <SparklesText text="Crear Nuevo Proyecto" />
        </div>
      </div>

      {/* Main Container */}
      <div className="w-[60vw] mx-auto p-8 mt-10 bg-white rounded-xl shadow-xl z-10 mb-10">
        {/* Status Messages */}
        {errorMessage && (
          <div className="alert alert-error text-white mb-6 flex items-center gap-3">
            <XCircleIcon className="w-6 h-6" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success text-white mb-6 flex items-center gap-3">
            <CheckCircleIcon className="w-6 h-6" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="grid grid-cols-1">
          {/* Header Row: Back Button + Art Type Header */}
          <div className="flex items-center justify-between gap-4 mb-7 px-4 rounded-lg">
            <div
              className={`bg-gradient-to-br ${currentColors.bg} w-full p-1 rounded-3xl`}
            >
              <div className="flex items-center gap-3 pl-4">
                {selectedArtType === "1" && (
                  <PaletteIcon className={`w-6 h-6 ${currentColors.icon}`} />
                )}
                {selectedArtType === "2" && (
                  <FileTextIcon className={`w-6 h-6 ${currentColors.icon}`} />
                )}
                {selectedArtType === "3" && (
                  <PaletteIcon className={`w-6 h-6 ${currentColors.icon}`} />
                )}
                {selectedArtType === "4" && (
                  <SquarePenIcon className={`w-6 h-6 ${currentColors.icon}`} />
                )}
                {!selectedArtType && <SquarePenIcon className="w-6 h-6 text-orange-500" />}
                <h2 className={`text-2xl font-bold ${currentColors.text}`}>
                  {getCurrentArtTypeName()}
                </h2>
              </div>
            </div>
            {/* Back Button */}
            <button
              onClick={() => navigate("/projects")}
              className="btn btn-outline btn-accent gap-2"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Volver
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Agrupa ambos en un flex-row */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Columna 1: Información General */}
              <div className="bg-white px-6 py-3 rounded-xl shadow-md border border-gray-100 w-full md:w-1/2">
                <h3 className="text-xl font-bold mb-4 text-neutral border-b pb-2">
                  Información General
                </h3>
                <CommonProjectFields
                  formData={formData}
                  handleChange={handleCommonChange}
                />
              </div>

              {/* Columna 2: Categorización del Proyecto */}
              <div className="bg-white px-6 py-3 rounded-xl shadow-md border border-gray-100 w-full md:w-1/2">
                <h3 className="text-xl font-bold mb-4 text-neutral border-b pb-2">
                  Categorización del Proyecto
                </h3>
                <ProjectSelectors
                  selectedArtType={selectedArtType}
                  setSelectedArtType={setSelectedArtType}
                  selectedTechnique={selectedTechnique}
                  setSelectedTechnique={setSelectedTechnique}
                  selectedClient={selectedClient}
                  setSelectedClient={setSelectedClient}
                  artTypes={artTypes}
                  techniques={techniques}
                  clients={clients}
                />
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex justify-end flex-col sm:flex-row gap-4 -mb-2">
              <button
                type="button"
                onClick={() => navigate("/projects")}
                className="btn btn-outline btn-secondary flex-1 sm:flex-none sm:min-w-32"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary flex-1 sm:flex-none sm:min-w-48 relative overflow-hidden"
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5 mr-2" /> Crear Proyecto
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
