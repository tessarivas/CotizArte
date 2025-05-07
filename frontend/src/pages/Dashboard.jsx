import React, { useEffect, useState } from "react";
import api from "@/api/axios";

function Dashboard() {
  const [quotes, setQuotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  useEffect(() => {
    // Cargar cotizaciones recientes
    const fetchQuotes = async () => {
      try {
        const response = await api.get("/quotes/recent");
        setQuotes(response.data);
      } catch (error) {
        console.error("Error al obtener cotizaciones:", error);
      }
    };

    // Cargar proyectos recientes
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects/recent");
        setProjects(response.data);
      } catch (error) {
        console.error("Error al obtener proyectos:", error);
      }
    };

    // Cargar total de ingresos por mes
    const fetchMonthlyTotal = async () => {
      try {
        const response = await api.get("/quotes/monthly-total");
        setMonthlyTotal(response.data.total);
      } catch (error) {
        console.error("Error al obtener el total mensual:", error);
      }
    };

    fetchQuotes();
    fetchProjects();
    fetchMonthlyTotal();
  }, []);

  return (
    <>
      <div className="bg-gradient-to-b from-teal-200 via-pink-200 to-orange-200 h-screen flex items-center justify-center">

    <div className="max-w-5xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-neutral mb-6">Dashboard</h1>

          {/* Resumen de ingresos del mes */}
          <div className="bg-primary text-white rounded-lg p-4 mb-6 shadow-md">
            <h2 className="text-xl font-bold">Total del mes</h2>
            <p className="text-2xl">${monthlyTotal.toFixed(2)}</p>
          </div>

          {/* Cotizaciones recientes */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Últimas Cotizaciones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quotes.map((quote) => (
                <div key={quote.id} className="bg-white shadow-md p-4 rounded-lg">
                  <h3 className="font-bold">{quote.projectTitle}</h3>
                  <p className="text-sm text-neutral-content">Estado: {quote.status}</p>
                  <p className="text-lg font-semibold">${quote.finalPrice.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Proyectos recientes */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Proyectos Recientes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-white shadow-md p-4 rounded-lg">
                  <h3 className="font-bold">{project.title}</h3>
                  <p className="text-sm text-neutral-content">{project.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Botón para crear nueva cotización */}
          <div className="text-center mt-6">
            <button className="btn btn-primary text-lg px-6 py-3">+ Nueva Cotización</button>
          </div>
        </div>
      </div>F
    </>
    
  );
}

export default Dashboard;
