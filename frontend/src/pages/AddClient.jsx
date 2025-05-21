import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SparklesText } from "@/components/magicui/sparkles-text";
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

      const response = await api.post("/clients", cleanedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Cliente agregado exitosamente.");
      setErrorMessage("");
      setTimeout(() => navigate("/clients"), 2000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error al agregar el cliente."
      );
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-teal-200 via-pink-200 to-orange-200 py-8">
      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-box px-8 py-8 max-w-md w-[25vw] overflow-y-auto max-h-[90vh] mt-18"
      >
        {/* Mensajes de error / éxito */}
        {errorMessage && (
          <p className="text-error text-sm text-center mb-2">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-success text-sm text-center mb-2">
            {successMessage}
          </p>
        )}

        {/* Título con efecto */}
        <SparklesText
          className={"text-center mb-6 text-5xl"}
          text="Agregar Cliente"
        />

        {/* Nombre */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">*Nombre:</label>
          <input
            name="name"
            type="text"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            required
            pattern="[A-Za-z][A-Za-z0-9\-]*"
            minlength="3"
            maxlength="30"
            title="Solo se permiten letras y números. Mínimo 3 caracteres."
            className="input validator input-bordered w-full"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">
            *Correo Electrónico:
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
            className="input validator input-bordered w-full"
          />
        </div>

        {/* Teléfono */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">
            Teléfono (Opcional):
          </label>
          <input
            name="phone"
            type="tel"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={handleChange}
            pattern="[0-9]*"
            minlength="10"
            maxlength="10"
            title="Debe contener 10 dígitos numéricos."
            className="input validator tabular-nums input-bordered w-full"
          />
        </div>

        {/* Empresa */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">
            Empresa (Opcional):
          </label>
          <input
            name="company"
            type="text"
            placeholder="Empresa"
            value={formData.company}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        {/* Notas */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">
            Notas (Opcional):
          </label>
          <textarea
            name="notes"
            placeholder="Notas adicionales..."
            value={formData.notes}
            onChange={handleChange}
            className="textarea textarea-bordered w-full h-24"
          />
        </div>

        {/* Botón */}
        <button type="submit" className="btn btn-primary w-full mt-3">
          Agregar Cliente
        </button>
      </form>
    </div>
  );
}
