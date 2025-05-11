import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectForm } from "@/hooks/useProjectForm";
import api from "@/api/axios";

// Importar componentes específicos para cada tipo de arte
import { CommonProjectFields } from "@/components/Projects/CommonProjectFields";
import { ProjectSelectors } from "@/components/Projects/ProjectSelectors";
import { DigitalIllustrationForm } from "@/components/Projects/DigitalIllustrationForm";
import { VideoEditingForm } from "@/components/Projects/VideoEditingForm";
import { PaintingForm } from "@/components/Projects/PaintingForm";
import { DrawingForm } from "@/components/Projects/DrawingForm";

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
    digitalIllustrationData,
    handleDigitalIllustrationChange,
    videoEditingData,
    handleVideoEditingChange,
    paintingData,
    handlePaintingChange,
    drawingData,
    handleDrawingChange,
  } = useProjectForm();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Función para validar campos antes de enviar
  const validateProjectData = (data) => {
    if (!data.title.trim()) return "El título es obligatorio.";
    if (!data.description.trim()) return "La descripción es obligatoria.";
    if (isNaN(data.detailLevel) || data.detailLevel < 1 || data.detailLevel > 5) {
      return "El nivel de detalle debe ser un número entre 1 y 5.";
    }
    if (isNaN(data.hoursWorked) || data.hoursWorked <= 0) {
      return "Las horas trabajadas deben ser un número positivo.";
    }
    if (data.size !== null && (isNaN(data.size) || data.size <= 0)) {
      return "El tamaño debe ser un número positivo.";
    }
    if (data.digitalIllustration) {
      const d = data.digitalIllustration;
      if (!d.illustrationType.trim())
        return "El tipo de ilustración es obligatorio.";
    }
    if (data.videoEditing) {
      const v = data.videoEditing;
      if (!v.editingType.trim())
        return "El tipo de edición es obligatorio.";
      if (isNaN(v.stockFootageCost))
        return "El costo de footage de stock debe ser un número.";
    }
    if (data.painting) {
      const p = data.painting;
      if (!p.technique.trim())
        return "La técnica de pintura es obligatoria.";
      if (isNaN(p.canvasPaperCost))
        return "El costo de lienzo/papel debe ser un número.";
      if (isNaN(p.paintsCost))
        return "El costo de pinturas debe ser un número.";
    }
    if (data.drawing) {
      const dr = data.drawing;
      if (!dr.technique.trim())
        return "La técnica de dibujo es obligatoria.";
      if (isNaN(dr.paperCost))
        return "El costo de papel debe ser un número.";
    }
    return null;
  };

  // Función para formatear y convertir datos antes de enviarlos
  const formatDataToSend = () => {
    const data = {
      ...formData,
      artTypeId: parseInt(selectedArtType),
      artTechniqueId: selectedTechnique ? parseInt(selectedTechnique) : null,
      clientId: selectedClient ? parseInt(selectedClient) : null,
      detailLevel: parseInt(formData.detailLevel),
      hoursWorked: parseFloat(formData.hoursWorked),
      size: formData.size ? parseInt(formData.size) : null,
      duration: formData.duration ? parseInt(formData.duration) : null,
    };

    if (selectedArtType === "1") {
      data.digitalIllustration = {
        illustrationType: digitalIllustrationData.illustrationType,
        additionalModifications: parseInt(digitalIllustrationData.additionalModifications),
        modificationCost: parseFloat(digitalIllustrationData.modificationCost),
      };
    } else if (selectedArtType === "2") {
      data.videoEditing = {
        editingType: videoEditingData.editingType,
        stockFootageCost: parseFloat(videoEditingData.stockFootageCost),
        musicSoundCost: parseFloat(videoEditingData.musicSoundCost),
        pluginsCost: parseFloat(videoEditingData.pluginsCost),
        includedRevisions: parseInt(videoEditingData.includedRevisions),
        additionalRevisions: parseInt(videoEditingData.additionalRevisions),
        revisionCost: parseFloat(videoEditingData.revisionCost),
      };
    } else if (selectedArtType === "3") {
      data.painting = {
        technique: paintingData.technique,
        canvasPaperCost: parseFloat(paintingData.canvasPaperCost),
        paintsCost: parseFloat(paintingData.paintsCost),
        finishingCost: parseFloat(paintingData.finishingCost),
        framingCost: parseFloat(paintingData.framingCost),
        shipping: paintingData.shipping,
        shippingCost: paintingData.shipping ? parseFloat(paintingData.shippingCost) : 0,
        authenticityCertificate: paintingData.authenticityCertificate,
        certificateCost: paintingData.authenticityCertificate
          ? parseFloat(paintingData.certificateCost)
          : 0,
      };
      // Para proyectos de pintura, se utiliza el tamaño ingresado en paintingData
      data.size = paintingData.size;
    } else if (selectedArtType === "4") {
      data.drawing = {
        technique: drawingData.technique,
        paperCost: parseFloat(drawingData.paperCost),
        materialsCost: parseFloat(drawingData.materialsCost),
        finishingCost: parseFloat(drawingData.finishingCost),
        framingCost: parseFloat(drawingData.framingCost),
        shipping: drawingData.shipping,
        shippingCost: drawingData.shipping ? parseFloat(drawingData.shippingCost) : 0,
        authenticityCertificate: drawingData.authenticityCertificate,
        certificateCost: drawingData.authenticityCertificate
          ? parseFloat(drawingData.certificateCost)
          : 0,
      };
      // Para dibujo, se toma el tamaño de drawingData
      data.size = drawingData.size;
    }

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) {
      setErrorMessage("Debes iniciar sesión.");
      return;
    }
    const dataToSend = formatDataToSend();
    const validationError = validateProjectData(dataToSend);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    try {
      console.log("Datos a enviar:", dataToSend);
      const response = await api.post("/projects", dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("Proyecto creado exitosamente.");
      setErrorMessage("");
      console.log("Proyecto creado:", response.data);
      navigate("/");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error al crear el proyecto."
      );
    }
  };

  // Renderizar el formulario específico según el tipo de arte seleccionado
  const renderSpecificForm = () => {
    switch (selectedArtType) {
      case "1":
        return (
          <DigitalIllustrationForm 
            data={digitalIllustrationData} 
            handleChange={handleDigitalIllustrationChange} 
          />
        );
      case "2":
        return (
          <VideoEditingForm 
            data={videoEditingData} 
            handleChange={handleVideoEditingChange}
            formData={formData}
            handleFormChange={handleCommonChange}
          />
        );
      case "3":
        return (
          <PaintingForm 
            data={paintingData} 
            handleChange={handlePaintingChange}
            formData={formData}
            handleFormChange={handleCommonChange}
          />
        );
      case "4":
        return (
          <DrawingForm 
            data={drawingData} 
            handleChange={handleDrawingChange}
            formData={formData}
            handleFormChange={handleCommonChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Crear Proyecto</h1>
      {errorMessage && (
        <p className="text-red-500 text-sm text-center">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-500 text-sm text-center">{successMessage}</p>
      )}
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-4 rounded-lg">
        {/* Campos Comunes */}
        <CommonProjectFields 
          formData={formData} 
          handleChange={handleCommonChange} 
        />
        
        {/* Selectores para tipo de arte, técnica y cliente */}
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
        
        {/* Formulario específico según el tipo de arte */}
        {renderSpecificForm()}
        
        <button type="submit" className="btn btn-primary w-full">Crear Proyecto</button>
      </form>
    </div>
  );
}