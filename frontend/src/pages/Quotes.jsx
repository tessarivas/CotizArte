import React, { useEffect, useState } from "react";
import api from "@/api/axios";

export default function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [newQuote, setNewQuote] = useState({
    projectId: "",
    basePrice: 0,
    commercialLicenseFee: 0,
    urgencyFee: 0,
    finalPrice: 0,
  });

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("No hay token disponible.");
          return;
        }
  
        const response = await api.get("/quotes", {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        console.log("Cotizaciones obtenidas:", response.data);
        setQuotes(response.data);
      } catch (error) {
        console.error("Error al obtener cotizaciones:", error);
      }
    };
  
    fetchQuotes();
  }, []);  

  const handleCreateQuote = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/quotes", { ...newQuote, projectId: selectedProject });
      setQuotes([...quotes, response.data]);
    } catch (error) {
      console.error("Error al crear cotización:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Lista de cotizaciones */}
      <h1 className="text-4xl font-bold mb-4 mt-20">Cotizaciones Existentes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quotes.map((quote) => (
          <div key={quote.id} className="bg-white shadow-md p-4 rounded-lg">
            <h3 className="font-bold">Proyecto: {quote.project.title}</h3>
            <h4 className="font-semibold">Precio:</h4>
            <p className="text-lg font-semibold">${quote.finalPrice.toFixed(2)}</p>
            <h4 className="font-semibold">Precio con descuento del {quote.discountPercentage}</h4>
            <p className="text-lg font-semibold">${quote.finalPriceAfterDiscount.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
