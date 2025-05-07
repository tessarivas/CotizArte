import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("No hay token disponible.");
          return;
        }

        const response = await api.get("/clients", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setClients(response.data);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mis Clientes</h1>

      {/* Botón para ir a agregar cliente */}
      <div className="text-right mb-4">
        <button
          onClick={() => navigate("/add-client")}
          className="btn btn-primary"
        >
          + Agregar Cliente
        </button>
      </div>

      {/* Lista de clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clients.length > 0 ? (
          clients.map((client) => (
            <div key={client.id} className="bg-white shadow-md p-4 rounded-lg">
              <h3 className="font-bold text-lg">{client.name}</h3>
              <p className="text-sm">Email: {client.email}</p>
              {client.company && <p className="text-sm">Empresa: {client.company}</p>}
              {client.notes && <p className="text-sm">Notas: {client.notes}</p>}
              <div className="flex justify-between mt-3">
                <button onClick={() => navigate(`/client/${client.id}`)} className="btn btn-outline">
                  Ver Detalles
                </button>
                <button onClick={() => navigate(`/edit-client/${client.id}`)} className="btn btn-success">
                  Editar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-neutral-content">Aún no tienes clientes registrados.</p>
        )}
      </div>
    </div>
  );
}
