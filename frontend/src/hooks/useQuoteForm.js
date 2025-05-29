import api from "@/api/axios";
import { useState, useEffect } from "react";
import { useQuotePreview } from "./useQuotePreview"; // Importar el hook de cálculo

export function useQuoteForm(projectId, navigate) {
  // Estado para los campos comunes de la cotización
  const [quoteData, setQuoteData] = useState({
    discountPercentage: 0,
    notes: "",
  });

  // Estado para los datos específicos según el tipo de arte
  const [specializedData, setSpecializedData] = useState({
    hoursWorked: 0,
    width: "",
    height: "",
    technique: "",
    additionalModifications: 0,
    isCommercial: false,
    commercialPercentage: "",
    rapidDelivery: false,
    rapidDeliveryPercentage: "",
  });

  const [selectedArtType, setSelectedArtType] = useState("");
  const [project, setProject] = useState(null);
  const [pricingProfile, setPricingProfile] = useState(null);
  const [pricingProfiles, setPricingProfiles] = useState([]);
  const [selectedPricingProfile, setSelectedPricingProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados para selección de insumos - los agregamos aquí para tenerlos disponibles
  const [selectedSoftware, setSelectedSoftware] = useState([]);
  const [selectedDigitalTools, setSelectedDigitalTools] = useState([]);
  const [selectedTraditionalMaterials, setSelectedTraditionalMaterials] = useState([]);
  const [selectedTraditionalTools, setSelectedTraditionalTools] = useState([]);

  // Usar el hook de preview para obtener los cálculos
  const breakdown = useQuotePreview({
    quoteData,
    specializedData,
    selectedArtType,
    project,
    pricingProfile,
    selectedPricingProfile,
    selectedSoftware,
    selectedDigitalTools,
    selectedTraditionalMaterials,
    selectedTraditionalTools,
  });

  // Fetch de proyecto y perfiles de precios
  useEffect(() => {
    if (!projectId) return;
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Sin token");
        const [projectRes, pricingRes] = await Promise.all([
          api.get(`/projects/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`/pricing-profiles`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setProject(projectRes.data);

        // Set art type
        if (projectRes.data?.artType?.id) {
          setSelectedArtType(projectRes.data.artType.id.toString());
          // Buscar el perfil de precios según artType
          const profile = pricingRes.data.find(
            (p) => p.artTypeId === projectRes.data.artType.id
          );
          setPricingProfile(
            profile || {
              standardHourlyRate: 50,
              projectsPerMonth: 10,
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
              defaultCommercialLicensePercentage: 30,
              defaultUrgencyPercentage: 20,
            }
          );
        }
        setPricingProfiles(pricingRes.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  // Sincroniza datos del proyecto con el formulario
  useEffect(() => {
    if (project) {
      // Cargar la técnica completa desde el backend usando el artTechniqueId del proyecto
      const loadProjectTechnique = async () => {
        if (project.artTechniqueId) {
          try {
            const token = localStorage.getItem("access_token");
            const response = await api.get(
              `/art-techniques/${project.artTechniqueId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            setSpecializedData((prev) => ({
              ...prev,
              selectedTechnique: response.data, // Guardar objeto completo con priceMultiplier
              hoursWorked: project.hoursWorked || 0,
              detailLevel: project.detailLevel || 1,
            }));
          } catch (error) {
            console.error("Error al cargar técnica del proyecto:", error);
          }
        } else {
          setSpecializedData((prev) => ({
            ...prev,
            hoursWorked: project.hoursWorked || 0,
            detailLevel: project.detailLevel || 1,
          }));
        }
      };

      loadProjectTechnique();
    }
  }, [project]);

  useEffect(() => {
    if (pricingProfile) {
      setSpecializedData((prev) => ({
        ...prev,
        commercialPercentage:
          prev.commercialPercentage !== "" &&
          prev.commercialPercentage !== undefined
            ? prev.commercialPercentage
            : pricingProfile.defaultCommercialLicensePercentage?.toString() ??
              "",
        rapidDeliveryPercentage:
          prev.rapidDeliveryPercentage !== "" &&
          prev.rapidDeliveryPercentage !== undefined
            ? prev.rapidDeliveryPercentage
            : pricingProfile.defaultUrgencyPercentage?.toString() ?? "",
      }));
    }
  }, [pricingProfile]);

  // Manejo de cambios en los campos del formulario
  const handleQuoteFieldChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'duration' || name === 'customModificationExtra') {
    setSpecializedData(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
    return;
  }
  
    if (name in specializedData) {
      setSpecializedData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else {
      setQuoteData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const [formErrors, setFormErrors] = useState({});
  const [confirming, setConfirming] = useState(false);
  const [clients, setClients] = useState([]);
  const [quoteClient, setQuoteClient] = useState(null);

  // Cargar clientes al montar
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    api
      .get("/clients", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClients(res.data));
  }, []);

  // Inicializar cliente si el proyecto ya tiene uno
  useEffect(() => {
    if (project?.client) setQuoteClient(project.client);
  }, [project]);

  // Determina si el proyecto ya tiene cliente
  const projectHasClient = !!project?.client;

  const steps = [
    { label: "Información del proyecto" },
    { label: "Detalles de la cotización" },
    { label: "Campos Específicos" },
    { label: "Selección de insumos" },
    { label: "Vista previa del precio" },
  ];
  const [currentStep, setCurrentStep] = useState(0);

  // Validación
  const validateForm = () => {
    const errors = {};
    if (!project) {
      errors.project = "No se ha seleccionado un proyecto válido";
    }
    if (!selectedArtType) {
      errors.artType = "Debes seleccionar un tipo de arte";
    }
    if (parseInt(selectedArtType) === 1 && !specializedData.detailLevel) {
      errors.detailLevel = "Debes seleccionar un nivel de detalle";
    }
    if (parseInt(selectedArtType) === 2 && !specializedData.duration) {
      errors.duration = "Debes especificar la duración del video";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit - ACTUALIZADO para enviar valores calculados
  const handleSubmit = async ({
    selectedSoftware: supplySelectedSoftware,
    selectedDigitalTools: supplySelectedDigitalTools,
    selectedTraditionalMaterials: supplySelectedTraditionalMaterials,
    selectedTraditionalTools: supplySelectedTraditionalTools,
  }) => {
    if (!validateForm()) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }
    const token = localStorage.getItem("access_token");
    if (!token) return alert("Debes iniciar sesión");

    try {
      // Usar los valores calculados del breakdown
      const dataToSend = {
        projectId: parseInt(projectId, 10),
        artTypeId: parseInt(selectedArtType, 10),
        pricingProfileId: selectedPricingProfile?.id,
        discountPercentage: parseFloat(quoteData.discountPercentage) || 0,
        notes: quoteData.notes,
        
        // Valores originales del formulario (para referencia/auditoría)
        hoursWorked: parseFloat(specializedData.hoursWorked) || 0,
        detailLevel: parseFloat(specializedData.detailLevel) || 1,
        additionalModifications: parseFloat(specializedData.additionalModifications) || 0,
        duration: parseFloat(specializedData.duration) || 0,
        isCommercial: specializedData.isCommercial,
        rapidDelivery: specializedData.rapidDelivery,
        commercialPercentage:
          specializedData.commercialPercentage !== ""
            ? parseFloat(specializedData.commercialPercentage)
            : undefined,
        rapidDeliveryPercentage:
          specializedData.rapidDeliveryPercentage !== ""
            ? parseFloat(specializedData.rapidDeliveryPercentage)
            : undefined,
        customModificationExtra:
          specializedData.customModificationExtra !== ""
            ? parseFloat(specializedData.customModificationExtra)
            : undefined,

        // VALORES CALCULADOS DEL BREAKDOWN - ESTOS SON LOS IMPORTANTES
        basePrice: breakdown.basePrice,
        commercialFee: breakdown.commercialFee,
        urgencyFee: breakdown.urgencyFee,
        materialsCost: breakdown.materialsCost,
        toolsCost: breakdown.toolsCost,
        shippingFee: breakdown.shippingFee,
        certificateFee: breakdown.certificateFee,
        subtotal: breakdown.subtotal,
        total: breakdown.total,

        // IDs de insumos seleccionados
        selectedSoftwareIds: (supplySelectedSoftware || selectedSoftware).map((sw) => sw.id),
        selectedDigitalToolIds: (supplySelectedDigitalTools || selectedDigitalTools).map((dt) => dt.id),
        selectedTraditionalMaterialIds: (supplySelectedTraditionalMaterials || selectedTraditionalMaterials).map((tm) => tm.id),
        selectedTraditionalToolIds: (supplySelectedTraditionalTools || selectedTraditionalTools).map((tt) => tt.id),
        
        clientId: !projectHasClient && quoteClient ? quoteClient.id : undefined,
      };

      console.log("Datos enviados al backend:", dataToSend);

      const response = await api.post("/quotes", dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      navigate("/quotes", {
        state: { success: true, quoteId: response.data.id },
      });
    } catch (error) {
      console.error("Error completo:", error);
      alert(
        "Error al crear la cotización: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return {
    quoteData,
    setQuoteData,
    specializedData,
    setSpecializedData,
    selectedArtType,
    setSelectedArtType,
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
    setFormErrors,
    confirming,
    setConfirming,
    clients,
    quoteClient,
    setQuoteClient,
    projectHasClient,
    validateForm,
    handleSubmit,
    breakdown,
    selectedSoftware,
    setSelectedSoftware,
    selectedDigitalTools,
    setSelectedDigitalTools,
    selectedTraditionalMaterials,
    setSelectedTraditionalMaterials,
    selectedTraditionalTools,
    setSelectedTraditionalTools,
  };
}