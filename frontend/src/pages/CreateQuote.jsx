import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

export default function CreateQuote() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [notes, setNotes] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return console.error("No hay token disponible.");

        const response = await api.get("/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data);
      } catch (error) {
        console.error("Error al obtener proyectos:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setErrorMessage("Debes iniciar sesión.");
        return;
      }

      const selectedProjectData = projects.find(
        (p) => p.id === parseInt(selectedProject)
      );
      if (!selectedProjectData) {
        setErrorMessage("Proyecto no encontrado.");
        return;
      }

      // ✅ Correcciones antes de enviar la cotización
      const quoteData = {
        projectId: parseInt(selectedProject),
        artTypeId: selectedProjectData.artTypeId, // ✅ Vincular el tipo de arte
        discountPercentage: discountPercentage
          ? parseFloat(discountPercentage)
          : null, // ✅ Convertir a número o enviar null
        notes: notes && notes.trim() !== "" ? notes : null, // ✅ Evitar undefined
      };

      console.log("Datos de cotización enviados:", quoteData); // ✅ Verificar antes de enviar

      const response = await api.post("/quotes", quoteData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Cotización creada exitosamente.");
      setErrorMessage("");
      console.log("Cotización creada:", response.data);

      setTimeout(() => navigate("/quotes"), 2000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error al crear la cotización."
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Crear Cotización</h1>

      {/* Mensajes */}
      {errorMessage && (
        <p className="text-red-500 text-sm text-center">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-500 text-sm text-center">{successMessage}</p>
      )}

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-4 rounded-lg"
      >
        <label className="block text-sm font-bold mb-2">
          Seleccionar Proyecto:
        </label>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          required
          className="select select-bordered w-full mb-3"
        >
          <option value="">Selecciona un proyecto</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>

        <label className="block text-sm font-bold mb-2">Descuento (%):</label>
        <input
          type="number"
          value={discountPercentage}
          onChange={(e) => setDiscountPercentage(e.target.value)}
          min="0"
          max="100"
          className="input input-bordered w-full mb-3"
        />

        <label className="block text-sm font-bold mb-2">Notas:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="textarea textarea-bordered w-full mb-3"
        />

        <button type="submit" className="btn btn-primary w-full">
          Crear Cotización
        </button>
      </form>
    </div>
  );
}
