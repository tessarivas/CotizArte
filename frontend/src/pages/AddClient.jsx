import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

export default function AddClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setErrorMessage("Debes iniciar sesión.");
        return;
      }
  
      const cleanedData = {
        ...formData,
        phone: formData.phone?.trim() || null,
        company: formData.company?.trim() || null,
        notes: formData.notes?.trim() || null,
      };
  
      console.log("Datos enviados:", cleanedData); // ✅ Verificar datos antes de enviar
  
      const response = await api.post("/clients", cleanedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setSuccessMessage("Cliente agregado exitosamente.");
      setErrorMessage("");
      console.log("Cliente creado:", response.data);
  
      setTimeout(() => navigate("/clients"), 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error al agregar el cliente.");
    }
  };  

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Agregar Cliente</h1>

      {/* Mensajes */}
      {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-4 rounded-lg">
        <label className="block text-sm font-bold mb-2">Nombre:</label>
        <input name="name" type="text" value={formData.name} onChange={handleChange} required className="input input-bordered w-full mb-3" />

        <label className="block text-sm font-bold mb-2">Correo Electrónico:</label>
        <input name="email" type="email" value={formData.email} onChange={handleChange} required className="input input-bordered w-full mb-3" />

        <label className="block text-sm font-bold mb-2">Teléfono:</label>
        <input name="phone" type="text" value={formData.phone} onChange={handleChange} className="input input-bordered w-full mb-3" />

        <label className="block text-sm font-bold mb-2">Empresa:</label>
        <input name="company" type="text" value={formData.company} onChange={handleChange} className="input input-bordered w-full mb-3" />

        <label className="block text-sm font-bold mb-2">Notas:</label>
        <textarea name="notes" value={formData.notes} onChange={handleChange} className="textarea textarea-bordered w-full mb-3" />

        <button type="submit" className="btn btn-primary w-full">Agregar Cliente</button>
      </form>
    </div>
  );
}
