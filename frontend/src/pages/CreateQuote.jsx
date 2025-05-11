// src/pages/CreateQuote.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/api/axios";
import { useQuoteForm } from "@/hooks/useQuoteForm";
import { CommonQuoteFields } from "@/components/Quotes/CommonQuoteFields";
import { DigitalIllustrationQuoteForm } from "@/components/Quotes/DigitalIllustrationQuoteForm";
import { VideoEditingQuoteForm } from "@/components/Quotes/VideoEditingQuoteForm";
import { PaintingQuoteForm } from "@/components/Quotes/PaintingQuoteForm";
import { DrawingQuoteForm } from "@/components/Quotes/DrawingQuoteForm";
import { QuotePreview } from "@/components/Quotes/QuotePreview";

export default function CreateQuote() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  // Estado para almacenar el proyecto completo y pricing profile
  const [project, setProject] = useState(null);
  const [pricingProfile, setPricingProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extraer estado y handlers del hook de cotización
  const {
    quoteData,
    specializedData,
    setSpecializedData,
    selectedArtType,
    setSelectedArtType,
    handleQuoteFieldChange,
  } = useQuoteForm();

  // Obtener los detalles completos del proyecto usando el projectId de la URL
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Sin token");
        // Se asume que existe un endpoint GET /projects/:id que devuelve el proyecto completo
        const response = await api.get(`/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(response.data);
        // Establece el artType del proyecto en el estado, si existe
        if (response.data && response.data.artType) {
          setSelectedArtType(response.data.artType.id.toString());
        }
        // Aquí puedes obtener o simular el pricingProfile (más adelante lo obtendrás del backend)
        setPricingProfile({
          hourlyRate: 50,
          softwareCost: 100,
          modificationExtra: 10,
          detailMultiplier: 5,
          baseRatePerMinute: 2,
          complexityFactor: 1.5,
          assetCost: 50,
          techniqueFactor: 0.1,
          worksPerMonth: 10,
          shippingFee: 20,
          certificateFee: 30,
        });
      } catch (error) {
        console.error("Error al obtener el proyecto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, setSelectedArtType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) return alert("Debes iniciar sesión");

    // Enviar artTypeId obtenido del objeto project
    const dataToSend = {
      projectId: parseInt(projectId, 10),
      artTypeId: project?.artType?.id, // Aseguramos que project y artType existan
      discountPercentage: parseFloat(quoteData.discountPercentage) || 0,
      notes: quoteData.notes,
      // Agrega otros campos específicos si los necesitas
    };

    try {
      const response = await api.post("/quotes", dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Cotización creada:", response.data);
      navigate("/quotes");
    } catch (error) {
      console.error("Error en la cotización:", error.response?.data || error.message);
    }
  };

  const renderSpecializedForm = () => {
    switch (selectedArtType) {
      case "1":
        return (
          <DigitalIllustrationQuoteForm
            data={specializedData}
            handleChange={(e) =>
              setSpecializedData({ ...specializedData, [e.target.name]: e.target.value })
            }
          />
        );
      case "2":
        return (
          <VideoEditingQuoteForm
            data={specializedData}
            handleChange={(e) =>
              setSpecializedData({ ...specializedData, [e.target.name]: e.target.value })
            }
          />
        );
      case "3":
        return (
          <PaintingQuoteForm
            data={specializedData}
            handleChange={(e) =>
              setSpecializedData({ ...specializedData, [e.target.name]: e.target.value })
            }
          />
        );
      case "4":
        return (
          <DrawingQuoteForm
            data={specializedData}
            handleChange={(e) =>
              setSpecializedData({ ...specializedData, [e.target.name]: e.target.value })
            }
          />
        );
      default:
        return null;
    }
  };

  if (loading) return <p>Cargando información del proyecto...</p>;
  if (!project) return <p>No se encontró el proyecto.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-20">
      <h2 className="mb-2">Crear Cotización para el Proyecto {projectId}</h2>
      <h1 className="text-3xl font-bold mb-4">Crear Cotización</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-4 rounded-lg">
        {/* Campos comunes de la cotización */}
        <CommonQuoteFields data={quoteData} handleChange={handleQuoteFieldChange} />
        {/* Vista previa del precio calculado */}
        <QuotePreview
          quoteData={quoteData}
          specializedData={specializedData}
          selectedArtType={selectedArtType}
          project={project}
          pricingProfile={pricingProfile}
          additionalData={{ materialsCost: 0, toolsCost: 0 }}
        />
        {/* Formulario especializado según el tipo de arte */}
        {renderSpecializedForm()}
        <button type="submit" className="btn btn-primary w-full">
          Crear Cotización
        </button>
      </form>
    </div>
  );
}
