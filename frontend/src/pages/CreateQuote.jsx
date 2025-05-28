import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { QuoteProgressBar } from "@/components/Quotes/QuoteProgressBar";
import { ProjectInfoSection } from "@/components/Quotes/ProjectInfoSection";
import { SupplySelectionSection } from "@/components/Quotes/SupplySelectionSection";

import { useQuoteForm } from "@/hooks/useQuoteForm";
import { CommonQuoteFields } from "@/components/Quotes/CommonQuoteFields";
import { DigitalIllustrationQuoteForm } from "@/components/Quotes/DigitalIllustrationQuoteForm";
import { VideoEditingQuoteForm } from "@/components/Quotes/VideoEditingQuoteForm";
import { PaintingQuoteForm } from "@/components/Quotes/PaintingQuoteForm";
import { DrawingQuoteForm } from "@/components/Quotes/DrawingQuoteForm";

import { QuotePreview } from "@/components/Quotes/QuotePreview";

import { SparklesText } from "@/components/magicui/sparkles-text-variant";
import { ArrowLeftIcon, AlertCircleIcon } from "lucide-react";
import GradientText from "@/blocks/TextAnimations/GradientText/GradientText";

export default function CreateQuote() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  // Hook con toda la lógica
  const {
    quoteData,
    specializedData,
    selectedArtType,
    handleQuoteFieldChange,
    project,
    pricingProfile,
    pricingProfiles,
    selectedPricingProfile,
    setSelectedPricingProfile,
    loading,
    steps,
    currentStep,
    setCurrentStep,
    formErrors,
    confirming,
    setConfirming,
    clients,
    quoteClient,
    setQuoteClient,
    projectHasClient,
    handleSubmit,
    breakdown,
    // Estados de insumos desde el hook
    selectedSoftware,
    setSelectedSoftware,
    selectedDigitalTools,
    setSelectedDigitalTools,
    selectedTraditionalMaterials,
    setSelectedTraditionalMaterials,
    selectedTraditionalTools,
    setSelectedTraditionalTools,
  } = useQuoteForm(projectId, navigate);

  const renderSpecializedForm = () => {
    switch (selectedArtType) {
      case "1": // Ilustración Digital
        return (
          <DigitalIllustrationQuoteForm
            data={specializedData}
            handleChange={handleQuoteFieldChange}
            handleQuoteFieldChange={handleQuoteFieldChange}
            errors={formErrors}
            pricingProfile={selectedPricingProfile}
          />
        );
      case "2": // Edición de Video
        return (
          <VideoEditingQuoteForm
            data={specializedData}
            handleChange={handleQuoteFieldChange}
            handleQuoteFieldChange={handleQuoteFieldChange}
            errors={formErrors}
            pricingProfile={selectedPricingProfile}
          />
        );
      case "3": // ✅ Pintura - AGREGAR ESTE CASO
        return (
          <PaintingQuoteForm
            data={specializedData}
            handleChange={handleQuoteFieldChange}
            handleQuoteFieldChange={handleQuoteFieldChange} // ✅ Agregar esta prop
            errors={formErrors}
            pricingProfile={selectedPricingProfile} // ✅ Agregar esta prop
          />
        );
      case "4": // Dibujo
        return (
          <DrawingQuoteForm
            data={specializedData}
            handleChange={handleQuoteFieldChange}
            handleQuoteFieldChange={handleQuoteFieldChange}
            errors={formErrors}
            pricingProfile={selectedPricingProfile}
          />
        );
      default:
        return null;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProjectInfoSection
            project={{ ...project, client: quoteClient }}
            onAssignClient={() => {
              setCurrentStep(1);
            }}
          />
        );
      case 1:
        return (
          <CommonQuoteFields
            data={quoteData}
            handleChange={handleQuoteFieldChange}
            pricingProfiles={pricingProfiles}
            selectedPricingProfile={selectedPricingProfile}
            setSelectedPricingProfile={setSelectedPricingProfile}
            clients={clients}
            selectedClient={quoteClient}
            setSelectedClient={setQuoteClient}
            projectHasClient={projectHasClient}
            selectedArtType={selectedArtType} // ✅ Pasar selectedArtType
          />
        );
      case 2:
        return <>{renderSpecializedForm()}</>;
      case 3:
        return (
          <SupplySelectionSection
            selectedArtType={selectedArtType}
            selectedSoftware={selectedSoftware}
            setSelectedSoftware={setSelectedSoftware}
            selectedDigitalTools={selectedDigitalTools}
            setSelectedDigitalTools={setSelectedDigitalTools}
            selectedTraditionalMaterials={selectedTraditionalMaterials}
            setSelectedTraditionalMaterials={setSelectedTraditionalMaterials}
            selectedTraditionalTools={selectedTraditionalTools}
            setSelectedTraditionalTools={setSelectedTraditionalTools}
          />
        );
      case 4:
        return (
          <QuotePreview
            quoteData={quoteData}
            specializedData={specializedData}
            selectedArtType={selectedArtType}
            project={project}
            pricingProfile={pricingProfile}
            selectedPricingProfile={selectedPricingProfile}
            selectedSoftware={selectedSoftware}
            selectedDigitalTools={selectedDigitalTools}
            selectedTraditionalMaterials={selectedTraditionalMaterials}
            selectedTraditionalTools={selectedTraditionalTools}
            breakdown={breakdown}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4">
        <AlertCircleIcon className="w-16 h-16 text-error" />
        <h2 className="text-2xl font-bold text-gray-800">
          No se encontró el proyecto
        </h2>
        <button
          onClick={() => navigate("/quotes")}
          className="btn btn-primary flex items-center gap-2"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Volver a Cotizaciones
        </button>
      </div>
    );
  }

  console.log("Paso actual:", currentStep);
  console.log("Breakdown actual:", breakdown);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-primary via-secondary to-accent">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-[60vw] mx-auto p-8 pt-22">
          <div className="text-center mb-5">
            <SparklesText text="Nueva Cotización" />
          </div>
          <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-xl p-8 min-h-[500px] flex flex-col justify-start">
            <div className="flex justify-between items-center mb-6 -mt-2">
              <div className="flex items-center gap-3">
                <GradientText className="text-4xl font-logo-text">
                  Proyecto:
                </GradientText>
                <p className="font-regular-text font-bold text-neutral text-2xl mt-2">
                  {project.title}
                </p>
              </div>
              <button
                onClick={() => navigate("/quotes")}
                className="btn btn-outline btn-secondary flex items-center gap-2"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Volver
              </button>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-8"
              onKeyDown={(e) => {
                if (currentStep === steps.length - 1 && e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            >
              <QuoteProgressBar steps={steps} currentStep={currentStep} />
              {renderStep()}
            </form>
          </div>
          {/* Botones SIEMPRE ABAJO */}
          <div className="flex justify-between mt-8 w-full max-w-[700px] mx-auto">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
              disabled={currentStep === 0}
            >
              Anterior
            </button>

            {/* ✅ Simplificar la lógica de botones */}
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
                }
              >
                Siguiente
              </button>
            ) : (
              /* ✅ Un solo botón de confirmación */
              <button
                type="button"
                className="btn btn-success text-white font-bold"
                onClick={() =>
                  handleSubmit({
                    selectedSoftware,
                    selectedDigitalTools,
                    selectedTraditionalMaterials,
                    selectedTraditionalTools,
                  })
                }
              >
                Crear Cotización
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}