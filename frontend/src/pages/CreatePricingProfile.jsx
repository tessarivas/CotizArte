// src/pages/CreatePricingProfile.jsx
import React, { useState, useEffect } from "react";
import api from "@/api/axios";

function CreatePricingProfile() {
  const [artTypes, setArtTypes] = useState([]);
  const [formData, setFormData] = useState({
    artTypeId: "",
    standardHourlyRate: "",
    preferredHourlyRate: "",
    projectsPerMonth: "", // Inicialmente vacío
    defaultCommercialLicensePercentage: 30,
    defaultUrgencyPercentage: 20,
  });

  useEffect(() => {
    const fetchArtTypes = async () => {
      try {
        const response = await api.get("/art-types");
        console.log("Tipos de arte obtenidos:", response.data); // Depuración
        setArtTypes(response.data);
      } catch (error) {
        console.error("Error al obtener tipos de arte:", error);
      }
    };
    fetchArtTypes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) return alert("Debes iniciar sesión");
  
    // Convertir valores numéricos antes de enviarlos
    const dataToSend = {
      artTypeId: parseInt(formData.artTypeId, 10),
      standardHourlyRate: parseFloat(formData.standardHourlyRate),
      preferredHourlyRate: parseFloat(formData.preferredHourlyRate),
      projectsPerMonth: formData.projectsPerMonth ? parseInt(formData.projectsPerMonth, 10) : 1,
      defaultCommercialLicensePercentage: parseFloat(formData.defaultCommercialLicensePercentage),
      defaultUrgencyPercentage: parseFloat(formData.defaultUrgencyPercentage),
    };
  
    console.log("Datos a enviar:", dataToSend); // Depuración
  
    try {
      await api.post("/pricing-profiles", dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Perfil de precio creado exitosamente");
    } catch (error) {
      console.error("Error al crear perfil de precio:", error.response?.data || error.message);
      console.log("Datos enviados:", dataToSend); // Depuración
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Crear Perfil de Precios</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-4 rounded-lg">
        <label className="block text-sm font-bold mb-2">Tipo de Arte:</label>
        <select name="artTypeId" onChange={handleChange} required className="select select-bordered w-full mb-3">
          <option value="">Selecciona un tipo de arte</option>
          {artTypes.map((type) => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
        <label className="block text-sm font-bold mb-2">Tarifa estándar por hora:</label>
        <input type="number" name="standardHourlyRate" onChange={handleChange} required className="input input-bordered w-full mb-3" />
        <label className="block text-sm font-bold mb-2">Tarifa preferida por hora:</label>
        <input type="number" name="preferredHourlyRate" onChange={handleChange} required className="input input-bordered w-full mb-3" />
        <label className="block text-sm font-bold mb-2">Proyectos por mes:</label>
        <input type="number" name="projectsPerMonth" onChange={handleChange} className="input input-bordered w-full mb-3" />
        <button type="submit" className="btn btn-primary w-full">Crear Perfil</button>
      </form>
    </div>
  );
}

export default CreatePricingProfile;