import React, { useEffect, useState } from "react";
import api from "@/api/axios";

export default function CreateProject() {
  // Estado para los campos comunes de Project
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    detailLevel: 1,
    hoursWorked: 0,
    isCommercial: false,
    rapidDelivery: false,
  });
  // Estados para selecciones (tipo de arte, técnica, cliente)
  const [selectedArtType, setSelectedArtType] = useState("");
  const [selectedTechnique, setSelectedTechnique] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  // Estados para listados
  const [artTypes, setArtTypes] = useState([]);
  const [techniques, setTechniques] = useState([]);
  const [clients, setClients] = useState([]);
  
  // Estados para datos específicos según tipo de arte
  const [digitalIllustrationData, setDigitalIllustrationData] = useState({
    illustrationType: "",
    additionalModifications: 0,
    modificationCost: 0,
  });
  const [videoEditingData, setVideoEditingData] = useState({
    editingType: "",
    stockFootageCost: 0,
    musicSoundCost: 0,
    pluginsCost: 0,
    includedRevisions: 2,
    additionalRevisions: 0,
    revisionCost: 0,
  });
  const [paintingData, setPaintingData] = useState({
    technique: "",
    canvasPaperCost: 0,
    paintsCost: 0,
    finishingCost: 0,
    framingCost: 0,
    shipping: false,
    shippingCost: 0,
    authenticityCertificate: false,
    certificateCost: 0,
    size: "",  // para pintura, capturamos el tamaño de la obra
  });
  const [drawingData, setDrawingData] = useState({
    technique: "",
    paperCost: 0,
    materialsCost: 0,
    finishingCost: 0,
    framingCost: 0,
    shipping: false,
    shippingCost: 0,
    authenticityCertificate: false,
    certificateCost: 0,
    size: "", // para dibujo, también podemos capturar el tamaño
  });
  
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Cargar listas: art types y clientes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return console.error("No hay token disponible.");
        const [artTypesResponse, clientsResponse] = await Promise.all([
          api.get("/art-types", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/clients", { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setArtTypes(artTypesResponse.data);
        setClients(clientsResponse.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    fetchData();
  }, []);

  // Al seleccionar un art type, cargar técnicas asociadas
  useEffect(() => {
    if (selectedArtType) {
      const fetchTechniques = async () => {
        try {
          const response = await api.get(`/art-techniques/by-art-type/${selectedArtType}`);
          setTechniques(response.data);
        } catch (error) {
          console.error("Error al obtener técnicas:", error);
        }
      };
      fetchTechniques();
    }
  }, [selectedArtType]);

  // Handlers para campos comunes y específicos
  const handleCommonChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };
  const handleDigitalIllustrationChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setDigitalIllustrationData({ ...digitalIllustrationData, [e.target.name]: value });
  };
  const handleVideoEditingChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setVideoEditingData({ ...videoEditingData, [e.target.name]: value });
  };
  const handlePaintingChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setPaintingData({ ...paintingData, [e.target.name]: value });
  };
  const handleDrawingChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setDrawingData({ ...drawingData, [e.target.name]: value });
  };

  // Función de validación de datos
  const validateProjectData = (data) => {
    // Validar campos comunes
    if (!data.title.trim()) return "El título es obligatorio.";
    if (!data.description.trim()) return "La descripción es obligatoria.";
    if (isNaN(data.detailLevel) || data.detailLevel < 1 || data.detailLevel > 5) {
      return "El nivel de detalle debe ser un número entre 1 y 5.";
    }
    if (isNaN(data.hoursWorked) || data.hoursWorked <= 0) {
      return "Las horas trabajadas deben ser un número positivo.";
    }
    // Si se envía tamaño, validarlo
    if (data.size !== null && (isNaN(data.size) || data.size <= 0)) {
      return "El tamaño debe ser un número positivo.";
    }
    // Especialidades: si se envían datos para cada tipo, validar sus campos
    if (data.painting) {
      const p = data.painting;
      if (!p.technique.trim()) return "La técnica de pintura es obligatoria.";
      if (isNaN(p.canvasPaperCost)) return "El costo de lienzo/papel debe ser un número.";
      if (isNaN(p.paintsCost)) return "El costo de pinturas debe ser un número.";
      // Puedes incluir más validaciones específicas para Painting aquí.
    }
    if (data.videoEditing) {
      const v = data.videoEditing;
      if (!v.editingType.trim()) return "El tipo de edición es obligatorio.";
      if (isNaN(v.stockFootageCost)) return "El costo de footage de stock debe ser un número.";
      // Más validaciones para VideoEditing, si se desean.
    }
    if (data.digitalIllustration) {
      const d = data.digitalIllustration;
      if (!d.illustrationType.trim()) return "El tipo de ilustración es obligatorio.";
    }
    if (data.drawing) {
      const dr = data.drawing;
      if (!dr.technique.trim()) return "La técnica de dibujo es obligatoria.";
      if (isNaN(dr.paperCost)) return "El costo de papel debe ser un número.";
    }
    return null; // Sin error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) {
      setErrorMessage("Debes iniciar sesión.");
      return;
    }
    
    // Armar el objeto a enviar con datos del Project y datos específicos anidados
    const dataToSend = {
      ...formData,
      artTypeId: parseInt(selectedArtType),
      artTechniqueId: selectedTechnique ? parseInt(selectedTechnique) : null,
      clientId: selectedClient ? parseInt(selectedClient) : null,
      detailLevel: parseInt(formData.detailLevel),
      hoursWorked: parseFloat(formData.hoursWorked),
      size: formData.size ? parseInt(formData.size) : null,
      duration: formData.duration ? parseInt(formData.duration) : null,
    };

    // Agregar información específica según el tipo de arte:
    if (selectedArtType === "1") {
      dataToSend.digitalIllustration = {
        illustrationType: digitalIllustrationData.illustrationType,
        additionalModifications: parseInt(digitalIllustrationData.additionalModifications),
        modificationCost: parseFloat(digitalIllustrationData.modificationCost),
      };
    } else if (selectedArtType === "2") {
      dataToSend.videoEditing = {
        editingType: videoEditingData.editingType,
        stockFootageCost: parseFloat(videoEditingData.stockFootageCost),
        musicSoundCost: parseFloat(videoEditingData.musicSoundCost),
        pluginsCost: parseFloat(videoEditingData.pluginsCost),
        includedRevisions: parseInt(videoEditingData.includedRevisions),
        additionalRevisions: parseInt(videoEditingData.additionalRevisions),
        revisionCost: parseFloat(videoEditingData.revisionCost),
      };
    } else if (selectedArtType === "3") {
      dataToSend.painting = {
        technique: paintingData.technique,
        canvasPaperCost: parseFloat(paintingData.canvasPaperCost),
        paintsCost: parseFloat(paintingData.paintsCost),
        finishingCost: parseFloat(paintingData.finishingCost),
        framingCost: parseFloat(paintingData.framingCost),
        shipping: paintingData.shipping,
        shippingCost: paintingData.shipping ? parseFloat(paintingData.shippingCost) : 0,
        authenticityCertificate: paintingData.authenticityCertificate,
        certificateCost: paintingData.authenticityCertificate ? parseFloat(paintingData.certificateCost) : 0,
      };
      dataToSend.size = paintingData.size; // Para pintura, se usa "size" de paintingData
    } else if (selectedArtType === "4") {
      dataToSend.drawing = {
        technique: drawingData.technique,
        paperCost: parseFloat(drawingData.paperCost),
        materialsCost: parseFloat(drawingData.materialsCost),
        finishingCost: parseFloat(drawingData.finishingCost),
        framingCost: parseFloat(drawingData.framingCost),
        shipping: drawingData.shipping,
        shippingCost: drawingData.shipping ? parseFloat(drawingData.shippingCost) : 0,
        authenticityCertificate: drawingData.authenticityCertificate,
        certificateCost: drawingData.authenticityCertificate ? parseFloat(drawingData.certificateCost) : 0,
      };
      dataToSend.size = drawingData.size; // Para dibujo, se usa "size" de drawingData
    }
    
    console.log("Datos a enviar:", dataToSend);

    // Ejecutar validación
    const validationError = validateProjectData(dataToSend);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    
    try {
      const response = await api.post("/projects", dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("Proyecto creado exitosamente.");
      setErrorMessage("");
      console.log("Proyecto creado:", response.data);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error al crear el proyecto.");
    }
  };

  // Renderizado del Formulario
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Crear Proyecto</h1>
      
      {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-4 rounded-lg">
        {/* Campos comunes */}
        <label className="block text-sm font-bold mb-2">Título:</label>
        <input name="title" type="text" value={formData.title} onChange={handleCommonChange} required className="input input-bordered w-full mb-3" />
        
        <label className="block text-sm font-bold mb-2">Descripción:</label>
        <textarea name="description" value={formData.description} onChange={handleCommonChange} required className="textarea textarea-bordered w-full mb-3" />
        
        <label className="block text-sm font-bold mb-2">Nivel de Detalle (1-5):</label>
        <input name="detailLevel" type="number" min="1" max="5" value={formData.detailLevel} onChange={handleCommonChange} required className="input input-bordered w-full mb-3" />
        
        <label className="block text-sm font-bold mb-2">Horas Trabajadas:</label>
        <input name="hoursWorked" type="number" value={formData.hoursWorked} onChange={handleCommonChange} required className="input input-bordered w-full mb-3" />
        
        <div className="flex items-center mb-3">
          <input name="isCommercial" type="checkbox" checked={formData.isCommercial} onChange={handleCommonChange} className="checkbox checkbox-primary" />
          <label className="ml-2 text-sm">¿Es comercial?</label>
        </div>
        
        <div className="flex items-center mb-3">
          <input name="rapidDelivery" type="checkbox" checked={formData.rapidDelivery} onChange={handleCommonChange} className="checkbox checkbox-primary" />
          <label className="ml-2 text-sm">¿Entrega rápida?</label>
        </div>
        
        {/* Selección de Tipo de Arte */}
        <label className="block text-sm font-bold mb-2">Tipo de Arte:</label>
        <select value={selectedArtType} onChange={(e) => setSelectedArtType(e.target.value)} required className="select select-bordered w-full mb-3">
          <option value="">Selecciona un tipo de arte</option>
          {artTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        
        {/* Selección de Técnica (opcional) */}
        <label className="block text-sm font-bold mb-2">Técnica (opcional):</label>
        <select value={selectedTechnique} onChange={(e) => setSelectedTechnique(e.target.value)} className="select select-bordered w-full mb-3">
          <option value="">Selecciona una técnica</option>
          {techniques.map((tech) => (
            <option key={tech.id} value={tech.id}>
              {tech.name}
            </option>
          ))}
        </select>
        
        {/* Selección de Cliente (opcional) */}
        <label className="block text-sm font-bold mb-2">Cliente (opcional):</label>
        <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} className="select select-bordered w-full mb-3">
          <option value="">Selecciona un cliente</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
        
        {/* Sección de campos adicionales según el tipo de arte */}
        {selectedArtType === "1" && (
          // Ilustración Digital
          <div className="border p-3 rounded mb-3">
            <h2 className="font-bold mb-2">Datos de Ilustración Digital</h2>
            <label className="block text-sm font-bold mb-2">Tipo de Ilustración:</label>
            <input name="illustrationType" type="text" value={digitalIllustrationData.illustrationType} onChange={handleDigitalIllustrationChange} className="input input-bordered w-full mb-3" placeholder="Ej. Retrato, Concept Art, etc." />
            <label className="block text-sm font-bold mb-2">Modificaciones adicionales:</label>
            <input name="additionalModifications" type="number" value={digitalIllustrationData.additionalModifications} onChange={handleDigitalIllustrationChange} className="input input-bordered w-full mb-3" />
            <label className="block text-sm font-bold mb-2">Costo de modificaciones:</label>
            <input name="modificationCost" type="number" value={digitalIllustrationData.modificationCost} onChange={handleDigitalIllustrationChange} className="input input-bordered w-full mb-3" />
          </div>
        )}
        
        {selectedArtType === "2" && (
          // Edición de Video
          <div className="border p-3 rounded mb-3">
            <h2 className="font-bold mb-2">Datos de Edición de Video</h2>
            <label className="block text-sm font-bold mb-2">Tipo de Edición:</label>
            <input name="editingType" type="text" value={videoEditingData.editingType} onChange={handleVideoEditingChange} className="input input-bordered w-full mb-3" placeholder="Ej. Comercial, Educativo, etc." />
            <label className="block text-sm font-bold mb-2">Costo de Footage de Stock:</label>
            <input name="stockFootageCost" type="number" value={videoEditingData.stockFootageCost} onChange={handleVideoEditingChange} className="input input-bordered w-full mb-3" />
            <label className="block text-sm font-bold mb-2">Costo de Música y Sonido:</label>
            <input name="musicSoundCost" type="number" value={videoEditingData.musicSoundCost} onChange={handleVideoEditingChange} className="input input-bordered w-full mb-3" />
            <label className="block text-sm font-bold mb-2">Costo de Plugins:</label>
            <input name="pluginsCost" type="number" value={videoEditingData.pluginsCost} onChange={handleVideoEditingChange} className="input input-bordered w-full mb-3" />
            <label className="block text-sm font-bold mb-2">Revisiones incluidas:</label>
            <input name="includedRevisions" type="number" value={videoEditingData.includedRevisions} onChange={handleVideoEditingChange} className="input input-bordered w-full mb-3" />
            <label className="block text-sm font-bold mb-2">Revisiones adicionales:</label>
            <input name="additionalRevisions" type="number" value={videoEditingData.additionalRevisions} onChange={handleVideoEditingChange} className="input input-bordered w-full mb-3" />
            <label className="block text-sm font-bold mb-2">Costo de revisión adicional:</label>
            <input name="revisionCost" type="number" value={videoEditingData.revisionCost} onChange={handleVideoEditingChange} className="input input-bordered w-full mb-3" />
            <label className="block text-sm font-bold mb-2">Duración del Video (minutos):</label>
            <input name="duration" type="number" value={formData.duration || ""} onChange={handleCommonChange} className="input input-bordered w-full mb-3" placeholder="Duración" />
          </div>
        )}
        
        {(selectedArtType === "3" || selectedArtType === "4") && (
          <div className="border p-3 rounded mb-3">
            <h2 className="font-bold mb-2">{selectedArtType === "3" ? "Datos de Pintura" : "Datos de Dibujo"}</h2>
            <label className="block text-sm font-bold mb-2">Tamaño (cm²):</label>
            <input name="size" type="text" value={formData.size || ""} onChange={handleCommonChange} className="input input-bordered w-full mb-3" placeholder="Ej. 600" />
            {selectedArtType === "3" && (
              <>
                <label className="block text-sm font-bold mb-2">Técnica de Pintura:</label>
                <input name="technique" type="text" value={paintingData.technique} onChange={handlePaintingChange} className="input input-bordered w-full mb-3" placeholder="Ej. Acrílico, Óleo, Acuarela" />
                <label className="block text-sm font-bold mb-2">Costo de Lienzo/Papel:</label>
                <input name="canvasPaperCost" type="number" value={paintingData.canvasPaperCost} onChange={handlePaintingChange} className="input input-bordered w-full mb-3" />
                <label className="block text-sm font-bold mb-2">Costo de Pinturas:</label>
                <input name="paintsCost" type="number" value={paintingData.paintsCost} onChange={handlePaintingChange} className="input input-bordered w-full mb-3" />
                <label className="block text-sm font-bold mb-2">Costo de Acabado:</label>
                <input name="finishingCost" type="number" value={paintingData.finishingCost} onChange={handlePaintingChange} className="input input-bordered w-full mb-3" />
                <label className="block text-sm font-bold mb-2">Costo de Enmarcado:</label>
                <input name="framingCost" type="number" value={paintingData.framingCost} onChange={handlePaintingChange} className="input input-bordered w-full mb-3" />
                <div className="flex items-center mb-3">
                  <input name="shipping" type="checkbox" checked={paintingData.shipping} onChange={handlePaintingChange} className="checkbox checkbox-primary" />
                  <label className="ml-2 text-sm">¿Incluye envío?</label>
                </div>
                {paintingData.shipping && (
                  <>
                    <label className="block text-sm font-bold mb-2">Costo de Envío:</label>
                    <input name="shippingCost" type="number" value={paintingData.shippingCost} onChange={handlePaintingChange} className="input input-bordered w-full mb-3" />
                  </>
                )}
                <div className="flex items-center mb-3">
                  <input name="authenticityCertificate" type="checkbox" checked={paintingData.authenticityCertificate} onChange={handlePaintingChange} className="checkbox checkbox-primary" />
                  <label className="ml-2 text-sm">¿Incluye Certificado de Autenticidad?</label>
                </div>
                {paintingData.authenticityCertificate && (
                  <>
                    <label className="block text-sm font-bold mb-2">Costo del Certificado:</label>
                    <input name="certificateCost" type="number" value={paintingData.certificateCost} onChange={handlePaintingChange} className="input input-bordered w-full mb-3" />
                  </>
                )}
                <label className="block text-sm font-bold mb-2">Tamaño (cm²) en Pintura:</label>
                <input name="size" type="text" value={paintingData.size || ""} onChange={handlePaintingChange} className="input input-bordered w-full mb-3" placeholder="Ej. 600" />
              </>
            )}
            {selectedArtType === "4" && (
              <>
                <label className="block text-sm font-bold mb-2">Técnica de Dibujo:</label>
                <input name="technique" type="text" value={drawingData.technique} onChange={handleDrawingChange} className="input input-bordered w-full mb-3" placeholder="Ej. Lápiz, Carboncillo, Pasteles" />
                <label className="block text-sm font-bold mb-2">Costo de Papel:</label>
                <input name="paperCost" type="number" value={drawingData.paperCost} onChange={handleDrawingChange} className="input input-bordered w-full mb-3" />
                <label className="block text-sm font-bold mb-2">Costo de Materiales:</label>
                <input name="materialsCost" type="number" value={drawingData.materialsCost} onChange={handleDrawingChange} className="input input-bordered w-full mb-3" />
                <label className="block text-sm font-bold mb-2">Costo de Acabado:</label>
                <input name="finishingCost" type="number" value={drawingData.finishingCost} onChange={handleDrawingChange} className="input input-bordered w-full mb-3" />
                <label className="block text-sm font-bold mb-2">Costo de Enmarcado:</label>
                <input name="framingCost" type="number" value={drawingData.framingCost} onChange={handleDrawingChange} className="input input-bordered w-full mb-3" />
                <div className="flex items-center mb-3">
                  <input name="shipping" type="checkbox" checked={drawingData.shipping} onChange={handleDrawingChange} className="checkbox checkbox-primary" />
                  <label className="ml-2 text-sm">¿Incluye envío?</label>
                </div>
                {drawingData.shipping && (
                  <>
                    <label className="block text-sm font-bold mb-2">Costo de Envío:</label>
                    <input name="shippingCost" type="number" value={drawingData.shippingCost} onChange={handleDrawingChange} className="input input-bordered w-full mb-3" />
                  </>
                )}
                <div className="flex items-center mb-3">
                  <input name="authenticityCertificate" type="checkbox" checked={drawingData.authenticityCertificate} onChange={handleDrawingChange} className="checkbox checkbox-primary" />
                  <label className="ml-2 text-sm">¿Incluye Certificado de Autenticidad?</label>
                </div>
                {drawingData.authenticityCertificate && (
                  <>
                    <label className="block text-sm font-bold mb-2">Costo del Certificado:</label>
                    <input name="certificateCost" type="number" value={drawingData.certificateCost} onChange={handleDrawingChange} className="input input-bordered w-full mb-3" />
                  </>
                )}
                <label className="block text-sm font-bold mb-2">Tamaño (cm²) en Dibujo:</label>
                <input name="size" type="text" value={drawingData.size || ""} onChange={handleDrawingChange} className="input input-bordered w-full mb-3" placeholder="Ej. 600" />
              </>
            )}
          </div>
        )}
        
        <button type="submit" className="btn btn-primary w-full">Crear Proyecto</button>
      </form>
    </div>
  );
}