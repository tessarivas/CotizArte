import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { SparklesText } from "@/components/magicui/sparkles-text-variant";

export default function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return console.error("Sin token");
        const response = await api.get("/quotes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuotes(response.data);
      } catch (error) {
        console.error("Error al cargar cotizaciones:", error);
      }
    };
    fetchQuotes();
  }, []);

  return (
    <>
      <div className="bg-gradient-to-r from-primary via-secondary to-accent h-[30vh] flex items-center justify-center relative">
        <div className="mt-22">
          <SparklesText text="Mis Cotizaciones" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Mis Cotizaciones</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quotes.length > 0 ? (
            quotes.map((quote) => (
              <div key={quote.id} className="bg-white shadow-md p-4 rounded-lg">
                <h3 className="font-bold text-lg">
                  Cotización para: {quote.project.title}
                </h3>
                <p>Precio Final: ${quote.finalPriceAfterDiscount}</p>
                <p>Estatus: {quote.status}</p>
                {/* Botón para crear cotización dentro de cada proyecto */}
                <button
                  onClick={() => navigate(`/create-quote/${quote.project.id}`)}
                  className="btn btn-primary mt-2"
                >
                  Crear Cotización
                </button>
              </div>
            ))
          ) : (
            <p>No hay cotizaciones registradas.</p>
          )}
        </div>
      </div>
    </>
  );
}
