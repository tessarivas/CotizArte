import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SparklesText } from "@/components/magicui/sparkles-text-variant";
import api from "@/api/axios";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return console.error("No hay token disponible.");

        const response = await api.get("/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Proyectos obtenidos:", response.data);
        setProjects(response.data);
      } catch (error) {
        console.error("Error al obtener proyectos:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      <div className="bg-gradient-to-r from-primary via-secondary to-accent h-[30vh] flex items-center justify-center relative">
        <div className="mt-22">
          <SparklesText text="Mis Proyectos" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Mis Proyectos</h1>

        {/* Botón para ir a Crear Proyecto */}
        <div className="text-right mb-4">
          <button
            onClick={() => navigate("/create-project")}
            className="btn btn-primary"
          >
            + Nuevo Proyecto
          </button>
        </div>

        {/* Lista de proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project.id}
                className="bg-white shadow-md p-4 rounded-lg"
              >
                <h3 className="font-bold text-lg">{project.title}</h3>
                <p className="text-sm text-neutral-content">
                  {project.description}
                </p>
                <p className="text-sm font-bold">
                  Tipo de Arte: {project.artType.name}
                </p>
                <p className="text-sm">
                  Nivel de Detalle: {project.detailLevel}
                </p>
                <p className="text-sm">
                  Horas Trabajadas: {project.hoursWorked}
                </p>
                <p className="text-sm">
                  Comercial: {project.isCommercial ? "Sí" : "No"}
                </p>
                <p className="text-sm">
                  Entrega Rápida: {project.rapidDelivery ? "Sí" : "No"}
                </p>
                {project.size && (
                  <p className="text-sm">Tamaño: {project.size} cm²</p>
                )}
                {project.duration && (
                  <p className="text-sm">Duración: {project.duration} min</p>
                )}

                {/* Mostrar detalles según el tipo de arte */}
                {project.artType.id === 1 && project.digitalIllustration && (
                  <div className="mt-3 border-t pt-3">
                    <h4 className="font-bold">Ilustración Digital</h4>
                    <p className="text-sm">
                      Tipo: {project.digitalIllustration.illustrationType}
                    </p>
                    <p className="text-sm">
                      Modificaciones adicionales:{" "}
                      {project.digitalIllustration.additionalModifications}
                    </p>
                    <p className="text-sm">
                      Costo de modificación: $
                      {project.digitalIllustration.modificationCost}
                    </p>
                  </div>
                )}

                {project.artType.id === 2 && project.videoEditing && (
                  <div className="mt-3 border-t pt-3">
                    <h4 className="font-bold">Edición de Video</h4>
                    <p className="text-sm">
                      Tipo: {project.videoEditing.editingType}
                    </p>
                    <p className="text-sm">
                      Costo de Footage: ${project.videoEditing.stockFootageCost}
                    </p>
                    <p className="text-sm">
                      Costo de Música/Sonido: $
                      {project.videoEditing.musicSoundCost}
                    </p>
                    <p className="text-sm">
                      Costo de Plugins: ${project.videoEditing.pluginsCost}
                    </p>
                    <p className="text-sm">
                      Revisiones incluidas:{" "}
                      {project.videoEditing.includedRevisions}
                    </p>
                    <p className="text-sm">
                      Revisiones adicionales:{" "}
                      {project.videoEditing.additionalRevisions}
                    </p>
                    <p className="text-sm">
                      Costo por revisión: ${project.videoEditing.revisionCost}
                    </p>
                  </div>
                )}

                {project.artType.id === 3 && project.painting && (
                  <div className="mt-3 border-t pt-3">
                    <h4 className="font-bold">Pintura</h4>
                    <p className="text-sm">
                      Técnica: {project.painting.technique}
                    </p>
                    <p className="text-sm">
                      Costo de lienzo/papel: ${project.painting.canvasPaperCost}
                    </p>
                    <p className="text-sm">
                      Costo de pinturas: ${project.painting.paintsCost}
                    </p>
                    <p className="text-sm">
                      Costo de acabado: ${project.painting.finishingCost}
                    </p>
                    <p className="text-sm">
                      Costo de enmarcado: ${project.painting.framingCost}
                    </p>
                    <p className="text-sm">
                      Incluye envío: {project.painting.shipping ? "Sí" : "No"}
                    </p>
                    <p className="text-sm">
                      Costo de envío: ${project.painting.shippingCost}
                    </p>
                    <p className="text-sm">
                      Incluye certificado:{" "}
                      {project.painting.authenticityCertificate ? "Sí" : "No"}
                    </p>
                    <p className="text-sm">
                      Costo de certificado: ${project.painting.certificateCost}
                    </p>
                  </div>
                )}

                {project.artType.id === 4 && project.drawing && (
                  <div className="mt-3 border-t pt-3">
                    <h4 className="font-bold">Dibujo</h4>
                    <p className="text-sm">
                      Técnica: {project.drawing.technique}
                    </p>
                    <p className="text-sm">
                      Costo de papel: ${project.drawing.paperCost}
                    </p>
                    <p className="text-sm">
                      Costo de materiales: ${project.drawing.materialsCost}
                    </p>
                    <p className="text-sm">
                      Costo de acabado: ${project.drawing.finishingCost}
                    </p>
                    <p className="text-sm">
                      Costo de enmarcado: ${project.drawing.framingCost}
                    </p>
                    <p className="text-sm">
                      Incluye envío: {project.drawing.shipping ? "Sí" : "No"}
                    </p>
                    <p className="text-sm">
                      Costo de envío: ${project.drawing.shippingCost}
                    </p>
                    <p className="text-sm">
                      Incluye certificado:{" "}
                      {project.drawing.authenticityCertificate ? "Sí" : "No"}
                    </p>
                    <p className="text-sm">
                      Costo de certificado: ${project.drawing.certificateCost}
                    </p>
                  </div>
                )}

                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => navigate(`/project/${project.id}`)}
                    className="btn btn-outline"
                  >
                    Ver Detalles
                  </button>
                  <button
                    onClick={() => navigate(`/create-quote/${project.id}`)}
                    className="btn btn-success"
                  >
                    Crear Cotización
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-neutral-content">
              Aún no tienes proyectos creados.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
